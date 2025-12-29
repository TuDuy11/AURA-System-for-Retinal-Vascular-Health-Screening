from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime

from infrastructure.databases.base import Base

class AIThresholdProfileModel(Base):
    __tablename__ = "ai_threshold_profiles"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    thresholds_json = Column(Text, nullable=False)   # store json as text for SQLite
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


