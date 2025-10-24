// app/components/ScheduleInput.tsx
'use client';

interface ScheduleInputProps {
  value: string;
  onChange: (value: string) => void;
  onLoadExample: () => void;
}

export function ScheduleInput({
  value,
  onChange,
  onLoadExample,
}: ScheduleInputProps) {
  return (
    <div className="bg-white rounded-3xl p-5 mb-5 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-extrabold text-gray-900">Your Schedule</h2>
        <button
          onClick={onLoadExample}
          className="bg-violet-100 px-3 py-1.5 rounded-full text-xs font-bold text-violet-600 hover:bg-violet-200 transition-colors"
        >
          Load Example
        </button>
      </div>
      <textarea
        className="w-full h-64 bg-gray-50 rounded-2xl p-4 text-sm border-2 border-gray-200 resize-none focus:outline-none focus:border-violet-600 transition-colors"
        placeholder="📝 Describe your week...&#10;• Classes & times&#10;• Work shifts&#10;• Commute time&#10;• Deadlines&#10;• Exam dates&#10;• Energy levels"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}