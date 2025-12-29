from sqlalchemy import Column, Integer, String, Date, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base

class PatientModel(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True)
    patient_code = Column(String(100), unique=True, nullable=True)

    dob = Column(Date, nullable=True)
    gender = Column(String(10), nullable=True)
    medical_profile_json = Column(Text, nullable=True)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)

    user = relationship("UserModel")
    doctor = relationship("DoctorModel")
    analysis_requests = relationship("AnalysisRequestModel", back_populates="patient")
