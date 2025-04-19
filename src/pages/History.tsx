import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Clock, CheckCircle, XCircle, Skull } from 'lucide-react';
import axios from 'axios';
import { TaskStatus } from '../types/Task';
import { useConsequenceContext } from '../context/ConsequenceContext';
import { Consequence } from '../types/Consequence';


// Define a Task interface matching what your API returns
interface Task {
  id: string;
  title: string;
  description: string;
  created_at: string;
  completedAt?: string;
  failedAt?: string;
  status: string; 
}

// Define a Consequence interface matching your context
// interface Consequence {
//   id: string;
//   name: string;
//   description: string;
//   executedAt: string;
// }

// Union type for timeline events
type TimelineEvent =
  | { type: TaskStatus.COMPLETED; date: string; task: Task }
  | { type: TaskStatus.FAILED;    date: string; task: Task }
  | { type: 'consequence';        date: string; consequence: Consequence };

const History: React.FC = () => {
  const { executedConsequences } = useConsequenceContext();
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, cannot fetch history');
        return;
      }

      try {
        const { data: tasks }: { data: Task[] } = await axios.get(
          'http://localhost:3001/api/tasks',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Split tasks by status
        const completedTasks = tasks.filter(
          (t) => t.status.toLowerCase() === TaskStatus.COMPLETED
        );
        const failedTasks = tasks.filter(
          (t) => t.status.toLowerCase() === TaskStatus.FAILED
        );

        // Build unified event list
        const events: TimelineEvent[] = [
          // Completed tasks
          ...completedTasks.map((task): TimelineEvent => ({
            type: TaskStatus.COMPLETED,
            date: task.completedAt ?? task.created_at,
            task,
          })),

          // Failed tasks
          ...failedTasks.map((task): TimelineEvent => ({
            type: TaskStatus.FAILED,
            date: task.failedAt ?? task.created_at,
            task,
          })),

          // Consequences — filter out any without executedAt
          ...executedConsequences
            .filter((c): c is Consequence & { executedAt: string } => Boolean(c.executedAt))
            .map((c): TimelineEvent => ({
              type: 'consequence',
              date: c.executedAt,
              consequence: c,
            })),
        ]
        // Sort descending by date
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTimelineEvents(events);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    fetchHistory();
  }, [executedConsequences]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case TaskStatus.COMPLETED:
        return <CheckCircle size={20} className="text-green-400" />;
      case TaskStatus.FAILED:
        return <XCircle size={20} className="text-red-400" />;
      case 'consequence':
        return <Skull size={20} className="text-red-500" />;
      default:
        return <Clock size={20} className="text-slate-400" />;
    }
  };

  const getEventTitle = (event: TimelineEvent) => {
    if (event.type === TaskStatus.COMPLETED)
      return `Completed: ${event.task.title}`;
    if (event.type === TaskStatus.FAILED)
      return `Failed: ${event.task.title}`;
    return `Consequence: ${event.consequence.name}`;
  };

  const getEventDescription = (event: TimelineEvent) => {
    if (event.type === TaskStatus.COMPLETED || event.type === TaskStatus.FAILED)
      return event.task.description;
    return event.consequence.description;
  };

  const getEventClass = (type: string) => {
    switch (type) {
      case TaskStatus.COMPLETED:
        return 'border-green-700 bg-green-900/10';
      case TaskStatus.FAILED:
        return 'border-red-700 bg-red-900/10';
      case 'consequence':
        return 'border-red-800 bg-red-900/20';
      default:
        return 'border-slate-700 bg-slate-800';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">History & Timeline</h1>

      {timelineEvents.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-400">
            No activity has been recorded yet. Complete or fail some tasks to
            see your history.
          </p>
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
                    <p className="text-sm text-slate-400">
                      {getEventDescription(event)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        event.type === TaskStatus.COMPLETED
                          ? 'bg-green-900/40 text-green-400'
                          : event.type === TaskStatus.FAILED
                          ? 'bg-red-900/40 text-red-400'
                          : 'bg-red-900/60 text-red-300'
                      }`}
                    >
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