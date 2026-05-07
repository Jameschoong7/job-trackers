from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    app_name: str = "Job Tracker API"
    environment: str = "development"


settings = Settings()