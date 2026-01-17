import os
import chromadb
from sentence_transformers import SentenceTransformer
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

CHROMA_PATH = os.getenv("CHROMA_PATH", "./chroma_db")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")


class EmbeddingService:
    """Service for managing embeddings and vector store"""
    
    def __init__(self):
        self.chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
        self.embedding_model = SentenceTransformer(EMBEDDING_MODEL)
    
    def get_or_create_collection(self, collection_name: str):
        """Get or create a ChromaDB collection"""
        try:
            return self.chroma_client.get_collection(collection_name)
        except Exception:
            return self.chroma_client.create_collection(collection_name)
    
    def add_documents(self, collection_name: str, documents: List[str], document_id: str) -> bool:
        """Add documents to collection with embeddings"""
        try:
            collection = self.get_or_create_collection(collection_name)
            
            # Generate embeddings
            embeddings = self.embedding_model.encode(documents).tolist()
            
            # Add to collection
            ids = [f"{document_id}_chunk_{i}" for i in range(len(documents))]
            collection.add(
                ids=ids,
                embeddings=embeddings,
                documents=documents,
                metadatas=[{"source": document_id} for _ in documents]
            )
            return True
        except Exception as e:
            print(f"Error adding documents to collection: {e}")
            return False
    
    def query_collection(self, collection_name: str, query: str, n_results: int = 5) -> Optional[List[str]]:
        """Query collection and return relevant documents"""
        try:
            collection = self.get_or_create_collection(collection_name)
            query_embedding = self.embedding_model.encode([query])[0].tolist()
            
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results
            )
            
            if results and results['documents']:
                return results['documents'][0]
            return []
        except Exception as e:
            print(f"Error querying collection: {e}")
            return []
    
    def delete_collection(self, collection_name: str) -> bool:
        """Delete a collection"""
        try:
            self.chroma_client.delete_collection(collection_name)
            return True
        except Exception as e:
            print(f"Error deleting collection: {e}")
            return False


embedding_service = EmbeddingService()
