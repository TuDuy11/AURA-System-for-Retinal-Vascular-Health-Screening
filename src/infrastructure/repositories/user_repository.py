from typing import Optional
from infrastructure.models.user_model import UserModel
from infrastructure.databases.mssql import SessionLocal
from uuid import uuid4

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
                "is_active": user.is_active
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
                "is_active": user.is_active
            }
        return None
    
    def create(self, email: str, password_hash: str, full_name: str = None) -> dict:
        """Tạo user mới"""
        user = UserModel(
            id=uuid4(),
            email=email,
            password_hash=password_hash,
            full_name=full_name,
            is_active=True
        )
        self.session.add(user)
        self.session.commit()
        return {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name
        }
    
    def close(self):
        """Đóng session"""
        self.session.close()
