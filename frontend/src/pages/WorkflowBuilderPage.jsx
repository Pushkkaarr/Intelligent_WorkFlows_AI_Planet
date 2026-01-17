import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { ComponentPanel } from '../components/ComponentPanel';
import { WorkflowCanvas } from '../components/WorkflowCanvas';
import { WorkflowControls } from '../components/WorkflowControls';
import { DocumentUploader } from '../components/DocumentUploader';
import { WorkflowExecutor } from '../components/WorkflowExecutor';
import { GenAIStackChat } from '../components/GenAIStackChat';
import { workflowsAPI } from '../api/endpoints';

export const WorkflowBuilderPage = () => {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecutorOpen, setIsExecutorOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
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
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{workflow?.name || 'New Workflow'}</h1>
            <p className="text-sm text-gray-500">{workflow?.description}</p>
          </div>
        </div>
      </div>

      {/* Main workflow builder */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 bg-white border-r border-gray-300 overflow-y-auto p-4 space-y-4 shadow-sm">
          <ComponentPanel />
          <DocumentUploader />
          <WorkflowControls
            workflowId={workflowId}
            onSave={handleSave}
            onExecute={handleExecute}
          />
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-hidden">
          <WorkflowCanvas />
        </div>

        {/* Right Panel - Properties */}
        <div className="w-64 bg-white border-l border-gray-300 p-4 overflow-y-auto shadow-sm">
          <h3 className="font-bold text-lg mb-4">Properties</h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Workflow ID</label>
              <p className="text-gray-500 break-all text-xs">{workflowId}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Status</label>
              <p className="text-green-600 font-medium">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Executor Modal */}
      <WorkflowExecutor
        workflowId={workflowId}
        isOpen={isExecutorOpen}
        onClose={() => setIsExecutorOpen(false)}
      />

      {/* Chat Modal */}
      <GenAIStackChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        workflowId={workflowId}
      />

      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110"
        title="Open chat"
      >
        <MessageCircle size={24} />
      </button>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
};
