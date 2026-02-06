from flask import Blueprint, jsonify
from sqlalchemy import text
from infrastructure.databases.mssql import get_db_session

health_bp = Blueprint("health", __name__)


@health_bp.get("/")
def index():
    return jsonify({"message": "Welcome to AURA API"}), 200


@health_bp.get("/health")
def health_check():
    """Basic healthcheck endpoint.

    - Returns overall status
    - Attempts a lightweight DB check and reports `db_status`
    """
    db_ok = False
    db_error = None
    try:
        session = get_db_session()
        session.execute(text("SELECT 1"))
        session.close()
        db_ok = True
    except Exception as e:
        db_error = str(e)

    return jsonify({
        "success": True,
        "data": {
            "status": "ok",
            "db_status": db_ok,
            "db_error": db_error,
        },
    }), 200