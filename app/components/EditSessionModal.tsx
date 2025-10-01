// app/components/EditSessionModal.tsx
'use client';

import { useState } from 'react';
import type { Session } from '../lib/types';

interface EditSessionModalProps {
  session: Session;
  onSave: (session: Session) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS = [
  '📚',
  '💻',
  '🏥',
  '💊',
  '🧪',
  '🩺',
  '🎯',
  '✏️',
  '🗄️',
  '🏨',
  '💤',
  '🚂',
  '☕',
  '🍽️',
];

export function EditSessionModal({
  session: initialSession,
  onSave,
  onClose,
}: EditSessionModalProps) {
  const [session, setSession] = useState(initialSession);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(session);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-extrabold text-gray-900">
            Edit Session
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 text-xl hover:bg-red-500 hover:text-white hover:rotate-90 transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-600 focus:ring-[3px] focus:ring-violet-600/10"
              value={session.title}
              onChange={(e) =>
                setSession({ ...session, title: e.target.value })
              }
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Time
            </label>
            <input
              type="text"
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-600 focus:ring-[3px] focus:ring-violet-600/10"
              placeholder="09:00-11:00"
              value={session.time}
              onChange={(e) => setSession({ ...session, time: e.target.value })}
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Type
            </label>
            <select
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-600 focus:ring-[3px] focus:ring-violet-600/10"
              value={session.type}
              onChange={(e) =>
                setSession({
                  ...session,
                  type: e.target.value as Session['type'],
                })
              }
            >
              <option value="class">Class</option>
              <option value="study">Study</option>
              <option value="work">Work</option>
              <option value="rest">Rest</option>
              <option value="commute">Commute</option>
              <option value="free">Free Time</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Icon
            </label>
            <input
              type="text"
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-600 focus:ring-[3px] focus:ring-violet-600/10"
              maxLength={2}
              value={session.icon}
              onChange={(e) => setSession({ ...session, icon: e.target.value })}
            />
            <div className="flex flex-wrap gap-2 mt-2.5">
              {EMOJI_OPTIONS.map((emoji) => (
                <span
                  key={emoji}
                  className="w-10 h-10 flex items-center justify-center text-xl bg-gray-100 rounded-lg cursor-pointer hover:bg-violet-600 hover:scale-110 transition-all"
                  onClick={() => setSession({ ...session, icon: emoji })}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Focus Note (optional)
            </label>
            <input
              type="text"
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-600 focus:ring-[3px] focus:ring-violet-600/10"
              placeholder="e.g., Complete 50%"
              value={session.focus || ''}
              onChange={(e) =>
                setSession({ ...session, focus: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-violet-600 text-white px-6 py-3 rounded-xl text-base font-bold hover:bg-violet-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-600/40 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}