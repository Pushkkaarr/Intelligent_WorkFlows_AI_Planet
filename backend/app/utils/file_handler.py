import os
import fitz  # PyMuPDF
from typing import Optional
from pathlib import Path

UPLOAD_DIR = "./uploads"


def create_upload_dir():
    """Create upload directory if it doesn't exist"""
    Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)


def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF file using PyMuPDF"""
    try:
        doc = fitz.open(file_path)
        text = ""
        for page_num in range(len(doc)):
            page = doc[page_num]
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> list:
    """Split text into overlapping chunks"""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk.strip():  # Only add non-empty chunks
            chunks.append(chunk)
        start = end - overlap
    return chunks


def save_uploaded_file(filename: str, content: bytes) -> str:
    """Save uploaded file and return path"""
    create_upload_dir()
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(content)
    return file_path
