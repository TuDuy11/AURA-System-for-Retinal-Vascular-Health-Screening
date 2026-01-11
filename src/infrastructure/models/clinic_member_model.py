from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base

class ClinicMemberModel(Base):
    __tablename__ = "clinic_members"

    id = Column(Integer, primary_key=True)
    member_role = Column(String(50), nullable=False)  # admin/staff/doctor...
    job_description = Column(String(255), nullable=True)
    joined_at = Column(DateTime, default=datetime.utcnow)

    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    clinic = relationship("ClinicModel", back_populates="members")
    user = relationship("UserModel")
