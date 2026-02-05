"""
Input validators for API endpoints
"""
import re
from typing import Tuple, Optional

def validate_email(email: str) -> Tuple[bool, Optional[str]]:
    """
    Validate email format
    
    Args:
        email: Email string to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not email or not isinstance(email, str):
        return False, "Email là bắt buộc"
    
    email = email.strip()
    # Simple email regex pattern
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not re.match(pattern, email):
        return False, "Email không hợp lệ"
    
    if len(email) > 255:
        return False, "Email quá dài (tối đa 255 ký tự)"
    
    return True, None


def validate_password(password: str) -> Tuple[bool, Optional[str]]:
    """
    Validate password strength
    
    Args:
        password: Password string to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not password or not isinstance(password, str):
        return False, "Mật khẩu là bắt buộc"
    
    if len(password) < 8:
        return False, "Mật khẩu phải có ít nhất 8 ký tự"
    
    if len(password) > 128:
        return False, "Mật khẩu quá dài (tối đa 128 ký tự)"
    
    # Check for at least one uppercase letter
    if not re.search(r'[A-Z]', password):
        return False, "Mật khẩu phải chứa ít nhất một chữ hoa"
    
    # Check for at least one lowercase letter
    if not re.search(r'[a-z]', password):
        return False, "Mật khẩu phải chứa ít nhất một chữ thường"
    
    # Check for at least one digit
    if not re.search(r'\d', password):
        return False, "Mật khẩu phải chứa ít nhất một chữ số"
    
    return True, None


def validate_full_name(full_name: str) -> Tuple[bool, Optional[str]]:
    """
    Validate full name
    
    Args:
        full_name: Full name string to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not full_name or not isinstance(full_name, str):
        return False, "Họ tên là bắt buộc"
    
    full_name = full_name.strip()
    
    if len(full_name) < 2:
        return False, "Họ tên phải có ít nhất 2 ký tự"
    
    if len(full_name) > 255:
        return False, "Họ tên quá dài (tối đa 255 ký tự)"
    
    return True, None


def validate_login_request(data: dict) -> Tuple[bool, Optional[str]]:
    """
    Validate login request body
    
    Args:
        data: Request body dictionary
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not data or not isinstance(data, dict):
        return False, "Request body không hợp lệ"
    
    email = data.get("email", "").strip() if data.get("email") else ""
    password = data.get("password", "")
    
    if not email:
        return False, "Email là bắt buộc"
    
    if not password:
        return False, "Mật khẩu là bắt buộc"
    
    is_valid, error = validate_email(email)
    if not is_valid:
        return False, error
    
    return True, None


def validate_register_request(data: dict) -> Tuple[bool, Optional[str]]:
    """
    Validate register request body
    
    Args:
        data: Request body dictionary
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not data or not isinstance(data, dict):
        return False, "Request body không hợp lệ"
    
    email = data.get("email", "").strip() if data.get("email") else ""
    password = data.get("password", "")
    full_name = data.get("fullName", "").strip() if data.get("fullName") else ""
    
    if not email:
        return False, "Email là bắt buộc"
    
    if not password:
        return False, "Mật khẩu là bắt buộc"
    
    is_valid, error = validate_email(email)
    if not is_valid:
        return False, error
    
    is_valid, error = validate_password(password)
    if not is_valid:
        return False, error
    
    if full_name:
        is_valid, error = validate_full_name(full_name)
        if not is_valid:
            return False, error
    
    return True, None
