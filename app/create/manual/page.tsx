"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Clock, Trash2, RefreshCw, AlertCircle, ChevronDown, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task,Schedule } from '@/app/lib/types';
import {
  FULL_DAYS,
  CATEGORIES,
} from "@/app/lib/constants";
import { getWeekDates } from "@/app/lib/utils";
import { loadSchedule, saveSchedule } from "@/app/lib/storage-helpers";
import WeekNavigation from '@/app/lib/components/schedule/WeekNavigation';
import {DaySelector} from "@/app/lib/components/schedule/DaySelector";
import EmptyState from "@/app/lib/components/schedule/EmptyState";
import CategorySelector from "@/app/lib/components/schedule/CategorySelector";


export default function Page() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const today = new Date().getDay();
    // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    const dayIndex = today === 0 ? 6 : today - 1;
    return FULL_DAYS[dayIndex];
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    startTime: '',
    endTime: '',
    sameAsStart: false,
    chainToPrevious: false,
    details: '',
    category: '',
    isUrgent: false,
    isRecurring: false,
  });

  const weekDates = getWeekDates(weekOffset);

  // Load schedule from localStorage on mount
  useEffect(() => {
    setSchedule(loadSchedule());
  }, []);

  // Save schedule to localStorage whenever it changes
useEffect(() => {
  saveSchedule(schedule);
}, [schedule]);

  const tasksForDay = (schedule[selectedDay] || []).filter(task => {
    if (task.isRecurring) return true;
    if (task.weekOffset === undefined) return true;
    return task.weekOffset === weekOffset;
  });

  const addTask = () => {
    if (!newTask.title || !newTask.startTime) return;
    if (!newTask.sameAsStart && !newTask.chainToPrevious && !newTask.endTime) return;

    let startTime = newTask.startTime;
    
    // If chaining to previous task, find the last task's end time
    if (newTask.chainToPrevious && tasksForDay.length > 0) {
      const sortedTasks = [...tasksForDay].sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      );
      const lastTask = sortedTasks[sortedTasks.length - 1];
      
      // Add 5 minutes to last task's end time
      const [hours, minutes] = lastTask.endTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes + 5);
      startTime = date.toTimeString().slice(0, 5);
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      startTime: startTime,
      endTime: newTask.sameAsStart ? startTime : (newTask.chainToPrevious ? newTask.endTime : newTask.endTime),
      details: newTask.details,
      category: newTask.category,
      isUrgent: newTask.isUrgent,
      isRecurring: newTask.isRecurring,
      weekOffset: newTask.isRecurring ? undefined : weekOffset,
    };

    setSchedule(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), task].sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      ),
    }));

    setNewTask({
      title: '',
      startTime: '',
      endTime: '',
      sameAsStart: false,
      chainToPrevious: false,
      details: '',
      category: '',
      isUrgent: false,
      isRecurring: false,
    });
    setShowAddTask(false);
  };

  const deleteTask = (day: string, taskId: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter(t => t.id !== taskId),
    }));
  };
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
        <h1 className="text-2xl font-bold mb-4">Weekly Schedule</h1>

        <WeekNavigation
          weekOffset={weekOffset}
          onPrevious={() => setWeekOffset(weekOffset - 1)}
          onNext={() => setWeekOffset(weekOffset + 1)}
          weekDates={weekDates}
        />

        <DaySelector
          weekDates={weekDates}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{selectedDay}</h2>
          <button
            onClick={() => setShowAddTask(true)}
            className="p-2 rounded-lg transition-all"
            style={{ backgroundColor: "#afa0c9", color: "#17092b" }}
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 pb-4 space-y-2">
        {tasksForDay.length === 0 ? (
          <EmptyState />
        ) : (
          tasksForDay.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              day={selectedDay}
              onDelete={deleteTask}
              expandedTask={expandedTask}
              onToggleExpand={(taskId) =>
                setExpandedTask(expandedTask === taskId ? null : taskId)
              }
            />
          ))
        )}
      </div>

      <AddTaskModal
        show={showAddTask}
        newTask={newTask}
        tasksForDay={tasksForDay}
        onClose={() => setShowAddTask(false)}
        onSave={addTask}
        onUpdateTask={(updates) => setNewTask({ ...newTask, ...updates })}
      />
    </div>
  </div>
);
}


