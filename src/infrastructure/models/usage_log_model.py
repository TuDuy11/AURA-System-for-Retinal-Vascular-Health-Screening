from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base


class UsageLogModel(Base):
    __tablename__ = "usage_logs"

    id = Column(Integer, primary_key=True)
    used_at = Column(DateTime, default=datetime.utcnow)
    usage_type = Column(String(50), nullable=False, default="analysis")  # analysis/export...

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=True)
    request_id = Column(Integer, ForeignKey("analysis_requests.id"), nullable=True)

    user = relationship("UserModel")
    subscription = relationship("SubscriptionModel", back_populates="usage_logs")
    request = relationship("AnalysisRequestModel")
