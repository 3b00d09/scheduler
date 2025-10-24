// app/components/FeaturesList.tsx
export function FeaturesList() {
  const features = [
    'Personalized day-by-day schedule',
    'Smart study time allocation',
    'Break & recovery planning',
    'Deadline prioritization',
  ];

  return (
    <div className="bg-violet-600 rounded-3xl p-5 mb-5 shadow-lg shadow-violet-600/30">
      <h3 className="text-lg font-extrabold text-white mb-4">
        ✨ What You'll Get
      </h3>
      <div className="space-y-2.5">
        {features.map((feature) => (
          <div key={feature} className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">✓</span>
            </div>
            <span className="text-white text-sm font-medium">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}