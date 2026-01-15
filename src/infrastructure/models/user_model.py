import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID

from infrastructure.databases.base import Base
from infrastructure.models.associations import user_roles

class UserModel(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    full_name = Column(String(255), nullable=True)
    phone = Column(String(100), nullable=True)
    avatar_url = Column(String(255), nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    roles = relationship("RoleModel", secondary=user_roles, back_populates="users")

    # 1-n
    notifications = relationship("NotificationModel", back_populates="user")
    auth_identities = relationship("AuthIdentityModel", back_populates="user")
