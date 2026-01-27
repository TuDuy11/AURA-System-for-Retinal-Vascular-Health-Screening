from dataclasses import dataclass


@dataclass
class RolePermission:
    role_permission_id: int
    role_id: int
    permission_id: int