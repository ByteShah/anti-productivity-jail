export enum TaskStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface TaskTime {
  hours: number;
  minutes: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  duration: TaskTime;
  status: TaskStatus;
  createdAt: string; // ISO date string
  completedAt?: string; // ISO date string
  failedAt?: string; // ISO date string
  consequence?: string; // ID of the consequence that will trigger if failed
}