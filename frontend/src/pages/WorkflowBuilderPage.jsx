import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className="flex h-screen flex-col bg-green-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-green-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition font-medium"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{workflow?.name || 'New Workflow'}</h1>
            <p className="text-sm text-gray-600">{workflow?.description}</p>
          </div>
        </div>
      </div>

      {/* Main workflow builder */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Collapsible */}
        <div className={`bg-white border-r border-green-200 overflow-y-auto shadow-sm transition-all duration-300 ${isSidebarOpen ? 'w-80 p-4' : 'w-0'}`}>
          {isSidebarOpen && (
            <div className="space-y-4">
              <ComponentPanel />
              <DocumentUploader />
              <WorkflowControls
                workflowId={workflowId}
                onSave={handleSave}
                onExecute={handleExecute}
              />
            </div>
          )}
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-8 bg-white border-r border-green-200 flex items-center justify-center hover:bg-green-50 transition group"
          title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={20} className="text-green-600 group-hover:text-green-700" />
          ) : (
            <ChevronRight size={20} className="text-green-600 group-hover:text-green-700" />
          )}
        </button>

        {/* Canvas */}
        <div className="flex-1 overflow-hidden">
          <WorkflowCanvas />
        </div>

        {/* Right Panel - Properties */}
        <div className="w-64 bg-white border-l border-green-200 p-4 overflow-y-auto shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-gray-900">Properties</h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-green-700 font-medium mb-1">Workflow ID</label>
              <p className="text-gray-600 break-all text-xs">{workflowId}</p>
            </div>
            <div>
              <label className="block text-green-700 font-medium mb-1">Status</label>
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
