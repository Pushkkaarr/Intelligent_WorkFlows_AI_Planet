from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
from dotenv import load_dotenv

# Import routes
from app.routes import auth, documents, workflows, chat
from app.utils.database import init_db
from app.middleware.error_handler import ErrorHandlerMiddleware, LoggingMiddleware

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize app on startup"""
    logger.info("Starting application...")
    init_db()
    yield
    logger.info("Shutting down application...")


app = FastAPI(
    title="Intelligent Workflows API",
    description="No-Code/Low-Code workflow application",
    version="1.0.0",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(LoggingMiddleware)
app.add_middleware(ErrorHandlerMiddleware)

# Add CORS middleware
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
    "http://localhost",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(workflows.router)
app.include_router(chat.router)


@app.get("/", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Intelligent Workflows API",
        "version": "1.0.0"
    }


@app.get("/api/health", tags=["Health"])
async def api_health():
    """API health check"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("DEBUG", False)
    )
