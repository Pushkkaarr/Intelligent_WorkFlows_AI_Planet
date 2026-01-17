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
      node.id === id ? { ...node, ...updates } : node
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
    setEdges
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
