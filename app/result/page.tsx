// app/result/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPlan, savePlan, clearPlan } from "../lib/utils";
import type { StudyPlan, Session } from '../lib/types';
import { UrgentTasks } from '../components/UrgetTasks';
import { StudyDistribution } from '../components/StudyDistribution';
import { DaySchedule } from '../components/DaySchedule';
import { ProTips } from '../components/ProTips';
import { EditSessionModal } from '../components/EditSessionModal';

// const getTypeColor = (type: Session['type']): string => {
//   const colors = {
//     class: '#3B82F6',
//     study: '#8B5CF6',
//     work: '#1F2937',
//     rest: '#10B981',
//     commute: '#F97316',
//     free: '#6B7280',
//   };
//   return colors[type];
// };

export default function ResultPage() {
  const router = useRouter();
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editingSession, setEditingSession] = useState<{
    dayIndex: number;
    sessionIndex: number;
  } | null>(null);

  useEffect(() => {
    const plan = getPlan();
    if (!plan) {
      router.push('/');
      return;
    }
    setStudyPlan(plan);
  }, [router]);

  if (!studyPlan) {
    return null;
  }

  const handleUpdateSession = (
    dayIndex: number,
    sessionIndex: number,
    updates: Partial<Session>
  ) => {
    const newPlan = { ...studyPlan };
    newPlan.days[dayIndex].sessions[sessionIndex] = {
      ...newPlan.days[dayIndex].sessions[sessionIndex],
      ...updates,
    };
    setStudyPlan(newPlan);
    savePlan(newPlan);
  };

  const handleDeleteSession = (dayIndex: number, sessionIndex: number) => {
    if (confirm('Delete this session?')) {
      const newPlan = { ...studyPlan };
      newPlan.days[dayIndex].sessions.splice(sessionIndex, 1);
      setStudyPlan(newPlan);
      savePlan(newPlan);
    }
  };

  const handleAddSession = (dayIndex: number) => {
    const newSession: Session = {
      time: '09:00-10:00',
      type: 'study',
      title: 'New Session',
      icon: '📚',
      focus: 'Add details here',
    };
    const newPlan = { ...studyPlan };
    newPlan.days[dayIndex].sessions.push(newSession);
    setStudyPlan(newPlan);
    savePlan(newPlan);
    setEditingSession({
      dayIndex,
      sessionIndex: newPlan.days[dayIndex].sessions.length - 1,
    });
  };

  const handleSaveSession = (session: Session) => {
    if (editingSession) {
      handleUpdateSession(
        editingSession.dayIndex,
        editingSession.sessionIndex,
        session
      );
      setEditingSession(null);
    }
  };

  const handleNewPlan = () => {
    clearPlan();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 flex justify-between items-center px-5 py-4 bg-white border-b border-gray-200">
        <button
          onClick={() => router.push('/')}
          className="text-base text-blue-500 font-bold hover:text-blue-600"
        >
          ← Back
        </button>
        <h2 className="text-base font-bold text-gray-900">Your Study Plan</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="text-sm text-violet-600 font-bold bg-violet-100 px-3 py-1.5 rounded-xl hover:bg-violet-200"
        >
          {editMode ? '💾 Done' : '✏️ Edit'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center bg-emerald-100 px-4 py-2 rounded-full mb-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            <span className="text-emerald-800 font-extrabold text-sm">
              {editMode ? 'Edit Mode' : 'Plan Ready!'}
            </span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-1">This Week</h1>
          <p className="text-base text-gray-500">
            {studyPlan.stats.totalHours} hours of focused study
          </p>
        </div>

        <UrgentTasks tasks={studyPlan.urgent} />
        <StudyDistribution
          subjects={studyPlan.stats.subjects}
          totalHours={studyPlan.stats.totalHours}
        />
        <DaySchedule
          days={studyPlan.days}
          editMode={editMode}
          onAddSession={handleAddSession}
          onEditSession={(dayIndex, sessionIndex) =>
            setEditingSession({ dayIndex, sessionIndex })
          }
          onDeleteSession={handleDeleteSession}
          //getTypeColor={getTypeColor}
        />
        <ProTips tips={studyPlan.tips} />
      </div>

      {/* Floating Button */}
      {!editMode && (
        <div className="fixed bottom-5 left-5 right-5 flex justify-center z-50">
          <button
            onClick={handleNewPlan}
            className="bg-violet-600 text-white px-8 py-4 rounded-full shadow-lg shadow-violet-600/40 font-extrabold text-base hover:bg-violet-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-600/50 active:translate-y-0 transition-all"
          >
            ✨ Create New Plan
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingSession && (
        <EditSessionModal
          session={
            studyPlan.days[editingSession.dayIndex].sessions[
              editingSession.sessionIndex
            ]
          }
          onSave={handleSaveSession}
          onClose={() => setEditingSession(null)}
        />
      )}
    </div>
  );
}