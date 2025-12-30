from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base


class PaymentModel(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    owner_type = Column(String(50), nullable=False)  # user/clinic
    amount = Column(Numeric(18, 2), nullable=False)
    currency = Column(String(10), nullable=False, default="VND")

    method = Column(String(50), nullable=True)  # momo/vnpay/cash
    provider = Column(String(50), nullable=True)
    transaction_code = Column(String(100), nullable=True)

    status = Column(String(50), nullable=False, default="pending")
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=True)

    user = relationship("UserModel")
    subscription = relationship("SubscriptionModel")

    
