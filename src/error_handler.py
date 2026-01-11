import logging
from flask import jsonify
from werkzeug.exceptions import HTTPException

logger = logging.getLogger(__name__)

def register_error_handlers(app):

    @app.errorhandler(HTTPException)
    def handle_http_exception(e: HTTPException):
        # Ví dụ: 404 favicon.ico sẽ trả 404, không bị biến thành 500
        return jsonify({
            "message": e.description,
            "error": e.name
        }), e.code

    @app.errorhandler(Exception)
    def handle_exception(e: Exception):
        # Quan trọng: in traceback ra log container
        logger.exception("Unhandled exception: %s", e)
        return jsonify({"message": "An unexpected error occurred."}), 500
