from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from infrastructure.databases.base import Base

class ReportItemModel(Base):
    __tablename__ = "report_items"

    id = Column(Integer, primary_key=True)
    item_type = Column(String(50), nullable=False)
    item_value = Column(String(255), nullable=True)

    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)

    report = relationship("ReportModel", back_populates="items")
