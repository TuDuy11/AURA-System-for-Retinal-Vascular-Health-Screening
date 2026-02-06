# AURA Email Verification - Getting Started

**Quick Start Guide for Developers**

---

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
cd src
pip install -r requirements.txt
```

Required packages are already in `requirements.txt`:
- Flask
- SQLAlchemy
- PyJWT
- bcrypt
- python-dotenv
- waitress

### 2. Configure Email (Development)

For development/testing, email service works without actual SMTP:

```bash
# Create .env file (or update existing)
cat >> .env << EOF
# Email Configuration (optional for testing)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=  # Leave empty for development
FRONTEND_URL=http://localhost:5173
EOF
```

### 3. Run the Backend

```bash
# From src directory
python run_waitress.py
# or
python -m flask run
```

Backend runs on `http://localhost:9999`

---

## 🔌 API Endpoints

All endpoints return JSON with `success` boolean and `data` object.

### 1. Register User

**Creates unverified user account**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "ValidPassword123",
  "fullName": "User Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "fullName": "User Name"
    },
    "roles": [{"name": "PATIENT"}]
  }
}
```

**Important:** User is created with `email_verified=false`

---

### 2. Send Verification Email

**Sends verification email (called automatically after register)**

```bash
POST /api/auth/send-verification-email
Content-Type: application/json

{
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email xác nhận đã được gửi"
}
```

**In Development:**
- Check console/logs for message: `Email not sent (no SENDER_PASSWORD configured). Would send to: user@example.com`
- Token is created but email not actually sent

---

### 3. Verify Email

**User clicks link in email and verifies**

```bash
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_from_email"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email đã được xác nhận thành công"
}
```

**Result:** User's `email_verified=true`

---

### 4. Resend Verification Email

**If user didn't receive email**

```bash
POST /api/auth/resend-verification-email
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email xác nhận đã được gửi lại"
}
```

---

## 🧪 Testing in Development

### Test 1: Quick Registration & Verification Flow

```bash
# 1. Register
curl -X POST http://localhost:9999/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123",
    "fullName": "Test User"
  }'

# Save the userId from response, e.g.: "user-uuid-12345"
USER_ID="user-uuid-12345"

# 2. Send verification email
curl -X POST http://localhost:9999/api/auth/send-verification-email \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"$USER_ID\"}"

# 3. Check console for token
# You'll see: "Email not sent (no SENDER_PASSWORD). Would send to: testuser@example.com"

# 4. Get token from database (for testing only)
# In production, token is in email link

# 5. Verify email
curl -X POST http://localhost:9999/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "TOKEN_FROM_DATABASE"}'

# Expected: {"success": true, "message": "Email đã được xác nhận thành công"}
```

### Test 2: Run Unit Tests

```bash
# Install test dependencies
pip install pytest pytest-flask

# Run tests
cd src/tests
pytest test_email_verification.py -v

# Expected output:
# test_email_verification.py::TestEmailValidation::test_valid_email PASSED
# test_email_verification.py::TestPasswordValidation::test_valid_password PASSED
# ... (30+ tests)
```

---

## 📝 Development Tips

### 1. Access Verification Token (Testing Only)

In development, to get the token without email:

```python
# In Python shell or script
from infrastructure.repositories.email_verification_token_repository import EmailVerificationTokenRepository
from infrastructure.databases.mssql import SessionLocal

session = SessionLocal()
repo = EmailVerificationTokenRepository(session)

# Get latest token for user
latest_token = repo.get_token_by_user_id("user-uuid")
if latest_token:
    print(f"Token: {latest_token.token}")
```

### 2. View Created Users

```python
from infrastructure.repositories.user_repository import UserRepository
from infrastructure.databases.mssql import SessionLocal

session = SessionLocal()
user_repo = UserRepository(session)

# Get user by email
user = user_repo.find_by_email("testuser@example.com")
if user:
    print(f"Email verified: {user['email_verified']}")
    print(f"Verified at: {user['email_verified_at']}")
```

### 3. Reset Database

```bash
# Delete SQLite database to start fresh
rm aura.db

# Next app start will create new empty database
python run_waitress.py
```

---

## 🔧 Production Setup

### 1. Configure Real Email Service

Get Gmail app-specific password:

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Copy the 16-character password
4. Update `.env`:

```
SENDER_EMAIL=your-real-email@gmail.com
SENDER_PASSWORD=xxxx xxxx xxxx xxxx
FRONTEND_URL=https://your-domain.com
```

### 2. Verify Email Links Work

Update `.env` with production frontend URL:

```
FRONTEND_URL=https://your-production-domain.com
```

User will see email with link:
```
https://your-production-domain.com/verify-email?token=ABC123...
```

### 3. Test Email Delivery

```bash
# Send test email
curl -X POST https://your-api.com/api/auth/send-verification-email \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user-id"}'

# Check inbox for email
# Time: Usually 1-5 seconds
```

---

## 📚 Architecture

```
Email Verification Flow:

User Registration
    ↓
[POST /register] → Create user (email_verified=false)
    ↓
[Auto] Create verification token (24h expiration)
    ↓
[POST /send-verification-email] → Send email with token
    ↓
User Clicks Email Link
    ↓
[POST /verify-email] → Validate token, mark user as verified
    ↓
User Can Access Protected Resources
```

---

## 🐛 Troubleshooting

### Issue: Email service not initialized

**Error:** `ModuleNotFoundError: No module named 'services'`

**Solution:**
```bash
# Make sure you're in src directory
cd src
python run_waitress.py
```

### Issue: Token validation fails

**Error:** `"Token xác nhận không hợp lệ"`

**Solution:**
1. Token must be 20+ characters
2. Token must not be used yet
3. Token must not older than 24 hours

### Issue: Email not sent in production

**Error:** SMTP connection failed

**Solution:**
1. Check SMTP credentials in `.env`
2. For Gmail: Use app-specific password (not your Google password)
3. Check firewall allows port 587
4. Check email provider isn't blocking

### Issue: Circular import errors

**Error:** `ImportError: cannot import name 'UserModel'`

**Solution:**
```python
# WRONG - Don't do this at top level
from infrastructure.databases import UserModel

# CORRECT - Import directly from models
from infrastructure.models.user_model import UserModel
```

---

## 📖 Full Documentation

- **Implementation Details:** See `FEATURE_IMPLEMENTATION.md`
- **Configuration Guide:** See `EMAIL_VERIFICATION.md`
- **Test Report:** See `TEST_REPORT.md`
- **API docs:** See inline comments in `src/api/routes/auth_routes.py`

---

## ✅ Checklist Before Going to Production

- [ ] SENDER_PASSWORD configured (Gmail app password)
- [ ] FRONTEND_URL points to production domain
- [ ] Database migrations run
- [ ] Email delivery tested
- [ ] Token expiration verified (24 hours)
- [ ] Error messages i18n (Vietnamese/English)
- [ ] Rate limiting configured (optional)
- [ ] Logs monitored
- [ ] Email templates customized (optional)

---

## 🤝 Contributing

Found a bug or want to improve? 

1. Check existing tests in `src/tests/test_email_verification.py`
2. Add new test for your fix
3. Run: `pytest test_email_verification.py -v`
4. Create pull request

---

**Last Updated:** February 6, 2026  
**Status:** ✅ Production Ready  
**Support:** See EMAIL_VERIFICATION.md for detailed guide
