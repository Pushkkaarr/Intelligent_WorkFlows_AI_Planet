import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { Trash2 } from 'lucide-react';

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
      color: 'bg-blue-500'
    },
    {
      type: 'knowledge_base',
      label: 'Knowledge Base',
      description: 'Document processing & embeddings',
      color: 'bg-purple-500'
    },
    {
      type: 'llm_engine',
      label: 'LLM Engine',
      description: 'Generate responses with Gemini',
      color: 'bg-green-500'
    },
    {
      type: 'output',
      label: 'Output',
      description: 'Display final response',
      color: 'bg-yellow-500'
    }
  ];

  const handleDragStart = (e, component) => {
    const newCount = nodeCount[component.type] + 1;
    const nodeId = `${component.type}-${newCount}`;
    
    const node = {
      id: nodeId,
      data: {
        label: `${component.label} ${newCount}`,
        type: component.type,
        config: {}
      },
      position: { x: 0, y: 0 },
      style: {
        backgroundColor: component.color,
        border: '2px solid #333',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        minWidth: '120px'
      }
    };

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    
    setNodeCount(prev => ({
      ...prev,
      [component.type]: newCount
    }));
  };

  return (
    <div className="w-64 bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Components</h2>
      <div className="space-y-3">
        {components.map((comp) => (
          <div
            key={comp.type}
            draggable
            onDragStart={(e) => handleDragStart(e, comp)}
            className={`${comp.color} text-white p-4 rounded cursor-move hover:opacity-80 transition shadow-md`}
          >
            <div className="font-semibold">{comp.label}</div>
            <div className="text-xs mt-1">{comp.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
