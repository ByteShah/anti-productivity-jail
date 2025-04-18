import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskStatus } from '../types/Task';

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
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'status' | 'createdAt'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      status: TaskStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      ...taskData,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...taskData } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const getTask = (id: string) => {
    return tasks.find((task) => task.id === id);
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