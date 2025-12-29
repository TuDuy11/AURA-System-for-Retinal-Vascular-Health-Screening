from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base

class ImageAnnotationModel(Base):
    __tablename__ = "image_annotations"

    id = Column(Integer, primary_key=True)
    annotation_type = Column(String(50), nullable=False)
    annotation_url = Column(String(500), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    result_id = Column(Integer, ForeignKey("analysis_results.id"), nullable=False)

    result = relationship("AnalysisResultModel", back_populates="annotations")
