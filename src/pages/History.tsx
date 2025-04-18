import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { useConsequenceContext } from '../context/ConsequenceContext';
import { format, parseISO } from 'date-fns';
import { Clock, CheckCircle, XCircle, Skull } from 'lucide-react';

const History = () => {
  const { completedTasks, failedTasks } = useTaskContext();
  const { executedConsequences } = useConsequenceContext();

  // Sort tasks by completion/failure date
  const sortedCompleted = [...completedTasks].sort((a, b) => {
    return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
  });

  const sortedFailed = [...failedTasks].sort((a, b) => {
    return new Date(b.failedAt || 0).getTime() - new Date(a.failedAt || 0).getTime();
  });

  // Combine all events for timeline
  const timelineEvents = [
    ...sortedCompleted.map(task => ({
      type: 'completed',
      date: task.completedAt || task.createdAt,
      task,
    })),
    ...sortedFailed.map(task => ({
      type: 'failed',
      date: task.failedAt || task.createdAt,
      task,
    })),
    ...executedConsequences.map(consequence => ({
      type: 'consequence',
      date: consequence.executedAt || '',
      consequence,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'completed': return <CheckCircle size={20} className="text-green-400" />;
      case 'failed': return <XCircle size={20} className="text-red-400" />;
      case 'consequence': return <Skull size={20} className="text-red-500" />;
      default: return <Clock size={20} className="text-slate-400" />;
    }
  };

  const getEventTitle = (event: any) => {
    switch (event.type) {
      case 'completed': return `Completed: ${event.task.title}`;
      case 'failed': return `Failed: ${event.task.title}`;
      case 'consequence': return `Consequence: ${event.consequence.name}`;
      default: return 'Unknown event';
    }
  };

  const getEventDescription = (event: any) => {
    switch (event.type) {
      case 'completed': return event.task.description;
      case 'failed': return event.task.description;
      case 'consequence': return event.consequence.description;
      default: return '';
    }
  };

  const getEventClass = (type: string) => {
    switch (type) {
      case 'completed': return 'border-green-700 bg-green-900/10';
      case 'failed': return 'border-red-700 bg-red-900/10';
      case 'consequence': return 'border-red-800 bg-red-900/20';
      default: return 'border-slate-700 bg-slate-800';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">History & Timeline</h1>

      {timelineEvents.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-400">No activity has been recorded yet. Complete or fail some tasks to see your history.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-700 pl-6 ml-3 space-y-6">
          {timelineEvents.map((event, idx) => (
            <div key={idx} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full border-2 border-slate-700 bg-slate-900 flex items-center justify-center">
                {getEventIcon(event.type)}
              </div>
              
              {/* Event card */}
              <div className={`card p-4 border ${getEventClass(event.type)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{getEventTitle(event)}</h3>
                    <p className="text-sm text-slate-400">{getEventDescription(event)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      event.type === 'completed' ? 'bg-green-900/40 text-green-400' : 
                      event.type === 'failed' ? 'bg-red-900/40 text-red-400' : 
                      'bg-red-900/60 text-red-300'
                    }`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {format(parseISO(event.date), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
                
                {event.type === 'consequence' && (
                  <div className="mt-2 text-xs text-red-400 italic">
                    Consequence executed as a result of task failure
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;