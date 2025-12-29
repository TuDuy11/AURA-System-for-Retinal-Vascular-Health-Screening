from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base

class AnalysisRequestModel(Base):
    __tablename__ = "analysis_requests"

    id = Column(Integer, primary_key=True)
    queue_id = Column(String(64), nullable=True)
    status = Column(String(50), default="queued")  # queued/processing/done/failed
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    model_version = Column(String(50), nullable=True)

    profile_id = Column(Integer, ForeignKey("ai_threshold_profiles.id"), nullable=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=True)

    patient = relationship("PatientModel", back_populates="analysis_requests")
    clinic = relationship("ClinicModel", back_populates="analysis_requests")
    profile = relationship("AIThresholdProfileModel")

    images = relationship("RetinalImageModel", back_populates="request")
    results = relationship("AnalysisResultModel", back_populates="request")
