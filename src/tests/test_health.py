import os

from create_app import create_app


def test_healthcheck_returns_ok():
    # Ensure testing config is used
    os.environ['FLASK_ENV'] = 'testing'
    app = create_app()
    client = app.test_client()

    resp = client.get('/api/health')
    assert resp.status_code == 200
    data = resp.get_json()
    assert data.get('success') is True
    assert data.get('data', {}).get('status') == 'ok'
    # db_status may be True/False depending on environment; ensure key exists
    assert 'db_status' in data.get('data', {})
