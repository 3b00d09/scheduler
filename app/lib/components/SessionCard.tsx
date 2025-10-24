// app/components/SessionCard.tsx
'use client';

import type { Session } from '../lib/types';

interface SessionCardProps {
  session: Session;
  dayIndex: number;
  sessionIndex: number;
  editMode: boolean;
  onEdit: (dayIndex: number, sessionIndex: number) => void;
  onDelete: (dayIndex: number, sessionIndex: number) => void;
  //getTypeColor: (type: Session['type']) => string;
}

export function SessionCard({
  session,
  dayIndex,
  sessionIndex,
  editMode,
  onEdit,
  onDelete,
  //getTypeColor,
}: SessionCardProps) {
  return (
    <div className="bg-white rounded-2xl mb-3 flex overflow-hidden shadow-md">
      <div
        className="w-1.5"
        //style={{ backgroundColor: getTypeColor(session.type) }}
      />
      <div className="flex p-4 flex-1">
        <div className="text-3xl mr-3">{session.icon}</div>
        <div className="flex-1">
          <div className="text-base font-extrabold text-gray-900 mb-1">
            {session.title}
          </div>
          <div className="text-xs text-gray-500 font-bold">{session.time}</div>
          {session.focus && (
            <div className="mt-2">
              <span className="bg-violet-100 px-2 py-1 rounded-xl text-[11px] text-violet-600 font-bold">
                {session.focus}
              </span>
            </div>
          )}
        </div>
        {editMode && (
          <div className="flex gap-2 ml-3">
            <button
              onClick={() => onEdit(dayIndex, sessionIndex)}
              className="w-9 h-9 rounded-lg bg-gray-100 text-base hover:bg-violet-600 hover:text-white hover:scale-110 transition-all"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(dayIndex, sessionIndex)}
              className="w-9 h-9 rounded-lg bg-gray-100 text-base hover:bg-red-500 hover:text-white hover:scale-110 transition-all"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}