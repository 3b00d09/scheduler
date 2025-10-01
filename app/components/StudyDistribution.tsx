// app/components/StudyDistribution.tsx
import type { Subject } from '../lib/types';

interface StudyDistributionProps {
  subjects: Subject[];
  totalHours: number;
}

export function StudyDistribution({
  subjects,
  totalHours,
}: StudyDistributionProps) {
  return (
    <div className="bg-white rounded-3xl p-5 mb-5 shadow-lg">
      <h3 className="text-lg font-extrabold text-gray-900 mb-4">
        Study Distribution
      </h3>
      {subjects.map((subject, idx) => (
        <div key={idx} className="mb-4 last:mb-0">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-bold text-gray-700">
              {subject.name}
            </span>
            <span className="text-xs font-extrabold text-gray-500">
              {subject.hours}h
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(subject.hours / totalHours) * 100}%`,
                backgroundColor: subject.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}