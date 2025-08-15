from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base  # Import Base from your database setup file

# Users table
class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    mobile_number = Column(String(15), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    # Relationship to documents
    documents = relationship(
        "Document",
        back_populates="user",
        cascade="all, delete-orphan"
    )


# Documents table
class Document(Base):
    __tablename__ = 'documents'

    doc_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    document_type = Column(String(100), nullable=False)
    expiry_date = Column(String(10), nullable=False)  # Keep as string if stored as text
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    # Relationship back to users
    user = relationship("User", back_populates="documents")
