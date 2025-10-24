// app/components/UrgentTasks.tsx
import type { UrgentTask } from "../types";

interface UrgentTasksProps {
  tasks: UrgentTask[];
}

export function UrgentTasks({ tasks }: UrgentTasksProps) {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="bg-red-500 rounded-3xl p-5 mb-5 shadow-lg shadow-red-500/30">
      <h3 className="text-lg font-extrabold text-white mb-4">
        🔥 Urgent This Week
      </h3>
      {tasks.map((task, idx) => (
        <div
          key={idx}
          className="bg-white/20 rounded-2xl p-4 flex justify-between items-center mb-2.5 last:mb-0"
        >
          <div>
            <div className="text-white font-bold text-base mb-1">
              {task.title}
            </div>
            <div className="text-white/80 text-xs">Due {task.due}</div>
          </div>
          <div className="w-8 h-8 rounded-2xl bg-white/30 flex items-center justify-center text-white text-xl font-bold">
            ›
          </div>
        </div>
      ))}
    </div>
  );
}