import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ComponentPanel } from '../components/ComponentPanel';
import { WorkflowCanvas } from '../components/WorkflowCanvas';
import { WorkflowControls } from '../components/WorkflowControls';
import { DocumentUploader } from '../components/DocumentUploader';
import { WorkflowExecutor } from '../components/WorkflowExecutor';
import { workflowsAPI } from '../api/endpoints';

export const WorkflowBuilderPage = () => {
  const { workflowId } = useParams();
  const [workflow, setWorkflow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecutorOpen, setIsExecutorOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (workflowId) {
      loadWorkflow();
    } else {
      setIsLoading(false);
    }
  }, [workflowId]);

  const loadWorkflow = async () => {
    try {
      const response = await workflowsAPI.get(workflowId);
      setWorkflow(response.data);
    } catch (err) {
      setError('Error loading workflow');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    setError(null);
    // Show success toast
  };

  const handleExecute = () => {
    setIsExecutorOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel */}
      <div className="w-80 bg-white border-r border-gray-300 overflow-y-auto p-4 space-y-4">
        <ComponentPanel />
        <DocumentUploader />
        <WorkflowControls
          workflowId={workflowId}
          onSave={handleSave}
          onExecute={handleExecute}
        />
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <WorkflowCanvas />
      </div>

      {/* Executor Modal */}
      <WorkflowExecutor
        workflowId={workflowId}
        isOpen={isExecutorOpen}
        onClose={() => setIsExecutorOpen(false)}
      />

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
};
