from abc import ABC, abstractmethod
from typing import Optional
from src.domain.model.user import User


class UserRepositoryInterface(ABC):
    """
    Interface định nghĩa các phương thức quản lý người dùng trong cơ sở dữ liệu.
    
    Đây là hợp đồng (contract) mà tất cả các lớp implement repository người dùng
    phải tuân theo. Được dùng để thao tác với dữ liệu User từ cơ sở dữ liệu.
    """

    @abstractmethod
    def find_by_email(self, email: str) -> Optional[User]:
        """
        Tìm kiếm người dùng theo địa chỉ email.
        
        Args:
            email: Địa chỉ email của người dùng cần tìm.
            
        Returns:
            Đối tượng User nếu tìm thấy, None nếu không tìm thấy.
        """
        pass

    @abstractmethod
    def find_by_id(self, user_id: int) -> Optional[User]:
        """
        Tìm kiếm người dùng theo ID.
        
        Args:
            user_id: ID duy nhất của người dùng.
            
        Returns:
            Đối tượng User nếu tìm thấy, None nếu không tìm thấy.
        """
        pass

    @abstractmethod
    def create_user(self, user: User) -> User:
        """
        Tạo và lưu người dùng mới vào cơ sở dữ liệu.
        
        Args:
            user: Đối tượng User chứa thông tin người dùng mới.
            
        Returns:
            Đối tượng User đã được lưu (có thể bao gồm ID được tạo tự động).
            
        Raises:
            ValueError: Nếu user không hợp lệ hoặc email đã tồn tại.
        """
        pass
    
    @abstractmethod
    def update_user(self, user: User) -> User:
        """
        Cập nhật thông tin người dùng hiện có.
        
        Args:
            user: Đối tượng User với dữ liệu đã cập nhật.
            
        Returns:
            Đối tượng User đã được cập nhật.
            
        Raises:
            ValueError: Nếu người dùng không tồn tại.
        """
        pass

    @abstractmethod
    def delete_user(self, user_id: int) -> bool:
        """
        Xóa người dùng khỏi cơ sở dữ liệu.
        
        Args:
            user_id: ID của người dùng cần xóa.
            
        Returns:
            True nếu xóa thành công, False nếu không tìm thấy.
        """
        pass

    







