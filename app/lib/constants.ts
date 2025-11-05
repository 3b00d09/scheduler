import { Category } from "./types";

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const FULL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const CATEGORIES: Category[] = [
  { id: "work", label: "Work", emoji: "💼" },
  { id: "study", label: "Study", emoji: "📚" },
  { id: "workout", label: "Workout", emoji: "💪" },
  { id: "eat", label: "Eat", emoji: "🍽️" },
  { id: "sleep", label: "Sleep", emoji: "😴" },
  { id: "commute", label: "Commute", emoji: "🚗" },
  { id: "social", label: "Social", emoji: "👥" },
  { id: "hobby", label: "Hobby", emoji: "🎨" },
  { id: "chores", label: "Chores", emoji: "🧹" },
  { id: "health", label: "Health", emoji: "🏥" },
  { id: "other", label: "Other", emoji: "📌" },
];

export const COLORS = {
  text: "#e9e7ec",
  background: "#17092b",
  primary: "#afa0c9",
  secondary: "#36117a",
  accent: "#1c0b3a",
} as const;

export const STORAGE_KEYS = {
  schedule: "weeklySchedule",
  taskStatuses: "taskStatuses",
} as const;
