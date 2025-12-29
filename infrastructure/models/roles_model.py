from sqlalchemy import Column, Integer, String, DateTime, Boolean  
from infrastructure.databases.base import Base

class Role_model(Base):
    __tablename__ = 'roles'

    Role_id = Column(Integer, primary_key=True)
    Role_name = Column(String(100), nullable=False, unique=True)
    Description = Column(String(255), nullable=True)


    