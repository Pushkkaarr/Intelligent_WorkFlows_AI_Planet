import React from 'react';

export const NodeSettings = ({ type, config, onChange }) => {
  const handleChange = (key, value) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      {type === 'user_query' && (
        <>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Query Type</label>
            <select 
              value={config.queryType || 'freeform'}
              onChange={(e) => handleChange('queryType', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            >
              <option value="freeform">Free Form Text</option>
              <option value="structured">Structured Query</option>
              <option value="template">Template Based</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Placeholder</label>
            <input
              type="text"
              value={config.placeholder || 'Ask a question...'}
              onChange={(e) => handleChange('placeholder', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              placeholder="Input placeholder text"
            />
          </div>
        </>
      )}

      {type === 'knowledge_base' && (
        <>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Knowledge Base Type</label>
            <select 
              value={config.kbType || 'document'}
              onChange={(e) => handleChange('kbType', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            >
              <option value="document">Document Base</option>
              <option value="api">API/Database</option>
              <option value="web">Web Search</option>
              <option value="custom">Custom Source</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Data Source</label>
            <input
              type="text"
              value={config.dataSource || ''}
              onChange={(e) => handleChange('dataSource', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              placeholder="e.g., /data/documents"
            />
          </div>
        </>
      )}

      {type === 'llm_engine' && (
        <>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Model</label>
            <select 
              value={config.model || 'gpt-4'}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5">GPT-3.5 Turbo</option>
              <option value="claude">Claude</option>
              <option value="local">Local Model</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Temperature</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature || 0.7}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{config.temperature || 0.7}</span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Max Tokens</label>
            <input
              type="number"
              value={config.maxTokens || 2048}
              onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              min="1"
              max="4096"
            />
          </div>
        </>
      )}

      {type === 'output' && (
        <>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Output Format</label>
            <select 
              value={config.format || 'text'}
              onChange={(e) => handleChange('format', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            >
              <option value="text">Plain Text</option>
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
              <option value="table">Table</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={config.showTimestamp || false}
                onChange={(e) => handleChange('showTimestamp', e.target.checked)}
                className="w-3 h-3"
              />
              Show Timestamp
            </label>
          </div>
        </>
      )}

      <div className="text-xs text-gray-500 italic pt-2 border-t border-gray-200">
        Node ID: {config.nodeId || 'Not set'}
      </div>
    </div>
  );
};
