import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlarmClock, LogIn, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password. Try demo@example.com / password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-md p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-3">
            <AlarmClock size={48} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold">Anti-Productivity Jail</h1>
          <p className="text-slate-400 mt-2">Sign in and start facing consequences</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Log in to your account</h2>
            
            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-6 flex items-center text-sm">
                <AlertCircle size={16} className="text-red-500 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <a href="#" className="text-xs text-red-400 hover:text-red-300">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="btn-primary w-full flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <LogIn size={18} className="mr-2" />
                      Sign In
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm text-slate-400">
              <span>Don't have an account? </span>
              <Link to="/register" className="text-red-400 hover:text-red-300 font-medium">
                Sign up
              </Link>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-slate-800/80 border-t border-slate-700 prison-bars-bg text-center">
            <div className="text-xs text-slate-400">
              <p>Demo credentials:</p>
              <p className="font-mono bg-slate-900/50 px-2 py-1 rounded mt-1 inline-block">
                demo@example.com / password
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center text-xs text-slate-500"
        >
          <p>By signing in, you agree to face the consequences of your procrastination.</p>
          <p className="mt-1">No excuses. No mercy.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;