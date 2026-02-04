from flask import Blueprint, request, jsonify
from infrastructure.repositories.user_repository import UserRepository
from infrastructure.databases.mssql import SessionLocal, init_mssql
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

# Khởi tạo database (tạo bảng nếu chưa có)
try:
    init_mssql()
except Exception as e:
    print(f"Database initialization warning: {e}")

# Seed dữ liệu mẫu khi khởi động
def seed_demo_users():
    """Thêm dữ liệu demo vào database"""
    session = SessionLocal()
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
    finally:
        session.close()

# Seed dữ liệu lần đầu
seed_demo_users()

@auth_bp.post("/login")
def login():
    """
    Endpoint đăng nhập
    
    Request body:
    {
        "email": "patient@example.com",
        "password": "123456"
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
    session = SessionLocal()
    user_repo = UserRepository(session)
    
    try:
        # Lấy dữ liệu từ request
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        
        # Kiểm tra input
        if not email or not password:
            return jsonify({
                "success": False,
                "error": "Email và mật khẩu là bắt buộc"
            }), 400
        
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
        payload = {
            "user_id": user_data["id"],
            "email": user_data["email"],
            "iat": datetime.utcnow().timestamp(),
            "exp": (datetime.utcnow() + timedelta(hours=24)).timestamp()
        }
        
        secret_key = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
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
    finally:
        user_repo.close()

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
        "password": "password123",
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
    session = SessionLocal()
    user_repo = UserRepository(session)
    
    try:
        # Lấy dữ liệu từ request
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        full_name = data.get("fullName")
        
        # Kiểm tra input
        if not email or not password:
            return jsonify({
                "success": False,
                "error": "Email và mật khẩu là bắt buộc"
            }), 400
        
        # Kiểm tra email đã tồn tại hay chưa
        existing_user = user_repo.find_by_email(email)
        if existing_user:
            return jsonify({
                "success": False,
                "error": "Email này đã được đăng ký"
            }), 400
        
        # Kiểm tra độ dài mật khẩu
        if len(password) < 6:
            return jsonify({
                "success": False,
                "error": "Mật khẩu phải có ít nhất 6 ký tự"
            }), 400
        
        # Mã hóa mật khẩu
        password_hash = hash_password(password)
        
        # Tạo user mới
        new_user = user_repo.create(
            email=email,
            password_hash=password_hash,
            full_name=full_name or email.split("@")[0]
        )
        
        # Tạo JWT token
        payload = {
            "user_id": new_user["id"],
            "email": new_user["email"],
            "iat": datetime.utcnow().timestamp(),
            "exp": (datetime.utcnow() + timedelta(hours=24)).timestamp()
        }
        
        secret_key = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
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
    finally:
        user_repo.close()

@auth_bp.get("/verify")
def verify_token():
    """
    Endpoint xác minh token
    """
    try:
        # Lấy token từ header
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({
                "success": False,
                "error": "Token không được cung cấp"
            }), 401
        
        # Extract token
        token = auth_header.split(" ")[1] if " " in auth_header else auth_header
        
        # Xác minh token
        secret_key = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
        try:
            payload = jwt.decode(token, secret_key, algorithms=["HS256"])
            return jsonify({
                "success": True,
                "data": payload
            }), 200
        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "error": "Token đã hết hạn"
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                "success": False,
                "error": "Token không hợp lệ"
            }), 401
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
