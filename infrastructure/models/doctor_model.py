from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base

class DoctorModel(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True)
    license_no = Column(String(100), unique=True, nullable=True)
    specialization = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=True)

    user = relationship("UserModel")
    clinic = relationship("ClinicModel", back_populates="doctors")
    assignments = relationship("DoctorPatientAssignmentModel", back_populates="doctor")
