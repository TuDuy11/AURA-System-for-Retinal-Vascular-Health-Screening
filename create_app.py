from flask import Flask

from config import Config
from cors import init_cors
from error_handler import register_error_handlers
from infrastructure.databases import init_db
from api import register_blueprints

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Logging: file app_logging.py của bạn hiện đang tự setup khi import
    # (vì có setup_logging() được gọi ở cuối file). :contentReference[oaicite:2]{index=2}
    import app_logging  # noqa: F401

    init_cors(app)                 # :contentReference[oaicite:3]{index=3}
    register_error_handlers(app)   # :contentReference[oaicite:4]{index=4}

    # init DB (tái sử dụng databases của bạn)
    init_db(app)

    # register routes mới (health/auth/... về sau)
    register_blueprints(app)

    return app
