from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, scoped_session
import os
from config import Config
from infrastructure.databases.base import Base
from flask import g

# Import all models to register them with Base.metadata BEFORE create_all()
# This is necessary so SQLAlchemy knows about all relationships and foreign keys
try:
    from infrastructure.models.user_model import UserModel
    from infrastructure.models.roles_model import RoleModel
    from infrastructure.models.permission_model import PermissionModel
    from infrastructure.models.notification_model import NotificationModel
    from infrastructure.models.notification_template_model import NotificationTemplateModel
    from infrastructure.models.auth_identity_model import AuthIdentityModel
    from infrastructure.models.email_verification_token_model import EmailVerificationTokenModel
except Exception as e:
    # Models might have circular import issues, but we'll handle it gracefully
    print(f"Warning: Could not import all models: {e}")

DATABASE_URI = Config.SQLALCHEMY_DATABASE_URI
print(f"[DB CONFIG] Reading Config.SQLALCHEMY_DATABASE_URI: {Config.SQLALCHEMY_DATABASE_URI}")
print(f"[DB CONFIG] os.environ.get('DATABASE_URI'): {os.environ.get('DATABASE_URI')}")
print(f"[DB CONFIG] Final DATABASE_URI being used: {DATABASE_URI}")  

# Create engine with database-specific options
if 'sqlite' in DATABASE_URI:
    if '/:memory:' in DATABASE_URI:
        # For in-memory SQLite, use StaticPool - single persistent connection
        from sqlalchemy.pool import StaticPool
        engine = create_engine(
            DATABASE_URI, 
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
            echo=False
        )
    else:
        # For file-based SQLite in Waitress/Gunicorn multi-threading:
        # Use NullPool to avoid database locking issues
        # Each request gets a new connection that's immediately closed
        from sqlalchemy.pool import NullPool
        engine = create_engine(
            DATABASE_URI, 
            connect_args={"check_same_thread": False, "timeout": 30},
            poolclass=NullPool,  # Critical: dispose connection after each use
            echo=False
        )
elif 'postgresql' in DATABASE_URI:
    engine = create_engine(
        DATABASE_URI,
        pool_size=10,
        pool_recycle=3600,
        pool_pre_ping=True,
        echo=False
    )
else:
    engine = create_engine(DATABASE_URI, echo=False)

# Create session factory with scoped_session for thread-local storage
SessionFactory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
scoped_session_factory = scoped_session(SessionFactory)

def get_db_session():
    """
    Get or create a database session.
    This creates a thread-local session that's automatically managed.
    """
    return scoped_session_factory()

def get_request_db_session(app=None):
    """
    Get database session for a Flask request.
    Uses Flask's g object to store per-request session.
    Call this from inside a request context.
    """
    try:
        from flask import g
        if 'db_session' not in g:
            # Create a direct session (not scoped) for this request
            g.db_session = SessionFactory()
        return g.db_session
    except RuntimeError:
        # Not in Flask app context, use scoped session
        return get_db_session()

def init_app(app):
    """
    Initialize database for Flask application.
    Sets up request-scoped session management.
    """
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        """Close the database session at the end of each request."""
        from flask import g
        session = g.pop('db_session', None)
        if session is not None:
            print(f"[DB TEARDOWN] Closing session {id(session)}")
            session.close()
            print(f"[DB TEARDOWN] Session closed")
    
    # Also initialize database tables
    init_mssql()

def init_mssql(app=None):
    """
    Tạo bảng dựa trên Base.metadata.
    Chỉ tạo được bảng nếu các file model đã được import (ở __init__.py).
    """
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        # If there are foreign key issues, try to create only the essential tables
        print(f"[DB INIT] Warning: Could not create all tables: {e}")
        print("[DB INIT] Attempting to create essential tables only...")
        try:
            # Create tables for basic auth and email verification
            from infrastructure.models.user_model import UserModel
            from infrastructure.models.email_verification_token_model import EmailVerificationTokenModel
            UserModel.__table__.create(bind=engine, checkfirst=True)
            EmailVerificationTokenModel.__table__.create(bind=engine, checkfirst=True)
            print("[DB INIT] Essential tables created successfully")
        except Exception as e2:
            print(f"[DB INIT] Could not create essential tables: {e2}")
            # Continue anyway - the tables might already exist or will be created on first use


