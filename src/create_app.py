from flask import Flask, send_from_directory
from config import Config, DevelopmentConfig, ProductionConfig, TestingConfig
from cors import init_cors
from error_handler import register_error_handlers
from infrastructure.databases import init_db, db
from api.routes import register_routes
from api.middleware import setup_request_logging, validate_content_type
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Tính path tới dist folder
_src_dir = os.path.dirname(os.path.abspath(__file__))
FRONTEND_BUILD_PATH = os.path.abspath(os.path.join(_src_dir, '..', 'src', 'Web Interface for AURA Clinic (1)', 'dist'))

# Debug: print path
print(f"Frontend path: {FRONTEND_BUILD_PATH}")
print(f"Frontend exists: {os.path.exists(FRONTEND_BUILD_PATH)}")

def create_app(config_name='development'):
    """
    Flask application factory
    
    Args:
        config_name: 'development', 'testing', hoặc 'production'
    
    Returns:
        Flask application instance
    """
    
    # Tạo Flask app với frontend static files
    app = Flask(__name__, static_folder=FRONTEND_BUILD_PATH, static_url_path='')
    
    # Chọn config dựa vào environment
    env = os.environ.get('FLASK_ENV', 'development')
    if env == 'testing':
        app.config.from_object(TestingConfig)
        logger.info("🧪 Loading TestingConfig")
    elif env == 'production':
        app.config.from_object(ProductionConfig)
        logger.info("🚀 Loading ProductionConfig")
    else:
        app.config.from_object(DevelopmentConfig)
        logger.info("🔧 Loading DevelopmentConfig")

    
    import app_logging
    
    # Khởi tạo CORS trước các routes
    init_cors(app)
    logger.info("✅ CORS initialized")
    
    # Thiết lập middleware
    setup_request_logging(app)
    validate_content_type(app)
    logger.info("✅ Middleware initialized")
                
    try:
        register_error_handlers(app)   
    except Exception as e:
        logger.error(f"Error registering error handlers: {e}")

    # init DB (tái sử dụng databases ) -
    # init_db(app)
    
    try:
        # register routes mới (health/auth/... về sau)
        register_routes(app)
        logger.info("✅ Routes registered")
    except Exception as e:
        logger.error(f"Error registering routes: {e}")

    # Serve frontend - PHẢI SAU API routes
    @app.route('/')
    def index():
        try:
            print(f"Serving index.html from {FRONTEND_BUILD_PATH}")
            return send_from_directory(FRONTEND_BUILD_PATH, 'index.html')
        except Exception as e:
            print(f"Error serving index.html: {e}")
            return f"Error: {str(e)}", 500
    
    @app.route('/<path:filename>')
    def serve_static(filename):
        try:
            # Không serve API routes - để cho API xử lý
            if filename.startswith('api/'):
                return {"error": "API route not found"}, 404
            print(f"Serving static file: {filename}")
            return send_from_directory(FRONTEND_BUILD_PATH, filename)
        except Exception as e:
            print(f"Error serving {filename}: {e}")
            return f"File not found: {filename}", 404
    
    return app

