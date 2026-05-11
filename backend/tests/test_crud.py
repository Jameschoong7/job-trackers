from datetime import date

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app import crud
from app.models import Base
from app.schemas import JobApplicationCreate, JobApplicationUpdate


def make_test_db():
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )
    Base.metadata.create_all(bind=engine)
    return TestingSessionLocal()


def make_application(
    company: str = "Demo Co",
    role: str = "Software Intern",
    status: str = "Applied",
) -> JobApplicationCreate:
    return JobApplicationCreate(
        company=company,
        role=role,
        url="https://example.com/job",
        status=status,
        date_applied=date(2026, 5, 11),
        followup_date=None,
        followup_note=None,
        notes="Demo application",
    )


def test_create_application_persists_job_application():
    db = make_test_db()

    created = crud.create_application(db, make_application())

    assert created.id is not None
    assert created.company == "Demo Co"
    assert created.role == "Software Intern"
    assert created.status == "Applied"


def test_get_applications_returns_all_applications():
    db = make_test_db()
    crud.create_application(db, make_application(company="One"))
    crud.create_application(db, make_application(company="Two"))

    applications = crud.get_applications(db)

    assert len(applications) == 2
    assert applications[0].company == "One"
    assert applications[1].company == "Two"


def test_get_applications_filters_by_status():
    db = make_test_db()
    crud.create_application(db, make_application(company="Applied Co", status="Applied"))
    crud.create_application(
        db,
        make_application(company="Interview Co", status="Interviewing"),
    )

    applications = crud.get_applications(db, status="Interviewing")

    assert len(applications) == 1
    assert applications[0].company == "Interview Co"


def test_get_application_returns_one_application():
    db = make_test_db()
    created = crud.create_application(db, make_application())

    found = crud.get_application(db, created.id)

    assert found is not None
    assert found.id == created.id
    assert found.company == "Demo Co"


def test_get_application_returns_none_when_missing():
    db = make_test_db()

    found = crud.get_application(db, 999)

    assert found is None


def test_update_application_changes_only_provided_fields():
    db = make_test_db()
    created = crud.create_application(db, make_application())
    update = JobApplicationUpdate(status="Interviewing", notes="Phone screen booked")

    updated = crud.update_application(db, created.id, update)

    assert updated is not None
    assert updated.company == "Demo Co"
    assert updated.status == "Interviewing"
    assert updated.notes == "Phone screen booked"


def test_update_application_returns_none_when_missing():
    db = make_test_db()
    update = JobApplicationUpdate(status="Rejected")

    updated = crud.update_application(db, 999, update)

    assert updated is None


def test_delete_application_removes_application():
    db = make_test_db()
    created = crud.create_application(db, make_application())

    deleted = crud.delete_application(db, created.id)
    found = crud.get_application(db, created.id)

    assert deleted is True
    assert found is None


def test_delete_application_returns_false_when_missing():
    db = make_test_db()

    deleted = crud.delete_application(db, 999)

    assert deleted is False
