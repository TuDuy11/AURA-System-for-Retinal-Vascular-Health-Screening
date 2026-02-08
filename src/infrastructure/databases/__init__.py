"""
Database initialization module
Note: Model imports are intentionally avoided here to prevent circular imports.
Models should be imported directly from infrastructure.models when needed.
"""

from infrastructure.databases.mssql import init_mssql

__all__ = ['init_mssql']

# Models should be imported explicitly where needed:
# from infrastructure.models.user_model import UserModel
# from infrastructure.models.email_verification_token_model import EmailVerificationTokenModel
# etc.
