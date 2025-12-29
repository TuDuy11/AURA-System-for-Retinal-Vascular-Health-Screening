from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base

class RetinalImageModel(Base):
    __tablename__ = "retinal_images"

    id = Column(Integer, primary_key=True)
    image_type = Column(String(20), nullable=False)   # FUNDUS/OCT
    storage_url = Column(String(500), nullable=False)
    checksum = Column(String(255), nullable=True)

    uploaded_at = Column(DateTime, default=datetime.utcnow)
    checked_at = Column(DateTime, nullable=True)

    metadata_json = Column(Text, nullable=True)

    request_id = Column(Integer, ForeignKey("analysis_requests.id"), nullable=True)

    request = relationship("AnalysisRequestModel", back_populates="images")
