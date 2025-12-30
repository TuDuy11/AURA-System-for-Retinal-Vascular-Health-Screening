from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base


class SubscriptionModel(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True)
    owner_type = Column(String(50), nullable=False)  # user/clinic
    status = Column(String(50), nullable=False, default="active")

    start_at = Column(DateTime, default=datetime.utcnow)
    end_at = Column(DateTime, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=True)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False)

    user = relationship("UserModel")
    clinic = relationship("ClinicModel")
    plan = relationship("PlanModel")
    usage_logs = relationship("UsageLogModel", back_populates="subscription", cascade="all, delete-orphan")
