# Email Verification Feature - Implementation Guide

**Date:** February 6, 2026  
**Status:** ✅ Complete & Ready to Test

## 📋 Overview

Email verification is now a core feature of the AURA authentication system. Users must verify their email address after registration before accessing certain features.

## 🗂️ Files Created & Modified

### New Files
1. **`src/infrastructure/models/email_verification_token_model.py`**
   - SQLAlchemy model for storing email verification tokens
   - Tracks token expiration and usage

2. **`src/services/email_service.py`**
   - Email service with SMTP support
   - Handles verification email and password reset email templates
   - Supports Gmail SMTP (production-ready)

3. **`src/infrastructure/repositories/email_verification_token_repository.py`**
   - Repository pattern for token management
   - CRUD operations and token validation

### Modified Files
1. **`src/infrastructure/models/user_model.py`**
   - Added `email_verified` (Boolean, default=False)
   - Added `email_verified_at` (DateTime, nullable)

2. **`src/infrastructure/repositories/user_repository.py`**
   - Added `update_email_verified()` method
   - Updated `find_by_email()` and `find_by_id()` to include verification fields

3. **`src/api/routes/auth_routes.py`**
   - Added 3 new endpoints (see API endpoints section)
   - Integrated email service and token repository

4. **`src/api/validators.py`**
   - Added `validate_email_verification_token()`
   - Added `validate_resend_verification_email_request()`

5. **`.env` & `.env.example`**
   - Added email configuration variables

---

## 🔌 Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

### Gmail Configuration (Recommended)

1. **Enable 2-Step Verification**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Generate app-specific password
   - Use this as `SENDER_PASSWORD` (not your Google password)

### Other Email Providers

The service supports any SMTP server:

```env
# SendGrid
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SENDER_EMAIL=apikey
SENDER_PASSWORD=SG.xxxxxxxxxxxxxxxxxx

# Office 365
SMTP_SERVER=smtp.office365.com
SMTP_PORT=587
SENDER_EMAIL=your-email@company.com
SENDER_PASSWORD=your-password
```

---

## 🔄 Workflow

### 1. User Registration Flow

```
User Registration
    ↓
[POST /api/auth/register]
    ├─ Validate input
    ├─ Check email doesn't exist
    ├─ Hash password
    ├─ Create user (email_verified = False)
    ├─ Generate verification token
    ├─ Send verification email
    └─ Return accessToken, refreshToken
```

### 2. Email Verification Flow

```
Verification Email Received
    ↓
User Clicks Link
    ↓
[POST /api/auth/verify-email]
    ├─ Extract token from URL
    ├─ Validate token
    ├─ Mark token as used
    ├─ Update user.email_verified = True
    └─ Return success
```

### 3. Resend Verification Email

```
User Clicks "Resend Email"
    ↓
[POST /api/auth/resend-verification-email]
    ├─ Find user by email
    ├─ Check email not already verified
    ├─ Invalidate previous tokens
    ├─ Create new token
    ├─ Send verification email
    └─ Return success
```

---

## 📡 API Endpoints

### 1. Send Verification Email

```bash
POST /api/auth/send-verification-email
```

**Request:**
```json
{
  "userId": "uuid-of-user"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email xác nhận đã được gửi"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Người dùng không tồn tại"
}
```

---

### 2. Verify Email

```bash
POST /api/auth/verify-email
```

**Request:**
```json
{
  "token": "verification-token-from-email"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email đã được xác nhận thành công"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Token xác nhận đã hết hạn"
}
```

**Possible Errors:**
- `"Token xác nhận không hợp lệ"` - Token doesn't exist
- `"Token xác nhận đã được sử dụng"` - Token already used
- `"Token xác nhận đã hết hạn"` - Token expired (after 24 hours)

---

### 3. Resend Verification Email

```bash
POST /api/auth/resend-verification-email
```

**Request:**
```json
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

**Note:** Returns success even if email doesn't exist (security best practice)

---

## 🧪 Testing Guide

### Setup

1. **Configure Gmail (or other email provider)**
   ```env
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SENDER_EMAIL=your-email@gmail.com
   SENDER_PASSWORD=your-app-password
   FRONTEND_URL=http://localhost:5173
   ```

2. **Restart Flask API**
   ```bash
   python src/run_waitress.py
   ```

3. **Check database migration**
   ```sql
   -- New tables created automatically:
   -- email_verification_tokens (stores verification tokens)
   -- Updated users table with email_verified, email_verified_at columns
   ```

### Test Case 1: Register & Verify Email

```bash
# 1. Register new user
curl -X POST http://localhost:9999/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123",
    "fullName": "Test User"
  }'

# Response:
# {
#   "success": true,
#   "data": {
#     "accessToken": "jwt_token",
#     "refreshToken": "refresh_token",
#     "user": {
#       "id": "user-uuid",
#       "email": "testuser@example.com",
#       "fullName": "Test User"
#     }
#   }
# }

