import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Twitter, CreditCard, Wifi, Save, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const { user } = useAuthContext();
  
  const [socialSettings, setSocialSettings] = useState({
    twitterConnected: false,
    facebookConnected: false,
    linkedinConnected: false,
  });

  const [financialSettings, setFinancialSettings] = useState({
    paypalConnected: false,
    stripeConnected: false,
    maxAmount: 10,
  });

  const [techSettings, setTechSettings] = useState({
    wifiConnected: false,
    deviceName: '',
    maxDuration: 30,
  });

  const [aiSettings, setAiSettings] = useState({
    cameraAccess: false,
    micAccess: false,
    notificationEmail: user?.email || '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    taskReminders: true,
    consequenceWarnings: true,
  });

  const handleSocialToggle = (platform: keyof typeof socialSettings) => {
    setSocialSettings(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const handleFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFinancialSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTechChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setTechSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setAiSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a backend
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <SettingsIcon size={28} className="text-slate-400 mr-2" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="mb-6 bg-amber-900/20 border border-amber-800/50 rounded-lg p-4 flex items-start">
        <AlertTriangle size={24} className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-amber-400">Demo Mode</h3>
          <p className="text-slate-300">Settings are for demonstration purposes only. No actual connections will be made.</p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings}>
        <div className="space-y-6">
          {/* Social Media Connections */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Twitter size={20} className="mr-2 text-blue-400" />
              Social Media Connections
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Twitter</h3>
                  <p className="text-sm text-slate-400">Connect to post failure messages</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleSocialToggle('twitterConnected')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    socialSettings.twitterConnected 
                      ? 'bg-red-600 text-white' 
                      : 'border border-slate-600 text-slate-300'
                  }`}
                >
                  {socialSettings.twitterConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Facebook</h3>
                  <p className="text-sm text-slate-400">Connect to post failure messages</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleSocialToggle('facebookConnected')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    socialSettings.facebookConnected 
                      ? 'bg-red-600 text-white' 
                      : 'border border-slate-600 text-slate-300'
                  }`}
                >
                  {socialSettings.facebookConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">LinkedIn</h3>
                  <p className="text-sm text-slate-400">Connect to post failure messages</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleSocialToggle('linkedinConnected')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    socialSettings.linkedinConnected 
                      ? 'bg-red-600 text-white' 
                      : 'border border-slate-600 text-slate-300'
                  }`}
                >
                  {socialSettings.linkedinConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Financial Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard size={20} className="mr-2 text-green-400" />
              Financial Consequences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">PayPal</h3>
                  <p className="text-sm text-slate-400">Connect to enable automatic donations</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFinancialSettings(prev => ({
                    ...prev,
                    paypalConnected: !prev.paypalConnected
                  }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    financialSettings.paypalConnected 
                      ? 'bg-red-600 text-white' 
                      : 'border border-slate-600 text-slate-300'
                  }`}
                >
                  {financialSettings.paypalConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Stripe</h3>
                  <p className="text-sm text-slate-400">Connect to enable automatic donations</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFinancialSettings(prev => ({
                    ...prev,
                    stripeConnected: !prev.stripeConnected
                  }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    financialSettings.stripeConnected 
                      ? 'bg-red-600 text-white' 
                      : 'border border-slate-600 text-slate-300'
                  }`}
                >
                  {financialSettings.stripeConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
              
              <div>
                <label htmlFor="maxAmount" className="block text-sm font-medium text-slate-300 mb-1">
                  Maximum Donation Amount ($)
                </label>
                <input
                  type="number"
                  id="maxAmount"
                  name="maxAmount"
                  value={financialSettings.maxAmount}
                  onChange={handleFinancialChange}
                  min="1"
                  max="100"
                  className="input"
                />
                <p className="text-xs text-slate-500 mt-1">Maximum amount that can be automatically donated when you fail a task</p>
              </div>
            </div>
          </motion.div>

          {/* Tech Control Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Wifi size={20} className="mr-2 text-purple-400" />
              Tech Control Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">WiFi Control</h3>
                  <p className="text-sm text-slate-400">Connect smart plug to control your WiFi</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setTechSettings(prev => ({
                    ...prev,
                    wifiConnected: !prev.wifiConnected
                  }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    techSettings.wifiConnected 
                      ? 'bg-red-600 text-white' 
                      : 'border border-slate-600 text-slate-300'
                  }`}
                >
                  {techSettings.wifiConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
              
              <div>
                <label htmlFor="deviceName" className="block text-sm font-medium text-slate-300 mb-1">
                  Device Name
                </label>
                <input
                  type="text"
                  id="deviceName"
                  name="deviceName"
                  value={techSettings.deviceName}
                  onChange={handleTechChange}
                  className="input"
                  placeholder="e.g., Living Room WiFi"
                />
              </div>
              
              <div>
                <label htmlFor="maxDuration" className="block text-sm font-medium text-slate-300 mb-1">
                  Maximum Shutdown Duration (minutes)
                </label>
                <input
                  type="number"
                  id="maxDuration"
                  name="maxDuration"
                  value={techSettings.maxDuration}
                  onChange={handleTechChange}
                  min="5"
                  max="120"
                  className="input"
                />
                <p className="text-xs text-slate-500 mt-1">Maximum time your devices can be disabled when you fail a task</p>
              </div>
            </div>
          </motion.div>

          {/* AI Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2 text-xl">🤖</span>
              AI Shame Guard Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Camera Access</h3>
                  <p className="text-sm text-slate-400">Allow camera to detect off-task activities</p>
                </div>
                <div 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    aiSettings.cameraAccess ? 'bg-red-600' : 'bg-slate-700'
                  }`}
                  onClick={() => setAiSettings(prev => ({
                    ...prev,
                    cameraAccess: !prev.cameraAccess
                  }))}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      aiSettings.cameraAccess ? 'translate-x-6' : 'translate-x-1'
                    }`} 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Microphone Access</h3>
                  <p className="text-sm text-slate-400">Allow mic to detect distracting sounds/music</p>
                </div>
                <div 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    aiSettings.micAccess ? 'bg-red-600' : 'bg-slate-700'
                  }`}
                  onClick={() => setAiSettings(prev => ({
                    ...prev,
                    micAccess: !prev.micAccess
                  }))}
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      aiSettings.micAccess ? 'translate-x-6' : 'translate-x-1'
                    }`} 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="notificationEmail" className="block text-sm font-medium text-slate-300 mb-1">
                  Accountability Contact Email
                </label>
                <input
                  type="email"
                  id="notificationEmail"
                  name="notificationEmail"
                  value={aiSettings.notificationEmail}
                  onChange={handleAIChange}
                  className="input"
                  placeholder="friend@example.com"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Who should be notified when you're caught slacking off?
                </p>
              </div>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email"
                  name="email"
                  checked={notifications.email}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 rounded border-slate-600 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="email" className="ml-2 block text-sm text-slate-300">
                  Email notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="browser"
                  name="browser"
                  checked={notifications.browser}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 rounded border-slate-600 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="browser" className="ml-2 block text-sm text-slate-300">
                  Browser notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="taskReminders"
                  name="taskReminders"
                  checked={notifications.taskReminders}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 rounded border-slate-600 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="taskReminders" className="ml-2 block text-sm text-slate-300">
                  Task deadline reminders
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="consequenceWarnings"
                  name="consequenceWarnings"
                  checked={notifications.consequenceWarnings}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 rounded border-slate-600 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="consequenceWarnings" className="ml-2 block text-sm text-slate-300">
                  Consequence warning alerts
                </label>
              </div>
            </div>
          </motion.div>
          
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              <Save size={18} className="mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;