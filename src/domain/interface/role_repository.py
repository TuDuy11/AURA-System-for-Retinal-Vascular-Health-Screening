from abc  import abstractmethod
from typing import Optional
from src.domain.model.role import Role

class RoleRepositoryInterface:
    @abstractmethod
    def get_roles_by_user_id(self,user_id:int) -> Optional[list[Role]]:
        pass

    

