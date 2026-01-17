import React, { useEffect, useState } from 'react';
import { Plus, Loader, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workflowsAPI } from '../api/endpoints';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: '', description: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const response = await workflowsAPI.list();
      setWorkflows(response.data);
    } catch (err) {
      setError('Error loading workflows');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkflow = async (e) => {
    e.preventDefault();
    if (!newWorkflow.name.trim()) {
      setError('Workflow name is required');
      return;
    }

    try {
      const response = await workflowsAPI.create(newWorkflow);
      setWorkflows(prev => [...prev, response.data]);
      setNewWorkflow({ name: '', description: '' });
      setShowCreateForm(false);
      navigate(`/builder/${response.data.id}`);
    } catch (err) {
      setError('Error creating workflow');
    }
  };

  const handleDeleteWorkflow = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await workflowsAPI.delete(id);
      setWorkflows(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      setError('Error deleting workflow');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Workflows</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} />
          New Workflow
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleCreateWorkflow} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workflow Name
              </label>
              <input
                type="text"
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My Workflow"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your workflow..."
                rows="3"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                Create Workflow
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader size={32} className="animate-spin" />
        </div>
      ) : workflows.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No workflows yet</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Create Your First Workflow
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map(workflow => (
            <div
              key={workflow.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              <h3 className="text-xl font-bold mb-2">{workflow.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{workflow.description}</p>
              <div className="text-xs text-gray-500 mb-4">
                <p>Created: {new Date(workflow.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/builder/${workflow.id}`)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteWorkflow(workflow.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
