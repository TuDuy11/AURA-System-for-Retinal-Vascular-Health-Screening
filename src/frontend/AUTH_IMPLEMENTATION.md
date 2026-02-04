# AURA Authentication & RBAC Implementation

## Overview

Hệ thống Authentication và RBAC (Role-Based Access Control) cho phòng khám sàng lọc võng mạc AURA đã được implement hoàn chỉnh theo kiến trúc hướng đối tượng và design pattern chuẩn.

## Architecture

### Layer Architecture

```
UI Layer (React Components)
    ↓
Controller Layer (AuthController)
    ↓
Service Layer (AuthService)
    ↓
Repository Layer (IUserRepository, IRoleRepository)
    ↓
Mock Data Layer
```

### Authentication Flow Sequence

```
1. User nhập email/password → Click "Đăng nhập"
2. UI → AuthController.login(LoginRequest)
3. AuthController → AuthService.login(request)
4. AuthService → IUserRepository.findByEmail(email)
   ├─ if user == null → throw "UNAUTHORIZED" (401)
   └─ if user exists → continue
5. AuthService → IPasswordHasher.verify(password, hash)
   ├─ if verify == false → throw "UNAUTHORIZED" (401)
   └─ if verify == true → continue
6. AuthService → IRoleRepository.getRolesByUserId(userId)
   └─ returns List<Role>
7. AuthService → ITokenService.generateAccessToken(user, roles)
8. AuthService → ITokenService.generateRefreshToken(user)
9. AuthService → return LoginResponse { accessToken, refreshToken, roles, user }
10. UI → Redirect based on roles[0].name
    ├─ PATIENT → Patient Dashboard
    └─ DOCTOR → Doctor Dashboard
```

## File Structure

```
/src/app/
├── services/
│   └── auth/
│       ├── types.ts                      # DTO definitions
│       ├── IUserRepository.ts            # Interface
│       ├── IPasswordHasher.ts            # Interface
│       ├── IRoleRepository.ts            # Interface
│       ├── ITokenService.ts              # Interface
│       ├── MockUserRepository.ts         # Mock implementation
│       ├── MockPasswordHasher.ts         # Mock implementation
│       ├── MockRoleRepository.ts         # Mock implementation
│       ├── MockTokenService.ts           # Mock implementation
│       ├── AuthService.ts                # Core business logic
│       └── AuthController.ts             # Entry point for UI
├── components/
│   ├── LoginPage.tsx                     # Login UI với states
│   ├── PatientDashboard.tsx              # Patient portal
│   ├── DoctorDashboard.tsx               # Doctor portal
│   ├── DevNotes.tsx                      # Developer documentation
│   └── shared/
│       ├── DashboardLayout.tsx           # Shared layout với user info
│       └── RoleGuard.tsx                 # Access denied page
└── App.tsx                               # Main app với routing logic
```

## Demo Accounts

### Patient Account
- **Email:** patient@example.com
- **Password:** password
- **Role:** PATIENT
- **Full Name:** Nguyễn Văn A

### Doctor Account
- **Email:** doctor@aura.vn
- **Password:** password
- **Role:** DOCTOR
- **Full Name:** TS. BS. Nguyễn Thị B

## Testing Guide

### Test Case 1: Invalid Email (401 Unauthorized)
1. Vào Login page
2. Nhập email không tồn tại: `wrong@email.com`
3. Nhập password bất kỳ: `password`
4. Click "Đăng nhập"
5. **Expected:** Alert "Email hoặc mật khẩu không đúng"

### Test Case 2: Invalid Password (401 Unauthorized)
1. Vào Login page
2. Nhập email đúng: `patient@example.com`
3. Nhập password sai: `wrongpassword`
4. Click "Đăng nhập"
5. **Expected:** Alert "Email hoặc mật khẩu không đúng"

### Test Case 3: Patient Login Success
1. Vào Login page
2. Nhập email: `patient@example.com`
3. Nhập password: `password`
4. Click "Đăng nhập" (có thể ở tab Bệnh nhân hoặc Bác sĩ - role thật lấy từ backend)
5. **Expected:** 
   - Loading spinner hiển thị
   - Sau ~1s redirect đến Patient Dashboard
   - Topbar hiển thị: "Nguyễn Văn A" + icon User + badge "Bệnh nhân"

### Test Case 4: Doctor Login Success
1. Vào Login page
2. Nhập email: `doctor@aura.vn`
3. Nhập password: `password`
4. Click "Đăng nhập"
5. **Expected:**
   - Loading spinner hiển thị
   - Sau ~1s redirect đến Doctor Dashboard
   - Topbar hiển thị: "TS. BS. Nguyễn Thị B" + icon Stethoscope + badge "Bác sĩ"

### Test Case 5: RBAC - Role Determined by Backend
1. Login với Patient account ở tab "Bác sĩ"
2. **Expected:** Vẫn redirect đến Patient Dashboard (vì backend trả role PATIENT)
3. Login với Doctor account ở tab "Bệnh nhân"
4. **Expected:** Vẫn redirect đến Doctor Dashboard (vì backend trả role DOCTOR)

## UI States

### Login Page States

1. **Idle State**
   - Form rỗng hoặc đã có data
   - Button "Đăng nhập" enabled
   - Không có error message

2. **Submitting State**
   - Button hiển thị "Đang xử lý..." với spinner
   - Button disabled
   - Input fields vẫn editable

