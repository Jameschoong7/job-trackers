from collections.abc import Generator

from fastapi.testclient import TestClient
from sqlalchemy import StaticPool, create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.database import get_db
from app.main import app
from app.models import Base


engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def override_get_db() -> Generator[Session, None, None]:
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def setup_function():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def make_payload(
    company: str = "Demo Co",
    role: str = "Software Intern",
    status: str = "Applied",
) -> dict[str, str | None]:
    return {
        "company": company,
        "role": role,
        "url": "https://example.com/job",
        "status": status,
        "date_applied": "2026-05-11",
        "followup_date": None,
        "followup_note": None,
        "notes": "Demo application",
    }


def test_create_application_returns_created_application():
    response = client.post("/applications", json=make_payload())

    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["company"] == "Demo Co"
    assert data["status"] == "Applied"


def test_get_applications_returns_all_applications():
    client.post("/applications", json=make_payload(company="One"))
    client.post("/applications", json=make_payload(company="Two"))

    response = client.get("/applications")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["company"] == "One"
    assert data[1]["company"] == "Two"


def test_get_applications_filters_by_status():
    client.post("/applications", json=make_payload(company="Applied Co"))
    client.post(
        "/applications",
        json=make_payload(company="Interview Co", status="Interviewing"),
    )

    response = client.get("/applications?status=Interviewing")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["company"] == "Interview Co"


def test_get_application_returns_one_application():
    create_response = client.post("/applications", json=make_payload())
    application_id = create_response.json()["id"]

    response = client.get(f"/applications/{application_id}")

    assert response.status_code == 200
    assert response.json()["id"] == application_id


def test_get_application_returns_404_when_missing():
    response = client.get("/applications/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Application not found"


def test_update_application_changes_application():
    create_response = client.post("/applications", json=make_payload())
    application_id = create_response.json()["id"]

    response = client.put(
        f"/applications/{application_id}",
        json={"status": "Interviewing", "notes": "Phone screen booked"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["company"] == "Demo Co"
    assert data["status"] == "Interviewing"
    assert data["notes"] == "Phone screen booked"


def test_update_application_returns_404_when_missing():
    response = client.put(
        "/applications/999",
        json={"status": "Rejected"},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Application not found"


def test_delete_application_returns_204_and_removes_application():
    create_response = client.post("/applications", json=make_payload())
    application_id = create_response.json()["id"]

    delete_response = client.delete(f"/applications/{application_id}")
    get_response = client.get(f"/applications/{application_id}")

    assert delete_response.status_code == 204
    assert delete_response.content == b""
    assert get_response.status_code == 404


def test_delete_application_returns_404_when_missing():
    response = client.delete("/applications/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Application not found"