// app/schemas/studyPlan.ts
import { z } from 'zod';

export const UrgentTaskSchema = z.object({
  title: z.string(),
  due: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
});

export const SessionSchema = z.object({
  time: z.string(),
  type: z.string(),
  title: z.string(),
  icon: z.string(),
  focus: z.string().default(''),
});

export const DaySchema = z.object({
  day: z.string(),
  date: z.string(),
  sessions: z.array(SessionSchema),
});

export const SubjectSchema = z.object({
  name: z.string(),
  hours: z.number(),
  color: z.string(),
});

export const StudyPlanSchema = z.object({
  urgent: z.array(UrgentTaskSchema),
  days: z.array(DaySchema),
  stats: z.object({
    totalHours: z.number(),
    subjects: z.array(SubjectSchema),
  }),
  tips: z.array(z.string()),
});

// Export types
export type StudyPlan = z.infer<typeof StudyPlanSchema>;
export type UrgentTask = z.infer<typeof UrgentTaskSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type Day = z.infer<typeof DaySchema>;
export type Subject = z.infer<typeof SubjectSchema>;