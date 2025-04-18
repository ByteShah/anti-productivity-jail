import React from 'react';
import { Link } from 'react-router-dom';
import { Task, TaskStatus } from '../../types/Task';
import { Clock, CheckCircle, XCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { format, formatDistanceToNow, isAfter, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { id, title, description, deadline, status } = task;

  const deadlineDate = parseISO(deadline);
  const isOverdue = status === TaskStatus.ACTIVE && isAfter(new Date(), deadlineDate);
  const timeRemaining = formatDistanceToNow(deadlineDate, { addSuffix: true });

  let cardClasses = "card p-4 h-full";
  let statusIcon = <Clock size={20} className="text-lime-400" />;
  let statusText = "Active";

  if (status === TaskStatus.COMPLETED) {
    cardClasses += " border-green-700/40 bg-green-900/10";
    statusIcon = <CheckCircle size={20} className="text-green-400" />;
    statusText = "Completed";
  } else if (status === TaskStatus.FAILED) {
    cardClasses += " border-red-700/40 bg-red-900/10";
    statusIcon = <XCircle size={20} className="text-red-400" />;
    statusText = "Failed";
  } else if (isOverdue) {
    cardClasses += " border-red-700/70 bg-red-900/20 animate-pulse-danger";
    statusIcon = <AlertTriangle size={20} className="text-red-400" />;
    statusText = "Overdue";
  } else {
    cardClasses += " border-lime-700/40 bg-lime-900/10";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={cardClasses}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/50 text-xs">
          {statusIcon}
          <span>{statusText}</span>
        </div>
      </div>

      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{description}</p>

      <div className="flex justify-between items-center">
        <div>
          <div className="text-xs text-slate-500">Deadline</div>
          <div className={`text-sm ${isOverdue ? 'text-red-400 font-medium' : 'text-slate-300'}`}>
            {format(deadlineDate, 'MMM d, yyyy h:mm a')}
            {status === TaskStatus.ACTIVE && (
              <div className="text-xs mt-1">
                {timeRemaining}
              </div>
            )}
          </div>
        </div>

        <Link
          to={`/task/${id}`}
          className="flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          Details
          <ChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default TaskCard;