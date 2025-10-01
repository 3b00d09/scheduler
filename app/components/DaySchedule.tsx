// app/components/DaySchedule.tsx
'use client';

import { useState } from 'react';
import type { Day, Session } from '../lib/types';
import { SessionCard } from './SessionCard';

interface DayScheduleProps {
  days: Day[];
  editMode: boolean;
  onAddSession: (dayIndex: number) => void;
  onEditSession: (dayIndex: number, sessionIndex: number) => void;
  onDeleteSession: (dayIndex: number, sessionIndex: number) => void;
  //getTypeColor: (type: Session['type']) => string;
}

export function DaySchedule({
  days,
  editMode,
  onAddSession,
  onEditSession,
  onDeleteSession,
  //getTypeColor,
}: DayScheduleProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-5">
      {/* Tabs */}
      <div className="flex bg-gray-50 border-b-2 border-gray-200 overflow-x-auto">
        {days.map((day, idx) => (
          <button
            key={day.day}
            onClick={() => setActiveTab(idx)}
            className={`flex-1 min-w-[120px] px-3 py-4 border-b-[3px] transition-all ${
              activeTab === idx
                ? 'bg-white border-blue-500'
                : 'border-transparent hover:bg-gray-100'
            }`}
          >
            <div
              className={`font-semibold text-sm mb-1 ${
                activeTab === idx ? 'text-blue-500' : 'text-gray-900'
              }`}
            >
              {day.day}
            </div>
            <div className="text-xs text-gray-500">{day.date}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              {days[activeTab].day}
            </h2>
            <p className="text-base text-gray-500">{days[activeTab].date}</p>
          </div>
          {editMode && (
            <button
              onClick={() => onAddSession(activeTab)}
              className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors"
            >
              + Add Session
            </button>
          )}
        </div>

        <div className="space-y-3">
          {days[activeTab].sessions.map((session, sessionIdx) => (
            <SessionCard
              key={sessionIdx}
              session={session}
              dayIndex={activeTab}
              sessionIndex={sessionIdx}
              editMode={editMode}
              onEdit={onEditSession}
              onDelete={onDeleteSession}
              //getTypeColor={getTypeColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}