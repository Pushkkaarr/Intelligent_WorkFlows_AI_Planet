from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.utils.database import get_db
from app.schemas_workflow import (
    WorkflowCreate,
    WorkflowUpdate,
    WorkflowResponse,
    WorkflowExecutionRequest,
    ChatMessageResponse
)
from app.services.workflow_service import WorkflowService, ChatService, DocumentService
from app.services.llm_service import llm_service, web_search_service
from app.utils.embeddings import embedding_service
from app.routes.auth import get_current_user

router = APIRouter(prefix="/api/workflows", tags=["Workflows"])


@router.post("/", response_model=WorkflowResponse, status_code=status.HTTP_201_CREATED)
async def create_workflow(
    workflow_data: WorkflowCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new workflow"""
    workflow = WorkflowService.create_workflow(db, current_user.id, workflow_data)
    return WorkflowResponse.from_orm(workflow)


@router.get("/", response_model=List[WorkflowResponse])
async def list_workflows(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all workflows for the user"""
    workflows = WorkflowService.list_workflows(db, current_user.id)
    return [WorkflowResponse.from_orm(w) for w in workflows]


@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(
    workflow_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific workflow"""
    workflow = WorkflowService.get_workflow(db, workflow_id, current_user.id)
    return WorkflowResponse.from_orm(workflow)


@router.put("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(
    workflow_id: str,
    workflow_data: WorkflowUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a workflow"""
    workflow = WorkflowService.update_workflow(db, workflow_id, current_user.id, workflow_data)
    return WorkflowResponse.from_orm(workflow)


@router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workflow(
    workflow_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a workflow"""
    WorkflowService.delete_workflow(db, workflow_id, current_user.id)
    return None


@router.post("/{workflow_id}/execute", response_model=ChatMessageResponse)
async def execute_workflow(
    workflow_id: str,
    request: WorkflowExecutionRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Execute workflow with query"""
    # Verify workflow exists and belongs to user
    workflow = WorkflowService.get_workflow(db, workflow_id, current_user.id)
    
    # Extract context from documents if specified
    context = ""
    if request.context_documents:
        for doc_id in request.context_documents:
            document = DocumentService.get_document(db, doc_id, current_user.id)
            if document.embedding_id:
                retrieved_docs = embedding_service.query_collection(
                    document.embedding_id,
                    request.query,
                    n_results=3
                )
                if retrieved_docs:
                    context += "\n".join(retrieved_docs) + "\n"
    
    # Check if web search should be enabled
    use_web_search = False
    if workflow.configuration and workflow.configuration.get("enable_web_search"):
        use_web_search = True
    
    # Generate response using LLM
    response_text = llm_service.generate_response(
        prompt=request.query,
        context=context if context else None,
        temperature=0.7
    )
    
    # If web search is enabled, enhance response
    if use_web_search:
        web_results = web_search_service.search(request.query, num_results=3)
        if web_results:
            web_context = "\n".join([f"- {r['title']}: {r['snippet']}" for r in web_results])
            enhanced_prompt = f"Based on these web search results:\n{web_context}\n\nProvide an updated response to: {request.query}"
            response_text = llm_service.generate_response(enhanced_prompt)
    
    # Store chat message
    message = ChatService.create_chat_message(
        db, workflow_id, current_user.id, request.query, response_text
    )
    
    return ChatMessageResponse.from_orm(message)


@router.get("/{workflow_id}/chat-history", response_model=List[ChatMessageResponse])
async def get_chat_history(
    workflow_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get chat history for a workflow"""
    # Verify workflow exists
    WorkflowService.get_workflow(db, workflow_id, current_user.id)
    
    messages = ChatService.get_chat_history(db, workflow_id, current_user.id)
    return [ChatMessageResponse.from_orm(msg) for msg in messages]
