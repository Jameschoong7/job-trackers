import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    app_name: str
    environment: str
    database_url: str


def get_settings() -> Settings:
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        raise RuntimeError("DATABASE_URL environment variable is required")

    return Settings(
        app_name="Job Tracker API",
        environment=os.getenv("ENVIRONMENT", "development"),
        database_url=database_url,
    )

settings = get_settings()
