from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


ApplicationStatus = Literal[
    "Applied",
    "Interviewing",
    "Offered",
    "Rejected",
    "Withdrawn",
]


class JobApplicationBase(BaseModel):
    company: str
    role: str
    url: str | None = None
    status: ApplicationStatus
    date_applied: date
    followup_date: date | None = None
    followup_note: str | None = None
    notes: str | None = None


class JobApplicationCreate(JobApplicationBase):
    pass


class JobApplicationUpdate(BaseModel):
    company: str | None = None
    role: str | None = None
    url: str | None = None
    status: ApplicationStatus | None = None
    date_applied: date | None = None
    followup_date: date | None = None
    followup_note: str | None = None
    notes: str | None = None


class JobApplicationRead(JobApplicationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
