from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from .base import Base


class WorkflowNode(Base):
    """WorkflowNode model to store individual nodes in a workflow"""
    __tablename__ = "workflow_nodes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_id = Column(String, ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    node_type = Column(String, nullable=False)  # user_query, knowledge_base, llm_engine, output
    node_id = Column(String, nullable=False)  # Unique within workflow (for React Flow)
    configuration = Column(JSON, nullable=True)  # Node-specific configuration
    position = Column(JSON, nullable=True)  # x, y coordinates for canvas
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    workflow = relationship("Workflow", back_populates="nodes")
