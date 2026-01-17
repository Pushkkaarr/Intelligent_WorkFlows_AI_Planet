from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.utils.database import get_db
from app.utils.file_handler import extract_text_from_pdf, chunk_text, save_uploaded_file
from app.utils.embeddings import embedding_service
from app.schemas_workflow import DocumentResponse
from app.services.workflow_service import DocumentService
from app.routes.auth import get_current_user

router = APIRouter(prefix="/api/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and process a document"""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported"
        )
    
    # Read file
    content = await file.read()
    file_size = len(content)
    
    # Save file
    file_path = save_uploaded_file(file.filename, content)
    
    # Create document record
    document = DocumentService.create_document(
        db, current_user.id, file.filename, file_path, file_size
    )
    
    # Extract text
    text = extract_text_from_pdf(file_path)
    document.text_content = text
    
    # Chunk text
    chunks = chunk_text(text)
    document.chunks_count = len(chunks)
    
    # Generate embeddings and store in ChromaDB
    collection_name = f"doc_{document.id}"
    success = embedding_service.add_documents(collection_name, chunks, document.id)
    
    if success:
        document.embedding_id = collection_name
    
    db.commit()
    db.refresh(document)
    
    return DocumentResponse.from_orm(document)


@router.get("/", response_model=List[DocumentResponse])
async def list_documents(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all documents for the user"""
    documents = DocumentService.list_documents(db, current_user.id)
    return [DocumentResponse.from_orm(doc) for doc in documents]


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(
    doc_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific document"""
    document = DocumentService.get_document(db, doc_id, current_user.id)
    return DocumentResponse.from_orm(document)


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    doc_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a document"""
    document = DocumentService.get_document(db, doc_id, current_user.id)
    
    # Delete embeddings
    if document.embedding_id:
        embedding_service.delete_collection(document.embedding_id)
    
    DocumentService.delete_document(db, doc_id, current_user.id)
    return None
