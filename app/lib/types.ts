// app/types/index.ts
export interface UrgentTask {
  title: string;
  due: string;
  priority: string;
}

export interface Session {
  time: string;
  type: string;
  title: string;
  icon: string;
  focus?: string;
}

export interface Day {
  day: string;
  date: string;
  sessions: Session[];
}

export interface Subject {
  name: string;
  hours: number;
  color: string;
}

export interface StudyPlan {
  urgent: UrgentTask[];
  days: Day[];
  stats: {
    totalHours: number;
    subjects: Subject[];
  };
  tips: string[];
}