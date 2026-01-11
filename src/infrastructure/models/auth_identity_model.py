from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base

class AuthIdentityModel(Base):
    __tablename__ = "auth_identities"

    id = Column(Integer, primary_key=True)
    provider = Column(String(50), nullable=False)       # local/google/facebook...
    provider_user_id = Column(String(255), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="auth_identities")
