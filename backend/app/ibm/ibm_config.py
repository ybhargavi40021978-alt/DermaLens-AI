import os
from pathlib import Path
from dotenv import load_dotenv

# Explicitly load environment variables from backend/.env if available
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BACKEND_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH, override=True)

IBM_API_KEY = os.environ.get("IBM_API_KEY")
IBM_PROJECT_ID = os.environ.get("IBM_PROJECT_ID")
IBM_REGION = os.environ.get("IBM_REGION", "us-south")
IBM_GRANITE_MODEL = os.environ.get("IBM_GRANITE_MODEL", "ibm/granite-3-8b-instruct")
IBM_CLOUD_URL = os.environ.get("IBM_CLOUD_URL", f"https://{IBM_REGION}.ml.cloud.ibm.com")

def is_configured() -> bool:
    """
    Checks if the basic IBM credentials required for watsonx.ai are present.
    """
    return bool(IBM_API_KEY and IBM_PROJECT_ID)
