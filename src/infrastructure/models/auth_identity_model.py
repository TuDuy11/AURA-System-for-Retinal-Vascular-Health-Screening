import uuid
from sqlalchemy import UUID, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base

class AuthIdentityModel(Base):
    __tablename__ = "auth_identities"

    id = id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider = Column(String(50), nullable=False)       # local/google/facebook...
    provider_user_id = Column(String(255), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="auth_identities")
