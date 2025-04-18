import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlarmClock, UserPlus, AlertCircle, Check } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuthContext();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      // Simple password strength estimation
      let score = 0;
      let message = '';
      
      if (value.length > 8) score += 1;
      if (/[A-Z]/.test(value)) score += 1;
      if (/[0-9]/.test(value)) score += 1;
      if (/[^A-Za-z0-9]/.test(value)) score += 1;
      
      if (score === 0) message = 'Very weak';
      else if (score === 1) message = 'Weak';
      else if (score === 2) message = 'Moderate';
      else if (score === 3) message = 'Strong';
      else message = 'Very strong';
      
      setPasswordStrength({ score, message });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0: return 'bg-red-600';
      case 1: return 'bg-orange-600';
      case 2: return 'bg-yellow-600';
      case 3: return 'bg-lime-600';
      case 4: return 'bg-green-600';
      default: return 'bg-slate-600';
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
          <p className="text-slate-400 mt-2">Create an account to start your productivity journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Create your account</h2>
            
            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-6 flex items-center text-sm">
                <AlertCircle size={16} className="text-red-500 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="••••••••"
                  required
                />
                
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-1 flex-1 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStrengthColor()}`} 
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs ml-2 min-w-16 text-right">
                        {passwordStrength.message}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center text-xs text-slate-400">
                        <span className={formData.password.length >= 8 ? "text-green-500" : "text-slate-600"}>
                          {formData.password.length >= 8 ? <Check size={12} /> : "•"}
                        </span>
                        <span className="ml-1">8+ characters</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-400">
                        <span className={/[A-Z]/.test(formData.password) ? "text-green-500" : "text-slate-600"}>
                          {/[A-Z]/.test(formData.password) ? <Check size={12} /> : "•"}
                        </span>
                        <span className="ml-1">Uppercase letter</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-400">
                        <span className={/[0-9]/.test(formData.password) ? "text-green-500" : "text-slate-600"}>
                          {/[0-9]/.test(formData.password) ? <Check size={12} /> : "•"}
                        </span>
                        <span className="ml-1">Number</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-400">
                        <span className={/[^A-Za-z0-9]/.test(formData.password) ? "text-green-500" : "text-slate-600"}>
                          {/[^A-Za-z0-9]/.test(formData.password) ? <Check size={12} /> : "•"}
                        </span>
                        <span className="ml-1">Special character</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  placeholder="••••••••"
                  required
                />
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">Passwords don't match</p>
                )}
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-primary w-full flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <UserPlus size={18} className="mr-2" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm text-slate-400">
              <span>Already have an account? </span>
              <Link to="/login" className="text-red-400 hover:text-red-300 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-center text-xs text-slate-500"
        >
          <p>By creating an account, you commit to facing the consequences of your procrastination.</p>
          <p className="mt-1">Welcome to productivity hell.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;