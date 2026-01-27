from dataclasses import dataclass


@dataclass
class UserRole:
    user_role_id: int
    user_id: int
    role_id: int