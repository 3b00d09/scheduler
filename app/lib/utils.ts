import type { StudyPlan } from './types';

const STORAGE_KEYS = {
  PLAN: 'studyPlan',
  API_KEY: 'apiKey',
  WEEK_KEY: 'weekKey',
} as const;

export const getWeekKey = (): string => {
  const now = new Date();
  const monday = new Date(now);
  const day = now.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  monday.setDate(now.getDate() + diff);
  return `week-${monday.getFullYear()}-${monday.getMonth()}-${monday.getDate()}`;
};

export const checkWeeklyReset = (): boolean => {
  if (typeof window === 'undefined') return false;

  const currentWeek = getWeekKey();
  const savedWeek = localStorage.getItem(STORAGE_KEYS.WEEK_KEY);

  if (savedWeek !== currentWeek) {
    localStorage.setItem(STORAGE_KEYS.WEEK_KEY, currentWeek);
    localStorage.removeItem(STORAGE_KEYS.PLAN);
    return true;
  }
  return false;
};

export const saveApiKey = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.API_KEY, key);
};

export const getApiKey = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
};

export const savePlan = (plan: StudyPlan): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
};

export const getPlan = (): StudyPlan | null => {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEYS.PLAN);
  if (!saved) return null;
  
  try {
    return JSON.parse(saved) as StudyPlan;
  } catch {
    return null;
  }
};

export const clearPlan = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.PLAN);
};

export const exampleText = `My weekly nursing university schedule:

CLASSES:
- Monday: Nursing Fundamentals 9:00-12:00, Anatomy Lab 14:00-17:00
- Tuesday: Pharmacology lecture 10:00-12:00, Clinical Skills 14:00-17:00  
- Wednesday: Pathophysiology 9:00-11:00, Patient Care Workshop 13:00-16:00
- Thursday: FREE DAY (no classes)
- Friday: Community Health 9:00-12:00, then I have a project presentation at 15:00

WORK (Hotel night shifts):
- Friday 22:00 to Saturday 06:00
- Saturday 22:00 to Sunday 06:00

COMMUTE: 
- Train ride is 45 minutes each way
- I leave home around 7:30 AM to arrive by 8:30 AM

URGENT DEADLINES:
- Care plan assignment due Thursday 23:59
- Pharmacology quiz next Tuesday during class
- Clinical reflection report due in 10 days

FINAL EXAMS COMING UP:
- Anatomy: December 15
- Pharmacology: December 18  
- Patient Care: December 20

PERSONAL NOTES:
- I'm completely exhausted after night shifts and need good sleep
- I wake up around 6:00 AM on class days
- I prefer studying in the morning when I'm fresh
- Need time for meals and family
- Thursday is my power day since no classes!`;
export const systemPrompt = `You are an expert study planner that creates comprehensive weekly schedules.

REQUIRED OUTPUT STRUCTURE:
You must provide a complete JSON response with these exact fields:
1. "urgent": Array of urgent tasks (title, due date as string, priority: "high"/"medium"/"low")
2. "days": Array of 7 day objects (Monday-Sunday), each with:
   - "day": Day name (e.g., "Monday")
   - "date": Date string (e.g., "Oct 15")
   - "sessions": Array of time blocks, each with:
     * "time": Time range (e.g., "6:00 AM - 7:00 AM")
     * "type": One of: "class", "study", "work", "rest", "commute", "free"
     * "title": Activity description
     * "icon": Emoji icon
     * "focus": Subject/topic (can be empty string for non-study sessions)
3. "stats": Object with:
   - "totalHours": Total study hours as number
   - "subjects": Array of subjects with name, hours (number), and color (hex)
4. "tips": Array of 3-5 actionable study tips as strings

SCHEDULING RULES:
- Create COMPLETE 24-hour schedules (6:00 AM to 6:00 AM next day)
- Use 30-60 minute time blocks
- Include ALL activities: sleep, meals, commute, classes, work, study, breaks
- Morning: 6:00-7:00 AM wake up/breakfast
- Meals: Breakfast 7-8 AM, Lunch 12-1 PM, Dinner 6-7 PM
- Sleep: 8 hours minimum (usually 10 PM - 6 AM, adjust after night shifts)
- Buffer: 15-30 min before/after fixed commitments

STUDY SESSION DESIGN:
- Max 2-3 hour study blocks with 10-15 min breaks
- High-focus work: 8 AM - 12 PM (use for hardest subjects)
- Medium-focus: 2 PM - 5 PM
- Light review: 7 PM - 9 PM (flashcards, practice problems)
- NO heavy studying after 9 PM or immediately after work shifts
- Include specific topics in "focus" field for study sessions

COMMUTE OPTIMIZATION:
- Type: "commute"
- Suggest passive learning: podcasts, flashcard apps, audio notes
- Keep focus field relevant but acknowledge limited deep work

SUBJECT DISTRIBUTION:
- Calculate total study hours across the week
- Prioritize subjects with nearest deadlines
- Rotate subjects daily to maintain engagement
- Use spaced repetition principles
- Track hours per subject in stats

ENERGY MANAGEMENT:
- Post-shift: Schedule rest/recovery, not study
- After night shifts: 8+ hours sleep before next activity
- Vary session intensity throughout day
- Include adequate rest periods

ICONS:
Use relevant emojis: 📚 study, 🏫 class, 💼 work, 😴 sleep, 🍽️ meals, 🚗 commute, ☕ break, etc.`;