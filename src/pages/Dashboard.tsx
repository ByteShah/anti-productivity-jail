import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { useConsequenceContext } from '../context/ConsequenceContext';
import { Link } from 'react-router-dom';
import { Clock, AlertTriangle, CheckCircle, Skull, ChevronRight } from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import TaskCard from '../components/tasks/TaskCard';

const Dashboard = () => {
  const { activeTasks, completedTasks, failedTasks } = useTaskContext();
  const { executedConsequences } = useConsequenceContext();
  const [activeTab, setActiveTab] = useState('active');

  const overdueTask = activeTasks.find(task => 
    isAfter(new Date(), parseISO(task.deadline))
  );

  const motivationalQuotes = [
    "Failure is not an option... it's a guarantee if you don't focus.",
    "Your future self is watching. Don't disappoint them.",
    "The consequence of procrastination is worse than the pain of discipline.",
    "Focus now or face the music later.",
    "No one ever regretted being productive."
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/task" className="btn-primary flex items-center">
          <PlusCircle size={18} className="mr-2" />
          New Task
        </Link>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ y: -5 }} 
          className="card bg-slate-800/80 p-4"
        >
          <div className="flex items-center text-lime-400 mb-2">
            <Clock size={20} className="mr-2" />
            <h3 className="font-semibold">Active Tasks</h3>
          </div>
          <p className="text-3xl font-bold">{activeTasks.length}</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }} 
          className="card bg-slate-800/80 p-4"
        >
          <div className="flex items-center text-green-400 mb-2">
            <CheckCircle size={20} className="mr-2" />
            <h3 className="font-semibold">Completed</h3>
          </div>
          <p className="text-3xl font-bold">{completedTasks.length}</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }} 
          className="card bg-slate-800/80 p-4"
        >
          <div className="flex items-center text-red-400 mb-2">
            <Skull size={20} className="mr-2" />
            <h3 className="font-semibold">Failed & Punished</h3>
          </div>
          <p className="text-3xl font-bold">{failedTasks.length}</p>
        </motion.div>
      </div>

      {/* Warning banner if tasks are overdue */}
      {overdueTask && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex items-start"
        >
          <AlertTriangle size={24} className="text-red-500 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-400">Task Overdue - Consequence Imminent!</h3>
            <p className="text-slate-300">"{overdueTask.title}" is past its deadline. Complete it now or face the consequences!</p>
            <Link 
              to={`/task/${overdueTask.id}`} 
              className="inline-flex items-center mt-2 text-red-400 hover:text-red-300"
            >
              Take action now
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Motivational quote */}
      <div className="border-l-4 border-jail-orange-500 pl-4 py-2 bg-jail-orange-950/30 rounded-r-lg">
        <p className="text-jail-orange-300 italic font-medium">{randomQuote}</p>
      </div>

      {/* Task tabs */}
      <div className="border-b border-slate-700">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-2 font-medium border-b-2 -mb-px ${
              activeTab === 'active' 
                ? 'border-lime-500 text-lime-400' 
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2 font-medium border-b-2 -mb-px ${
              activeTab === 'completed' 
                ? 'border-green-500 text-green-400' 
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('failed')}
            className={`py-2 font-medium border-b-2 -mb-px ${
              activeTab === 'failed' 
                ? 'border-red-500 text-red-400' 
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {/* Task lists */}
      <div className="space-y-4">
        {activeTab === 'active' && (
          <>
            {activeTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400">No active tasks. Ready to challenge yourself?</p>
                <Link to="/task" className="btn-primary mt-4 inline-flex">
                  Create your first task
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {completedTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400">No completed tasks yet. Complete a task to see it here!</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'failed' && (
          <>
            {failedTasks.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-400">Failed Tasks and Their Consequences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {failedTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400">No failed tasks. Keep up the good work!</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Recent consequences */}
      {executedConsequences.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-red-400">Recent Consequences</h2>
          <div className="grid grid-cols-1 gap-3">
            {executedConsequences.slice(0, 3).map(consequence => (
              <div key={consequence.id + consequence.executedAt} className="card p-4 bg-red-900/20 border border-red-900/50">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{consequence.name}</h3>
                    <p className="text-sm text-slate-400">{consequence.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="badge-error">Executed</span>
                    <p className="text-xs text-slate-500 mt-1">
                      {consequence.executedAt && format(parseISO(consequence.executedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Import outside of component to avoid potential missing dependency
import { PlusCircle } from 'lucide-react';

export default Dashboard;