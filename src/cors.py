from flask_cors import CORS
from flask import Flask
import logging
from config import Config

logger = logging.getLogger(__name__)


def validate_origin(origin):
    """
    Kiểm tra origin có hợp lệ không
    
    Args:
        origin: URL origin từ request
        
    Returns:
        True nếu origin được phép, False nếu không
    """
    if not origin:
        return False
    
    # Chuẩn hóa origin (loại bỏ trailing slashes)
    origin = origin.rstrip('/')
    
    # Lấy danh sách origins được phép từ config
    allowed_origins = [o.strip().rstrip('/') for o in Config.CORS_ALLOWED_ORIGINS]
    
    is_allowed = origin in allowed_origins
    
    if is_allowed:
        logger.debug(f"CORS: Origin '{origin}' được phép")
    else:
        logger.warning(f"CORS: Origin '{origin}' bị từ chối")
    
    return is_allowed


def init_cors(app: Flask):
    """
    Khởi tạo CORS cho Flask app
    
    Tự động cấu hình dựa vào environment:
    - Development: Cho phép localhost:3000, localhost:5173
    - Production: Chỉ cho phép domains được định nghĩa trong CORS_ALLOWED_ORIGINS
    
    Args:
        app: Flask application instance
        
    Returns:
        Flask app với CORS được khởi tạo
    """
    
    try:
        # Chuẩn bị cấu hình CORS
        cors_config = {
            'origins': Config.CORS_ALLOWED_ORIGINS,
            'methods': Config.CORS_ALLOWED_METHODS,
            'allow_headers': Config.CORS_ALLOWED_HEADERS,
            'supports_credentials': Config.CORS_ALLOW_CREDENTIALS,
            'max_age': Config.CORS_MAX_AGE,
            'expose_headers': ['Content-Type', 'X-Total-Count'],  # Header để expose cho client
        }
        
        CORS(app, resources={r"/api/*": cors_config})
        
        logger.info(f"CORS initialized with allowed origins: {Config.CORS_ALLOWED_ORIGINS}")
        logger.info(f"CORS methods: {Config.CORS_ALLOWED_METHODS}")
        
    except Exception as e:
        logger.error(f"Error initializing CORS: {str(e)}")
        raise
    
    return app

