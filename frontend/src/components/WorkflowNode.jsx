import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Settings, X, Play } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import { NodeSettings } from './NodeSettings';

export const WorkflowNode = ({ data, id, isConnectable }) => {
  const { removeNode, workflowData, setWorkflowData, executeWorkflow } = useWorkflow();
  const [showSettings, setShowSettings] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const getNodeColor = (type, nodeColor) => {
    if (nodeColor) return nodeColor;
    switch(type) {
      case 'user_query': return 'bg-blue-50 border-blue-400';
      case 'knowledge_base': return 'bg-purple-50 border-purple-400';
      case 'llm_engine': return 'bg-cyan-50 border-cyan-400';
      case 'output': return 'bg-orange-50 border-orange-400';
      default: return 'bg-green-50 border-green-400';
    }
  };

  const getNodeTextColor = (type) => {
    switch(type) {
      case 'user_query': return 'text-blue-900';
      case 'knowledge_base': return 'text-purple-900';
      case 'llm_engine': return 'text-cyan-900';
      case 'output': return 'text-orange-900';
      default: return 'text-gray-900';
    }
  };

  const handleDeleteNode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeNode(id);
  };

  const handleConfigChange = (newConfig) => {
    // Note: updateNode is no longer used but keeping for reference
    setShowSettings(false);
  };

  // Handle query execution for user_query node
  const handleExecuteQuery = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!workflowData.query.trim()) {
      return;
    }
    
    setIsExecuting(true);
    try {
      await executeWorkflow(workflowData.query);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="relative">
      {/* Delete button above the node */}
      <div className="absolute -top-6 right-0 z-50 pointer-events-auto">
        <button
          onClick={handleDeleteNode}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg hover:shadow-xl transition active:scale-95"
          title="Delete node and all connections"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main node - with proper pointer events handling */}
      <div 
        className={`rounded-lg p-3 min-w-64 shadow-lg border-2 bg-white ${getNodeColor(data.type, data.nodeColor)} transition hover:shadow-xl relative`}
        style={{ touchAction: 'none', pointerEvents: 'auto' }}
      >
      {/* Top Handle (Input) - Only for non-user_query nodes */}
      {data.type !== 'user_query' && (
        <>
          <Handle 
            type="target" 
            position={Position.Top}
            isConnectable={isConnectable}
            style={{ 
              background: '#059669',
              width: '14px',
              height: '14px',
              border: '3px solid white',
              boxShadow: '0 0 0 2px #059669, 0 0 8px rgba(5, 150, 105, 0.6)',
              cursor: 'crosshair',
              pointerEvents: 'auto'
            }}
          />
          <div className="text-xs text-center text-green-600 mb-2 font-bold">Input</div>
        </>
      )}
      
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex-1">
          <div className={`font-bold text-sm ${getNodeTextColor(data.type)}`}>{data.label}</div>
          <div className="text-xs text-gray-500 font-medium">{data.type.replace(/_/g, ' ').toUpperCase()}</div>
        </div>
        <div className="flex gap-1 flex-shrink-0 pointer-events-auto">
          {data.type === 'user_query' && (
            <button
              onClick={handleExecuteQuery}
              disabled={isExecuting || !workflowData.query.trim()}
              className={`p-1 rounded transition ${
                isExecuting || !workflowData.query.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700'
              }`}
              title="Execute workflow"
            >
              <Play size={16} />
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-green-600 hover:text-green-700 transition p-1 hover:bg-green-100 rounded hover:scale-110"
            title="Configure settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* User Query Input Field */}
      {data.type === 'user_query' && (
        <div className="mb-3 pointer-events-auto">
          <input
            type="text"
            value={workflowData.query}
            onChange={(e) => setWorkflowData(prev => ({ ...prev, query: e.target.value }))}
            placeholder="Ask a question..."
            disabled={isExecuting}
            className="w-full px-2 py-2 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>
      )}

      {/* Output Display */}
      {data.type === 'output' && workflowData.response && (
        <div className="mb-3 pointer-events-auto bg-orange-100 border border-orange-300 rounded p-2 max-h-32 overflow-y-auto">
          <p className="text-xs text-orange-900">{workflowData.response}</p>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-green-50 p-3 mt-3 rounded border border-green-300 text-xs space-y-2 max-h-72 overflow-y-auto pointer-events-auto">
          <NodeSettings 
            type={data.type} 
            config={data.config || {}}
            onChange={handleConfigChange}
          />
        </div>
      )}

      {/* Bottom Handle (Output) - Only for non-output nodes */}
      {data.type !== 'output' && (
        <>
          <div className="text-xs text-center text-green-600 mt-3 mb-2 font-bold">Output</div>
          <Handle 
            type="source" 
            position={Position.Bottom}
            isConnectable={isConnectable}
            style={{ 
              background: '#059669',
              width: '14px',
              height: '14px',
              border: '3px solid white',
              boxShadow: '0 0 0 2px #059669, 0 0 8px rgba(5, 150, 105, 0.6)',
              cursor: 'crosshair',
              pointerEvents: 'auto'
            }}
          />
        </>
      )}
      </div>
    </div>
  );
};

