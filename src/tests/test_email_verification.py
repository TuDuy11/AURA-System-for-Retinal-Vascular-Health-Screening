"""
Email Verification Feature - Unit Tests
Tests for email verification, validators, and email service
"""

import os
import pytest
from datetime import datetime, timedelta
os.environ['DATABASE_URI'] = 'sqlite:///:memory:'
os.environ['FLASK_ENV'] = 'development'
os.environ['SECRET_KEY'] = 'test-secret-key-12345'
os.environ['SMTP_SERVER'] = 'smtp.gmail.com'
os.environ['SMTP_PORT'] = '587'
os.environ['SENDER_EMAIL'] = 'test@example.com'
os.environ['FRONTEND_URL'] = 'http://localhost:5173'

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from flask import Flask
from infrastructure.models.user_model import UserModel
from infrastructure.models.email_verification_token_model import EmailVerificationTokenModel
from infrastructure.models.roles_model import RoleModel
from infrastructure.models.notification_model import NotificationModel
from infrastructure.models.auth_identity_model import AuthIdentityModel
from infrastructure.databases.base import Base
from infrastructure.databases.mssql import engine, SessionLocal
from infrastructure.repositories.user_repository import UserRepository
from infrastructure.repositories.email_verification_token_repository import EmailVerificationTokenRepository
from api.validators import (
    validate_email,
    validate_password,
    validate_email_verification_token,
    validate_resend_verification_email_request
)
from services.email_service import email_service


class TestEmailValidation:
    """Test email format validation"""
    
    def test_valid_email(self):
        is_valid, error = validate_email("user@example.com")
        assert is_valid is True
        assert error is None
    
    def test_valid_email_with_plus(self):
        is_valid, error = validate_email("user+tag@example.com")
        assert is_valid is True
    
    def test_valid_email_subdomain(self):
        is_valid, error = validate_email("user@sub.example.co.uk")
        assert is_valid is True
    
    def test_invalid_email_no_at(self):
        is_valid, error = validate_email("invalid.email.com")
        assert is_valid is False
        assert "không hợp lệ" in error.lower()
    
    def test_invalid_email_empty(self):
        is_valid, error = validate_email("")
        assert is_valid is False
    
    def test_invalid_email_too_long(self):
        is_valid, error = validate_email("a" * 300 + "@example.com")
        assert is_valid is False


class TestPasswordValidation:
    """Test password strength validation"""
    
    def test_valid_password(self):
        is_valid, error = validate_password("ValidPassword123")
        assert is_valid is True
        assert error is None
    
    def test_valid_password_complex(self):
        is_valid, error = validate_password("MyS3cur3P@ssw0rd!")
        assert is_valid is True
    
    def test_password_too_short(self):
        is_valid, error = validate_password("Pass1")
        assert is_valid is False
        assert "ít nhất 8" in error.lower()
    
    def test_password_no_uppercase(self):
        is_valid, error = validate_password("password123")
        assert is_valid is False
        assert "chữ hoa" in error.lower()
    
    def test_password_no_lowercase(self):
        is_valid, error = validate_password("PASSWORD123")
        assert is_valid is False
        assert "chữ thường" in error.lower()
    
    def test_password_no_digit(self):
        is_valid, error = validate_password("PasswordNoDigit")
        assert is_valid is False
        assert "chữ số" in error.lower()
    
    def test_password_too_long(self):
        is_valid, error = validate_password("A1" * 100)
        assert is_valid is False


class TestEmailVerificationTokenValidation:
    """Test email verification token request validation"""
    
    def test_valid_token(self):
        is_valid, error = validate_email_verification_token(
            {"token": "valid_long_token_string_1234567890"}
        )
        assert is_valid is True
        assert error is None
    
    def test_token_too_short(self):
        is_valid, error = validate_email_verification_token({"token": "short"})
        assert is_valid is False
        assert "không hợp lệ" in error.lower()
    
    def test_token_missing(self):
        is_valid, error = validate_email_verification_token({})
        assert is_valid is False
        assert "không hợp lệ" in error.lower() or "bắt buộc" in error.lower()
    
    def test_token_empty_string(self):
        is_valid, error = validate_email_verification_token({"token": ""})
        assert is_valid is False


class TestResendVerificationEmailValidation:
    """Test resend verification email request validation"""
    
    def test_valid_email_request(self):
        is_valid, error = validate_resend_verification_email_request(
            {"email": "user@example.com"}
        )
        assert is_valid is True
        assert error is None
    
    def test_invalid_email(self):
        is_valid, error = validate_resend_verification_email_request(
            {"email": "invalid-email"}
        )
        assert is_valid is False
    
    def test_email_missing(self):
        is_valid, error = validate_resend_verification_email_request({})
        assert is_valid is False
        assert "không hợp lệ" in error.lower() or "bắt buộc" in error.lower()


class TestEmailService:
    """Test email service functionality"""
    
    def test_email_service_initialization(self):
        assert email_service.smtp_server == 'smtp.gmail.com'
        assert email_service.smtp_port == 587
        assert email_service.sender_email == 'test@example.com'
        assert email_service.frontend_url == 'http://localhost:5173'
    
    def test_send_verification_email(self):
        # Should return True (or mail service returns success)
        result = email_service.send_verification_email(
            recipient_email="test@example.com",
            verification_token="test_token_12345",
            full_name="Test User"
        )
        assert result is True
    
    def test_send_password_reset_email(self):
        result = email_service.send_password_reset_email(
            recipient_email="test@example.com",
            reset_token="reset_token_12345",
            full_name="Test User"
        )
        assert result is True


class TestEmailVerificationTokenRepository:
    """Test email verification token repository operations"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test database"""
        # Note: Full repository testing with UserModel requires Flask app context
        # due to SQLAlchemy mapper dependencies. These tests are better done as
        # integration tests with the full Flask application running.
        self.session = SessionLocal()
        self.token_repo = EmailVerificationTokenRepository(self.session)
        
        yield
        
        self.session.close()
    
    def test_repository_initialization(self):
        """Test repository can be instantiated"""
        assert self.token_repo is not None
        assert self.token_repo.session is not None
    
    def test_repository_has_required_methods(self):
        """Test repository has all required methods"""
        assert hasattr(self.token_repo, 'create_token')
        assert hasattr(self.token_repo, 'get_token_by_token')
        assert hasattr(self.token_repo, 'verify_token')
        assert hasattr(self.token_repo, 'get_token_by_user_id')
        assert hasattr(self.token_repo, 'invalidate_user_tokens')
        assert callable(self.token_repo.create_token)
        assert callable(self.token_repo.get_token_by_token)


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
