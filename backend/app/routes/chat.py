from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import os
import logging
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/chat", tags=["Chat"])
logger = logging.getLogger(__name__)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Models
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    workflowId: Optional[str] = None
    conversationHistory: Optional[List[Message]] = None

class ChatResponse(BaseModel):
    response: str
    status: str = "success"

# System prompt for the chat
SYSTEM_PROMPT = """You are a helpful AI assistant for the GenAI Stack platform. 
You help users understand and work with their workflow stacks, answer questions about components, 
and provide guidance on creating and executing workflows.

When formatting responses:
- Use **text** for bold emphasis
- Use -- for em dashes (—)
- Use numbered lists for step-by-step instructions (1. item, 2. item, etc.)
- Use bullet points for lists (• item)
- Keep responses clear and concise
- Provide practical examples when helpful

Be professional, helpful, and focused on workflow and AI topics."""

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the GenAI Stack Chat and get a response
    Uses Gemini 2.5 Flash Lite model
    """
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=500,
                detail="GEMINI_API_KEY not configured"
            )

        if not request.message.strip():
            raise HTTPException(
                status_code=400,
                detail="Message cannot be empty"
            )

        # Build conversation history for context
        messages = []
        
        # Add system prompt as first message
        messages.append({
            "role": "user",
            "parts": [SYSTEM_PROMPT]
        })
        messages.append({
            "role": "model",
            "parts": ["I understand. I'm here to help with GenAI Stack workflows and related questions."]
        })

        # Add conversation history if provided
        if request.conversationHistory:
            for msg in request.conversationHistory:
                messages.append({
                    "role": "user" if msg.role == "user" else "model",
                    "parts": [msg.content]
                })

        # Add current message
        messages.append({
            "role": "user",
            "parts": [request.message]
        })

        # Initialize Gemini model
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash-lite",
            system_instruction=SYSTEM_PROMPT
        )

        # Create chat session
        chat_session = model.start_chat(history=messages[2:])  # Skip system messages

        # Send message and get response
        response = chat_session.send_message(request.message)
        
        # Extract and format response text
        response_text = response.text if hasattr(response, 'text') else str(response)

        logger.info(f"Chat response generated for workflow {request.workflowId}")

        return ChatResponse(
            response=response_text,
            status="success"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat request: {str(e)}"
        )

@router.get("/health")
async def chat_health():
    """Health check for chat service"""
    return {
        "status": "healthy",
        "service": "Chat Service",
        "gemini_configured": bool(GEMINI_API_KEY)
    }
