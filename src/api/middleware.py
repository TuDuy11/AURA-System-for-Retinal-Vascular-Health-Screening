from flask import request, g
from datetime import datetime
import logging
import time

logger = logging.getLogger(__name__)


def setup_request_logging(app):
    """
    Thiết lập request/response logging middleware
    
    Ghi log các thông tin:
    - Request ID
    - Origin (để debug CORS)
    - Request method, path, status
    - Response time
    """
    
    @app.before_request
    def before_request():
        # Lưu thời gian bắt đầu request
        g.start_time = time.time()
        
        # Log CORS origin nếu có
        origin = request.headers.get('Origin', 'No origin')
        logger.debug(f"[REQUEST] {request.method} {request.path} | Origin: {origin}")
    
    @app.after_request
    def after_request(response):
        # Tính thời gian xử lý request
        if hasattr(g, 'start_time'):
            elapsed = time.time() - g.start_time
            logger.debug(f"[RESPONSE] {request.method} {request.path} | Status: {response.status_code} | Time: {elapsed:.3f}s")
        
        # Log CORS headers nếu có
        if 'Access-Control-Allow-Origin' in response.headers:
            logger.debug(f"[CORS] Allowed origin: {response.headers.get('Access-Control-Allow-Origin')}")
        
        return response


def validate_content_type(app):
    """
    Kiểm tra Content-Type header cho POST/PUT requests
    """
    
    @app.before_request
    def check_content_type():
        if request.method in ['POST', 'PUT', 'PATCH']:
            if request.content_length and request.content_length > 0:
                content_type = request.headers.get('Content-Type', '')
                if not content_type.startswith('application/json'):
                    logger.warning(
                        f"[VALIDATION] Invalid Content-Type for {request.method} {request.path}: {content_type}"
                    )
