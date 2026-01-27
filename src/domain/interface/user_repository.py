from abc  import abstractmethod
from typing import Optional
from src.domain.model.user import User

class UserRepositoryInterface:
    @abstractmethod
    def find_by_email (self, email:str) -> Optional[User]: 
        pass

    @abstractmethod
    def find_by_id (self, user_id:int) -> Optional[User]: 
        pass

    @abstractmethod
    def create_user(self, user: User) -> User: # đăng ký user mới
        pass

    







