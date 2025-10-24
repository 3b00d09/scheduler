"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Clock, Trash2, RefreshCw, AlertCircle, ChevronDown, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface Task {
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

interface Schedule {
  [key: string]: Task[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CATEGORIES = [
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'study', label: 'Study', emoji: '📚' },
  { id: 'workout', label: 'Workout', emoji: '💪' },
  { id: 'eat', label: 'Eat', emoji: '🍽️' },
  { id: 'sleep', label: 'Sleep', emoji: '😴' },
  { id: 'commute', label: 'Commute', emoji: '🚗' },
  { id: 'social', label: 'Social', emoji: '👥' },
  { id: 'hobby', label: 'Hobby', emoji: '🎨' },
  { id: 'chores', label: 'Chores', emoji: '🧹' },
  { id: 'health', label: 'Health', emoji: '🏥' },
  { id: 'other', label: 'Other', emoji: '📌' },
];

const getWeekDates = (weekOffset: number) => {
  const today = new Date();
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + (weekOffset * 7));
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const formatDate = (date: Date) => {
  return date.getDate();
};

const getWeekRange = (dates: Date[]) => {
  const first = dates[0];
  const last = dates[6];
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${first.toLocaleDateString('en-US', options)} - ${last.toLocaleDateString('en-US', options)}`;
};

export default function Page() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
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
    const stored = localStorage.getItem('weeklySchedule');
    if (stored) {
      try {
        setSchedule(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load schedule:', e);
      }
    }
  }, []);

  // Save schedule to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('weeklySchedule', JSON.stringify(schedule));
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
    <div className="min-h-screen flex flex-col" style={{ 
      backgroundColor: '#17092b',
      color: '#e9e7ec'
    }}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Weekly Schedule</h1>

          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="p-2 rounded-lg transition-all"
              style={{ backgroundColor: '#36117a' }}
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium">{getWeekRange(weekDates)}</span>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="p-2 rounded-lg transition-all"
              style={{ backgroundColor: '#36117a' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day Selector Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {DAYS.map((day, idx) => (
              <button
                key={day}
                onClick={() => setSelectedDay(FULL_DAYS[idx])}
                className="flex flex-col items-center justify-center rounded-lg font-medium text-xs py-2 transition-all"
                style={{
                  backgroundColor: selectedDay === FULL_DAYS[idx] ? '#afa0c9' : '#36117a',
                  color: selectedDay === FULL_DAYS[idx] ? '#17092b' : '#e9e7ec',
                }}
              >
                <span className="mb-1">{day}</span>
                <span className="text-xs opacity-70">{formatDate(weekDates[idx])}</span>
              </button>
            ))}
          </div>

          {/* Current Day Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{selectedDay}</h2>
            <button
              onClick={() => setShowAddTask(true)}
              className="p-2 rounded-lg transition-all"
              style={{ backgroundColor: '#afa0c9', color: '#17092b' }}
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="flex-1 px-4 pb-4 space-y-2">
          {tasksForDay.length === 0 ? (
            <div 
              className="p-6 rounded-lg text-center"
              style={{ backgroundColor: '#1c0b3a' }}
            >
              <Clock size={32} className="mx-auto mb-2 opacity-50" />
              <p className="opacity-70">No tasks scheduled</p>
            </div>
          ) : (
            tasksForDay.map(task => (
              <div
                key={task.id}
                className="rounded-lg"
                style={{
                  backgroundColor: task.isUrgent ? '#36117a' : '#1c0b3a',
                  borderLeft: task.isUrgent ? '4px solid #afa0c9' : 'none',
                }}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {task.category && (
                          <span className="text-lg">
                            {CATEGORIES.find(c => c.id === task.category)?.emoji}
                          </span>
                        )}
                        <h3 className="font-semibold">{task.title}</h3>
                        {task.isRecurring && (
                          <RefreshCw size={14} style={{ color: '#afa0c9' }} />
                        )}
                        {task.isUrgent && (
                          <AlertCircle size={14} style={{ color: '#afa0c9' }} />
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
                      onClick={() => deleteTask(selectedDay, task.id)}
                      className="p-2 rounded opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {task.details && (
                    <button
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                      className="flex items-center gap-2 text-sm opacity-70 mt-2"
                    >
                      <FileText size={14} />
                      <span>Details</span>
                      <ChevronDown 
                        size={14} 
                        className="transition-transform"
                        style={{ transform: expandedTask === task.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>
                  )}

                  {expandedTask === task.id && task.details && (
                    <div 
                      className="mt-2 p-2 rounded text-sm"
                      style={{ backgroundColor: '#17092b' }}
                    >
                      {task.details}
                    </div>
                  )}

                  {task.isRecurring && (
                    <div className="text-xs opacity-60 mt-2">
                      Repeats every {selectedDay}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Task Modal */}
        {showAddTask && (
          <div 
            className="fixed inset-0 flex items-end justify-center z-50"
            style={{ backgroundColor: 'rgba(23, 9, 43, 0.9)' }}
            onClick={() => setShowAddTask(false)}
          >
            <div
              className="w-full max-w-md p-6 rounded-t-2xl max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: '#1c0b3a' }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Add Task</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 opacity-80">Task Name</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full p-3 rounded-lg outline-none"
                    style={{ backgroundColor: '#36117a', color: '#e9e7ec' }}
                    placeholder="Enter task name"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 opacity-80">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNewTask({ ...newTask, category: cat.id })}
                        className="p-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
                        style={{
                          backgroundColor: newTask.category === cat.id ? '#afa0c9' : '#36117a',
                          color: newTask.category === cat.id ? '#17092b' : '#e9e7ec',
                        }}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-2 opacity-80">Start Time</label>
                    <input
                      type="time"
                      value={newTask.startTime}
                      onChange={e => setNewTask({ ...newTask, startTime: e.target.value })}
                      className="w-full p-3 rounded-lg outline-none disabled:opacity-50"
                      style={{ backgroundColor: '#36117a', color: '#e9e7ec' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 opacity-80">End Time</label>
                    <input
                      type="time"
                      value={newTask.endTime}
                      onChange={e => setNewTask({ ...newTask, endTime: e.target.value })}
                      disabled={newTask.sameAsStart}
                      className="w-full p-3 rounded-lg outline-none disabled:opacity-50"
                      style={{ backgroundColor: '#36117a', color: '#e9e7ec' }}
                    />
                  </div>
                </div>

                <div className="space-y-2">

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newTask.chainToPrevious}
                      onChange={e => {
                        if (e.target.checked && tasksForDay.length > 0) {
                          const sortedTasks = [...tasksForDay].sort((a, b) => 
                            a.startTime.localeCompare(b.startTime)
                          );
                          const lastTask = sortedTasks[sortedTasks.length - 1];
                          
                          // Add 5 minutes to last task's end time
                          const [hours, minutes] = lastTask.endTime.split(':').map(Number);
                          const date = new Date();
                          date.setHours(hours, minutes + 5);
                          const newStartTime = date.toTimeString().slice(0, 5);
                          
                          setNewTask({ 
                            ...newTask, 
                            chainToPrevious: true,
                            sameAsStart: false,
                            startTime: newStartTime
                          });
                        } else {
                          setNewTask({ 
                            ...newTask, 
                            chainToPrevious: false,
                            startTime: ''
                          });
                        }
                      }}
                      disabled={tasksForDay.length === 0}
                      className="w-5 h-5 rounded disabled:opacity-30"
                      style={{ accentColor: '#afa0c9' }}
                    />
                    <span className="text-sm">Chain from previous task</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newTask.sameAsStart}
                      onChange={e => setNewTask({ 
                        ...newTask, 
                        sameAsStart: e.target.checked, 
                        chainToPrevious: false,
                        endTime: '' 
                      })}
                      className="w-5 h-5 rounded"
                      style={{ accentColor: '#afa0c9' }}
                    />
                    <span className="text-sm">Same as start time</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm mb-2 opacity-80">Details (Optional)</label>
                  <textarea
                    value={newTask.details}
                    onChange={e => setNewTask({ ...newTask, details: e.target.value })}
                    className="w-full p-3 rounded-lg outline-none resize-none"
                    style={{ backgroundColor: '#36117a', color: '#e9e7ec' }}
                    placeholder="Add any extra notes or details"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newTask.isUrgent}
                      onChange={e => setNewTask({ ...newTask, isUrgent: e.target.checked })}
                      className="w-5 h-5 rounded"
                      style={{ accentColor: '#afa0c9' }}
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
                      onChange={e => setNewTask({ ...newTask, isRecurring: e.target.checked })}
                      className="w-5 h-5 rounded"
                      style={{ accentColor: '#afa0c9' }}
                    />
                    <span className="flex items-center gap-2">
                      <RefreshCw size={16} />
                      Repeat Every Week
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddTask(false)}
                    className="flex-1 p-3 rounded-lg font-medium"
                    style={{ backgroundColor: '#36117a' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTask}
                    className="flex-1 p-3 rounded-lg font-medium"
                    style={{ backgroundColor: '#afa0c9', color: '#17092b' }}
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}