import React, { useState } from 'react';
import { Save, Play, X } from 'lucide-react';
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
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h3 className="font-bold">Workflow Controls</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition"
        >
          <Save size={18} />
          Save Workflow
        </button>

        <button
          onClick={handleExecute}
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition"
        >
          <Play size={18} />
          Execute Workflow
        </button>
      </div>

      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
        <p><strong>Nodes:</strong> {nodes.length}</p>
        <p><strong>Connections:</strong> {edges.length}</p>
      </div>
    </div>
  );
};