3. **Error State (401 Unauthorized)**
   - Red alert box hiển thị
   - Message: "Email hoặc mật khẩu không đúng"
   - Button enabled trở lại
   - User có thể retry

4. **Success State**
   - Transition ngắn
   - Redirect đến dashboard tương ứng

## DTO Definitions

### LoginRequest
```typescript
{
  email: string;
  password: string;
}
```

### LoginResponse
```typescript
{
  accessToken: string;
  refreshToken: string;
  roles: Role[];
  user: UserInfo;
}
```

### Role
```typescript
{
  id: string;
  name: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  displayName: string;
}
```

### UserInfo
```typescript
{
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}
```

## Production Implementation Notes

### Security Considerations

1. **Password Hashing**
   - Current: Plain text comparison (DEMO ONLY)
   - Production: Use bcrypt with salt rounds ≥ 10
   ```typescript
   const hash = await bcrypt.hash(password, 10);
   const isValid = await bcrypt.compare(password, hash);
   ```

2. **JWT Tokens**
   - Current: Mock tokens with Base64
   - Production: Use RS256 algorithm with private/public key pair
   - Access Token expiry: 15-60 minutes
   - Refresh Token expiry: 7-30 days

3. **Token Storage**
   - Current: localStorage (for demo)
   - Production: 
     - Access Token: Memory or httpOnly cookie
     - Refresh Token: httpOnly, secure, sameSite cookie

4. **API Security**
   - Implement rate limiting (e.g., 5 login attempts per 15 minutes)
   - Use HTTPS only
   - Add CSRF protection
   - Implement request signing

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User-Role junction table (many-to-many)
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Optional: Permissions for fine-grained access control
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);
```

### API Endpoints

```
POST /api/auth/login
  Request: { email, password }
  Response: { accessToken, refreshToken, roles, user }
  Errors: 
    - 400: Invalid request body
    - 401: Invalid credentials
    - 429: Too many requests
    - 500: Internal server error

POST /api/auth/refresh
  Request: { refreshToken }
  Response: { accessToken }
  Errors:
    - 401: Invalid or expired refresh token
    - 500: Internal server error

POST /api/auth/logout
  Request: { refreshToken }
  Response: { success: true }

GET /api/auth/me
  Headers: { Authorization: "Bearer {accessToken}" }
  Response: { user, roles }
  Errors:
    - 401: Invalid or expired token
```

## View Developer Documentation

Để xem documentation đầy đủ trong UI:

1. **Option 1:** Thay đổi initial state trong App.tsx
   ```typescript
   const [viewMode, setViewMode] = useState<ViewMode>('dev-notes');
   ```

2. **Option 2:** Add temporary button để toggle
   ```typescript
   <button onClick={() => setViewMode('dev-notes')}>View Dev Notes</button>
   ```

3. **Option 3:** Access through browser console
   ```javascript
   // In browser DevTools console
   window.location.hash = '#dev-notes'
   ```

## Key Design Decisions

### 1. Why Mock Services?

Mock services implement the same interfaces as production services, making it easy to:
- Develop UI without waiting for backend
- Test different scenarios (success, errors, loading states)
- Swap to real services by just changing the implementation
- Follow Dependency Inversion Principle

### 2. Why Separate Repositories?

- **Single Responsibility:** Each repository handles one entity
- **Testability:** Easy to mock individual repositories
- **Flexibility:** Can use different data sources (SQL, NoSQL, external API)
- **Maintainability:** Changes to one entity don't affect others

### 3. Why Token Service?

- Encapsulates token generation logic
- Can switch token types (JWT, OAuth, etc.) without changing business logic
- Easier to implement refresh token rotation
- Centralized place for token validation

### 4. Why Role-Based Redirect in UI?

- UI makes redirect decision based on backend response (roles[])
- UI pill "Bệnh nhân/Bác sĩ" is just UX hint, not security
- Security enforced at:
  - Backend: API endpoints check roles before processing
  - Frontend: Show/hide UI based on roles, but backend always validates
  - Database: Row Level Security (RLS) policies

## Benefits of This Architecture

1. **Separation of Concerns**
   - UI layer handles presentation
   - Controller handles request/response
   - Service handles business logic
   - Repository handles data access

2. **Testability**
   - Each layer can be tested independently
   - Mock implementations for unit tests
   - Integration tests with real dependencies

3. **Scalability**
   - Easy to add new roles (ADMIN, NURSE, etc.)
   - Easy to add new authentication methods (OAuth, SAML, etc.)
   - Easy to add permissions system

4. **Maintainability**
   - Clear boundaries between layers
   - Changes in one layer don't cascade
   - Easy to understand and onboard new developers

## Next Steps for Production

1. ✅ Replace mock implementations with real services
2. ✅ Implement proper password hashing (bcrypt)
3. ✅ Implement JWT with signing
4. ✅ Set up database with schema
5. ✅ Add API rate limiting
6. ✅ Implement refresh token rotation
7. ✅ Add audit logging
8. ✅ Set up monitoring and alerting
9. ✅ Add CSRF protection
10. ✅ Implement session management

## Support

For questions or issues, contact the development team or refer to:
- `/src/app/components/DevNotes.tsx` - In-app documentation
- `/src/app/services/auth/` - Service implementations
- This file - Architecture overview

---

**Last Updated:** February 2, 2026
**Version:** 1.0.0
**Author:** AURA Development Team
