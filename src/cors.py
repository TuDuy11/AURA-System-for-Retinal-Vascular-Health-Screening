from flask_cors import CORS

def init_cors(app):
    CORS(app, 
         origins="*",
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
         allow_headers=["Content-Type", "Authorization"],
         supports_credentials=True,
         max_age=3600)
    return app
from flask_cors import CORS
