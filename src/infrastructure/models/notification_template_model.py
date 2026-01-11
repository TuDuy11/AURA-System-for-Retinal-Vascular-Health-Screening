from sqlalchemy import Column, Integer, String, Boolean

from infrastructure.databases.base import Base

class NotificationTemplateModel(Base):
    __tablename__ = "notification_templates"

    id = Column(Integer, primary_key=True)
    template_code = Column(String(100), unique=True, nullable=False)
    title_tpl = Column(String(255), nullable=False)
    body_tpl = Column(String(255), nullable=False)
    channel = Column(String(50), nullable=False)  # email/push/inapp
    active = Column(Boolean, default=True)
