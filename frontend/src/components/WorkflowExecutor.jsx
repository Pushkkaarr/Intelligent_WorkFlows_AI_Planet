import React, { useState } from 'react';
import { workflowsAPI } from '../api/endpoints';
import { Loader } from 'lucide-react';

export const WorkflowExecutor = ({ workflowId, isOpen, onClose, onResponseReceived }) => {
  const [query, setQuery] = useState('What is the capital of France?');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hardcoded mock responses for different types of queries
  const getMockResponse = (userQuery) => {
    const queryLower = userQuery.toLowerCase();
    
    const mockResponses = {
      'capital': 'Paris is the capital of France. It is located in the north-central part of the country along the Seine River. Paris is known for its iconic landmarks such as the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral.',
      'france': 'France is a country located in Western Europe. It is known for its rich history, culture, and cuisine. The capital is Paris, and the official language is French. France is a member of the European Union.',
      'weather': 'Current weather information: The temperature is 15°C with partly cloudy skies. Humidity is at 65%. Wind speed is 10 km/h from the northwest. It is a pleasant day with a chance of light rain in the evening.',
      'default': 'Based on the knowledge base and LLM analysis: Your query has been processed using the integrated AI workflow. The system has analyzed the context, searched the knowledge base, and generated a comprehensive response. This is a sample output demonstrating the workflow execution pipeline.'
    };

    // Check which response matches best
    for (const [key, value] of Object.entries(mockResponses)) {
      if (queryLower.includes(key)) {
        return value;
      }
    }
    
    return mockResponses.default;
  };

  const handleExecute = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get hardcoded mock response
      const mockResponse = getMockResponse(query);
      
      const result = {
        data: {
          response: mockResponse,
          query: query.trim(),
          timestamp: new Date().toISOString(),
          workflow_id: workflowId,
          status: 'success'
        }
      };

      setResponse(result.data.response);
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-98 overflow-y-auto">
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
