// app/components/ProTips.tsx
interface ProTipsProps {
  tips: string[];
}

export function ProTips({ tips }: ProTipsProps) {
  if (!tips || tips.length === 0) return null;

  return (
    <div className="bg-blue-500 rounded-3xl p-5 mb-5 shadow-lg shadow-blue-500/30">
      <h3 className="text-lg font-extrabold text-white mb-4">💡 Pro Tips</h3>
      {tips.map((tip, idx) => (
        <p key={idx} className="text-white text-sm mb-2 last:mb-0">
          {tip}
        </p>
      ))}
    </div>
  );
}