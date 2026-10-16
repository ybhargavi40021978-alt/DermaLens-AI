"""Streamlit dashboard for actual model comparison and error analysis.

Run from backend/: streamlit run ml/dashboard.py
"""
import json
from pathlib import Path
import pandas as pd
import streamlit as st
import matplotlib.pyplot as plt

BACKEND = Path(__file__).resolve().parents[1]
REPORT = Path(__import__("os").environ.get("DERMALENS_METRICS_PATH", BACKEND / "ml_artifacts" / "comparison_metrics.json"))

st.set_page_config(page_title="DermaLens Model Lab", page_icon="🔬", layout="wide")
st.title("DermaLens AI · Model Performance Lab")
st.caption("Evaluation dashboard — research metrics only, not evidence of clinical validation.")
if not REPORT.exists():
    st.warning("No measured results yet. Train models first; this dashboard does not generate demo metrics.")
    st.code("python -m ml.train_compare --data-dir ../data/skin-dataset --epochs 5")
    st.stop()
try:
    report=json.loads(REPORT.read_text(encoding="utf-8"))
except Exception as exc:
    st.error(f"Could not read evaluation report: {exc}")
    st.stop()
models=report.get("models",[])
if not models:
    st.info("The report has no model evaluation results.")
    st.stop()
c1,c2,c3,c4=st.columns(4)
c1.metric("Classes",len(report.get("class_names",[])))
c2.metric("Test images",report.get("split",{}).get("test","—"))
c3.metric("Selected model",report.get("selected_model","—"))
c4.metric("Models compared",len(models))
st.subheader("Model comparison")
df=pd.DataFrame([{k:m.get(k) for k in ["name","accuracy","macro_precision","macro_recall","macro_f1","training_seconds","test_samples"]} for m in models])
st.dataframe(df,use_container_width=True,hide_index=True)
chartdf=df.set_index("name")[["accuracy","macro_precision","macro_recall","macro_f1"]]
st.bar_chart(chartdf)
st.subheader("Confusion matrix and class-level errors")
names=report.get("class_names",[])
selected=st.selectbox("Model", [m["name"] for m in models])
result=next(m for m in models if m["name"]==selected)
matrix=result.get("confusion_matrix",[])
if matrix and names:
    fig,ax=plt.subplots(figsize=(max(5,len(names)*.8),max(4,len(names)*.7)))
    im=ax.imshow(matrix,interpolation="nearest")
    ax.set_title(f"{selected} · confusion matrix")
    ax.set_xlabel("Predicted label"); ax.set_ylabel("True label")
    ax.set_xticks(range(len(names)),names,rotation=45,ha="right")
    ax.set_yticks(range(len(names)),names)
    for i,row in enumerate(matrix):
        for j,value in enumerate(row): ax.text(j,i,str(value),ha="center",va="center")
    fig.colorbar(im,ax=ax,fraction=.046,pad=.04); fig.tight_layout()
    st.pyplot(fig)
    plt.close(fig)
report_by_class=result.get("classification_report",{})
class_rows=[{"class":name,**report_by_class.get(name,{})} for name in names if isinstance(report_by_class.get(name),dict)]
if class_rows:
    st.markdown("**Per-class precision, recall and F1**")
    st.dataframe(pd.DataFrame(class_rows),use_container_width=True,hide_index=True)
with st.expander("Dataset and evaluation details"):
    st.json({k:v for k,v in report.items() if k not in ("models",)})
st.warning("Review false negatives carefully. Small or biased datasets, duplicate patients, image quality, and skin-tone representation can distort metrics. These results do not diagnose or rule out a condition.")
