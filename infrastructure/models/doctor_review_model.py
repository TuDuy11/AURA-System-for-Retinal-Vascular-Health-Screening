from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base


class DoctorReviewModel(Base):
    __tablename__ = "doctor_reviews"

    id = Column(Integer, primary_key=True)
    review_type = Column(String(50), nullable=True)
    doctor_notes = Column(Text, nullable=True)
    review_at = Column(DateTime, default=datetime.utcnow)

    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    result_id = Column(Integer, ForeignKey("analysis_results.id"), nullable=False)

    doctor = relationship("DoctorModel")
    result = relationship("AnalysisResultModel")


