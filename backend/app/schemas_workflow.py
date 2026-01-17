from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class WorkflowNodeCreate(BaseModel):
    node_type: str = Field(..., description="Type: user_query, knowledge_base, llm_engine, output")
    node_id: str
    configuration: Optional[Dict[str, Any]] = None
    position: Optional[Dict[str, float]] = None


class WorkflowNodeResponse(WorkflowNodeCreate):
    id: str
    workflow_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WorkflowCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    configuration: Optional[Dict[str, Any]] = None


class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    configuration: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class WorkflowResponse(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    configuration: Optional[Dict[str, Any]]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    nodes: List[WorkflowNodeResponse] = []

    class Config:
        from_attributes = True


class DocumentCreate(BaseModel):
    filename: str
    file_size: int


class DocumentResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    file_path: str
    file_size: int
    content_type: str
    chunks_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChatMessageCreate(BaseModel):
    query: str = Field(..., min_length=1)


class ChatMessageResponse(BaseModel):
    id: str
    workflow_id: str
    user_id: str
    query: str
    response: Optional[str]
    execution_data: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True


class WorkflowExecutionRequest(BaseModel):
    query: str = Field(..., min_length=1)
    context_documents: Optional[List[str]] = None  # Document IDs to use as context
