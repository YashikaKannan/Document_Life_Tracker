from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from reminder import start_scheduler, check_and_send_reminders
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import date
import hashlib
import hmac
import os
import models
from database import SessionLocal, engine

# Create database tables
if os.getenv("ENV") != "production":
    models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Starts the reminder scheduler when the server starts (use startup event to avoid duplicates)
@app.on_event("startup")
def _start_scheduler_once():
    start_scheduler()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://document-life-tracker.vercel.app", "http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods
    allow_headers=["*"],  # allow all headers
)

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------- Pydantic Schemas ----------------------

# User Schemas
class UserBase(BaseModel):
    name: str
    mobile_number: str
    email: str
    password: str

class UserDisplay(BaseModel):
    user_id: int
    name: str
    mobile_number: str
    email: str

    class Config:
        from_attributes = True  # replaces orm_mode in Pydantic v2

# Document Schemas
class DocumentBase(BaseModel):
    user_id: int
    document_type: str
    expiry_date: date

class DocumentDisplay(BaseModel):
    doc_id: int
    user_id: int
    document_type: str
    expiry_date: date
    

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str


# ---------------------- Auth helpers ----------------------
_PASSWORD_SALT = os.getenv("PASSWORD_SALT", "static-dev-salt-change-me")

def _hash_password(plain: str) -> str:
    data = (plain + _PASSWORD_SALT).encode("utf-8")
    return hashlib.sha256(data).hexdigest()

def _verify_password(plain: str, stored_hash: str) -> bool:
    computed = _hash_password(plain)
    return hmac.compare_digest(computed, stored_hash)

@app.post("/login")
def login_user(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.name == login_data.username).first()

    if not user or not _verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"message": "Login successful", "user_id": user.user_id , "name": user.name}

# ---------------------- USERS CRUD ----------------------

@app.post("/users", response_model=UserDisplay)
def create_user(user: UserBase, db: Session = Depends(get_db)):
    # Check for duplicate email
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = models.User(
        name=user.name,
        mobile_number=user.mobile_number,
        email=user.email,
        password_hash=_hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# @app.get("/users/", response_model=List[UserDisplay])
# def get_users(db: Session = Depends(get_db)):
#     return db.query(models.User).all()

@app.get("/users/{user_id}", response_model=UserDisplay)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

class PasswordUpdate(BaseModel):
    password: str

@app.put("/users/{user_id}", response_model=UserDisplay)
def update_user(user_id: int, user: PasswordUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.password_hash = _hash_password(user.password)
    db.commit()
    db.refresh(db_user)
    return db_user

# @app.delete("/documents/{doc_id}")
# def delete_document(doc_id: int, db: Session = Depends(get_db)):
#     db_doc = db.query(models.Document).filter(models.Document.doc_id == doc_id).first()
#     if not db_doc:
#         raise HTTPException(status_code=404, detail="Document not found")

#     db.delete(db_doc)
#     db.commit()
#     return {"message": "Document deleted successfully", "doc_id": doc_id}


# ---------------------- DOCUMENTS CRUD ----------------------

@app.post("/documents", response_model=DocumentDisplay)
def create_document(document: DocumentBase, db: Session = Depends(get_db)):
    # Optional: check if user exists before adding document
    user_exists = db.query(models.User).filter(models.User.user_id == document.user_id).first()
    if not user_exists:
        raise HTTPException(status_code=400, detail="User does not exist")

    db_doc = models.Document(
        user_id=document.user_id,
        document_type=document.document_type,
        expiry_date=document.expiry_date
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

# @app.get("/documents/", response_model=List[DocumentDisplay])
# def get_documents(db: Session = Depends(get_db)):
#     return db.query(models.Document).all()

# Removed unused endpoint: get single document by id

# Removed unused endpoint: update document

@app.delete("/documents/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    db_doc = db.query(models.Document).filter(models.Document.doc_id == doc_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(db_doc)
    db.commit()
    return {"detail": "Document deleted successfully"}

@app.get("/documents/user/{user_id}", response_model=List[DocumentDisplay])
def get_documents_by_user(user_id: int, db: Session = Depends(get_db)):
    documents = db.query(models.Document).filter(models.Document.user_id == user_id).all()
    return documents

# Removed unused/broken endpoint: users/recent (no last_login column)

@app.get("/send-reminders-now")
def send_reminders_now():
    check_and_send_reminders()
    return {"message": "Manual reminders sent successfully"}