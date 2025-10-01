// app/components/StatsCards.tsx
export function StatsCards() {
  const stats = [
    { emoji: '⚡', label: 'Smart AI' },
    { emoji: '📅', label: 'Weekly Plans' },
    { emoji: '🎯', label: 'Stay Focused' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl p-4 text-center shadow-md"
        >
          <div className="text-3xl mb-1">{stat.emoji}</div>
          <div className="text-xs text-gray-500 font-bold">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}