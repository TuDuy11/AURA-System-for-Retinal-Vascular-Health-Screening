from flask import Flask
from config import Config
from cors import init_cors
from error_handler import register_error_handlers
from infrastructure.databases import init_db, db
from api.routes import register_routes
import logging
import os

logging.basicConfig(level=logging.INFO)



def create_app():
    # fontend templates and static files configuration
    app = Flask(__name__, 
                template_folder=os.path.join(os.path.dirname(__file__), 'frontend', 'templates'),
                static_folder=os.path.join(os.path.dirname(__file__), 'frontend', 'static'))
    app.config.from_object(Config)

    
   
    import app_logging  

    init_cors(app)                 
    register_error_handlers(app)   

    # init DB (tái sử dụng databases ) -
    # init_db(app)
    
    
   
    # register routes mới (health/auth/... về sau)
    register_routes(app)

    
    return app
