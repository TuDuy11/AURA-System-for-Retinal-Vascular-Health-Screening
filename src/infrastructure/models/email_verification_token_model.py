import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta

from infrastructure.databases.base import Base


class EmailVerificationTokenModel(Base):
    __tablename__ = "email_verification_tokens"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    
    # Token expiration (default 24 hours)
    expires_at = Column(DateTime, nullable=False, default=lambda: datetime.utcnow() + timedelta(hours=24))
    is_used = Column(Boolean, default=False)
    used_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("UserModel", foreign_keys=[user_id])
    
    def is_expired(self) -> bool:
        """Check if token has expired"""
        return datetime.utcnow() > self.expires_at
    
    def is_valid(self) -> bool:
        """Check if token is valid (not used and not expired)"""
        return not self.is_used and not self.is_expired()
