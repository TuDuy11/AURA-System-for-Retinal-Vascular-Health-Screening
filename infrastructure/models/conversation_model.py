from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base


class ConversationModel(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)

    doctor = relationship("DoctorModel")
    patient = relationship("PatientModel")
    messages = relationship("MessageModel", back_populates="conversation", cascade="all, delete-orphan")



