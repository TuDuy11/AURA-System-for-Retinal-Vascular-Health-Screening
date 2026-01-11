from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from infrastructure.databases.base import Base

class DoctorPatientAssignmentModel(Base):
    __tablename__ = "doctor_patient_assignments"

    id = Column(Integer, primary_key=True)
    ip_address = Column(String(45), nullable=True)

    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)

    doctor = relationship("DoctorModel", back_populates="assignments")
    patient = relationship("PatientModel")
