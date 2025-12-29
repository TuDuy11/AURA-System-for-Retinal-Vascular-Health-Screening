from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

from infrastructure.databases.base import Base
from infrastructure.models.associations import role_permissions

class PermissionModel(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True)
    permission_code = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)

    roles = relationship("RoleModel", secondary=role_permissions, back_populates="permissions")
