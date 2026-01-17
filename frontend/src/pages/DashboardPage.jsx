import React, { useEffect, useState } from 'react';
import { Plus, Loader, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">My Stacks</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition font-medium"
          >
            <Plus size={20} />
            New Stack
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Create New Stack</h2>
            <form onSubmit={handleCreateWorkflow} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stack Name
                </label>
                <input
                  type="text"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Chat With PDF"
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
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe what this stack does..."
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition font-medium"
                >
                  Create Stack
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-md transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader size={32} className="animate-spin text-green-600" />
          </div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-6 text-lg">No stacks yet</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md inline-flex items-center gap-2 font-medium transition"
            >
              <Plus size={20} />
              Create Your First Stack
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {workflows.map(workflow => (
              <div
                key={workflow.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{workflow.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{workflow.description || 'No description'}</p>
                <p className="text-xs text-gray-500 mb-4">
                  Created: {new Date(workflow.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/builder/${workflow.id}`)}
                    className="flex-1 text-green-600 hover:text-green-700 font-medium text-sm flex items-center justify-center gap-1 transition"
                  >
                    Edit Stack <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
