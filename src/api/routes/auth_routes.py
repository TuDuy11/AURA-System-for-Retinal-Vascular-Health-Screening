from flask import Blueprint, request, jsonify, g
from infrastructure.repositories.user_repository import UserRepository
from infrastructure.repositories.email_verification_token_repository import EmailVerificationTokenRepository
from infrastructure.databases.mssql import get_request_db_session, SessionFactory, init_mssql
from api.validators import validate_email, validate_password, validate_login_request, validate_register_request, validate_email_verification_token, validate_resend_verification_email_request
from services.email_service import email_service
import jwt
import os
import bcrypt
from datetime import datetime, timedelta

auth_bp = Blueprint("auth", __name__)

def hash_password(password: str) -> str:
    """Băm mật khẩu"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Kiểm tra mật khẩu"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_secret_key() -> str:
    """
    Get JWT secret key from environment
    Raises error if not set in production
    """
    secret_key = os.getenv("SECRET_KEY")
    if not secret_key:
        env = os.getenv("FLASK_ENV", "development")
        if env == "production":
            raise ValueError("SECRET_KEY must be set in environment for production")
        secret_key = "your-secret-key-change-in-production"  # Default for dev
    return secret_key

def verify_token_from_header(auth_header: str) -> tuple:
    """
    Verify JWT token from Authorization header
    
    Args:
        auth_header: Authorization header value
        
    Returns:
        Tuple of (payload_dict or None, error_message or None, status_code)
    """
    if not auth_header:
        return None, "Token không được cung cấp", 401
    
    try:
        # Extract token from "Bearer {token}" format
        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return None, "Invalid authorization header format", 400
        
        token = parts[1]
        secret_key = get_secret_key()
        
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload, None, 200
        
    except jwt.ExpiredSignatureError:
        return None, "Token đã hết hạn", 401
    except jwt.InvalidTokenError as e:
        return None, f"Token không hợp lệ: {str(e)}", 401
    except Exception as e:
        return None, f"Lỗi xác minh token: {str(e)}", 500

# Khởi tạo database (tạo bảng nếu chưa có)
try:
    init_mssql()
except Exception as e:
    print(f"Database initialization warning: {e}")

# Seed dữ liệu mẫu khi khởi động
def seed_demo_users():
    """Thêm dữ liệu demo vào database"""
    from infrastructure.databases.mssql import get_db_session
    session = get_db_session()
    try:
        from infrastructure.models.user_model import UserModel
        
        # Kiểm tra xem đã có demo users chưa
        existing = session.query(UserModel).filter(
            UserModel.email.in_(["patient@example.com", "doctor@example.com"])
        ).first()
        
        if not existing:
            # Thêm patient
            patient = UserModel(
                email="patient@example.com",
                password_hash=hash_password("123456"),
                full_name="Bệnh nhân Demo",
                is_active=True
            )
            session.add(patient)
            
            # Thêm doctor
            doctor = UserModel(
                email="doctor@example.com",
                password_hash=hash_password("123456"),
                full_name="Tiến sĩ Demo",
                is_active=True
            )
            session.add(doctor)
            
            session.commit()
            print("✓ Demo users seeded successfully")
    except Exception as e:
        print(f"Seed users warning: {e}")

# Seed dữ liệu lần đầu (disabled - use login with demo accounts instead)
# Demo accounts are seeded when first registered
# Demo credentials: patient@example.com / 123456, doctor@example.com / 123456
# seed_demo_users()

@auth_bp.post("/login")
def login():
    """
    Endpoint đăng nhập
    
    Request body:
    {
        "email": "patient@example.com",
        "password": "Password123"
    }
    
    Response:
    {
        "success": true,
        "data": {
            "accessToken": "jwt_token",
            "refreshToken": "refresh_token",
            "user": {
                "id": "uuid",
                "email": "patient@example.com",
                "fullName": "Bệnh nhân Demo"
            },
            "roles": [
                {"id": "1", "name": "PATIENT"}
            ]
        }
    }
    """
    session = get_request_db_session()
    user_repo = UserRepository(session)
    
    try:
        # Validate request
        data = request.get_json() or {}
        is_valid, error = validate_login_request(data)
        if not is_valid:
            return jsonify({
                "success": False,
                "error": error
            }), 400
        
        # Lấy dữ liệu từ request
        email = data.get("email", "").strip()
        password = data.get("password")
        
        # Tìm user trong database
        user_data = user_repo.find_by_email(email)
        if not user_data:
            return jsonify({
                "success": False,
                "error": "Email hoặc mật khẩu không đúng"
            }), 401
        
        # Kiểm tra mật khẩu
        if not verify_password(password, user_data["password_hash"]):
            return jsonify({
                "success": False,
                "error": "Email hoặc mật khẩu không đúng"
            }), 401
        
        # Tạo JWT token
        secret_key = get_secret_key()
        payload = {
            "user_id": user_data["id"],
            "email": user_data["email"],
            "iat": datetime.utcnow().timestamp(),
            "exp": (datetime.utcnow() + timedelta(hours=24)).timestamp()
        }
        
        access_token = jwt.encode(payload, secret_key, algorithm="HS256")
        refresh_token = jwt.encode({**payload, "exp": (datetime.utcnow() + timedelta(days=7)).timestamp()}, secret_key, algorithm="HS256")
        
        # Xác định role dựa trên email
        role = "PATIENT"
        if "doctor" in email.lower():
            role = "DOCTOR"
        elif "admin" in email.lower():
            role = "ADMIN"
        
        # Trả về response
        return jsonify({
            "success": True,
            "data": {
                "accessToken": access_token,
                "refreshToken": refresh_token,
                "user": {
                    "id": user_data["id"],
                    "email": user_data["email"],
                    "fullName": user_data["full_name"],
                    "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_data['email']}"
                },
                "roles": [
                    {
                        "id": user_data["id"],
                        "name": role
                    }
                ]
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@auth_bp.post("/logout")
def logout():
    """
    Endpoint đăng xuất
    """
    try:
        return jsonify({
            "success": True,
            "message": "Đã đăng xuất thành công"
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@auth_bp.post("/register")
def register():
    """
    Endpoint đăng ký tài khoản mới
    
    Request body:
    {
        "email": "user@example.com",
        "password": "Password123",
        "fullName": "Tên người dùng"
    }
    
    Response:
    {
        "success": true,
        "data": {
            "accessToken": "jwt_token",
            "refreshToken": "refresh_token",
            "user": {
                "id": "uuid",
                "email": "user@example.com",
                "fullName": "Tên người dùng"
            },
            "roles": [
                {"id": "uuid", "name": "PATIENT"}
            ]
        }
    }
    """
    session = get_request_db_session()
    user_repo = UserRepository(session)
    
    try:
        # Validate request
        data = request.get_json() or {}
        is_valid, error = validate_register_request(data)
        if not is_valid:
            return jsonify({
                "success": False,
                "error": error
            }), 400
        
        # Lấy dữ liệu từ request
        email = data.get("email", "").strip()
        password = data.get("password")
        full_name = data.get("fullName", "").strip() if data.get("fullName") else None
        
        # Kiểm tra email đã tồn tại hay chưa (temporarily skip - see if creation works first)
        # try:
        #     existing_user = user_repo.find_by_email(email)
        #     if existing_user:
        #         return jsonify({
        #             "success": False,
        #             "error": "Email này đã được đăng ký"
        #         }), 400
        # except Exception as e:
        #     # If there's a DB error, just proceed with creation
        #     # This can happen with in-memory DB or I/O issues
        #     print(f"[Warning] Could not check existing email: {e}")
        
        # Mã hóa mật khẩu
        password_hash = hash_password(password)
        
        # Tạo user mới
        new_user = user_repo.create(
            email=email,
            password_hash=password_hash,
            full_name=full_name or email.split("@")[0]
        )
        
        # Tạo JWT token
        secret_key = get_secret_key()
        payload = {
            "user_id": new_user["id"],
            "email": new_user["email"],
            "iat": datetime.utcnow().timestamp(),
            "exp": (datetime.utcnow() + timedelta(hours=24)).timestamp()
        }
        
        access_token = jwt.encode(payload, secret_key, algorithm="HS256")
        refresh_token = jwt.encode({**payload, "exp": (datetime.utcnow() + timedelta(days=7)).timestamp()}, secret_key, algorithm="HS256")
        
        # Xác định role mặc định là PATIENT
        role = "PATIENT"
        
        # Trả về response
        return jsonify({
            "success": True,
            "data": {
                "accessToken": access_token,
                "refreshToken": refresh_token,
                "user": {
                    "id": new_user["id"],
                    "email": new_user["email"],
                    "fullName": new_user["full_name"],
                    "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={new_user['email']}"
                },
                "roles": [
                    {
                        "id": new_user["id"],
                        "name": role
                    }
                ]
            }
        }), 201
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@auth_bp.get("/verify")
def verify_token():
    """
    Endpoint xác minh token
    
    Headers:
    {
        "Authorization": "Bearer {token}"
    }
    
    Response:
    {
        "success": true,
        "data": {
            "user_id": "uuid",
            "email": "user@example.com",
            "iat": timestamp,
            "exp": timestamp
        }
    }
    """
    try:
        auth_header = request.headers.get("Authorization", "")
        payload, error, status_code = verify_token_from_header(auth_header)
        
        if error:
            return jsonify({
                "success": False,
                "error": error
            }), status_code
        
        return jsonify({
            "success": True,
            "data": payload
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@auth_bp.get("/me")
def get_current_user():
    """
    Get current logged-in user information
    
    Headers:
    {
        "Authorization": "Bearer {accessToken}"
    }
    
    Response:
    {
        "success": true,
        "data": {
            "id": "uuid",
            "email": "user@example.com",
            "fullName": "User Name",
            "avatar": "avatar_url",
            "roles": [
                {"id": "uuid", "name": "PATIENT"}
            ]
        }
    }
    """
    session = get_request_db_session()
    user_repo = UserRepository(session)
    
    try:
        auth_header = request.headers.get("Authorization", "")
        payload, error, status_code = verify_token_from_header(auth_header)
        
        if error:
            return jsonify({
                "success": False,
                "error": error
            }), status_code
        
        # Get user from database
        user_id = payload.get("user_id")
        email = payload.get("email")
        
        user_data = user_repo.find_by_email(email)
        if not user_data:
            return jsonify({
                "success": False,
                "error": "Không tìm thấy người dùng"
            }), 404
        
        # Determine role based on email
        role = "PATIENT"
        if "doctor" in email.lower():
            role = "DOCTOR"
        elif "admin" in email.lower():
            role = "ADMIN"
        
        return jsonify({
            "success": True,
            "data": {
                "id": user_data["id"],
                "email": user_data["email"],
                "fullName": user_data["full_name"],
                "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_data['email']}",
                "roles": [
                    {
                        "id": user_data["id"],
                        "name": role
                    }
                ]
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@auth_bp.post("/refresh")
def refresh_access_token():
    """
    Refresh access token using refresh token
    
    Request body:
    {
        "refreshToken": "refresh_token_value"
    }
    
    Response:
    {
        "success": true,
        "data": {
            "accessToken": "new_access_token",
            "expiresIn": 86400
        }
    }
    """
    session = get_request_db_session()
    user_repo = UserRepository(session)
    
    try:
        data = request.get_json() or {}
        refresh_token = data.get("refreshToken")
        
        if not refresh_token:
            return jsonify({
                "success": False,
                "error": "refreshToken là bắt buộc"
            }), 400
        
        # Verify refresh token
        secret_key = get_secret_key()
        try:
            payload = jwt.decode(refresh_token, secret_key, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "error": "Refresh token đã hết hạn"
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                "success": False,
                "error": "Refresh token không hợp lệ"
            }), 401
        
        # Verify user still exists
        user_id = payload.get("user_id")
        email = payload.get("email")
        user_data = user_repo.find_by_email(email)
        
        if not user_data:
            return jsonify({
                "success": False,
                "error": "Người dùng không tồn tại"
            }), 404
        
        # Generate new access token
        new_payload = {
            "user_id": user_id,
            "email": email,
            "iat": datetime.utcnow().timestamp(),
            "exp": (datetime.utcnow() + timedelta(hours=24)).timestamp()
        }
        
        new_access_token = jwt.encode(new_payload, secret_key, algorithm="HS256")
        
        return jsonify({
            "success": True,
            "data": {
                "accessToken": new_access_token,
                "expiresIn": 86400  # 24 hours in seconds
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@auth_bp.post("/send-verification-email")
def send_verification_email_endpoint():
    """
    Send verification email to user after registration
    
    Request body:
    {
        "userId": "uuid"
    }
    
    Response:
    {
        "success": true,
        "message": "Email xác nhận đã được gửi"
    }
    """
    session = get_request_db_session()
    user_repo = UserRepository(session)
    token_repo = EmailVerificationTokenRepository(session)
    
    try:
        data = request.get_json() or {}
        user_id = data.get("userId")
        
        if not user_id:
            return jsonify({
                "success": False,
                "error": "userId là bắt buộc"
            }), 400
        
        # Find user
        user_data = user_repo.find_by_id(user_id)
        if not user_data:
            return jsonify({
                "success": False,
                "error": "Người dùng không tồn tại"
            }), 404
        
        # Check if email already verified
        if user_data.get("email_verified"):
            return jsonify({
                "success": False,
                "error": "Email đã được xác nhận"
            }), 400
        
        # Invalidate previous tokens
        token_repo.invalidate_user_tokens(user_id)
        
        # Create verification token
        verification_token = token_repo.create_token(user_id)
        
        # Send verification email
        email_sent = email_service.send_verification_email(
            recipient_email=user_data["email"],
            verification_token=verification_token,
            full_name=user_data.get("full_name")
        )
        
        if not email_sent:
            return jsonify({
                "success": False,
                "error": "Không thể gửi email xác nhận"
            }), 500
        
        return jsonify({
            "success": True,
            "message": "Email xác nhận đã được gửi"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@auth_bp.post("/verify-email")
def verify_email_endpoint():
    """
    Verify email address with verification token
    
    Request body:
    {
        "token": "verification_token"
    }
    
    Response:
    {
        "success": true,
        "message": "Email đã được xác nhận thành công"
    }
    """
    session = get_request_db_session()
    user_repo = UserRepository(session)
    token_repo = EmailVerificationTokenRepository(session)
    
    try:
        data = request.get_json() or {}
        
        # Validate request
        is_valid, error = validate_email_verification_token(data)
        if not is_valid:
            return jsonify({
                "success": False,
                "error": error
            }), 400
        
        token = data.get("token")
        
        # Get token record
        token_record = token_repo.get_token_by_token(token)
        if not token_record:
            return jsonify({
                "success": False,
                "error": "Token xác nhận không hợp lệ"
            }), 400
        
        # Check if token is valid
        if not token_record.is_valid():
            if token_record.is_used:
                return jsonify({
                    "success": False,
                    "error": "Token xác nhận đã được sử dụng"
                }), 400
            else:
                return jsonify({
                    "success": False,
                    "error": "Token xác nhận đã hết hạn"
                }), 400
        
        # Update user email_verified
        user_id = token_record.user_id
        user_repo.update_email_verified(user_id)
        
        # Mark token as used
        token_repo.verify_token(token)
        
        return jsonify({
            "success": True,
            "message": "Email đã được xác nhận thành công"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@auth_bp.post("/resend-verification-email")
def resend_verification_email_endpoint():
    """
    Resend verification email to user
    
    Request body:
    {
        "email": "user@example.com"
    }
    
    Response:
    {
        "success": true,
        "message": "Email xác nhận đã được gửi lại"
    }
    """
    session = get_request_db_session()
    user_repo = UserRepository(session)
    token_repo = EmailVerificationTokenRepository(session)
    
    try:
        data = request.get_json() or {}
        
        # Validate request
        is_valid, error = validate_resend_verification_email_request(data)
        if not is_valid:
            return jsonify({
                "success": False,
                "error": error
            }), 400
        
        email = data.get("email").strip()
        
        # Find user by email
        user_data = user_repo.find_by_email(email)
        if not user_data:
            # Don't reveal if email exists for security
            return jsonify({
                "success": True,
                "message": "Nếu email tồn tại, email xác nhận sẽ được gửi"
            }), 200
        
        # Check if email already verified
        if user_data.get("email_verified"):
            return jsonify({
                "success": False,
                "error": "Email đã được xác nhận"
            }), 400
        
        # Invalidate previous tokens
        token_repo.invalidate_user_tokens(user_data["id"])
        
        # Create verification token
        verification_token = token_repo.create_token(user_data["id"])
        
        # Send verification email
        email_sent = email_service.send_verification_email(
            recipient_email=user_data["email"],
            verification_token=verification_token,
            full_name=user_data.get("full_name")
        )
        
        if not email_sent:
            return jsonify({
                "success": True,
                "message": "Nếu email tồn tại, email xác nhận sẽ được gửi"
            }), 200
        
        return jsonify({
            "success": True,
            "message": "Email xác nhận đã được gửi lại"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@auth_bp.post("/change-password")
def change_password():
    """
    Change password (requires old password for verification)
    
    Headers:
    {
        "Authorization": "Bearer {accessToken}"
    }
    
    Request body:
    {
        "currentPassword": "old_password",
        "newPassword": "new_password",
        "confirmPassword": "new_password"
    }
    
    Response:
    {
        "success": true,
        "message": "Mật khẩu đã được thay đổi thành công"
    }
    """
    session = get_request_db_session()
    user_repo = UserRepository(session)
    
    try:
        # Verify token
        auth_header = request.headers.get("Authorization", "")
        payload, error, status_code = verify_token_from_header(auth_header)
        
        if error:
            return jsonify({
                "success": False,
                "error": error
            }), status_code
        
        # Get request data
        data = request.get_json() or {}
        current_password = data.get("currentPassword", "").strip()
        new_password = data.get("newPassword", "").strip()
        confirm_password = data.get("confirmPassword", "").strip()
        
        # Validation
        if not current_password or not new_password or not confirm_password:
            return jsonify({
                "success": False,
                "error": "Vui lòng điền đầy đủ thông tin"
            }), 400
        
        if len(new_password) < 6:
            return jsonify({
                "success": False,
                "error": "Mật khẩu mới phải có ít nhất 6 ký tự"
            }), 400
        
        if new_password != confirm_password:
            return jsonify({
                "success": False,
                "error": "Mật khẩu xác nhận không khớp"
            }), 400
        
        # Get user
        user_id = payload.get("user_id")
        email = payload.get("email")
        user_data = user_repo.find_by_email(email)
        
        if not user_data:
            return jsonify({
                "success": False,
                "error": "Không tìm thấy người dùng"
            }), 404
        
        # Verify current password
        if not verify_password(current_password, user_data.get("password_hash", "")):
            return jsonify({
                "success": False,
                "error": "Mật khẩu hiện tại không chính xác"
            }), 401
        
        # Update password
        new_password_hash = hash_password(new_password)
        user_repo.update_password(user_id, new_password_hash)
        
        return jsonify({
            "success": True,
            "message": "Mật khẩu đã được thay đổi thành công"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@auth_bp.post("/reset-password")
def reset_password():
    """
    Reset password by email (for forgot password flow)
    
    Request body:
    {
        "email": "user@example.com",
        "newPassword": "new_password",
        "confirmPassword": "new_password"
    }
    
    Response:
    {
        "success": true,
        "message": "Mật khẩu đã được đặt lại thành công"
    }
    """
    session = get_request_db_session()
    user_repo = UserRepository(session)
    
    try:
        # Get request data
        data = request.get_json() or {}
        email = data.get("email", "").strip()
        new_password = data.get("newPassword", "").strip()
        confirm_password = data.get("confirmPassword", "").strip()
        
        # Validation
        if not email or not new_password or not confirm_password:
            return jsonify({
                "success": False,
                "error": "Vui lòng điền đầy đủ thông tin"
            }), 400
        
        if not validate_email(email)[0]:
            return jsonify({
                "success": False,
                "error": "Email không hợp lệ"
            }), 400
        
        if len(new_password) < 6:
            return jsonify({
                "success": False,
                "error": "Mật khẩu phải có ít nhất 6 ký tự"
            }), 400
        
        if new_password != confirm_password:
            return jsonify({
                "success": False,
                "error": "Mật khẩu xác nhận không khớp"
            }), 400
        
        # Find user
        user_data = user_repo.find_by_email(email)
        if not user_data:
            # Don't reveal if email exists for security
            return jsonify({
                "success": True,
                "message": "Nếu email tồn tại, mật khẩu sẽ được đặt lại"
            }), 200
        
        # Update password
        new_password_hash = hash_password(new_password)
        user_repo.update_password(user_data["id"], new_password_hash)
        
        return jsonify({
            "success": True,
            "message": "Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới."
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

