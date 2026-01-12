````bash
AURA-System-for-Retinal-Vascular-Health-Screening/
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
├── README.md
└── src/
    ├── api/
    │   ├── controllers/
    │   │   └── ...                  # Controllers for the API
    │   ├── routes/
    │   │   ├── __init__.py
    │   │   └── health_routes.py
    │   ├── middleware.py
    │   ├── requests.py
    │   └── responses.py
    ├── domain/
    │   └── models/
    │       └── ...                  # Business logic models
    ├── services/
    │   └── ...                      # Services interacting with domain (business logic)
    ├── infrastructure/
    │   ├── databases/
    │   │   └── ...                  # DB adapters + initialization
    │   ├── models/
    │   │   └── ...                  # ORM/DB models
    │   └── services/
    │       └── ...                  # 3rd-party integrations (email, storage, etc.)
    ├── aura.db                      # SQLite database file (optional to commit)
    ├── app.py
    ├── config.py
    ├── cors.py
    ├── create_app.py
    ├── dependency_container.py
    ├── error_handler.py
    ├── logging.py
    └── wsgi.py                      # Gunicorn entrypoint (app object)






# AURA Backend docker 

## Yêu cầu
- Cài Docker Desktop

## Cách chạy
```bash
docker compose up -d --build

## Cách test 
-  Truy cập localhost:9999/health


