"""
Simple test for validators module
Run: python test_validators.py
"""

import sys
from api.validators import (
    validate_email,
    validate_password,
    validate_login_request
)

def test_validators():
    print("=" * 60)
    print("TESTING VALIDATORS")
    print("=" * 60)
    
    # Test email validation
    print("\n1. Email Validation:")
    print("-" * 40)
    
    test_emails = [
        ("user@example.com", True),
        ("invalid.email", False),
        ("test@domain.co.uk", True),
        ("", False),
        ("test@domain", False),
    ]
    
    for email, should_pass in test_emails:
        is_valid, error = validate_email(email)
        status = "✓ PASS" if is_valid == should_pass else "✗ FAIL"
        print(f"{status}: '{email}' -> Valid={is_valid}")
        if error and not is_valid:
            print(f"       Error: {error}")
    
    # Test password validation
    print("\n2. Password Validation:")
    print("-" * 40)
    
    test_passwords = [
        ("ValidPass123", True),
        ("password", False),  # No uppercase or digit
        ("PASSWORD123", False),  # No lowercase
        ("ValidPass", False),  # No digit
        ("Valid1", False),  # Too short (< 8)
        ("ValidPassword123", True),
        ("VeryLongPasswordWithNumbers123AndUppercaseAndLowercase", True),
    ]
    
    for password, should_pass in test_passwords:
        is_valid, error = validate_password(password)
        status = "✓ PASS" if is_valid == should_pass else "✗ FAIL"
        print(f"{status}: '{password}' -> Valid={is_valid}")
        if error and not is_valid:
            print(f"       Error: {error}")
    
    # Test login request
    print("\n3. Login Request Validation:")
    print("-" * 40)
    
    test_requests = [
        ({"email": "user@example.com", "password": "password123"}, True),
        ({"email": "invalid", "password": "password123"}, False),
        ({"email": "user@example.com"}, False),  # Missing password
        ({}, False),  # Empty request
    ]
    
    for request_data, should_pass in test_requests:
        is_valid, error = validate_login_request(request_data)
        status = "✓ PASS" if is_valid == should_pass else "✗ FAIL"
        print(f"{status}: {request_data}")
        if error and not is_valid:
            print(f"       Error: {error}")
    
    print("\n" + "=" * 60)
    print("TESTS COMPLETED")
    print("=" * 60)

if __name__ == "__main__":
    test_validators()
