from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base

class ReportModel(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    report_type = Column(String(50), nullable=False)
    file_url = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    request_id = Column(Integer, ForeignKey("analysis_requests.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)

    request = relationship("AnalysisRequestModel")
    patient = relationship("PatientModel")

    items = relationship("ReportItemModel", back_populates="report")
