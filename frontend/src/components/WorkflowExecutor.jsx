import React, { useState } from 'react';
import { workflowsAPI } from '../api/endpoints';
import { Loader, AlertCircle } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

export const WorkflowExecutor = ({ workflowId, isOpen, onClose, onResponseReceived }) => {
  const { generateResponse } = useWorkflow();
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
      // Call Gemini API for real response
      const aiResponse = await generateResponse(query);
      
      const result = {
        data: {
          response: aiResponse,
          query: query.trim(),
          timestamp: new Date().toISOString(),
          workflow_id: workflowId,
          status: 'success'
        }
      };

      setResponse(result.data.response);
      onResponseReceived?.(result.data);
    } catch (err) {
      setError(err.message || 'Error executing workflow. Please check your API key and try again.');
      console.error('Workflow execution error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-98 overflow-y-auto">
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">Execute Workflow</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex gap-2">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Query</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your question here..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              disabled={isLoading}
            />
          </div>

          {response && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">AI Response:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={handleExecute}
              disabled={isLoading || !query.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 font-medium"
            >
              {isLoading && <Loader size={18} className="animate-spin" />}
              {isLoading ? 'Processing...' : 'Execute Workflow'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
