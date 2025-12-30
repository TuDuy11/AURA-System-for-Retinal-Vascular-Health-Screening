from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base


class MessageModel(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    message_type = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    attachment_url = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)

    conversation = relationship("ConversationModel", back_populates="messages")
    sender = relationship("UserModel")
