from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config
from infrastructure.databases.base import Base

DATABASE_URI = Config.DATABASE_URI

engine = create_engine(DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db_session():
    """
    Tạo 1 session mới mỗi lần gọi.
    Tránh dùng session global vì web chạy nhiều request song song sẽ dễ lỗi.
    """
    return SessionLocal()

def init_mssql(app=None):
    """
    Tạo bảng dựa trên Base.metadata.
    Chỉ tạo được bảng nếu các file model đã được import (ở __init__.py).
    """
    Base.metadata.create_all(bind=engine)
