import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Trash2, Settings } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

export const WorkflowNode = ({ data, id, isConnectable }) => {
  const { removeNode, updateNode } = useWorkflow();
  const [showSettings, setShowSettings] = useState(false);

  const getNodeColor = (type) => {
    switch(type) {
      case 'user_query': return 'bg-blue-50 border-blue-400';
      case 'knowledge_base': return 'bg-purple-50 border-purple-400';
      case 'llm_engine': return 'bg-green-50 border-green-400';
      case 'output': return 'bg-yellow-50 border-yellow-400';
      default: return 'bg-gray-50 border-gray-400';
    }
  };

  const getNodeTextColor = (type) => {
    switch(type) {
      case 'user_query': return 'text-blue-900';
      case 'knowledge_base': return 'text-purple-900';
      case 'llm_engine': return 'text-green-900';
      case 'output': return 'text-yellow-900';
      default: return 'text-gray-900';
    }
  };

  const handleConfigChange = (newConfig) => {
    updateNode(id, { ...data, config: newConfig });
    setShowSettings(false);
  };

  return (
    <div className={`rounded-lg p-3 min-w-64 shadow-lg border-2 bg-white ${getNodeColor(data.type)} transition hover:shadow-xl relative`}>
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
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-500 hover:text-gray-700 transition p-1 hover:bg-gray-200 rounded"
            title="Configure settings"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => removeNode(id)}
            className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-100 rounded"
            title="Delete node"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-50 p-3 mt-3 rounded border border-gray-300 text-xs space-y-2 max-h-72 overflow-y-auto pointer-events-auto">
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
  );
};

  const NodeSettings = ({ type, config, onChange }) => {
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    onChange(localConfig);
  };

  const handleChange = (field, value) => {
    setLocalConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  switch(type) {
    case 'user_query':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-gray-800 font-bold text-xs mb-2">User Query Settings</label>
            <p className="text-xs text-gray-600 mb-2">Enter point for queries</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Query Placeholder</label>
            <input
              type="text"
              placeholder="e.g., Enter your question here"
              value={localConfig.placeholder || 'What is the capital of France?'}
              onChange={(e) => handleChange('placeholder', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            />
            <p className="text-xs text-gray-500 mt-1">This text appears as placeholder in query input</p>
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded text-xs font-bold"
          >
            Save Settings
          </button>
        </div>
      );

    case 'knowledge_base':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-gray-800 font-bold text-xs mb-2">Knowledge Base</label>
            <p className="text-xs text-gray-600 mb-2">Let LLM search info in your file</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">File for Knowledge Base</label>
            <div className="border-2 border-dashed border-gray-300 rounded p-2 text-center text-xs text-gray-600 bg-blue-50">
              📄 Company_Overview_2024.pdf
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Embedding Model</label>
            <select
              value={localConfig.embedding_model || 'text-embedding-3-large'}
              onChange={(e) => handleChange('embedding_model', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            >
              <option value="text-embedding-3-large">text-embedding-3-large</option>
              <option value="text-embedding-3-small">text-embedding-3-small</option>
              <option value="all-MiniLM-L6-v2">all-MiniLM-L6-v2</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">API Key</label>
            <input
              type="password"
              placeholder="Enter API Key"
              value={localConfig.api_key || 'sk-proj-**HARDCODED**'}
              onChange={(e) => handleChange('api_key', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-2 py-2 rounded text-xs font-bold"
          >
            Save Settings
          </button>
        </div>
      );

    case 'llm_engine':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-gray-800 font-bold text-xs mb-2">LLM (OpenAI)</label>
            <p className="text-xs text-gray-600 mb-2">Run a query with OpenAI LLM</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Model</label>
            <select
              value={localConfig.model || 'GPT 4o- Mini'}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            >
              <option value="GPT 4o- Mini">GPT 4o- Mini</option>
              <option value="GPT 4">GPT 4</option>
              <option value="gemini-pro">Gemini Pro</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">API Key</label>
            <input
              type="password"
              placeholder="Enter API Key"
              value={localConfig.api_key || 'sk-proj-**HARDCODED**'}
              onChange={(e) => handleChange('api_key', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">Prompt</label>
            <p className="text-xs text-gray-500 mb-1">You are a helpful PDF assistant. Use web search if the PDF lacks content</p>
            <div className="bg-gray-100 border border-gray-300 rounded p-2 text-xs text-gray-600 max-h-16 overflow-y-auto">
              CONTEXT: Company data and regulations from knowledge base
              <br/>User Query: What is the capital of France?
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Temperature</label>
            <div className="flex gap-2 items-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localConfig.temperature || 0.7}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs font-bold text-gray-700 w-8">{(localConfig.temperature || 0.7).toFixed(1)}</span>
            </div>
          </div>
          <label className="flex items-center gap-2 p-2 border border-gray-300 rounded">
            <input
              type="checkbox"
              checked={localConfig.enable_web_search !== false}
              onChange={(e) => handleChange('enable_web_search', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-xs font-semibold text-gray-700">WebSearch Tool</span>
          </label>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">SERF API</label>
            <input
              type="password"
              placeholder="Enter SERF API Key"
              value={localConfig.serf_api || 'serf-api-**HARDCODED**'}
              onChange={(e) => handleChange('serf_api', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-2 py-2 rounded text-xs font-bold"
          >
            Save Settings
          </button>
        </div>
      );

    case 'output':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-gray-800 font-bold text-xs mb-2">Output</label>
            <p className="text-xs text-gray-600 mb-2">Output of the result nodes as text</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Format</label>
            <select
              value={localConfig.format || 'text'}
              onChange={(e) => handleChange('format', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            >
              <option value="text">Text</option>
              <option value="json">JSON</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Description</label>
            <input
              type="text"
              placeholder="Output will be generated based on query"
              value={localConfig.description || 'Final AI-Generated Answer'}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-2 rounded text-xs font-bold"
          >
            Save Settings
          </button>
        </div>
      );

    default:
      return <p className="text-gray-600 text-xs">No settings available</p>;
  }
};

