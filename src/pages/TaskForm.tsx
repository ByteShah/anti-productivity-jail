import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { useConsequenceContext } from '../context/ConsequenceContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';

const TaskForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addTask, updateTask, getTask } = useTaskContext();
  const { consequences } = useConsequenceContext();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: format(new Date(Date.now() + 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
    durationHours: 1,
    durationMinutes: 0,
    consequence: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      const task = getTask(id);
      if (task) {
        setFormData({
          title: task.title,
          description: task.description,
          deadline: format(new Date(task.deadline), "yyyy-MM-dd'T'HH:mm"),
          durationHours: task.duration?.hours || 1,
          durationMinutes: task.duration?.minutes || 0,
          consequence: task.consequence || '',
        });
      } else {
        navigate('/');
      }
    }
  }, [id, getTask, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (new Date(formData.deadline) < new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    if (formData.durationHours < 0) {
      newErrors.durationHours = 'Hours cannot be negative';
    }

    if (formData.durationMinutes < 0 || formData.durationMinutes > 59) {
      newErrors.durationMinutes = 'Minutes must be between 0 and 59';
    }

    if (formData.durationHours === 0 && formData.durationMinutes === 0) {
      newErrors.durationHours = 'Duration must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'durationHours' || name === 'durationMinutes'
        ? parseInt(value, 10) || 0
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const taskData = {
      title: formData.title,
      description: formData.description,
      deadline: new Date(formData.deadline).toISOString(),
      duration: {
        hours: formData.durationHours,
        minutes: formData.durationMinutes,
      },
      consequence: formData.consequence || undefined,
    };

    if (isEditing) {
      updateTask(id, taskData);
    } else {
      addTask(taskData);
    }

    navigate('/');
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold mt-2">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card p-6 bg-slate-800/80"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="E.g., Finish project proposal"
            />
            {errors.title && (
              <p className="mt-1 text-red-400 text-sm">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="input"
              placeholder="Describe what you need to accomplish..."
            />
            {errors.description && (
              <p className="mt-1 text-red-400 text-sm">{errors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-slate-300 mb-1">
              Deadline
            </label>
            <input
              type="datetime-local"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="input"
            />
            {errors.deadline && (
              <p className="mt-1 text-red-400 text-sm">{errors.deadline}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Estimated Duration
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    id="durationHours"
                    name="durationHours"
                    value={formData.durationHours}
                    onChange={handleChange}
                    min={0}
                    className="input"
                    placeholder="Hours"
                  />
                  <label htmlFor="durationHours" className="text-xs text-slate-500 mt-1 block">
                    Hours
                  </label>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    id="durationMinutes"
                    name="durationMinutes"
                    value={formData.durationMinutes}
                    onChange={handleChange}
                    min={0}
                    max={59}
                    className="input"
                    placeholder="Minutes"
                  />
                  <label htmlFor="durationMinutes" className="text-xs text-slate-500 mt-1 block">
                    Minutes
                  </label>
                </div>
              </div>
              {(errors.durationHours || errors.durationMinutes) && (
                <p className="mt-1 text-red-400 text-sm">
                  {errors.durationHours || errors.durationMinutes}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="consequence" className="block text-sm font-medium text-slate-300 mb-1">
                Select Consequence
              </label>
              <select
                id="consequence"
                name="consequence"
                value={formData.consequence}
                onChange={handleChange}
                className="input"
              >
                <option value="">Random Consequence</option>
                {consequences.filter(c => c.enabled).map((consequence) => (
                  <option key={consequence.id} value={consequence.id}>
                    {consequence.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                {formData.consequence
                  ? "Specific consequence if you fail"
                  : "System will choose a random consequence if you fail"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-outline mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
            >
              <Save size={16} className="mr-2" />
              {isEditing ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskForm;