const TaskCard = ({
  task,
  day,
  onDelete,
  expandedTask,
  onToggleExpand,
}: {
  task: Task;
  day: string;
  onDelete: (day: string, taskId: string) => void;
  expandedTask: string | null;
  onToggleExpand: (taskId: string) => void;
}) => (
  <div
    className="rounded-lg"
    style={{
      backgroundColor: task.isUrgent ? "#36117a" : "#1c0b3a",
      borderLeft: task.isUrgent ? "4px solid #afa0c9" : "none",
    }}
  >
    <div className="p-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {task.category && (
              <span className="text-lg">
                {CATEGORIES.find((c) => c.id === task.category)?.emoji}
              </span>
            )}
            <h3 className="font-semibold">{task.title}</h3>
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
        </div>
        <button
          onClick={() => onDelete(day, task.id)}
          className="p-2 rounded opacity-70 hover:opacity-100 transition-opacity"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {task.details && (
        <button
          onClick={() => onToggleExpand(task.id)}
          className="flex items-center gap-2 text-sm opacity-70 mt-2"
        >
          <FileText size={14} />
          <span>Details</span>
          <ChevronDown
            size={14}
            className="transition-transform"
            style={{
              transform:
                expandedTask === task.id ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
      )}

      {expandedTask === task.id && task.details && (
        <div
          className="mt-2 p-2 rounded text-sm"
          style={{ backgroundColor: "#17092b" }}
        >
          {task.details}
        </div>
      )}

      {task.isRecurring && (
        <div className="text-xs opacity-60 mt-2">Repeats every {day}</div>
      )}
    </div>
  </div>
);


const AddTaskModal = ({
  show,
  newTask,
  tasksForDay,
  onClose,
  onSave,
  onUpdateTask,
}: {
  show: boolean;
  newTask: any;
  tasksForDay: Task[];
  onClose: () => void;
  onSave: () => void;
  onUpdateTask: (updates: Partial<typeof newTask>) => void;
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-50"
      style={{ backgroundColor: "rgba(23, 9, 43, 0.9)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-6 rounded-t-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#1c0b3a" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">Add Task</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 opacity-80">Task Name</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => onUpdateTask({ title: e.target.value })}
              className="w-full p-3 rounded-lg outline-none"
              style={{ backgroundColor: "#36117a", color: "#e9e7ec" }}
              placeholder="Enter task name"
            />
          </div>

          <CategorySelector
            selectedCategory={newTask.category}
            onSelectCategory={(category) => onUpdateTask({ category })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-2 opacity-80">
                Start Time
              </label>
              <input
                type="time"
                value={newTask.startTime}
                onChange={(e) => onUpdateTask({ startTime: e.target.value })}
                className="w-full p-3 rounded-lg outline-none"
                style={{ backgroundColor: "#36117a", color: "#e9e7ec" }}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 opacity-80">End Time</label>
              <input
                type="time"
                value={newTask.endTime}
                onChange={(e) => onUpdateTask({ endTime: e.target.value })}
                disabled={newTask.sameAsStart}
                className="w-full p-3 rounded-lg outline-none disabled:opacity-50"
                style={{ backgroundColor: "#36117a", color: "#e9e7ec" }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newTask.chainToPrevious}
                onChange={(e) => {
                  if (e.target.checked && tasksForDay.length > 0) {
                    const sortedTasks = [...tasksForDay].sort((a, b) =>
                      a.startTime.localeCompare(b.startTime)
                    );
                    const lastTask = sortedTasks[sortedTasks.length - 1];

                    const [hours, minutes] = lastTask.endTime
                      .split(":")
                      .map(Number);
                    const date = new Date();
                    date.setHours(hours, minutes + 5);
                    const newStartTime = date.toTimeString().slice(0, 5);

                    onUpdateTask({
                      chainToPrevious: true,
                      sameAsStart: false,
                      startTime: newStartTime,
                    });
                  } else {
                    onUpdateTask({
                      chainToPrevious: false,
                      startTime: "",
                    });
                  }
                }}
                disabled={tasksForDay.length === 0}
                className="w-5 h-5 rounded disabled:opacity-30"
                style={{ accentColor: "#afa0c9" }}
              />
              <span className="text-sm">Chain from previous task</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newTask.sameAsStart}
                onChange={(e) =>
                  onUpdateTask({
                    sameAsStart: e.target.checked,
                    chainToPrevious: false,
                    endTime: "",
                  })
                }
                className="w-5 h-5 rounded"
                style={{ accentColor: "#afa0c9" }}
              />
              <span className="text-sm">Same as start time</span>
            </label>
          </div>

          <div>
            <label className="block text-sm mb-2 opacity-80">
              Details (Optional)
            </label>
            <textarea
              value={newTask.details}
              onChange={(e) => onUpdateTask({ details: e.target.value })}
              className="w-full p-3 rounded-lg outline-none resize-none"
              style={{ backgroundColor: "#36117a", color: "#e9e7ec" }}
              placeholder="Add any extra notes or details"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newTask.isUrgent}
                onChange={(e) => onUpdateTask({ isUrgent: e.target.checked })}
                className="w-5 h-5 rounded"
                style={{ accentColor: "#afa0c9" }}
              />
              <span className="flex items-center gap-2">
                <AlertCircle size={16} />
                Mark as Urgent
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newTask.isRecurring}
                onChange={(e) =>
                  onUpdateTask({ isRecurring: e.target.checked })
                }
                className="w-5 h-5 rounded"
                style={{ accentColor: "#afa0c9" }}
              />
              <span className="flex items-center gap-2">
                <RefreshCw size={16} />
                Repeat Every Week
              </span>
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 p-3 rounded-lg font-medium"
              style={{ backgroundColor: "#36117a" }}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="flex-1 p-3 rounded-lg font-medium"
              style={{ backgroundColor: "#afa0c9", color: "#17092b" }}
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

