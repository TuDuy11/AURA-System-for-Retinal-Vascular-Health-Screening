from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base

class ClinicModel(Base):
    __tablename__ = "clinics"

    id = Column(Integer, primary_key=True)
    clinic_name = Column(String(255), nullable=False)
    address = Column(String(255), nullable=True)

    verification_status = Column(String(50), nullable=True)  # pending/verified/rejected
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("ClinicMemberModel", back_populates="clinic")
    doctors = relationship("DoctorModel", back_populates="clinic")
    analysis_requests = relationship("AnalysisRequestModel", back_populates="clinic")
