from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from apscheduler.schedulers.background import BackgroundScheduler
from email.mime.text import MIMEText
from database import SessionLocal
from models import Document, User
from dotenv import load_dotenv
import smtplib
import os

# Load variables from .env file
load_dotenv()

SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

REMINDER_DAYS = 7

def send_email(to_email, subject, body):
    msg = MIMEText(body, "html")
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email

    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print("Email credentials not set; skipping email send")
        return

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, [to_email], msg.as_string())
    except Exception as exc:
        print(f"Failed to send email to {to_email}: {exc}")

def check_and_send_reminders():
    db: Session = SessionLocal()
    try:
        today = datetime.today().date()
        upcoming_date = today + timedelta(days=REMINDER_DAYS)

        expiring_docs = (
            db.query(Document, User)
            .join(User, Document.user_id == User.user_id)
            .filter(Document.expiry_date >= today)            # not already expired
            .filter(Document.expiry_date <= upcoming_date)    # within window
            .all()
        )

        for doc, user in expiring_docs:
            body = f"""
                <p>Hello {user.name},</p>
                <p>Your document <b>{doc.document_type}</b> will expire on <b>{doc.expiry_date}</b>.</p>
                <p>Please take necessary action before expiry.</p>
                <p>Regards,<br>Team - Document Life Tracker</p>
            """
            send_email(user.email, "Document Expiry Reminder", body)
    finally:
        db.close()

_SCHEDULER = None

def start_scheduler():
    global _SCHEDULER
    if _SCHEDULER and _SCHEDULER.running:
        return
    _SCHEDULER = BackgroundScheduler(timezone="Asia/Kolkata")
    # 09:00 IST daily
    _SCHEDULER.add_job(check_and_send_reminders, "cron", hour=19, minute=22, id="reminders", replace_existing=True)
    _SCHEDULER.start()
    print("📅 Reminder scheduler started (daily at 9:00 am IST)")