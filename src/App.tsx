import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import Settings from './pages/Settings';
import ConsequenceConfig from './pages/ConsequenceConfig';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="task">
          <Route index element={<TaskForm />} />
          <Route path=":id" element={<TaskForm />} />
        </Route>
        <Route path="consequences" element={<ConsequenceConfig />} />
        <Route path="settings" element={<Settings />} />
        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  );
}

export default App;