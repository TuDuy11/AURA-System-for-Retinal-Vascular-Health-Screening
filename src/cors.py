from flask_cors import CORS

def init_cors(app):
    CORS(app, 
         origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
         allow_headers=["Content-Type", "Authorization"],
         supports_credentials=True,
         max_age=3600)
    return app