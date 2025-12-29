from sqlalchemy import Column, Integer, String, DateTime, Boolean  
from infrastructure.databases.base import Base

class User_model(Base):
    __tablename__ = 'users'

    User_id = Column(Integer, primary_key=True)
    Full_name = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    email= Column(String(255), nullable=False, unique=True)
    Phone = Column(String(100), nullable=True)
    Avatar_url = Column(String(255), nullable=True)

