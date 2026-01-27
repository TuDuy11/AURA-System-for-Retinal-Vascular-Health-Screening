from dataclasses import dataclass


@dataclass
class Permission:
    permission_id: int
    permission_name: str
    description: str