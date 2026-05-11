from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas import (
    JobApplicationCreate,
    JobApplicationRead,
    JobApplicationUpdate,
)

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("", response_model=list[JobApplicationRead])
def list_applications(
    status: str | None = None,
    db: Session = Depends(get_db),
):
    return crud.get_applications(db, status=status)


@router.get("/{application_id}", response_model=JobApplicationRead)
def read_application(
    application_id: int,
    db: Session = Depends(get_db),
):
    application = crud.get_application(db, application_id)

    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    return application


@router.post(
    "",
    response_model=JobApplicationRead,
    status_code=status.HTTP_201_CREATED,
)
def create_application(
    application: JobApplicationCreate,
    db: Session = Depends(get_db),
):
    return crud.create_application(db, application)


@router.put("/{application_id}", response_model=JobApplicationRead)
def update_application(
    application_id: int,
    application_update: JobApplicationUpdate,
    db: Session = Depends(get_db),
):
    application = crud.update_application(db, application_id, application_update)

    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    return application


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
):
    deleted = crud.delete_application(db, application_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Application not found")

    return Response(status_code=status.HTTP_204_NO_CONTENT)
