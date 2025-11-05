"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Task, TaskStatus, Schedule, Category } from "@/app/lib/types";
import {
  Check,
  X,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Save,
  Zap,
} from "lucide-react";

import {
  DAYS,
  FULL_DAYS,
} from "@/app/lib/constants";

import {
  getWeekDates,
  formatDate,
  getDateKey,
  getWeekRange,
  getCurrentTime,
  timeToMinutes,
  isTaskActive,
  isTaskUpcoming,
  formatTimeRemaining,
} from "@/app/lib/utils";

import { loadSchedule, loadTaskStatuses, saveSchedule, saveTaskStatuses } from "@/app/lib/storage-helpers";


const shouldBeInProgress = (
  task: Task,
  currentMinutes: number,
  status: TaskStatus
) => {
  if (status.status !== "pending") return false;
  const start = timeToMinutes(task.startTime);
  return currentMinutes >= start;
};


export default function Page() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1;
  });
  const [taskStatuses, setTaskStatuses] = useState<{
    [key: string]: TaskStatus;
  }>({});
  const [editingFailure, setEditingFailure] = useState<string | null>(null);
  const [failureNote, setFailureNote] = useState("");
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [currentTimeString, setCurrentTimeString] = useState("");

  // Load schedule from localStorage
  useEffect(() => {
    setSchedule(loadSchedule());
  }, []);

  useEffect(() => {
    setTaskStatuses(loadTaskStatuses());
  }, []);

  useEffect(() => {
    saveTaskStatuses(taskStatuses);
  }, [taskStatuses]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(getCurrentTime());
      setCurrentTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const weekDates = getWeekDates(weekOffset);
  const selectedDate = weekDates[selectedDayIndex];
  const selectedDay = FULL_DAYS[selectedDayIndex];
  const dateKey = getDateKey(selectedDate);
  const isToday = getDateKey(new Date()) === dateKey;

  const tasksForDay = (schedule[selectedDay] || []).filter((task) => {
    if (task.isRecurring) return true;
    if (task.weekOffset === undefined) return true;
    return task.weekOffset === weekOffset;
  });

  const getTaskStatus = (taskId: string): TaskStatus => {
    const key = `${dateKey}-${taskId}`;
    const stored = taskStatuses[key] || {
      taskId,
      date: dateKey,
      status: "pending" as const,
    };

    // Auto-transition to in-progress if task has started
    if (isToday && stored.status === "pending") {
      const task = tasksForDay.find((t) => t.id === taskId);
      if (task && shouldBeInProgress(task, currentTime, stored)) {
        return { ...stored, status: "in-progress" as const };
      }
    }

    return stored;
  };

  // 5. NOW use useMemo with getTaskStatus
  const tasksWithStatus = useMemo(() => {
    return tasksForDay.map((task) => ({
      task,
      status: getTaskStatus(task.id),
      isActive:
        isToday && isTaskActive(task.startTime, task.endTime, currentTime),
      isUpcoming: isToday && isTaskUpcoming(task.startTime, currentTime),
      isPast: isToday && timeToMinutes(task.endTime) < currentTime,
    }));
  }, [tasksForDay, taskStatuses, currentTime, isToday, dateKey]);

  const updateTaskStatus = (
    taskId: string,
    status: "pending" | "completed" | "failed",
    note?: string
  ) => {
    const key = `${dateKey}-${taskId}`;
    setTaskStatuses((prev) => ({
      ...prev,
      [key]: {
        taskId,
        date: dateKey,
        status,
        failureNote: note,
      },
    }));
    setEditingFailure(null);
    setFailureNote("");
  };

  const startEditingFailure = (taskId: string) => {
    const status = getTaskStatus(taskId);
    setEditingFailure(taskId);
    setFailureNote(status.failureNote || "");
  };

  const saveFailureNote = (taskId: string) => {
    updateTaskStatus(taskId, "failed", failureNote);
  };

  const completedCount = tasksWithStatus.filter(
    (t) => t.status.status === "completed"
  ).length;
  const failedCount = tasksWithStatus.filter(
    (t) => t.status.status === "failed"
  ).length;
  const inProgressCount = tasksWithStatus.filter(
    (t) => t.status.status === "in-progress"
  ).length;
  const totalCount = tasksWithStatus.length;
  const pendingCount =
    totalCount - completedCount - failedCount - inProgressCount;

  const activeTask = isToday
    ? tasksWithStatus.find((t) => {
        return (
          (t.status.status === "pending" ||
            t.status.status === "in-progress") &&
          t.isActive
        );
      })?.task || null
    : null;

  const upcomingTasks = isToday
    ? tasksWithStatus
        .filter(
          (t) => t.status.status === "pending" && t.isUpcoming && !t.isActive
        )
        .map((t) => t.task)
    : [];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#17092b",
        color: "#e9e7ec",
      }}
    >
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Task Tracker</h1>
            {isToday && (
              <div
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: "#afa0c9", color: "#17092b" }}
              >
                {currentTimeString}
              </div>
            )}
          </div>

          <WeekNavigation
            weekOffset={weekOffset}
            onPrevious={() => setWeekOffset(weekOffset - 1)}
            onNext={() => setWeekOffset(weekOffset + 1)}
            weekDates={weekDates}
          />

          <DaySelector
            weekDates={weekDates}
            selectedDayIndex={selectedDayIndex}
            onSelectDay={setSelectedDayIndex}
          />

          <StatsSummary
            totalCount={totalCount}
            completedCount={completedCount}
            failedCount={failedCount}
            inProgressCount={inProgressCount}
            pendingCount={pendingCount}
          />

          <CurrentTaskBanner task={activeTask} />

          <UpcomingTasksList tasks={upcomingTasks} currentTime={currentTime} />

          <h2 className="text-xl font-semibold mb-4">{selectedDay}</h2>
        </div>

        <div className="flex-1 px-4 pb-4 space-y-3">
          {tasksWithStatus.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Active and Pending Tasks */}
              {tasksWithStatus
                .filter(
                  ({ status }) =>
                    status.status === "pending" ||
                    status.status === "in-progress"
                )
                .map(({ task, status, isActive, isUpcoming, isPast }) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    status={status}
                    isToday={isToday}
                    currentTime={currentTime}
                    isEditing={editingFailure === task.id}
                    failureNote={failureNote}
                    onComplete={(id) => updateTaskStatus(id, "completed")}
                    onFail={startEditingFailure}
                    onUndo={(id) => updateTaskStatus(id, "pending")}
                    onEditFailure={startEditingFailure}
                    onSaveFailure={saveFailureNote}
                    onCancelEdit={() => {
                      setEditingFailure(null);
                      setFailureNote("");
                    }}
                    onNoteChange={setFailureNote}
                  />
                ))}

              {/* Divider if there are completed/failed tasks */}
              {tasksWithStatus.some(
                ({ status }) =>
                  status.status === "completed" || status.status === "failed"
              ) &&
                tasksWithStatus.some(
                  ({ status }) =>
                    status.status === "pending" ||
                    status.status === "in-progress"
                ) && (
                  <div className="flex items-center gap-3 py-2">
                    <div
                      className="flex-1 h-px"
                      style={{ backgroundColor: "#36117a" }}
                    />
                    <span className="text-xs opacity-50 font-medium">
                      COMPLETED
                    </span>
                    <div
                      className="flex-1 h-px"
                      style={{ backgroundColor: "#36117a" }}
                    />
                  </div>
                )}

              {/* Completed and Failed Tasks */}
              {tasksWithStatus
                .filter(
                  ({ status }) =>
                    status.status === "completed" || status.status === "failed"
                )
                .map(({ task, status, isActive, isUpcoming, isPast }) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    status={status}
                    isToday={isToday}
                    currentTime={currentTime}
                    isEditing={editingFailure === task.id}
                    failureNote={failureNote}
                    onComplete={(id) => updateTaskStatus(id, "completed")}
                    onFail={startEditingFailure}
                    onUndo={(id) => updateTaskStatus(id, "pending")}
                    onEditFailure={startEditingFailure}
                    onSaveFailure={saveFailureNote}
                    onCancelEdit={() => {
                      setEditingFailure(null);
                      setFailureNote("");
                    }}
                    onNoteChange={setFailureNote}
                  />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const WeekNavigation = ({
  weekOffset,
  onPrevious,
  onNext,
  weekDates,
}: {
  weekOffset: number;
  onPrevious: () => void;
  onNext: () => void;
  weekDates: Date[];
}) => (
  <div className="flex items-center justify-between mb-4">
    <button
      onClick={onPrevious}
      className="p-2 rounded-lg transition-all"
      style={{ backgroundColor: "#36117a" }}
    >
      <ChevronLeft size={20} />
    </button>
    <span className="text-sm font-medium">{getWeekRange(weekDates)}</span>
    <button
      onClick={onNext}
      className="p-2 rounded-lg transition-all"
      style={{ backgroundColor: "#36117a" }}
    >
      <ChevronRight size={20} />
    </button>
  </div>
);

const DaySelector = ({
  weekDates,
  selectedDayIndex,
  onSelectDay,
}: {
  weekDates: Date[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}) => {
  const today = getDateKey(new Date());

  return (
    <div className="grid grid-cols-7 gap-1 mb-4">
      {DAYS.map((day, idx) => {
        const isDayToday = getDateKey(weekDates[idx]) === today;
        return (
          <button
            key={day}
            onClick={() => onSelectDay(idx)}
            className="flex flex-col items-center justify-center rounded-lg font-medium text-xs py-2 transition-all relative"
            style={{
              backgroundColor: selectedDayIndex === idx ? "#afa0c9" : "#36117a",
              color: selectedDayIndex === idx ? "#17092b" : "#e9e7ec",
            }}
          >
            <span className="mb-1">{day}</span>
            <span className="text-xs opacity-70">
              {formatDate(weekDates[idx])}
            </span>
            {isDayToday && (
              <div
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: "#afa0c9" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

const StatsCard = ({
  value,
  label,
  highlighted = false,
}: {
  value: number;
  label: string;
  highlighted?: boolean;
}) => (
  <div
    className="p-3 rounded-lg text-center"
    style={{ backgroundColor: "#1c0b3a" }}
  >
    <div
      className="text-2xl font-bold"
      style={{ color: highlighted ? "#afa0c9" : "#e9e7ec" }}
    >
      {value}
    </div>
    <div className="text-xs opacity-70">{label}</div>
  </div>
);

const StatsSummary = ({
  totalCount,
  completedCount,
  failedCount,
  inProgressCount,
  pendingCount,
}: {
  totalCount: number;
  completedCount: number;
  failedCount: number;
  inProgressCount: number;
  pendingCount: number;
}) => (
  <div className="grid grid-cols-5 gap-2 mb-4">
    <StatsCard value={totalCount} label="Total" />
    <StatsCard value={inProgressCount} label="Active" highlighted />
    <StatsCard value={completedCount} label="Done" highlighted />
    <StatsCard value={failedCount} label="Failed" highlighted />
    <StatsCard value={pendingCount} label="Pending" />
  </div>
);

const CurrentTaskBanner = ({ task }: { task: Task | null }) => {
  if (!task) return null;

  return (
    <div
      className="p-4 rounded-lg mb-4 border-2 animate-pulse"
      style={{
        backgroundColor: "#36117a",
        borderColor: "#afa0c9",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Zap size={18} style={{ color: "#afa0c9" }} />
        <span className="font-semibold text-sm" style={{ color: "#afa0c9" }}>
          HAPPENING NOW
        </span>
      </div>
      <h3 className="font-bold text-lg">{task.title}</h3>
      <div className="text-sm opacity-80 mt-1">
        {task.startTime} - {task.endTime}
      </div>
    </div>
  );
};

const UpcomingTasksList = ({
  tasks,
  currentTime,
}: {
  tasks: Task[];
  currentTime: number;
}) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2 opacity-70 px-4">COMING UP</h3>
      <div className="px-4 space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3 rounded-lg border"
            style={{
              backgroundColor: "#1c0b3a",
              borderColor: "#36117a",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{task.title}</h4>
                  {task.isUrgent && (
                    <AlertCircle size={12} style={{ color: "#afa0c9" }} />
                  )}
                </div>
                <div className="text-xs opacity-70">
                  {task.startTime} - {task.endTime}
                </div>
              </div>
              <div
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{ backgroundColor: "#36117a", color: "#afa0c9" }}
              >
                {formatTimeRemaining(task.startTime, currentTime)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div
    className="p-6 rounded-lg text-center"
    style={{ backgroundColor: "#1c0b3a" }}
  >
    <Clock size={32} className="mx-auto mb-2 opacity-50" />
    <p className="opacity-70">No tasks scheduled</p>
  </div>
);

const TaskStatusButtons = ({
  taskId,
  onComplete,
  onFail,
}: {
  taskId: string;
  onComplete: (taskId: string) => void;
  onFail: (taskId: string) => void;
}) => (
  <div className="flex gap-2">
    <button
      onClick={() => onComplete(taskId)}
      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-all hover:opacity-90"
      style={{ backgroundColor: "#afa0c9", color: "#17092b" }}
    >
      <Check size={18} />
      Done
    </button>
    <button
      onClick={() => onFail(taskId)}
      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-all hover:opacity-90"
      style={{ backgroundColor: "#36117a" }}
    >
      <X size={18} />
      Failed
    </button>
  </div>
);

const CompletedStatus = ({
  taskId,
  onUndo,
}: {
  taskId: string;
  onUndo: (taskId: string) => void;
}) => (
  <div
    className="flex items-center justify-between p-3 rounded-lg"
    style={{ backgroundColor: "#afa0c9", color: "#17092b" }}
  >
    <div className="flex items-center gap-2">
      <Check size={18} />
      <span className="font-medium">Completed</span>
    </div>
    <button
      onClick={() => onUndo(taskId)}
      className="text-xs underline opacity-70 hover:opacity-100"
    >
      Undo
    </button>
  </div>
);

const FailedStatus = ({
  taskId,
  failureNote,
  onEdit,
  onUndo,
}: {
  taskId: string;
  failureNote?: string;
  onEdit: (taskId: string) => void;
  onUndo: (taskId: string) => void;
}) => (
  <div>
    <div
      className="flex items-center justify-between p-3 rounded-lg mb-2"
      style={{ backgroundColor: "#36117a" }}
    >
      <div className="flex items-center gap-2">
        <X size={18} />
        <span className="font-medium">Failed</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(taskId)}
          className="p-1 rounded opacity-70 hover:opacity-100"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onUndo(taskId)}
          className="text-xs underline opacity-70 hover:opacity-100"
        >
          Undo
        </button>
      </div>
    </div>
    {failureNote && (
      <div
        className="p-3 rounded-lg text-sm"
        style={{ backgroundColor: "#17092b" }}
      >
        <span className="opacity-70">Note: </span>
        {failureNote}
      </div>
    )}
  </div>
);

const FailureNoteEditor = ({
  taskId,
  note,
  onNoteChange,
  onCancel,
  onSave,
}: {
  taskId: string;
  note: string;
  onNoteChange: (note: string) => void;
  onCancel: () => void;
  onSave: (taskId: string) => void;
}) => (
  <div className="space-y-2">
    <textarea
      value={note}
      onChange={(e) => onNoteChange(e.target.value)}
      placeholder="Why did this task fail? (optional)"
      className="w-full p-3 rounded-lg outline-none resize-none"
      style={{ backgroundColor: "#36117a", color: "#e9e7ec" }}
      rows={3}
      autoFocus
    />
    <div className="flex gap-2">
      <button
        onClick={onCancel}
        className="flex-1 p-2 rounded-lg font-medium"
        style={{ backgroundColor: "#36117a" }}
      >
        Cancel
      </button>
      <button
        onClick={() => onSave(taskId)}
        className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg font-medium"
        style={{ backgroundColor: "#afa0c9", color: "#17092b" }}
      >
        <Save size={16} />
        Save
      </button>
    </div>
  </div>
);

const TaskCard = ({
  task,
  status,
  isToday,
  currentTime,
  isEditing,
  failureNote,
  onComplete,
  onFail,
  onUndo,
  onEditFailure,
  onSaveFailure,
  onCancelEdit,
  onNoteChange,
}: {
  task: Task;
  status: TaskStatus;
  isToday: boolean;
  currentTime: number;
  isEditing: boolean;
  failureNote: string;
  onComplete: (taskId: string) => void;
  onFail: (taskId: string) => void;
  onUndo: (taskId: string) => void;
  onEditFailure: (taskId: string) => void;
  onSaveFailure: (taskId: string) => void;
  onCancelEdit: () => void;
  onNoteChange: (note: string) => void;
}) => {
  const isActive =
    isToday && isTaskActive(task.startTime, task.endTime, currentTime);
  const isUpcoming = isToday && isTaskUpcoming(task.startTime, currentTime);
  const isPast = isToday && timeToMinutes(task.endTime) < currentTime;

  return (
    <div
      className="rounded-lg relative overflow-hidden"
      style={{
        backgroundColor: task.isUrgent ? "#36117a" : "#1c0b3a",
        borderLeft: task.isUrgent ? "4px solid #afa0c9" : "none",
        opacity:
          status.status === "completed"
            ? 0.6
            : isPast && status.status === "pending"
            ? 0.7
            : 1,
        border: isActive ? "2px solid #afa0c9" : "none",
        boxShadow: isActive ? "0 0 20px rgba(175, 160, 201, 0.3)" : "none",
      }}
    >
      {isActive && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: "#afa0c9" }}
        />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3
                className={`font-semibold ${
                  status.status === "completed" ? "line-through" : ""
                }`}
              >
                {task.title}
              </h3>
              {isActive && (
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ backgroundColor: "#afa0c9", color: "#17092b" }}
                >
                  NOW
                </span>
              )}
              {isUpcoming && !isActive && status.status === "pending" && (
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ backgroundColor: "#36117a", color: "#afa0c9" }}
                >
                  {formatTimeRemaining(task.startTime, currentTime)}
                </span>
              )}
              {task.isRecurring && (
                <RefreshCw size={14} style={{ color: "#afa0c9" }} />
              )}
              {task.isUrgent && (
                <AlertCircle size={14} style={{ color: "#afa0c9" }} />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm opacity-80">
              <Clock size={14} />
              <span>
                {task.startTime}
                {task.endTime !== task.startTime && ` - ${task.endTime}`}
              </span>
            </div>
            {task.details && (
              <p className="text-sm opacity-70 mt-2">{task.details}</p>
            )}
          </div>
        </div>

        {status.status === "pending" && (
          <TaskStatusButtons
            taskId={task.id}
            onComplete={onComplete}
            onFail={onFail}
          />
        )}

        {status.status === "in-progress" && (
          <InProgressStatus
            taskId={task.id}
            onComplete={onComplete}
            onFail={onFail}
          />
        )}

        {status.status === "completed" && (
          <CompletedStatus taskId={task.id} onUndo={onUndo} />
        )}

        {status.status === "failed" && !isEditing && (
          <FailedStatus
            taskId={task.id}
            failureNote={status.failureNote}
            onEdit={onEditFailure}
            onUndo={onUndo}
          />
        )}

        {isEditing && (
          <FailureNoteEditor
            taskId={task.id}
            note={failureNote}
            onNoteChange={onNoteChange}
            onCancel={onCancelEdit}
            onSave={onSaveFailure}
          />
        )}
      </div>
    </div>
  );
};

const InProgressStatus = ({
  taskId,
  onComplete,
  onFail,
}: {
  taskId: string;
  onComplete: (taskId: string) => void;
  onFail: (taskId: string) => void;
}) => (
  <div>
    <div
      className="flex items-center justify-center p-2 rounded-lg mb-2"
      style={{ backgroundColor: "#afa0c9", color: "#17092b" }}
    >
      <div className="flex items-center gap-2">
        <Clock size={18} className="animate-spin" />
        <span className="font-medium">In Progress</span>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => onComplete(taskId)}
        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-all hover:opacity-90"
        style={{ backgroundColor: "#afa0c9", color: "#17092b" }}
      >
        <Check size={18} />
        Done
      </button>
      <button
        onClick={() => onFail(taskId)}
        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-all hover:opacity-90"
        style={{ backgroundColor: "#36117a" }}
      >
        <X size={18} />
        Failed
      </button>
    </div>
  </div>
);
