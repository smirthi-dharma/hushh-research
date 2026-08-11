import pytest
from hushh_mcp.services.one_location_agent_service import OneLocationAgentService
import uuid

@pytest.mark.asyncio
async def test_location_metadata_counterpart_label_is_embedded(monkeypatch):
    service = OneLocationAgentService()

    # Mock database to prevent actual inserts
    def mock_execute_one(sql, params=None):
        if "completed_grant" in sql:
            return {"id": "grant-id", "owner_user_id": "owner-1", "recipient_user_id": "recipient-2"}
        if "UPDATE one_location_share_grants" in sql:
            return {"id": "grant-id", "owner_user_id": "owner-1", "recipient_user_id": "recipient-2"}
        if "UPDATE one_location_access_requests" in sql:
            return {"id": "req-1", "requester_user_id": "requester-2", "owner_user_id": "owner-1"}
        if "INSERT INTO one_location_access_requests" in sql:
            return {"id": "req-1"}
        return {"id": str(uuid.uuid4()), "owner_user_id": "owner-1", "requester_user_id": "requester-2"}

    monkeypatch.setattr(service, "_execute_one", mock_execute_one)
    monkeypatch.setattr(service, "_execute_many", lambda *args, **kwargs: [])

    def mock_identity_row(user_id):
        if user_id and "no-name" in user_id:
            return {"user_id": user_id, "display_name": "", "phone_number": "+123456789"}
        return {"user_id": user_id, "display_name": f"MockUser-{user_id}", "phone_number": "+123456789"} if user_id else None

    monkeypatch.setattr(service, "_identity_row", mock_identity_row)

    # Mock notifications to avoid DB calls
    monkeypatch.setattr(service, "_send_metadata_notification", lambda *args, **kwargs: None)
    monkeypatch.setattr(service, "_is_active_connection", lambda *args, **kwargs: True)
    monkeypatch.setattr(service, "_grant_payload", lambda row: {"id": "g-1"})
    monkeypatch.setattr(service, "_send_location_share_created_notification", lambda *args, **kwargs: None)

    inserted_events = []
    def mock_insert_event(**kwargs):
        inserted_events.append(kwargs)
    monkeypatch.setattr(service, "_insert_event", mock_insert_event)

    # Let's bypass the connection guard to avoid DB setup
    import contextlib
    @contextlib.contextmanager
    def dummy_guard(*args, **kwargs):
        yield None
    monkeypatch.setattr(service, "_key_bound_writer_guard", dummy_guard)

    # 1. location_share_created
    service.create_grant(
        owner_user_id="owner-1",
        recipient_user_id="recipient-2",
        recipient_key_id="key-1",
        duration_hours=1.0,
        enforce_connection=False
    )

    assert len(inserted_events) >= 1
    ev = inserted_events[-1]
    assert ev["event_type"] == "location_share_created"
    assert ev["metadata"]["counterpart_label"] == "MockUser-recipient-2"
    assert "duration_hours" in ev["metadata"]
    assert "phone_number" not in ev["metadata"]

    # 2. location_access_request
    service.request_access(owner_user_id="owner-1", requester_user_id="requester-2")
    ev = inserted_events[-1]
    assert ev["event_type"] == "location_access_request"
    assert ev["metadata"]["counterpart_label"] == "MockUser-requester-2"
    assert "phone_number" not in ev["metadata"]

    # 3. location_access_request with no name
    service.request_access(owner_user_id="owner-1", requester_user_id="no-name-requester")
    ev = inserted_events[-1]
    assert ev["event_type"] == "location_access_request"
    assert ev["metadata"]["counterpart_label"] == ""

    # 4. location_access_approved
    service.approve_request(owner_user_id="owner-1", request_id="req-1", duration_hours=1.0)
    ev = inserted_events[-1]
    assert ev["event_type"] == "location_access_approved"
    assert ev["metadata"]["counterpart_label"] == "MockUser-requester-2"

    # 5. location_access_denied
    service.deny_request(owner_user_id="owner-1", request_id="req-1")
    ev = inserted_events[-1]
    assert ev["event_type"] == "location_access_denied"
    assert ev["metadata"]["counterpart_label"] == "MockUser-requester-2"

    # 6. location_share_revoked
    service.revoke_grant(owner_user_id="owner-1", grant_id="grant-id")
    ev = inserted_events[-1]
    assert ev["event_type"] == "location_share_revoked"
    assert ev["metadata"]["counterpart_label"] == "MockUser-recipient-2"

    # 7. location_share_expired
    monkeypatch.setattr(service, "_execute_many", lambda *args, **kwargs: [{"grant_id": "grant-id", "owner_user_id": "owner-1", "recipient_user_id": "recipient-2"}])
    service._expire_stale_grants(user_id='owner-1')
    ev = inserted_events[-1]
    assert ev["event_type"] == "location_share_expired"
    assert ev["metadata"]["counterpart_label"] == "MockUser-recipient-2"
