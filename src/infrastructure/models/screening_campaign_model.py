from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship

from infrastructure.databases.base import Base


class ScreeningCampaignModel(Base):
    __tablename__ = "screening_campaigns"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    description = Column(Text, nullable=True)

    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=True)
    clinic = relationship("ClinicModel")
