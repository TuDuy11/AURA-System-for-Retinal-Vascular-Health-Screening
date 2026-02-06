# Quick Environment Setup Guide

## 🎯 Choose Your Environment

### Development (SQLite - Recommended for Local Work)
```bash
# Copy development config
cp .env.development .env

# Start with Flask dev server (single-threaded, no concurrency issues)
cd src
python run_app.py
# Server: http://localhost:9999
```

**Pros:**
- ✅ No setup needed (no PostgreSQL)
- ✅ SQLite works perfectly with single thread
- ✅ Fast iteration cycle
- ✅ Test client authentication works 100%

**Cons:**
- ❌ SQLite breaks with multi-threaded servers (Waitress/Gunicorn)
- ❌ Not suitable for production

---

### Production (PostgreSQL - For Deployment)
```bash
# Copy production config
cp .env.production .env

# Update critical vars in .env:
# - DB_PASSWORD (strong password)
# - SECRET_KEY (32+ chars random)
# - CORS_ALLOWED_ORIGINS (your domain)

# Start with Docker (PostgreSQL + API + Frontend)
docker-compose --profile production up -d --build

# Server: http://localhost:9999
# Frontend: http://localhost:5173
```

**Pros:**
- ✅ Multi-threaded servers work (Waitress/Gunicorn)
- ✅ Handles concurrent connections
- ✅ Enterprise-grade reliability
- ✅ Easy to scale & backup
- ✅ HTTP requests work perfectly

**Cons:**
- ❌ Requires Docker & PostgreSQL setup
- ❌ Slightly more complex configuration

---

## 🔄 Switching Between Environments

### From Development → Production
```bash
# Stop Flask dev server (Ctrl+C)

# Backup your SQLite database if needed
cp src/aura.db backup_dev.db

# Load production config
cp .env.production .env
nano .env  # Update DB_PASSWORD, SECRET_KEY, CORS_ALLOWED_ORIGINS

# Start Docker with PostgreSQL
docker-compose --profile production up -d --build

# Verify
curl http://localhost:9999/api/health
```

### From Production → Development
```bash
# Stop Docker
docker-compose --profile production down

# Load development config
cp .env.development .env

# Start Flask dev server
cd src && python run_app.py
```

---

## ✅ What's Different?

| Feature | Development | Production |
|---------|-------------|-----------|
| **Database** | SQLite (in-memory or file) | PostgreSQL |
| **Server** | Flask dev (`python run_app.py`) | Gunicorn/Waitress (docker) |
| **Threading** | Single thread | Multi-threaded (workers) |
| **CORS** | `localhost:*` | Your domain |
| **SSL** | None | Required (nginx) |
| **Monitoring** | Manual | Docker healthcheck |
| **Backups** | Manual | Automated volumes |

---

## 📝 Config File Reference

### `.env.development`
- Uses SQLite (fast, no setup)
- Flask debug mode enabled
- Localhost CORS

### `.env.production`
- Uses PostgreSQL (robust)
- Production security settings
- Custom domain CORS

---

## 🧪 Test Each Environment

### Development - Flask Test Client ✅
```bash
python -c "
import sys
sys.path.insert(0, 'src')
from create_app import create_app

app = create_app()
client = app.test_client()

# Register
r1 = client.post('/api/auth/register', json={
    'email': 'test@ex.com',
    'password': 'Pass123!',
    'fullName': 'Test'
})
print(f'Register: {r1.status_code}')  # 201 ✅

# Login
r2 = client.post('/api/auth/login', json={
    'email': 'test@ex.com',
    'password': 'Pass123!'
})
print(f'Login: {r2.status_code}')  # 200 ✅
"
```

### Production - HTTP Requests ✅
```bash
# Wait for server to start
sleep 5

# Register
curl -X POST http://localhost:9999/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@ex.com",
    "password": "Pass123!",
    "fullName": "User"
  }'
# Expected: 201 ✅

# Login
curl -X POST http://localhost:9999/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@ex.com",
    "password": "Pass123!"
  }'
# Expected: 200 ✅
```

---

## 🚀 Recommended Flow

1. **Develop Locally** → Use `.env.development` + Flask
2. **Test in Docker** → Use `.env.production` to verify Docker setup
3. **Deploy** → Push `.env` secrets to production server, start Docker

---

## ❓ Common Issues

### "disk I/O error" with Waitress
**Problem:** Using SQLite + Waitress
**Solution:** Use PostgreSQL (`.env.production`)

### API won't start
**Check:**
```bash
# Verify Python environment
python --version
pip list | grep Flask

# Check env file exists
cat .env | head -5

# Try starting directly
cd src && python run_app.py
```

### PostgreSQL connection fails
**Check:**
```bash
# Verify credentials in .env
grep DB_ .env

# Test Docker
docker-compose ps postgres

# Check logs
docker-compose logs postgres
```

---

## 📚 Full Documentation

See `PRODUCTION_DEPLOYMENT.md` for complete production setup guide.
