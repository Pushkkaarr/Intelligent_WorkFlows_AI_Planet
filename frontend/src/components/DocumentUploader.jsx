import React, { useState } from 'react';
import { Upload, Trash2, Loader } from 'lucide-react';
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
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold mb-4">Documents</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload size={32} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Click to upload PDF</p>
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
        <div className="flex items-center justify-center gap-2 mt-4">
          <Loader size={20} className="animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {documents.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-sm">Uploaded Files:</h4>
          {documents.map(doc => (
            <div key={doc.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span className="text-sm truncate">{doc.filename}</span>
              <button
                onClick={() => handleDelete(doc.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
