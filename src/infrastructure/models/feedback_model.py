from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base


class FeedbackModel(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True)
    feedback_type = Column(String(50), nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    request_id = Column(Integer, ForeignKey("analysis_requests.id"), nullable=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)

    request = relationship("AnalysisRequestModel")
    doctor = relationship("DoctorModel")
