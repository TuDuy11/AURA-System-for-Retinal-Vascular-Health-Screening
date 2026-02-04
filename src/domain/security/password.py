import bcrypt
from typing import Optional

# Hằng số cấu hình
DEFAULT_HASH_ROUNDS = 12  # Số vòng hash - càng cao càng bảo mật nhưng chậm hơn
ENCODING = 'utf-8'  # Mã hóa ký tự


def hash_password(password: str) -> str:
    """
    Mã hóa mật khẩu bằng bcrypt với salt ngẫu nhiên.
    
    Args:
        password: Mật khẩu dạng text cần được mã hóa.
        
    Returns:
        Mật khẩu đã được mã hóa dưới dạng chuỗi UTF-8.
        
    Raises:
        ValueError: Nếu mật khẩu trống rỗng.
        TypeError: Nếu mật khẩu không phải là chuỗi.
    """
    # Kiểm tra kiểu dữ liệu
    if not isinstance(password, str):
        raise TypeError("Mật khẩu phải là chuỗi ký tự")
    
    # Kiểm tra mật khẩu không trống
    if not password or not password.strip():
        raise ValueError("Mật khẩu không được để trống")
    
    # Tạo salt ngẫu nhiên với số vòng mã hóa
    salt = bcrypt.gensalt(rounds=DEFAULT_HASH_ROUNDS)
    # Mã hóa mật khẩu bằng bcrypt
    hashed_password = bcrypt.hashpw(password.encode(ENCODING), salt)
    
    return hashed_password.decode(ENCODING)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Xác minh mật khẩu bằng cách so sánh với mật khẩu đã được mã hóa.
    
    Args:
        plain_password: Mật khẩu dạng text cần xác minh.
        hashed_password: Mật khẩu đã mã hóa để so sánh.
        
    Returns:
        True nếu mật khẩu khớp, False nếu không khớp.
        
    Raises:
        TypeError: Nếu input không phải là chuỗi.
        ValueError: Nếu input trống.
    """
    # Kiểm tra kiểu dữ liệu của cả hai tham số
    if not isinstance(plain_password, str) or not isinstance(hashed_password, str):
        raise TypeError("Cả hai mật khẩu phải là chuỗi ký tự")
    
    # Kiểm tra không có mật khẩu trống
    if not plain_password or not hashed_password:
        raise ValueError("Mật khẩu không được để trống")
    
    # So sánh mật khẩu bằng bcrypt
    return bcrypt.checkpw(
        plain_password.encode(ENCODING),
        hashed_password.encode(ENCODING)
    )


def is_password_strong(password: str, min_length: int = 8) -> bool:
    """
    Kiểm tra mật khẩu có đủ mạnh theo tiêu chuẩn bảo mật.
    
    Args:
        password: Mật khẩu cần kiểm tra.
        min_length: Độ dài tối thiểu của mật khẩu (mặc định: 8 ký tự).
        
    Returns:
        True nếu mật khẩu đủ mạnh, False nếu không.
    """
    # Kiểm tra input hợp lệ
    if not isinstance(password, str) or not password:
        return False
    
    # Kiểm tra mật khẩu có chứa ký tự in hoa
    has_upper = any(char.isupper() for char in password)
    # Kiểm tra mật khẩu có chứa ký tự in thường
    has_lower = any(char.islower() for char in password)
    # Kiểm tra mật khẩu có chứa chữ số
    has_digit = any(char.isdigit() for char in password)
    
    # Trả về kết quả: phải có đủ độ dài, chữ in hoa, in thường và chữ số
    return len(password) >= min_length and has_upper and has_lower and has_digit
    
