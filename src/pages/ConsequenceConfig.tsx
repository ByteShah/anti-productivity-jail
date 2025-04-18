import React, { useState } from 'react';
import { useConsequenceContext } from '../context/ConsequenceContext';
import { ConsequenceType } from '../types/Consequence';
import { motion } from 'framer-motion';
import { Skull, AlertTriangle, PlusCircle, Trash2, Edit } from 'lucide-react';

const ConsequenceConfig = () => {
  const { consequences, addConsequence, updateConsequence, deleteConsequence } = useConsequenceContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: ConsequenceType.SOCIAL,
    name: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high',
    enabled: true,
    config: {} as Record<string, string>,
  });

  const resetForm = () => {
    setFormData({
      type: ConsequenceType.SOCIAL,
      name: '',
      description: '',
      severity: 'medium',
      enabled: true,
      config: {},
    });
    setEditingId(null);
  };

  const handleOpenForm = (id?: string) => {
    if (id) {
      const consequence = consequences.find(c => c.id === id);
      if (consequence) {
        setFormData({
          type: consequence.type,
          name: consequence.name,
          description: consequence.description,
          severity: consequence.severity,
          enabled: consequence.enabled,
          config: { ...consequence.config },
        });
        setEditingId(id);
      }
    } else {
      resetForm();
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateConsequence(editingId, formData);
    } else {
      addConsequence(formData);
    }
    
    handleCloseForm();
  };

  const renderConfigFields = () => {
    switch (formData.type) {
      case ConsequenceType.SOCIAL:
        return (
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
              Message to Post
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.config.message || ''}
              onChange={handleConfigChange}
              className="input"
              placeholder="I failed to complete my task. #productivity #shame"
              rows={2}
            />
          </div>
        );
      
      case ConsequenceType.FINANCIAL:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-1">
                Amount to Donate ($)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.config.amount || ''}
                onChange={handleConfigChange}
                className="input"
                placeholder="10"
                min="1"
              />
            </div>
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-slate-300 mb-1">
                Recipient
              </label>
              <input
                type="text"
                id="recipient"
                name="recipient"
                value={formData.config.recipient || ''}
                onChange={handleConfigChange}
                className="input"
                placeholder="Charity name"
              />
            </div>
          </div>
        );
      
      case ConsequenceType.TECH:
        return (
          <div>
            <label htmlFor="deviceName" className="block text-sm font-medium text-slate-300 mb-1">
              Device Name
            </label>
            <input
              type="text"
              id="deviceName"
              name="deviceName"
              value={formData.config.deviceName || ''}
              onChange={handleConfigChange}
              className="input"
              placeholder="WiFi Router"
            />
            
            <label htmlFor="duration" className="block text-sm font-medium text-slate-300 mt-4 mb-1">
              Shutdown Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.config.duration || ''}
              onChange={handleConfigChange}
              className="input"
              placeholder="30"
              min="5"
            />
          </div>
        );
      
      case ConsequenceType.AI:
        return (
          <div>
            <label htmlFor="alertMessage" className="block text-sm font-medium text-slate-300 mb-1">
              Alert Message
            </label>
            <input
              type="text"
              id="alertMessage"
              name="alertMessage"
              value={formData.config.alertMessage || ''}
              onChange={handleConfigChange}
              className="input"
              placeholder="Alert: Task failure detected!"
            />
            
            <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-300 mt-4 mb-1">
              Accountability Contact (email)
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.config.contactEmail || ''}
              onChange={handleConfigChange}
              className="input"
              placeholder="friend@example.com"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-amber-900/40 text-amber-400';
      case 'medium': return 'bg-orange-900/40 text-orange-400';
      case 'high': return 'bg-red-900/40 text-red-400';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const getTypeIcon = (type: ConsequenceType) => {
    switch (type) {
      case ConsequenceType.SOCIAL: return '🤦‍♂️';
      case ConsequenceType.FINANCIAL: return '💸';
      case ConsequenceType.TECH: return '🔌';
      case ConsequenceType.AI: return '🤖';
      default: return '❓';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Skull size={28} className="text-red-500 mr-2" />
          Consequences
        </h1>
        <button 
          onClick={() => handleOpenForm()} 
          className="btn-primary"
        >
          <PlusCircle size={18} className="mr-2" />
          New Consequence
        </button>
      </div>

      <div className="mb-6 bg-red-900/20 border border-red-800/50 rounded-lg p-4 flex items-start">
        <AlertTriangle size={24} className="text-red-500 mr-3 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-red-400">Consequences Make You Productive</h3>
          <p className="text-slate-300">Configure consequences that are painful enough to motivate you but safe enough to execute. All consequences are simulated for this demo.</p>
        </div>
      </div>

      {consequences.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-400 mb-4">No consequences configured yet. Create your first consequence to get started.</p>
          <button 
            onClick={() => handleOpenForm()} 
            className="btn-primary"
          >
            <PlusCircle size={18} className="mr-2" />
            Create Consequence
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {consequences.map((consequence) => (
            <motion.div 
              key={consequence.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className={`card p-4 ${consequence.enabled ? '' : 'opacity-60'}`}
            >
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getTypeIcon(consequence.type)}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{consequence.name}</h3>
                    <p className="text-sm text-slate-400">{consequence.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(consequence.severity)}`}>
                    {consequence.severity}
                  </span>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleOpenForm(consequence.id)}
                      className="p-1.5 text-slate-400 hover:text-white"
                      aria-label="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteConsequence(consequence.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center">
                  <span className="text-xs text-slate-500 mr-2">Enabled:</span>
                  <div 
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      consequence.enabled ? 'bg-green-600' : 'bg-slate-700'
                    }`}
                    onClick={() => updateConsequence(consequence.id, { enabled: !consequence.enabled })}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        consequence.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`} 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl w-full max-w-lg"
          >
            <div className="p-5 border-b border-slate-700">
              <h2 className="text-xl font-bold">
                {editingId ? 'Edit Consequence' : 'Create New Consequence'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-1">
                  Consequence Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input"
                >
                  <option value={ConsequenceType.SOCIAL}>Social Media Shame</option>
                  <option value={ConsequenceType.FINANCIAL}>Financial Penalty</option>
                  <option value={ConsequenceType.TECH}>Tech Shutdown</option>
                  <option value={ConsequenceType.AI}>AI Shame Guard</option>
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="E.g., Tweet My Failure"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input"
                  placeholder="Describe what this consequence does..."
                  rows={2}
                  required
                />
              </div>

              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-slate-300 mb-1">
                  Severity
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Configuration</h3>
                {renderConfigFields()}
              </div>

              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="enabled"
                  name="enabled"
                  checked={formData.enabled}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-600 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="enabled" className="ml-2 block text-sm text-slate-300">
                  Enable this consequence
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="btn border border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ConsequenceConfig;