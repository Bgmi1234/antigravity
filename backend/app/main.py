from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import engine
from . import models
from .routers import employees, workflows, executions, tasks, youtube
from .services import ollama_service, anythingllm_service
import logging
from sqlalchemy import text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Verify Database Connection
try:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    
    # Render beautiful EMPLOD startup dashboard card
    print("\n" + "+" + "-" * 58 + "+")
    print("| * EMPLOD BACKEND IS RUNNING                                |")
    print("| * API URL: http://127.0.0.1:8000                          |")
    print("| * Environment configuration successfully loaded.           |")
    print("| * Database successfully connected & verified.              |")
    print("+" + "-" * 58 + "+\n")
    
except Exception as e:
    logger.critical(f"Database verification failed at startup: {e}")
    raise e

# Create tables
try:
    models.Base.metadata.create_all(bind=engine)
    logger.info("Table creation verified")
except Exception as e:
    logger.error(f"Table creation failed: {e}")

app = FastAPI(title="EMPLOD AI Employee Workflow API")

# Configure CORS
import os

frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
origins = [
    frontend_url,
    "http://localhost:3000",
    "http://127.0.0.1:3000", # Always allow IP for testing
]

# Allow any vercel preview URL (if necessary, though specific frontend_url is safer)
# origins.append(re.compile(r"https://.*\.vercel\.app"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check route
@app.get("/health")
def read_health():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {
            "status": "ok",
            "database": "connected"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "database": "disconnected",
                "error": str(e)
            }
        )

@app.get("/")
def read_root():
    return {"status": "ok", "message": "EMPLOD API is healthy"}

@app.get("/test-ollama")
def test_ollama():
    try:
        response = ollama_service.generate_response("Say hello")
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/test-anythingllm")
def test_anythingllm():
    try:
        response = anythingllm_service.ask_workspace("What is the password reset policy?")
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Include routers
app.include_router(youtube.router, prefix="/youtube", tags=["youtube"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(employees.router, prefix="/employees", tags=["employees"])
app.include_router(workflows.router, prefix="/steps", tags=["workflows"])
app.include_router(executions.router, tags=["executions"])
