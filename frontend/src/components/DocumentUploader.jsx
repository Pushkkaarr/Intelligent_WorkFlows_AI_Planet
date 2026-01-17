import React, { useState } from 'react';
import { Upload, Trash2, Loader, FileText } from 'lucide-react';
import { documentsAPI } from '../api/endpoints';

export const DocumentUploader = ({ onUploadSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      setError('Only PDF files are supported');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await documentsAPI.upload(formData);
      setDocuments(prev => [...prev, response.data]);
      onUploadSuccess?.(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    try {
      await documentsAPI.delete(docId);
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
    } catch (err) {
      setError('Error deleting document');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-bold text-gray-900 mb-4">Documents</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
        <div className="flex flex-col items-center justify-center py-2">
          <Upload size={24} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 font-medium">Click to upload PDF</p>
          <p className="text-xs text-gray-500">Max 50MB</p>
        </div>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={isLoading}
          className="hidden"
        />
      </label>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
          <Loader size={16} className="animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {documents.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-sm text-gray-700">Uploaded Files:</h4>
          {documents.map(doc => (
            <div key={doc.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200 hover:border-gray-300 transition">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText size={14} className="text-blue-600 flex-shrink-0" />
                <span className="text-sm truncate text-gray-700">{doc.filename}</span>
              </div>
              <button
                onClick={() => handleDelete(doc.id)}
                className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                title="Delete document"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
