from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import JobApplication
from app.schemas import JobApplicationCreate, JobApplicationUpdate


def get_applications(
    db: Session,
    status: str | None = None,
) -> list[JobApplication]:
    statement = select(JobApplication).order_by(JobApplication.date_applied.desc())

    if status is not None:
        statement = statement.where(JobApplication.status == status)

    return list(db.scalars(statement).all())


def get_application(
    db: Session,
    application_id: int,
) -> JobApplication | None:
    return db.get(JobApplication, application_id)


def create_application(
    db: Session,
    application: JobApplicationCreate,
) -> JobApplication:
    db_application = JobApplication(**application.model_dump())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


def update_application(
    db: Session,
    application_id: int,
    application_update: JobApplicationUpdate,
) -> JobApplication | None:
    db_application = get_application(db, application_id)

    if db_application is None:
        return None

    update_data = application_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_application, field, value)

    db.commit()
    db.refresh(db_application)
    return db_application


def delete_application(
    db: Session,
    application_id: int,
) -> bool:
    db_application = get_application(db, application_id)

    if db_application is None:
        return False

    db.delete(db_application)
    db.commit()
    return True
