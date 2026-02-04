# AURA Authentication System - Quick Start Guide

## 🚀 Quick Testing

### Demo Accounts

**Patient Account:**
- Email: `patient@example.com`
- Password: `password`

**Doctor Account:**
- Email: `doctor@aura.vn`
- Password: `password`

### Test the Flow

1. **Open the app** → Click "Đăng nhập" in header
2. **Enter credentials** → Use demo account above
3. **Click "Đăng nhập"** → Watch the loading state
4. **Observe redirect** → Patient → Patient Dashboard | Doctor → Doctor Dashboard

### View Developer Documentation

**Method 1: Browser Console**
```javascript
// Open browser DevTools (F12) and run:
auraDebug.showDevNotes()
```

**Method 2: Console Function**
```javascript
// Or simply:
showDevNotes()
```

**Method 3: Check Demo Accounts**
```javascript
// View all available accounts:
auraDebug.demoAccounts
```

## 📋 What to Test

### ✅ Valid Login (Patient)
- Email: `patient@example.com`
- Password: `password`
- Expected: Loading → Redirect to Patient Dashboard

### ✅ Valid Login (Doctor)
- Email: `doctor@aura.vn`
- Password: `password`
- Expected: Loading → Redirect to Doctor Dashboard

### ❌ Invalid Email
- Email: `wrong@email.com`
- Password: `password`
- Expected: Error message "Email hoặc mật khẩu không đúng"

### ❌ Invalid Password
- Email: `patient@example.com`
- Password: `wrongpassword`
- Expected: Error message "Email hoặc mật khẩu không đúng"

### 🔒 RBAC Test
- Login with Patient account at "Bác sĩ" tab
- Expected: Still redirects to Patient Dashboard (role from backend, not UI)

## 🎯 Key Features Implemented

### 1. Login States
- ✅ **Idle**: Form ready
- ✅ **Submitting**: Loading spinner + disabled button
- ✅ **Error**: Red alert with message
- ✅ **Success**: Redirect to correct dashboard

### 2. RBAC (Role-Based Access Control)
- ✅ Patient → Patient Dashboard only
- ✅ Doctor → Doctor Dashboard only
- ✅ Role determined by backend (not UI selection)
- ✅ User info displayed in topbar

### 3. Authentication Flow
```
UI → AuthController.login()
  → AuthService.login()
    → UserRepository.findByEmail()
    → PasswordHasher.verify()
    → RoleRepository.getRolesByUserId()
    → TokenService.generateTokens()
  ← LoginResponse { tokens, roles, user }
→ Redirect based on roles
```

### 4. Dashboards
- ✅ **Patient Dashboard**: Upload screening, view history, results
- ✅ **Doctor Dashboard**: Review cases, manage patients, notifications
- ✅ **Dynamic User Info**: Name, email, role badge from LoginResponse

## 📁 File Structure

```
/src/app/
├── services/auth/
│   ├── AuthController.ts          # Entry point
│   ├── AuthService.ts              # Business logic
│   ├── types.ts                    # DTOs
│   └── Mock*.ts                    # Mock implementations
├── components/
│   ├── LoginPage.tsx               # Login with states
│   ├── PatientDashboard.tsx        # Patient portal
│   ├── DoctorDashboard.tsx         # Doctor portal
│   └── DevNotes.tsx                # Full documentation
└── App.tsx                         # Main routing
```

## 🔧 For Developers

### Access Dev Notes
1. Run in console: `auraDebug.showDevNotes()`
2. Or read: `/AUTH_IMPLEMENTATION.md`

### Demo Accounts in Console
```javascript
auraDebug.demoAccounts
// Returns:
{
  patient: { email: "patient@example.com", password: "password" },
  doctor: { email: "doctor@aura.vn", password: "password" }
}
```

### Quick Login for Testing
```javascript
// Go to login page
auraDebug.showLogin()
```

## 🎨 UI/UX Features

- ✅ Clean, professional medical-tech design
- ✅ Gradient blue/cyan theme
- ✅ Loading states with spinners
- ✅ Error messages in red alerts
- ✅ Responsive layout (desktop + mobile)
- ✅ Smooth transitions

## 📚 Documentation

- **Quick Start**: This file
- **Full Implementation**: `/AUTH_IMPLEMENTATION.md`
- **In-App Dev Notes**: Run `auraDebug.showDevNotes()`
- **API Contracts**: See DTOs in `/src/app/services/auth/types.ts`

## ⚠️ Important Notes

### This is a DEMO
- Uses mock services with simulated delays
- Passwords stored as plain text (NOT for production)
- Tokens are base64-encoded (NOT secure)
- Data stored in localStorage

### For Production
- Replace mock services with real backend
- Use bcrypt for password hashing
- Implement proper JWT with signing
- Use httpOnly cookies for tokens
- Add rate limiting
- Enable HTTPS only

## 🐛 Troubleshooting

**Problem:** Login button not responding
- **Solution:** Check console for errors. Ensure all services are loaded.

**Problem:** Redirect not working
- **Solution:** Check LoginResponse.roles has correct role name (PATIENT/DOCTOR)

**Problem:** User info not showing
- **Solution:** Verify LoginResponse.user contains fullName and email

## 📞 Support

For questions or issues:
1. Check DevNotes: `auraDebug.showDevNotes()`
2. Read implementation doc: `/AUTH_IMPLEMENTATION.md`
3. Check console for debug info

---

**Version:** 1.0.0  
**Last Updated:** February 2, 2026  
**Team:** AURA Development
