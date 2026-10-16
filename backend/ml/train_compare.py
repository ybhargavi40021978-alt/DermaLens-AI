"""Train and compare CNN, transfer-learning ResNet18, and pretrained ResNet50.

Expected dataset layout:
  data/skin-dataset/
    class_a/*.jpg
    class_b/*.jpg
Use only datasets whose license permits your use. Keep patient-level splits separate
to prevent leakage when patient identifiers are available.
"""
from __future__ import annotations
import argparse, json, random, time
from pathlib import Path
import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms, models
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix, classification_report
from sklearn.model_selection import train_test_split
from app.ml.train_models import CustomCNN

def make_model(name, nclasses, pretrained=True):
    if name == "custom_cnn":
        return CustomCNN(nclasses)
    if name == "transfer_resnet18":
        model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT if pretrained else None)
        for p in model.parameters(): p.requires_grad = False
        model.fc = nn.Linear(model.fc.in_features, nclasses)
        for p in model.layer4.parameters(): p.requires_grad = True
        return model
    model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT if pretrained else None)
    for p in model.parameters(): p.requires_grad = False
    model.fc = nn.Linear(model.fc.in_features, nclasses)
    for p in model.layer4.parameters(): p.requires_grad = True
    return model

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--data-dir", required=True, help="ImageFolder root with one subfolder per class")
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch-size", type=int, default=16)
    parser.add_argument("--image-size", type=int, default=224)
    parser.add_argument("--output-dir", default="ml_artifacts")
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--models", nargs="+", default=["custom_cnn","transfer_resnet18","pretrained_resnet50"],
                        choices=["custom_cnn","transfer_resnet18","pretrained_resnet50"])
    args=parser.parse_args()
    random.seed(args.seed); np.random.seed(args.seed); torch.manual_seed(args.seed)
    device=torch.device("cuda" if torch.cuda.is_available() else "cpu")
    # ImageNet normalization suits the pretrained models and is also applied to the baseline.
    tfm=transforms.Compose([
        transforms.Resize((args.image_size,args.image_size)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ToTensor(),
        transforms.Normalize([.485,.456,.406],[.229,.224,.225])
    ])
    dataset=datasets.ImageFolder(args.data_dir, transform=tfm)
    if len(dataset.classes)<2: raise SystemExit("Need at least two labeled class folders.")
    counts={c:0 for c in dataset.classes}
    for _,y in dataset.samples: counts[dataset.classes[y]]+=1
    if min(counts.values())<3:
        raise SystemExit(f"Not enough images per class for a meaningful split. Counts: {counts}. Need at least 3/class; preferably hundreds or more.")
    n=len(dataset); ntest=max(1,round(n*.15)); nval=max(1,round(n*.15)); ntrain=n-ntest-nval
    if ntrain<1: raise SystemExit("Dataset too small to split.")
    train_ds,val_ds,test_ds=random_split(dataset,[ntrain,nval,ntest],generator=torch.Generator().manual_seed(args.seed))
    # Disable stochastic augmentation for validation/test.
    eval_dataset=datasets.ImageFolder(args.data_dir, transform=transforms.Compose([
        transforms.Resize((args.image_size,args.image_size)),transforms.ToTensor(),
        transforms.Normalize([.485,.456,.406],[.229,.224,.225])]))
    val_ds.dataset=eval_dataset; test_ds.dataset=eval_dataset
    train_loader=DataLoader(train_ds,batch_size=args.batch_size,shuffle=True,num_workers=0)
    val_loader=DataLoader(val_ds,batch_size=args.batch_size,shuffle=False,num_workers=0)
    test_loader=DataLoader(test_ds,batch_size=args.batch_size,shuffle=False,num_workers=0)
    out=Path(args.output_dir); out.mkdir(parents=True,exist_ok=True)
    results=[]
    for name in args.models:
        started=time.time()
        model=make_model(name,len(dataset.classes),pretrained=name!="custom_cnn").to(device)
        optimizer=torch.optim.AdamW((p for p in model.parameters() if p.requires_grad),lr=1e-4 if name!="custom_cnn" else 1e-3)
        criterion=nn.CrossEntropyLoss(); best_loss=float("inf"); best_state=None
        for epoch in range(args.epochs):
            model.train()
            for x,y in train_loader:
                x,y=x.to(device),y.to(device); optimizer.zero_grad()
                loss=criterion(model(x),y); loss.backward(); optimizer.step()
            model.eval(); total=0; vloss=0
            with torch.no_grad():
                for x,y in val_loader:
                    x,y=x.to(device),y.to(device); logits=model(x)
                    vloss+=criterion(logits,y).item()*len(y); total+=len(y)
            vloss/=max(total,1)
            print(f"{name} epoch {epoch+1}/{args.epochs}: val_loss={vloss:.4f}")
            if vloss<best_loss:
                best_loss=vloss; best_state={k:v.detach().cpu().clone() for k,v in model.state_dict().items()}
        if best_state: model.load_state_dict(best_state)
        model.eval(); ytrue=[]; ypred=[]; yprob=[]
        with torch.no_grad():
            for x,y in test_loader:
                logits=model(x.to(device)); probs=torch.softmax(logits,1).cpu().numpy()
                ytrue.extend(y.numpy().tolist()); ypred.extend(probs.argmax(1).tolist()); yprob.extend(probs.tolist())
        p,r,f,_=precision_recall_fscore_support(ytrue,ypred,average="macro",zero_division=0)
        model_result={
            "name":name,"accuracy":round(float(accuracy_score(ytrue,ypred)),4),
            "macro_precision":round(float(p),4),"macro_recall":round(float(r),4),"macro_f1":round(float(f),4),
            "test_samples":len(ytrue),"confusion_matrix":confusion_matrix(ytrue,ypred,labels=list(range(len(dataset.classes)))).tolist(),
            "classification_report":classification_report(ytrue,ypred,labels=list(range(len(dataset.classes))),target_names=dataset.classes,output_dict=True,zero_division=0),
            "training_seconds":round(time.time()-started,2)
        }
        results.append(model_result)
        checkpoint={"architecture":name if name=="custom_cnn" else ("resnet18" if name=="transfer_resnet18" else "resnet50"),
                    "state_dict":model.state_dict(),"classes":dataset.classes,"image_size":args.image_size,"seed":args.seed}
        torch.save(checkpoint,out/f"{name}.pt")
        print(json.dumps({k:v for k,v in model_result.items() if k not in ("classification_report","confusion_matrix")},indent=2))
    best=max(results,key=lambda x:x["macro_f1"])
    chosen=out/(best["name"]+".pt")
    (out/"best_model.pt").write_bytes(chosen.read_bytes())
    report={"status":"evaluated","dataset_dir":str(Path(args.data_dir).resolve()),"class_names":dataset.classes,
            "class_counts":counts,"split":{"train":ntrain,"validation":nval,"test":ntest},
            "seed":args.seed,"device":str(device),"epochs":args.epochs,
            "selection_metric":"macro_f1","selected_model":best["name"],"models":results,
            "limitations":["Random image-level split used. Prefer patient-level splitting to avoid leakage when patient IDs exist.",
            "Metrics are dataset-specific and do not establish clinical safety or generalization.",
            "Confidence scores are not calibrated probabilities unless calibration is evaluated separately."]}
    (out/"comparison_metrics.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
    print(f"Saved report: {out/'comparison_metrics.json'}")
if __name__=="__main__": main()
