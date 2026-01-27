from flask import Blueprint, jsonify, render_template

health_bp = Blueprint("health", __name__)

@health_bp.get("/")
def index():
    return render_template("index.html")

@health_bp.get("/health")
def health_check():
    return jsonify({"success": True, "data": {"status": "ok"}}), 200