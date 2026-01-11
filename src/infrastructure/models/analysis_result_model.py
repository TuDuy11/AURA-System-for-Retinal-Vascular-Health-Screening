from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base

class AnalysisResultModel(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True)
    risk_level = Column(String(20), nullable=True)
    predicted_labels_json = Column(Text, nullable=True)

    generated_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="created")

    request_id = Column(Integer, ForeignKey("analysis_requests.id"), nullable=False)

    request = relationship("AnalysisRequestModel", back_populates="results")
    annotations = relationship("ImageAnnotationModel", back_populates="result")
