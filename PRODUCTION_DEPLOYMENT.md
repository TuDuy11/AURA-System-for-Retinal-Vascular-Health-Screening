# Production Deployment Guide for AURA

## Overview

AURA supports two database backends:
- **SQLite** (Development) - Simple file-based database, single-threaded
- **PostgreSQL** (Production) - Robust enterprise database, multi-threaded

## ⚠️ Important: Why PostgreSQL for Production?

SQLite is **NOT suitable for multi-threaded servers like Waitress/Gunicorn** because:
- File-based locking causes "disk I/O errors" under concurrent access
- Flask test client (single-threaded) works fine
- Production servers with multiple workers cause database locks
- PostgreSQL handles concurrent connections natively

## 🚀 Production Setup with PostgreSQL & Docker Compose

### Step 1: Configure Environment Variables

Copy `.env.production` template and update credentials:

```bash
cp .env.production .env
# Edit .env with your actual values:
# - DB_PASSWORD (use strong password)
# - SECRET_KEY (use 32+ character random string)
# - CORS_ALLOWED_ORIGINS (your domain)
```

**Required Variables for Production:**
```
FLASK_ENV=production
FLASK_DEBUG=False
DB_ENGINE=postgresql
DB_HOST=postgres
DB_PORT=5432
DB_NAME=aura_db
DB_USER=aura_user
DB_PASSWORD=your_strong_password_here
SECRET_KEY=your_secret_key_min_32_chars
WORKERS=4
THREADS=2
```

### Step 2: Start Production Environment

```bash
# Start with PostgreSQL (production profile)
docker-compose --profile production up -d --build

# Verify services are running
docker-compose ps
# Should show: postgres (healthy), api (healthy), frontend (running)

# Check logs
docker-compose logs -f
```

### Step 3: Verify Database Connection

```bash
# Check PostgreSQL connection
docker-compose exec postgres psql -U aura_user -d aura_db -c "SELECT version();"

# Check API health
curl http://localhost:9999/api/health
```

### Step 4: Test Authentication Flow

```bash
# Register new user
curl -X POST http://localhost:9999/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "fullName": "Test User"
  }'
# Expected: Status 201 ✅

# Login with new user
curl -X POST http://localhost:9999/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
# Expected: Status 200 with access token ✅
```

## 💻 Development Setup (SQLite)

For local development, use SQLite with Flask dev server (single-threaded):

```bash
# Load development environment
cp .env.development .env

# Start only API (without PostgreSQL)
docker-compose up --build

# OR run locally without Docker
python run_app.py
# Server runs on http://localhost:9999
```

## 📋 Docker Compose Commands

### Production (with PostgreSQL)
```bash
# Start all services (API + PostgreSQL + Frontend)
docker-compose --profile production up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose --profile production down

# Backup database
docker-compose exec postgres pg_dump -U aura_user aura_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U aura_user aura_db < backup.sql
```

### Development (SQLite only)
```bash
# Start without PostgreSQL
docker-compose up -d

# Use default profile (excludes PostgreSQL)
# API will use SQLite from DATABASE_URI env var
```

## 🔧 Environment Configuration Files

### `.env.production` - Production Settings
- PostgreSQL connection
- Gunicorn workers (4 workers recommended)
- Production security settings
- Custom domain CORS

### `.env.development` - Development Settings
- SQLite in-memory database
- Flask debug mode enabled
- Localhost CORS origins

### Load Environment Variables
```bash
# Automatically loaded from .env file by docker-compose
# For non-Docker usage:
source .env  # Linux/Mac
set -o allexport ; source .env ; set +o allexport  # Bash
```

## 🔐 Security Configuration

### Update Before Going to Production

1. **SECRET_KEY** (in `.env`)
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

2. **Database Password** (in `.env`)
   - Uses strong, random 32+ character password
   - Different from development

3. **CORS Origins** (in `.env`)
   - Only allow your actual domain
   - Example: `https://yourdomain.com,https://www.yourdomain.com`

4. **SSL/HTTPS** 
   - Use reverse proxy (nginx) in front of API
   - Enable SSL certificates (Let's Encrypt)

## 📊 Performance Tuning

### For High Traffic

**Update `.env` for your server capacity:**

```bash
# For 8+ CPU cores, 16GB+ RAM
WORKERS=8        # 2-4 per CPU core
THREADS=4        # 2-4 per worker
TIMEOUT=120      # Allow longer requests
DB_POOL_SIZE=20  # More database connections
```

**PostgreSQL tuning (`docker-compose.yml`):**
```yaml
environment:
  POSTGRES_MAX_CONNECTIONS=200
  POSTGRES_SHARED_BUFFERS=256MB
  POSTGRES_EFFECTIVE_CACHE_SIZE=1GB
```

## 🚨 Troubleshooting

### `disk I/O error` - You're using SQLite with Waitress!
**Solution:** Use PostgreSQL (see Step 1-2 above)

### `psycopg2` not found
**Solution:** Already in `requirements.txt` - just rebuild Docker
```bash
docker-compose down && docker-compose --profile production up --build
```

### API can't connect to PostgreSQL
**Check:**
```bash
# Verify PostgreSQL is running and healthy
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Verify credentials in .env match docker-compose.yml
cat .env | grep DB_
```

### Database schema not created
**Run migrations or restart:**
```bash
docker-compose down -v      # Remove volumes (fresh start)
docker-compose --profile production up -d
```

## 📈 Monitoring

### Check Service Health
```bash
# All services health
docker-compose ps

# API health endpoint
curl -s http://localhost:9999/api/health | jq .

# Database connection test
docker-compose exec postgres psql -U aura_user -d aura_db -c "SELECT NOW();"
```

### View Real-Time Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f postgres
```

## 🔄 Database Migrations

For schema updates:

```bash
# Connect to PostgreSQL container
docker-compose exec postgres psql -U aura_user -d aura_db

# Run SQL scripts
docker-compose exec -T postgres psql -U aura_user -d aura_db < script.sql
```

## ✅ Pre-Launch Checklist

- [ ] PostgreSQL configured in `.env`
- [ ] SECRET_KEY generated (not default)
- [ ] DB_PASSWORD is strong and unique
- [ ] CORS_ALLOWED_ORIGINS set to actual domain
- [ ] SSL/HTTPS configured (reverse proxy)
- [ ] Database backups configured
- [ ] API health check passing
- [ ] Authentication working (register + login)
- [ ] Frontend configured to use correct API URL
- [ ] Logs monitored in production

## 📞 Support

For issues with:
- **SQLite problems:** Switch to PostgreSQL production setup
- **Connection issues:** Check `.env` credentials match docker-compose.yml  
- **Performance:** Review worker/thread counts for your hardware
- **Security:** Verify all production variables updated

---

**Next Step:** Follow "Step 1: Configure Environment Variables" above to deploy!
