from domain.interface.user_repository import UserRepository
from domain.interface.role_repository import RoleRepository
from domain.model.user import User

# đây là class thông báo lỗi khi không tìm thấy user theo email 
class UserNotFound(Exception):
    def __init__(self, email: str, user_id:int):
        self.email = email # lưu email lỗi 
        self.user_id = user_id # lưu id lỗi
        super().__init__(f"User with email {email} not found") # tạo thông báo lỗi
        super().__init__(f"User with id {user_id} not found") 



# đây là class thông báo lỗi khi không tìm thấy role theo user id
class RoleNotAssigned(Exception):
    def __init__(self, user_id: int):
        self.user_id = user_id
        super().__init__(f"No roles assigned to user with id {user_id}")



class AuthService:
    # contructer 
    def __init__(self, user_repository: UserRepository, role_repository: RoleRepository):
        self.user_repository = user_repository
        self.role_repository = role_repository

    # tìm kiếm theo email
    def find_user_by_email(self, email: str):
        # không nhập email trả về lỗi 
        if not email:
            raise ValueError("Email cannot be empty")
        
        user = self.user_repository.find_by_email(email)
        # không tìm thấy user trả về lỗi
        if user is None:
            raise UserNotFound(email)
        return user
    
    # tìm kiếm theo id 
    def find_by_id(self,user_id:int):
        # không nhập id trả về lỗi
        if not user_id:
            raise ValueError("User ID cannot be empty")
        
        user = self.user_repository.find_by_id(user_id)
        if user is None:
            raise UserNotFound("",user_id)
        return user
    
    def get_roles_by_user_id(self,user_id:int):
        if not user_id:
            raise ValueError("User ID cannot be empty")
        roles = self.role_repository.get_roles_by_user_id(user_id)
        if roles is None or len(roles) == 0:
            raise RoleNotAssigned(user_id)
        return roles
    

    #def create_user(self, user: User):

        
        

        
