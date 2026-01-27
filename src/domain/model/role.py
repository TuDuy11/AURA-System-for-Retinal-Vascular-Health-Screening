from dataclasses import dataclass
from datetime import datetime


@dataclass
class Role:
    role_id: int
    role_name: str
    description: str
    created_at: datetime
    updated_at: datetime