# 2. Send verification email (if needed)
curl -X POST http://localhost:9999/api/auth/send-verification-email \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-uuid"}'

# 3. Check email inbox for verification link
# 4. Extract token from link: http://localhost:5173/verify-email?token=ABC123...

# 5. Verify email with token
curl -X POST http://localhost:9999/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "ABC123..."}'

# Response:
# {
#   "success": true,
#   "message": "Email đã được xác nhận thành công"
# }

# 6. Get user to confirm email_verified=true
curl -X GET http://localhost:9999/api/auth/me \
  -H "Authorization: Bearer jwt_token"
```

### Test Case 2: Resend Verification Email

```bash
# User clicks "Resend Email" button
curl -X POST http://localhost:9999/api/auth/resend-verification-email \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com"}'

# Response:
# {
#   "success": true,
#   "message": "Email xác nhận đã được gửi lại"
# }
```

### Test Case 3: Token Expiration

```bash
# 1. Register user
# 2. Wait 24+ hours (or modify token expiration in code for testing)
# 3. Try to verify with old token

curl -X POST http://localhost:9999/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "old-token-after-24h"}'

# Response:
# {
#   "success": false,
#   "error": "Token xác nhận đã hết hạn"
# }
```

### Test Case 4: Invalid Token

```bash
curl -X POST http://localhost:9999/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "invalid-token-abc123"}'

# Response:
# {
#   "success": false,
#   "error": "Token xác nhận không hợp lệ"
# }
```

---

## 🔒 Security Features

1. ✅ **Secure Token Generation**
   - Uses `secrets.token_urlsafe(32)` for cryptographically secure tokens
   - Tokens are unique and cannot be guessed

2. ✅ **Token Expiration**
   - Default 24-hour expiration
   - Expired tokens are rejected

3. ✅ **One-Time Use**
   - Tokens marked as "used" after successful verification
   - Cannot be reused

4. ✅ **Email Enumeration Protection**
   - Resend endpoint doesn't reveal if email exists
   - Security best practice to prevent user enumeration

5. ✅ **Password Hashing**
   - User passwords already hashed with bcrypt
   - Tokens stored in plaintext (acceptable as they're short-lived)

6. ✅ **HTTPS Ready**
   - All links use `FRONTEND_URL` which should be HTTPS in production

---

## 📊 Database Schema

### email_verification_tokens table

```sql
CREATE TABLE email_verification_tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL FOREIGN KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### users table (updated)

```sql
-- New columns added:
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE
ALTER TABLE users ADD COLUMN email_verified_at DATETIME NULL
```

---

## 🚀 Production Checklist

- [ ] Configure `SMTP_SERVER`, `SENDER_EMAIL`, `SENDER_PASSWORD` in production `.env`
- [ ] Set `FRONTEND_URL` to production frontend URL
- [ ] Set `FLASK_ENV=production` and `DEBUG=False`
- [ ] Use HTTPS for all frontend URLs
- [ ] Set strong `SECRET_KEY` in production
- [ ] Enable email logging for monitoring
- [ ] Set up email monitoring/alerting
- [ ] Test email delivery in production environment
- [ ] Implement rate limiting on email endpoints (optional)
- [ ] Backup email templates if customizing

---

## 🔄 Future Enhancements

1. **Rate Limiting**
   - Limit verification email sends per user
   - Prevent abuse of resend endpoint

2. **Email Customization**
   - Allow admins to customize email templates
   - Multi-language support

3. **Notification Preferences**
   - Users can opt-out of emails
   - Email type management

4. **Analytics**
   - Track verification rates
   - Monitor email delivery

5. **Integration**
   - SendGrid for better deliverability
   - Email status webhooks
   - Bounce handling

---

## 🐛 Troubleshooting

### Email Not Received

1. Check `SENDER_PASSWORD` is correct (Gmail app-specific password)
2. Check `SMTP_SERVER` and `SMTP_PORT` are correct
3. Check firewall isn't blocking SMTP port 587
4. Check email isn't in spam folder
5. Check Flask logs for SMTP errors

### Token Verification Fails

1. Make sure token copied completely (including special characters)
2. Check token hasn't expired (24 hour limit)
3. Check token hasn't already been used
4. Verify database has tables (run migrations if needed)

### Database Errors

1. Ensure `email_verification_tokens` table exists
2. Ensure `users` table has `email_verified` and `email_verified_at` columns
3. Reset database if needed: `rm aura.db`

---

## 📞 Support

For issues or questions:
1. Check this guide's Troubleshooting section
2. Check Flask application logs
3. Review database schema
4. Test with simple curl commands
5. Verify email provider configuration

---

**Implementation by:** GitHub Copilot  
**Last Updated:** February 6, 2026
