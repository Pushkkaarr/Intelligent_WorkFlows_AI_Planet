import React, { useState } from 'react';
import { workflowsAPI } from '../api/endpoints';
import { Loader } from 'lucide-react';

export const WorkflowExecutor = ({ workflowId, isOpen, onClose, onResponseReceived }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExecute = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const result = await workflowsAPI.execute(workflowId, {
        query: query.trim(),
        context_documents: []
      });

      setResponse(result.data.response || 'No response generated');
      onResponseReceived?.(result.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error executing workflow');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">Chat with Workflow</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            disabled={isLoading}
          />

          {response && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Response:</h3>
              <p className="text-gray-700">{response}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleExecute}
              disabled={isLoading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition flex items-center justify-center gap-2"
            >
              {isLoading && <Loader size={18} className="animate-spin" />}
              Execute
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
