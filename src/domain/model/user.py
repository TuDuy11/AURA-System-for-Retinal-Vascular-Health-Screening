from dataclasses import dataclass, field


@dataclass
class User:
    user_id: int
    email: str
    full_name: str
    is_active: bool
    _password_hash: str = field(repr=False)
    phone: str = None
    avatar_url: str = None

    




