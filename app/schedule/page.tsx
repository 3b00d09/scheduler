"use client"
import React, { useState, useEffect } from 'react';
import { Check, X, Clock, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, Edit2, Save, Zap } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  details: string;
  isUrgent: boolean;
  isRecurring: boolean;
  weekOffset?: number;
}

interface TaskStatus {
  taskId: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  failureNote?: string;
}

interface Schedule {
  [key: string]: Task[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

const getDateKey = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const getWeekRange = (dates: Date[]) => {
  const first = dates[0];
  const last = dates[6];
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${first.toLocaleDateString('en-US', options)} - ${last.toLocaleDateString('en-US', options)}`;
};

const getCurrentTime = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const isTaskActive = (startTime: string, endTime: string, currentMinutes: number) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return currentMinutes >= start && currentMinutes < end;
};

const isTaskUpcoming = (startTime: string, currentMinutes: number) => {
  const start = timeToMinutes(startTime);
  const diff = start - currentMinutes;
  return diff > 0 && diff <= 60; // Within next 60 minutes
};

const formatTimeRemaining = (startTime: string, currentMinutes: number) => {
  const start = timeToMinutes(startTime);
  const diff = start - currentMinutes;
  if (diff <= 0) return '';
  if (diff < 60) return `in ${diff}m`;
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  return mins > 0 ? `in ${hours}h ${mins}m` : `in ${hours}h`;
};

export default function Page() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  });
  const [taskStatuses, setTaskStatuses] = useState<{ [key: string]: TaskStatus }>({});
  const [editingFailure, setEditingFailure] = useState<string | null>(null);
  const [failureNote, setFailureNote] = useState('');
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [currentTimeString, setCurrentTimeString] = useState('');

  // Load schedule from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('weeklySchedule');
    if (stored) {
      setSchedule(JSON.parse(stored));
    }
  }, []);

  // Load task statuses from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('taskStatuses');
    if (stored) {
      setTaskStatuses(JSON.parse(stored));
    }
  }, []);

  // Save task statuses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('taskStatuses', JSON.stringify(taskStatuses));
  }, [taskStatuses]);

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(getCurrentTime());
      setCurrentTimeString(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const weekDates = getWeekDates(weekOffset);
  const selectedDate = weekDates[selectedDayIndex];
  const selectedDay = FULL_DAYS[selectedDayIndex];
  const dateKey = getDateKey(selectedDate);
  
  const isToday = getDateKey(new Date()) === dateKey;

  const tasksForDay = (schedule[selectedDay] || []).filter(task => {
    if (task.isRecurring) return true;
    if (task.weekOffset === undefined) return true;
    return task.weekOffset === weekOffset;
  });

  const getTaskStatus = (taskId: string): TaskStatus => {
    const key = `${dateKey}-${taskId}`;
    return taskStatuses[key] || { taskId, date: dateKey, status: 'pending' };
  };

  const updateTaskStatus = (taskId: string, status: 'completed' | 'failed', note?: string) => {
    const key = `${dateKey}-${taskId}`;
    setTaskStatuses(prev => ({
      ...prev,
      [key]: {
        taskId,
        date: dateKey,
        status,
        failureNote: note,
      },
    }));
    setEditingFailure(null);
    setFailureNote('');
  };

  const startEditingFailure = (taskId: string) => {
    const status = getTaskStatus(taskId);
    setEditingFailure(taskId);
    setFailureNote(status.failureNote || '');
  };

  const saveFailureNote = (taskId: string) => {
    updateTaskStatus(taskId, 'failed', failureNote);
  };

  const completedCount = tasksForDay.filter(t => getTaskStatus(t.id).status === 'completed').length;
  const failedCount = tasksForDay.filter(t => getTaskStatus(t.id).status === 'failed').length;
  const totalCount = tasksForDay.length;
  const pendingCount = totalCount - completedCount - failedCount;

  // Find current active task
  const activeTask = isToday ? tasksForDay.find(t => 
    getTaskStatus(t.id).status === 'pending' && 
    isTaskActive(t.startTime, t.endTime, currentTime)
  ) : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ 
      backgroundColor: '#17092b',
      color: '#e9e7ec'
    }}>
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Task Tracker</h1>
            {isToday && (
              <div 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: '#afa0c9', color: '#17092b' }}
              >
                {currentTimeString}
              </div>
            )}
          </div>

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
            {DAYS.map((day, idx) => {
              const isDayToday = getDateKey(weekDates[idx]) === getDateKey(new Date());
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDayIndex(idx)}
                  className="flex flex-col items-center justify-center rounded-lg font-medium text-xs py-2 transition-all relative"
                  style={{
                    backgroundColor: selectedDayIndex === idx ? '#afa0c9' : '#36117a',
                    color: selectedDayIndex === idx ? '#17092b' : '#e9e7ec',
                  }}
                >
                  <span className="mb-1">{day}</span>
                  <span className="text-xs opacity-70">{formatDate(weekDates[idx])}</span>
                  {isDayToday && (
                    <div 
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#afa0c9' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div 
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: '#1c0b3a' }}
            >
              <div className="text-2xl font-bold">{totalCount}</div>
              <div className="text-xs opacity-70">Total</div>
            </div>
            <div 
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: '#1c0b3a' }}
            >
              <div className="text-2xl font-bold" style={{ color: '#afa0c9' }}>{completedCount}</div>
              <div className="text-xs opacity-70">Done</div>
            </div>
            <div 
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: '#1c0b3a' }}
            >
              <div className="text-2xl font-bold" style={{ color: '#afa0c9' }}>{failedCount}</div>
              <div className="text-xs opacity-70">Failed</div>
            </div>
            <div 
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: '#1c0b3a' }}
            >
              <div className="text-2xl font-bold">{pendingCount}</div>
              <div className="text-xs opacity-70">Pending</div>
            </div>
          </div>

          {/* Current Task Banner */}
          {activeTask && (
            <div 
              className="p-4 rounded-lg mb-4 border-2 animate-pulse"
              style={{ 
                backgroundColor: '#36117a',
                borderColor: '#afa0c9',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap size={18} style={{ color: '#afa0c9' }} />
                <span className="font-semibold text-sm" style={{ color: '#afa0c9' }}>HAPPENING NOW</span>
              </div>
              <h3 className="font-bold text-lg">{activeTask.title}</h3>
              <div className="text-sm opacity-80 mt-1">
                {activeTask.startTime} - {activeTask.endTime}
              </div>
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4">{selectedDay}</h2>
        </div>

        {/* Tasks List */}
        <div className="flex-1 px-4 pb-4 space-y-3">
          {tasksForDay.length === 0 ? (
            <div 
              className="p-6 rounded-lg text-center"
              style={{ backgroundColor: '#1c0b3a' }}
            >
              <Clock size={32} className="mx-auto mb-2 opacity-50" />
              <p className="opacity-70">No tasks scheduled</p>
            </div>
          ) : (
            tasksForDay.map(task => {
              const status = getTaskStatus(task.id);
              const isEditing = editingFailure === task.id;
              const isActive = isToday && isTaskActive(task.startTime, task.endTime, currentTime);
              const isUpcoming = isToday && isTaskUpcoming(task.startTime, currentTime);
              const isPast = isToday && timeToMinutes(task.endTime) < currentTime;

              return (
                <div
                  key={task.id}
                  className="rounded-lg relative overflow-hidden"
                  style={{
                    backgroundColor: task.isUrgent ? '#36117a' : '#1c0b3a',
                    borderLeft: task.isUrgent ? '4px solid #afa0c9' : 'none',
                    opacity: status.status === 'completed' ? 0.6 : isPast && status.status === 'pending' ? 0.7 : 1,
                    border: isActive ? '2px solid #afa0c9' : 'none',
                    boxShadow: isActive ? '0 0 20px rgba(175, 160, 201, 0.3)' : 'none',
                  }}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div 
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: '#afa0c9' }}
                    />
                  )}

                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className={`font-semibold ${status.status === 'completed' ? 'line-through' : ''}`}>
                            {task.title}
                          </h3>
                          {isActive && (
                            <span 
                              className="text-xs px-2 py-1 rounded-full font-medium"
                              style={{ backgroundColor: '#afa0c9', color: '#17092b' }}
                            >
                              NOW
                            </span>
                          )}
                          {isUpcoming && !isActive && status.status === 'pending' && (
                            <span 
                              className="text-xs px-2 py-1 rounded-full font-medium"
                              style={{ backgroundColor: '#36117a', color: '#afa0c9' }}
                            >
                              {formatTimeRemaining(task.startTime, currentTime)}
                            </span>
                          )}
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
                        {task.details && (
                          <p className="text-sm opacity-70 mt-2">{task.details}</p>
                        )}
                      </div>
                    </div>

                    {/* Status Buttons */}
                    {status.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateTaskStatus(task.id, 'completed')}
                          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-all hover:opacity-90"
                          style={{ backgroundColor: '#afa0c9', color: '#17092b' }}
                        >
                          <Check size={18} />
                          Done
                        </button>
                        <button
                          onClick={() => startEditingFailure(task.id)}
                          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-all hover:opacity-90"
                          style={{ backgroundColor: '#36117a' }}
                        >
                          <X size={18} />
                          Failed
                        </button>
                      </div>
                    )}

                    {/* Completed Status */}
                    {status.status === 'completed' && (
                      <div 
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ backgroundColor: '#afa0c9', color: '#17092b' }}
                      >
                        <div className="flex items-center gap-2">
                          <Check size={18} />
                          <span className="font-medium">Completed</span>
                        </div>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'pending')}
                          className="text-xs underline opacity-70 hover:opacity-100"
                        >
                          Undo
                        </button>
                      </div>
                    )}

                    {/* Failed Status or Edit */}
                    {status.status === 'failed' && !isEditing && (
                      <div>
                        <div 
                          className="flex items-center justify-between p-3 rounded-lg mb-2"
                          style={{ backgroundColor: '#36117a' }}
                        >
                          <div className="flex items-center gap-2">
                            <X size={18} />
                            <span className="font-medium">Failed</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditingFailure(task.id)}
                              className="p-1 rounded opacity-70 hover:opacity-100"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => updateTaskStatus(task.id, 'pending')}
                              className="text-xs underline opacity-70 hover:opacity-100"
                            >
                              Undo
                            </button>
                          </div>
                        </div>
                        {status.failureNote && (
                          <div 
                            className="p-3 rounded-lg text-sm"
                            style={{ backgroundColor: '#17092b' }}
                          >
                            <span className="opacity-70">Note: </span>{status.failureNote}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Failure Note Editor */}
                    {isEditing && (
                      <div className="space-y-2">
                        <textarea
                          value={failureNote}
                          onChange={e => setFailureNote(e.target.value)}
                          placeholder="Why did this task fail? (optional)"
                          className="w-full p-3 rounded-lg outline-none resize-none"
                          style={{ backgroundColor: '#36117a', color: '#e9e7ec' }}
                          rows={3}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingFailure(null);
                              setFailureNote('');
                            }}
                            className="flex-1 p-2 rounded-lg font-medium"
                            style={{ backgroundColor: '#36117a' }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveFailureNote(task.id)}
                            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg font-medium"
                            style={{ backgroundColor: '#afa0c9', color: '#17092b' }}
                          >
                            <Save size={16} />
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}