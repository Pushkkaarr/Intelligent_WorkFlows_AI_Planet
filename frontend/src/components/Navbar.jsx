import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Workflow Builder</h1>
          </div>

          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm">{user.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && user && (
          <div className="md:hidden pb-4 space-y-2">
            <div className="text-sm">{user.username}</div>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
