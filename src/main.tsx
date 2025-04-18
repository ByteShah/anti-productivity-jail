import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { TaskProvider } from './context/TaskContext';
import { ConsequenceProvider } from './context/ConsequenceContext';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <ConsequenceProvider>
            <App />
          </ConsequenceProvider>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);