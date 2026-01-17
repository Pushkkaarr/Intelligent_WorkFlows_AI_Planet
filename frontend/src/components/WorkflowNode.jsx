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
    <div className={`rounded-lg p-3 min-w-56 shadow-lg border-2 bg-white ${getNodeColor(data.type)} transition hover:shadow-xl`}>
      {/* Top Handle (Input) */}
      <Handle 
        type="target" 
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#059669' }}
      />
      
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex-1">
          <div className={`font-bold text-sm ${getNodeTextColor(data.type)}`}>{data.label}</div>
          <div className="text-xs text-gray-600">{data.type.replace(/_/g, ' ')}</div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-500 hover:text-gray-700 transition p-1"
            title="Configure settings"
          >
            <Settings size={14} />
          </button>
          <button
            onClick={() => removeNode(id)}
            className="text-red-500 hover:text-red-700 transition p-1"
            title="Delete node"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-50 p-2 mt-2 rounded border border-gray-300 text-xs space-y-2">
          <NodeSettings 
            type={data.type} 
            config={data.config || {}}
            onChange={handleConfigChange}
          />
        </div>
      )}

      {/* Bottom Handle (Output) */}
      <Handle 
        type="source" 
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ background: '#059669' }}
      />
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
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">User Query Settings</label>
          <input
            type="text"
            placeholder="Query placeholder"
            value={localConfig.placeholder || ''}
            onChange={(e) => handleChange('placeholder', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
          >
            Save
          </button>
        </div>
      );

    case 'knowledge_base':
      return (
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">Knowledge Base</label>
          <select
            value={localConfig.embedding_model || 'text-embedding-3-large'}
            onChange={(e) => handleChange('embedding_model', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          >
            <option value="text-embedding-3-large">text-embedding-3-large</option>
            <option value="text-embedding-3-small">text-embedding-3-small</option>
            <option value="all-MiniLM-L6-v2">all-MiniLM-L6-v2</option>
          </select>
          <label className="block text-gray-700 font-semibold mt-2">API Key</label>
          <input
            type="password"
            placeholder="API Key"
            value={localConfig.api_key || ''}
            onChange={(e) => handleChange('api_key', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
          <button
            onClick={handleSave}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs"
          >
            Save
          </button>
        </div>
      );

    case 'llm_engine':
      return (
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">LLM Settings</label>
          <select
            value={localConfig.model || 'GPT 4o- Mini'}
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          >
            <option value="GPT 4o- Mini">GPT 4o- Mini</option>
            <option value="GPT 4">GPT 4</option>
            <option value="gemini-pro">Gemini Pro</option>
          </select>
          <label className="block text-gray-700 font-semibold mt-2">API Key</label>
          <input
            type="password"
            placeholder="API Key"
            value={localConfig.api_key || ''}
            onChange={(e) => handleChange('api_key', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
          <label className="block text-gray-700 font-semibold mt-2">Prompt</label>
          <textarea
            placeholder="Custom prompt"
            value={localConfig.prompt || ''}
            onChange={(e) => handleChange('prompt', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs h-16 resize-none"
          />
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={localConfig.enable_web_search || false}
              onChange={(e) => handleChange('enable_web_search', e.target.checked)}
              className="w-4 h-4"
            />
            <span>Enable Web Search</span>
          </label>
          <label className="block text-gray-700 font-semibold mt-2">Temperature</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={localConfig.temperature || 0.7}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{localConfig.temperature || 0.7}</span>
          <label className="block text-gray-700 font-semibold mt-2">SERF API</label>
          <input
            type="password"
            placeholder="SERF API Key"
            value={localConfig.serf_api || ''}
            onChange={(e) => handleChange('serf_api', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
          <button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs mt-2"
          >
            Save
          </button>
        </div>
      );

    case 'output':
      return (
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">Output Settings</label>
          <select
            value={localConfig.format || 'text'}
            onChange={(e) => handleChange('format', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          >
            <option value="text">Text</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
          </select>
          <label className="block text-gray-700 font-semibold mt-2">Description</label>
          <input
            type="text"
            placeholder="Output description"
            value={localConfig.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
          <button
            onClick={handleSave}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs"
          >
            Save
          </button>
        </div>
      );

    default:
      return <p className="text-gray-600">No settings available</p>;
  }
};
