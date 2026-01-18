import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkflowProvider } from './context/WorkflowContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkflowBuilderPage } from './pages/WorkflowBuilderPage';
import './styles/tailwind.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkflowProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <DashboardPage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/builder/:workflowId"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <WorkflowBuilderPage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/builder"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <WorkflowBuilderPage />
                  </>
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WorkflowProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
