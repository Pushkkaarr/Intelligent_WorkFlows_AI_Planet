import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';

export const ComponentPanel = () => {
  const { addNode } = useWorkflow();
  const [nodeCount, setNodeCount] = useState({
    user_query: 0,
    knowledge_base: 0,
    llm_engine: 0,
    output: 0
  });

  const components = [
    {
      type: 'user_query',
      label: 'User Query',
      description: 'Entry point for user input',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      type: 'knowledge_base',
      label: 'Knowledge Base',
      description: 'Document processing & embeddings',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      type: 'llm_engine',
      label: 'LLM Engine',
      description: 'Generate responses with Gemini',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      type: 'output',
      label: 'Output',
      description: 'Display final response',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    }
  ];

  const getDefaultConfig = (type) => {
    switch(type) {
      case 'user_query':
        return { placeholder: 'Enter your question here' };
      case 'knowledge_base':
        return { embedding_model: 'text-embedding-3-large', api_key: '' };
      case 'llm_engine':
        return { 
          model: 'GPT 4o- Mini', 
          api_key: '', 
          prompt: 'You are a helpful assistant', 
          temperature: 0.7,
          enable_web_search: false,
          serf_api: ''
        };
      case 'output':
        return { format: 'text', description: 'Output of the result nodes as text' };
      default:
        return {};
    }
  };

  const handleDragStart = (e, component) => {
    const newCount = nodeCount[component.type] + 1;
    const nodeId = `${component.type}-${newCount}`;
    
    const node = {
      id: nodeId,
      data: {
        label: `${component.label} ${newCount}`,
        type: component.type,
        config: getDefaultConfig(component.type)
      },
      position: { x: 0, y: 0 },
      type: 'workflow'
    };

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    
    setNodeCount(prev => ({
      ...prev,
      [component.type]: newCount
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <h2 className="text-lg font-bold mb-4 text-gray-900">Components</h2>
      <p className="text-xs text-gray-500 mb-4">Drag components to canvas</p>
      <div className="space-y-2">
        {components.map((comp) => (
          <div
            key={comp.type}
            draggable
            onDragStart={(e) => handleDragStart(e, comp)}
            className={`${comp.color} text-white p-3 rounded cursor-move transition shadow-sm border border-opacity-20 border-white`}
          >
            <div className="font-semibold text-sm">{comp.label}</div>
            <div className="text-xs mt-1 opacity-90">{comp.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
