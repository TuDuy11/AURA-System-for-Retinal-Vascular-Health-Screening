from sqlalchemy import Column, Integer, String, Numeric, Boolean

from infrastructure.databases.base import Base


class PlanModel(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    price = Column(Numeric(18, 2), nullable=False)
    currency = Column(String(10), nullable=False, default="VND")
    quota_images = Column(Integer, nullable=False, default=0)
    duration_days = Column(Integer, nullable=False, default=30)
    active = Column(Boolean, default=True)


