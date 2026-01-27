from dataclasses import dataclass
from datetime import datetime


@dataclass
class AuthIdentity:
    identity_id: int
    user_id: int
    provider: str
    provider_user_id: str
    created_at: datetime