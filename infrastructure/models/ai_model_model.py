from sqlalchemy import Column, Integer, String, Boolean

from infrastructure.databases.base import Base


class AIModelModel(Base):
    __tablename__ = "ai_models"

    id = Column(Integer, primary_key=True)
    version = Column(String(50), nullable=False)
    deployed = Column(Boolean, default=False)
    ip_address = Column(String(45), nullable=True)


