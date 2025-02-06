from app import app
from settings import SETTINGS
import uvicorn


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=SETTINGS.DEBUG)
