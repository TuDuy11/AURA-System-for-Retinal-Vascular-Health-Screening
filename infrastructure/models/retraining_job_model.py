from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base


class RetrainingJobModel(Base):
    __tablename__ = "retraining_jobs"

    id = Column(Integer, primary_key=True)
    trigger_reason = Column(String(255), nullable=True)
    dataset_ref = Column(String(255), nullable=True)
    ip_address = Column(String(45), nullable=True)

    status_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    model_id = Column(Integer, ForeignKey("ai_models.id"), nullable=True)
    model = relationship("AIModelModel")


