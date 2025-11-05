import { Schedule, TaskStatus } from "./types";
import { STORAGE_KEYS } from "./constants";

export const loadSchedule = (): Schedule => {
  if (typeof window === "undefined") return {};

  const stored = localStorage.getItem(STORAGE_KEYS.schedule);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to load schedule:", e);
      return {};
    }
  }
  return {};
};

export const saveSchedule = (schedule: Schedule): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.schedule, JSON.stringify(schedule));
  } catch (e) {
    console.error("Failed to save schedule:", e);
  }
};

export const loadTaskStatuses = (): { [key: string]: TaskStatus } => {
  if (typeof window === "undefined") return {};

  const stored = localStorage.getItem(STORAGE_KEYS.taskStatuses);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to load task statuses:", e);
      return {};
    }
  }
  return {};
};

export const saveTaskStatuses = (taskStatuses: {
  [key: string]: TaskStatus;
}): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      STORAGE_KEYS.taskStatuses,
      JSON.stringify(taskStatuses)
    );
  } catch (e) {
    console.error("Failed to save task statuses:", e);
  }
};
