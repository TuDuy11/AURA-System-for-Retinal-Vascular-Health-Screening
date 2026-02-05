from domain.interface.user_repository import UserRepositoryInterface
from domain.interface.role_repository import RoleRepositoryInterface
from domain.model.user import User
import bcrypt

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
    def __init__(self, user_repository: UserRepositoryInterface, role_repository: RoleRepositoryInterface):
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

    def create_user(self, user:User):
        print(f"[AUTH SERVICE] Đang xử lý logic đăng ký cho email: {user.email}")
        if not user.email:
            raise ValueError("Email cannot be empty")
        if not user.password:
            raise ValueError("Password cannot be empty")
        
        existing_user = self.user_repository.find_by_email(user.email)
        if existing_user is not None:
            raise ValueError(f"User with email {user.email} already exists")
        
        return self.user_repository.create(user)
    
    def password_hash(self,password:str):
        print("[SECURITY] Đang thực hiện băm (hashing) mật khẩu mới...")
        # Tạo một salt ngẫu nhiên
        salt = bcrypt.gensalt()
        # Băm mật khẩu với salt
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')
    
    def verify_password(self,plain_password:str,hashed_password:str):
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    




        
        

        
