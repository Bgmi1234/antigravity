import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Force override of existing environment variables so cached local DB URLs are replaced
load_dotenv(override=True)

# Load DATABASE_URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("\n" + "=" * 80)
    print("[!] CRITICAL CONFIGURATION ERROR: DATABASE_URL IS MISSING!")
    print("Please configure DATABASE_URL in your backend/.env file.")
    print("=" * 80 + "\n")
    raise RuntimeError("DATABASE_URL environment variable is missing.")

engine = None
SessionLocal = None

def init_engine(url):
    global engine, SessionLocal
    engine = create_engine(url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Try connecting to DATABASE_URL
if DATABASE_URL:
    try:
        # Hide password in logs
        safe_url = DATABASE_URL
        if "@" in DATABASE_URL:
            parts = DATABASE_URL.split("@")
            user_part = parts[0].split(":")
            if len(user_part) > 2:
                safe_url = f"{user_part[0]}:{user_part[1]}:******@{parts[1]}"
        logger.info(f"Attempting to connect to primary database at: {safe_url.split('@')[-1] if '@' in safe_url else 'Unknown'}")
        
        # Test connection
        temp_engine = create_engine(DATABASE_URL)
        with temp_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Successfully connected to the primary database.")
        init_engine(DATABASE_URL)
    except Exception as e:
        logger.critical(f"Primary database connection failed: {e}")
        raise e
else:
    raise ValueError("DATABASE_URL environment variable is not set! Supabase PostgreSQL connection is required.")

# Base class for declarative SQLAlchemy models.
Base = declarative_base()

# Dependency function to provide a database session to FastAPI routes.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

