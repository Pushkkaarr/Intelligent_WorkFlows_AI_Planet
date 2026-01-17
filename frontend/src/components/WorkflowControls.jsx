import React, { useState } from 'react';
import { Save, Play, X, AlertCircle } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import { workflowsAPI } from '../api/endpoints';

export const WorkflowControls = ({ workflowId, onExecute, onSave }) => {
  const { nodes, edges } = useWorkflow();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateWorkflow = () => {
    if (nodes.length === 0) {
      setError('Add at least one component');
      return false;
    }

    const hasUserQuery = nodes.some(n => n.data.type === 'user_query');
    const hasOutput = nodes.some(n => n.data.type === 'output');

    if (!hasUserQuery || !hasOutput) {
      setError('Workflow must have User Query and Output components');
      return false;
    }

    // Check if all nodes are connected
    if (edges.length === 0) {
      setError('Connect all components with edges');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateWorkflow()) return;

    setIsLoading(true);
    try {
      const config = {
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.data.type,
          position: n.position,
          config: n.data.config
        })),
        edges: edges
      };

      if (workflowId) {
        await workflowsAPI.update(workflowId, { configuration: config });
      }

      onSave?.();
    } catch (err) {
      setError('Error saving workflow');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!validateWorkflow()) return;
    onExecute?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      <h3 className="font-bold text-gray-900">Workflow Controls</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm flex justify-between items-start gap-2">
          <div className="flex gap-2 flex-1">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition font-medium text-sm"
        >
          <Save size={16} />
          Save Workflow
        </button>

        <button
          onClick={handleExecute}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition font-medium text-sm"
        >
          <Play size={16} />
          Execute Workflow
        </button>
      </div>

      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
        <p className="font-medium text-gray-700 mb-2">Workflow Info</p>
        <p><strong>Nodes:</strong> {nodes.length}</p>
        <p><strong>Connections:</strong> {edges.length}</p>
      </div>
    </div>
  );
};
