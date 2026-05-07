from fastapi import FastAPI

from app.config import settings
from app.routes.applications import router as applications_router

app = FastAPI(title=settings.app_name)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(applications_router)