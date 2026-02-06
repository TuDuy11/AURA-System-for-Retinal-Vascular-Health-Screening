# Configuration settings for the Flask application

import os

def build_database_uri():
    """Build database URI from environment variables."""
    # Check if DATABASE_URI is explicitly set
    if os.environ.get('DATABASE_URI'):
        return os.environ.get('DATABASE_URI')
    
    # Try to build PostgreSQL URI from individual components
    db_engine = os.environ.get('DB_ENGINE', 'sqlite')
    
    if db_engine.lower() == 'postgresql':
        db_host = os.environ.get('DB_HOST', 'localhost')
        db_port = os.environ.get('DB_PORT', '5432')
        db_name = os.environ.get('DB_NAME', 'aura_db')
        db_user = os.environ.get('DB_USER', 'postgres')
        db_password = os.environ.get('DB_PASSWORD', '')
        
        uri = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        return uri
    
    # Default to in-memory SQLite
    return 'sqlite:///:memory:'

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_default_secret_key'
    DEBUG = os.environ.get('DEBUG', 'False').lower() in ['true', '1']
    TESTING = os.environ.get('TESTING', 'False').lower() in ['true', '1']
    
    # Database configuration - supports both SQLite and PostgreSQL
    SQLALCHEMY_DATABASE_URI = build_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_POOL_SIZE = 10
    SQLALCHEMY_POOL_RECYCLE = 3600
    SQLALCHEMY_POOL_PRE_PING = True  # Verify connections before using
    CORS_HEADERS = 'Content-Type'
    
    # CORS Configuration
    CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
    CORS_ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD']
    CORS_ALLOWED_HEADERS = ['Content-Type', 'Authorization', 'X-Requested-With']
    CORS_MAX_AGE = int(os.environ.get('CORS_MAX_AGE', 3600))
    CORS_ALLOW_CREDENTIALS = True

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    # Use in-memory database for development to avoid OneDrive locking issues
    # DATABASE_URI can be overridden via environment variable
    _db_uri = os.environ.get('DATABASE_URI')
    if not _db_uri:
        # Default to in-memory for development
        SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
        print("[CONFIG] Using in-memory SQLite database for development")
    else:
        SQLALCHEMY_DATABASE_URI = _db_uri
        print(f"[CONFIG] Using DATABASE_URI from environment: {_db_uri}")
    # Cho phép tất cả localhost origins trong development
    CORS_ALLOWED_ORIGINS = os.environ.get(
        'CORS_ALLOWED_ORIGINS', 
        'http://localhost:5173,http://localhost:3000,http://localhost:8000,http://127.0.0.1:5173,http://127.0.0.1:3000'
    ).split(',')

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    CORS_ALLOWED_ORIGINS = ['http://localhost:5173', 'http://localhost:3000']

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI') or 'sqlite:///aura.db'
    # Production: Chỉ cho phép specific domains từ environment variable
    CORS_ALLOWED_ORIGINS = os.environ.get(
        'CORS_ALLOWED_ORIGINS', 
        'https://aura-clinic.com,https://www.aura-clinic.com'
    ).split(',')
    CORS_MAX_AGE = 7200  # 2 hours cho production

class SwaggerConfig:
    """Swagger configuration."""
    template = {
        "swagger": "2.0",
        "info": {
            "title": "AURA Retinal Vascular Health Screening API",
            "description": "API for retinal vascular health screening system",
            "version": "1.0.0"
        },
        "basePath": "/",
        "schemes": ["http", "https"],
        "consumes": ["application/json"],
        "produces": ["application/json"]
    }

    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec',
                "route": '/apispec.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/docs"
    }