from sqlalchemy.orm import Session
from app.models import Workflow, WorkflowNode, Document, ChatMessage
from app.schemas_workflow import WorkflowCreate, WorkflowUpdate, WorkflowExecutionRequest
from fastapi import HTTPException, status
from typing import Optional, List
import json


class WorkflowService:
    """Service for workflow operations"""
    
    @staticmethod
    def create_workflow(db: Session, user_id: str, workflow_data: WorkflowCreate) -> Workflow:
        """Create a new workflow"""
        workflow = Workflow(
            user_id=user_id,
            name=workflow_data.name,
            description=workflow_data.description or "",
            configuration=workflow_data.configuration
        )
        db.add(workflow)
        db.commit()
        db.refresh(workflow)
        return workflow
    
    @staticmethod
    def get_workflow(db: Session, workflow_id: str, user_id: str) -> Workflow:
        """Get workflow by ID and verify ownership"""
        workflow = db.query(Workflow).filter(
            Workflow.id == workflow_id,
            Workflow.user_id == user_id
        ).first()
        
        if not workflow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workflow not found"
            )
        return workflow
    
    @staticmethod
    def list_workflows(db: Session, user_id: str) -> List[Workflow]:
        """List all workflows for a user"""
        return db.query(Workflow).filter(Workflow.user_id == user_id).all()
    
    @staticmethod
    def update_workflow(db: Session, workflow_id: str, user_id: str, workflow_data: WorkflowUpdate) -> Workflow:
        """Update workflow"""
        workflow = WorkflowService.get_workflow(db, workflow_id, user_id)
        
        update_data = workflow_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(workflow, field, value)
        
        db.commit()
        db.refresh(workflow)
        return workflow
    
    @staticmethod
    def delete_workflow(db: Session, workflow_id: str, user_id: str) -> bool:
        """Delete workflow"""
        workflow = WorkflowService.get_workflow(db, workflow_id, user_id)
        db.delete(workflow)
        db.commit()
        return True


class DocumentService:
    """Service for document operations"""
    
    @staticmethod
    def create_document(db: Session, user_id: str, filename: str, file_path: str, file_size: int) -> Document:
        """Create a new document"""
        document = Document(
            user_id=user_id,
            filename=filename,
            file_path=file_path,
            file_size=file_size
        )
        db.add(document)
        db.commit()
        db.refresh(document)
        return document
    
    @staticmethod
    def get_document(db: Session, doc_id: str, user_id: str) -> Document:
        """Get document by ID and verify ownership"""
        document = db.query(Document).filter(
            Document.id == doc_id,
            Document.user_id == user_id
        ).first()
        
        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found"
            )
        return document
    
    @staticmethod
    def list_documents(db: Session, user_id: str) -> List[Document]:
        """List all documents for a user"""
        return db.query(Document).filter(Document.user_id == user_id).all()
    
    @staticmethod
    def delete_document(db: Session, doc_id: str, user_id: str) -> bool:
        """Delete document"""
        document = DocumentService.get_document(db, doc_id, user_id)
        db.delete(document)
        db.commit()
        return True


class ChatService:
    """Service for chat operations"""
    
    @staticmethod
    def create_chat_message(db: Session, workflow_id: str, user_id: str, query: str, response: Optional[str] = None) -> ChatMessage:
        """Create a chat message"""
        message = ChatMessage(
            workflow_id=workflow_id,
            user_id=user_id,
            query=query,
            response=response
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        return message
    
    @staticmethod
    def get_chat_history(db: Session, workflow_id: str, user_id: str) -> List[ChatMessage]:
        """Get chat history for a workflow"""
        return db.query(ChatMessage).filter(
            ChatMessage.workflow_id == workflow_id,
            ChatMessage.user_id == user_id
        ).order_by(ChatMessage.created_at).all()
