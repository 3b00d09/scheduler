// app/components/Header.tsx
export function Header() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-3xl bg-violet-600 inline-flex items-center justify-center mb-4 shadow-lg shadow-violet-600/30">
        <span className="text-4xl">✨</span>
      </div>
      <h1 className="text-4xl font-black text-text mb-1">StudyFlow</h1>
      <p className="text-base text-gray-500 font-semibold">
        AI-Powered Study Planner
      </p>
    </div>
  );
}