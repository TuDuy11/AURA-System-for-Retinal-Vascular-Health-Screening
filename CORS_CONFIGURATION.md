# CORS Configuration Guide

## 📋 Tổng Quan

CORS (Cross-Origin Resource Sharing) được cấu hình để cho phép các requests từ frontend được chấp nhận bởi backend API. Hệ thống đã được nâng cấp để:

- ✅ Hỗ trợ multiple origins
- ✅ Environment-specific configuration (Dev/Test/Production)
- ✅ Detailed logging và debugging
- ✅ Security best practices

---

## 🔧 Cấu Hình Cơ Bản

### 1. **Environment Variables** (`.env`)

```bash
# Development - Cho phép localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# Production - Chỉ cho phép specific domains
# CORS_ALLOWED_ORIGINS=https://aura-clinic.com,https://www.aura-clinic.com
```

### 2. **Tệp Cấu Hình** (`src/config.py`)

Hệ thống tự động tải cấu hình theo `FLASK_ENV`:

```python
# Development (mặc định)
FLASK_ENV=development
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,...

# Testing
FLASK_ENV=testing
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Production
FLASK_ENV=production
CORS_ALLOWED_ORIGINS=https://aura-clinic.com
CORS_MAX_AGE=7200  # 2 hours cache
```

---

## 🎯 Các Tính Năng

### **1. Multiple Origins Support**
```python
# Hỗ trợ nhiều origins, cách nhau bằng dấu phẩy
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://app.example.com
```

### **2. Automatic Origin Validation**
```python
# File: src/cors.py
def validate_origin(origin):
    """Kiểm tra origin có hợp lệ không"""
    # Log thông báo debug/warning nếu origin bị từ chối
```

### **3. Request/Response Logging**
```python
# File: src/api/middleware.py
# Tự động log:
# - Origin của request
# - Response status code
# - Processing time
# - CORS headers được set
```

### **4. Flexible HTTP Methods**
```python
CORS_ALLOWED_METHODS = [
    'GET', 'POST', 'PUT', 'DELETE', 
    'OPTIONS', 'PATCH', 'HEAD'
]
```

### **5. Custom Headers Support**
```python
CORS_ALLOWED_HEADERS = [
    'Content-Type',      # JSON request
    'Authorization',     # Bearer tokens
    'X-Requested-With'   # AJAX detection
]
```

---

## 📊 Configuration Summary

| Property | Development | Production |
|----------|-------------|-----------|
| `CORS_ALLOWED_ORIGINS` | localhost:5173,3000 | Specific domains |
| `CORS_MAX_AGE` | 3600s (1 hour) | 7200s (2 hours) |
| `CORS_ALLOW_CREDENTIALS` | True | True |
| `LOG_LEVEL` | DEBUG | INFO |

---

## 🔒 Security Best Practices

### ✅ Làm
- Chỉ định rõ ràng các origins được phép
- Sử dụng `https://` trong production
- Validate origins trên backend
- Log các requests bị từ chối

### ❌ Không Làm
- ❌ Không sử dụng `origins: "*"` în production
- ❌ Không để credentials=True mà không validate origins
- ❌ Không expose sensitive headers

---

## 🧪 Testing CORS

### **1. Kiểm tra bằng curl**
```bash
curl -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  http://localhost:9999/api/health
```

### **2. Browser Console**
```javascript
fetch('http://localhost:9999/api/health', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(data => console.log(data))
.catch(err => console.error('CORS Error:', err))
```

### **3. Kiểm tra Logs**
```bash
docker logs aura-api
# Tìm dòng: [CORS] Allowed origin: ...
```

---

## 🚀 Deployment Checklist

### Development
- [ ] `.env` có `FLASK_ENV=development`
- [ ] `CORS_ALLOWED_ORIGINS` chỉ localhost

### Production
- [ ] `.env` có `FLASK_ENV=production`
- [ ] `CORS_ALLOWED_ORIGINS` là HTTPS domains
- [ ] SECRET_KEY được set từ environment
- [ ] DEBUG=False
- [ ] Kiểm tra logs không có warnings

---

## 🔗 Related Files

- [cors.py](../src/cors.py) - CORS initialization
- [config.py](../src/config.py) - Configuration classes
- [middleware.py](../src/api/middleware.py) - Request logging
- [create_app.py](../src/create_app.py) - App factory
- [.env.example](../.env.example) - Environment template

---

## 📝 Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS error in browser | Kiểm tra `CORS_ALLOWED_ORIGINS` có chứa origin của bạn |
| Preflight requests timeout | Tăng `CORS_MAX_AGE` hoặc kiểm tra network |
| Credentials not sent | Set `CORS_ALLOW_CREDENTIALS=True` (mặc định) |
| Log không hiển thị | Kiểm tra `LOG_LEVEL` trong config |

---

## 📚 References

- [Flask-CORS Documentation](https://flask-cors.readthedocs.io/)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP CORS Security](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html)
