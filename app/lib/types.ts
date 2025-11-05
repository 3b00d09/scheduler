export interface Task {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  details: string;
  isUrgent: boolean;
  isRecurring: boolean;
  weekOffset?: number;
  category?: string;
}

export interface TaskStatus {
  taskId: string;
  date: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  failureNote?: string;
}

export interface Schedule {
  [key: string]: Task[];
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
}
