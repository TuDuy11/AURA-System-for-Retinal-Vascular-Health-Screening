from typing import Optional
from infrastructure.models.user_model import UserModel
from infrastructure.databases.mssql import SessionLocal
from uuid import uuid4
from datetime import datetime

class UserRepository:
    """Repository để quản lý User trong database"""
    
    def __init__(self, session=None):
        self.session = session or SessionLocal()
    
    def find_by_email(self, email: str) -> Optional[dict]:
        """Tìm user theo email"""
        user = self.session.query(UserModel).filter(UserModel.email == email).first()
        if user:
            return {
                "id": str(user.id),
                "email": user.email,
                "password_hash": user.password_hash,
                "full_name": user.full_name,
                "avatar_url": user.avatar_url,
                "is_active": user.is_active,
                "email_verified": user.email_verified,
                "email_verified_at": user.email_verified_at
            }
        return None
    
    def find_by_id(self, user_id: str) -> Optional[dict]:
        """Tìm user theo ID"""
        user = self.session.query(UserModel).filter(UserModel.id == user_id).first()
        if user:
            return {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "avatar_url": user.avatar_url,
                "is_active": user.is_active,
                "email_verified": user.email_verified,
                "email_verified_at": user.email_verified_at
            }
        return None
    
    def create(self, email: str, password_hash: str, full_name: str = None) -> dict:
        """Tạo user mới"""
        print(f"[SYSTEM LOG] Processing registration for email: {email}")
        user = UserModel(
        id=str(uuid4()),
        email=email,
        password_hash=password_hash,
        full_name=full_name,
        is_active=True,
        email_verified=False
    )
        self.session.add(user)
        self.session.commit()
        return {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "email_verified": False
        }
    
    def update_email_verified(self, user_id: str) -> bool:
        """Cập nhật trạng thái email verified"""
        user = self.session.query(UserModel).filter(UserModel.id == user_id).first()
        if user:
            user.email_verified = True
            user.email_verified_at = datetime.utcnow()
            self.session.commit()
            return True
        return False
