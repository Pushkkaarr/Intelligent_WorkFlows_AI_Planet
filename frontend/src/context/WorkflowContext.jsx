import React, { createContext, useContext, useState } from 'react';

const WorkflowContext = createContext(null);

export const WorkflowProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);

  const addNode = (node) => {
    setNodes(prev => [...prev, node]);
  };

  const updateNode = (id, updates) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, data: updates } : node
    ));
  };

  const removeNode = (id) => {
    setNodes(prev => prev.filter(node => node.id !== id));
    setEdges(prev => prev.filter(edge => 
      edge.source !== id && edge.target !== id
    ));
  };

  const addEdge = (edge) => {
    setEdges(prev => [...prev, edge]);
  };

  const removeEdge = (id) => {
    setEdges(prev => prev.filter(edge => edge.id !== id));
  };

  const clearWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setCurrentWorkflow(null);
  };

  // Get response from backend API
  const generateResponse = async (userQuery) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      const workflowId = currentWorkflow?.id || 'default';

      const response = await fetch(`${backendUrl}/api/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query: userQuery
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate response from backend');
      }

      const data = await response.json();
      
      if (data.response) {
        return data.response;
      }
      
      throw new Error('Invalid response format from backend');
    } catch (error) {
      console.error('Error calling backend API:', error);
      throw error;
    }
  };

  // Execute workflow with backend response
  const executeWorkflow = async (query) => {
    try {
      const response = await generateResponse(query);
      return response;
    } catch (error) {
      console.error('Workflow execution error:', error);
      throw error;
    }
  };

  const value = {
    nodes,
    edges,
    currentWorkflow,
    setCurrentWorkflow,
    addNode,
    updateNode,
    removeNode,
    addEdge,
    removeEdge,
    clearWorkflow,
    setNodes,
    setEdges,
    generateResponse,
    executeWorkflow
  };

  return (
    <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within WorkflowProvider');
  }
  return context;
};
