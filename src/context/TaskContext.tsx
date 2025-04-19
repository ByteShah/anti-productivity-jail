import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskStatus } from '../types/Task';
import axios from 'axios';
import { useAuthContext } from './AuthContext';

interface TaskContextProps {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'status' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  failTask: (id: string) => void;
  completeTask: (id: string) => void;
  activeTasks: Task[];
  completedTasks: Task[];
  failedTasks: Task[];
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const apiUrl = 'http://localhost:3001/api/tasks';
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }
      const response = await axios.get<Task[]>(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched tasks:', response.data);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'status' | 'createdAt'>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, cannot add task');
        return;
      }

      const response = await axios.post<Task>(apiUrl, 
        { ...taskData, status: TaskStatus.ACTIVE },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      const task = tasks.find((task) => task.id === id);
      if (!task) {
        console.error('Task not found');
        return;
      }
      const response = await axios.put<Task>(`${apiUrl}/${id}`, { ...task, ...taskData });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? response.data : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getTask = (id: string) => {
    const task = tasks.find((task) => task.id === id);
    console.log('Getting task:', id, task);
    return task;
  };

  const failTask = (id: string) => {
    updateTask(id, { status: TaskStatus.FAILED });
  };

  const completeTask = (id: string) => {
    updateTask(id, { status: TaskStatus.COMPLETED });
  };

  const activeTasks = tasks.filter((task) => task.status === TaskStatus.ACTIVE);
  const completedTasks = tasks.filter((task) => task.status === TaskStatus.COMPLETED);
  const failedTasks = tasks.filter((task) => task.status === TaskStatus.FAILED);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTask,
        failTask,
        completeTask,
        activeTasks,
        completedTasks,
        failedTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
