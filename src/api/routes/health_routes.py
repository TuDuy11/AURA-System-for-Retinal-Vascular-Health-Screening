from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)

@health_bp.get("/")
def index():
    return jsonify({"message": "Welcome to AURA API"}), 200

@health_bp.get("/health")
def health_check():
    return jsonify({"success": True, "data": {"status": "ok"}}), 200