from .health_routes import health_bp
from .auth_routes import auth_bp
from .payment_routes import payment_bp

def register_routes(app):
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(payment_bp)
