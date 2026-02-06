"""
EmailVerificationToken Repository
Handles database operations for email verification tokens
"""

import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from infrastructure.models.email_verification_token_model import EmailVerificationTokenModel
import secrets


class EmailVerificationTokenRepository:
    """Repository for email verification tokens"""
    
    def __init__(self, session: Session):
        self.session = session
    
    def create_token(self, user_id: str, expires_in_hours: int = 24) -> str:
        """
        Create a new email verification token
        
        Args:
            user_id: User ID
            expires_in_hours: Token expiration time in hours (default 24)
            
        Returns:
            str: Generated token
        """
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=expires_in_hours)
        
        verification_token = EmailVerificationTokenModel(
            id=str(uuid.uuid4()),
            user_id=user_id,
            token=token,
            expires_at=expires_at
        )
        
        self.session.add(verification_token)
        self.session.commit()
        
        return token
    
    def verify_token(self, token: str) -> bool:
        """
        Verify and mark token as used
        
        Args:
            token: Token to verify
            
        Returns:
            bool: True if token is valid and marked as used
        """
        verification_token = self.session.query(EmailVerificationTokenModel).filter_by(token=token).first()
        
        if not verification_token:
            return False
        
        if not verification_token.is_valid():
            return False
        
        # Mark as used
        verification_token.is_used = True
        verification_token.used_at = datetime.utcnow()
        self.session.commit()
        
        return True
    
    def get_token_by_token(self, token: str) -> EmailVerificationTokenModel:
        """
        Get token record by token value
        
        Args:
            token: Token value
            
        Returns:
            EmailVerificationTokenModel or None
        """
        return self.session.query(EmailVerificationTokenModel).filter_by(token=token).first()
    
    def get_token_by_user_id(self, user_id: str) -> EmailVerificationTokenModel:
        """
        Get the most recent valid token for a user
        
        Args:
            user_id: User ID
            
        Returns:
            EmailVerificationTokenModel or None
        """
        return self.session.query(EmailVerificationTokenModel).filter_by(
            user_id=user_id,
            is_used=False
        ).order_by(EmailVerificationTokenModel.created_at.desc()).first()
    
    def invalidate_user_tokens(self, user_id: str):
        """
        Invalidate all unused tokens for a user
        
        Args:
            user_id: User ID
        """
        self.session.query(EmailVerificationTokenModel).filter_by(
            user_id=user_id,
            is_used=False
        ).update({"is_used": True, "used_at": datetime.utcnow()})
        self.session.commit()
    
    def cleanup_expired_tokens(self):
        """
        Clean up expired tokens from database
        """
        self.session.query(EmailVerificationTokenModel).filter(
            EmailVerificationTokenModel.expires_at < datetime.utcnow()
        ).delete()
        self.session.commit()
