import { Header } from "./lib/components/Header";
import { StatsCards } from "./lib/components/StatsCard";

export default function Page(){
  return(
    <div className="grid gap-6">
      <Header />
      <StatsCards />
      <ActionSelector/>
    </div>
  )
}

 function ActionSelector() {
  return (
    <div className="px-4 py-6 bg-secondary rounded-lg">
      <h2 className="text-xl font-bold text-text mb-4">
        Get Started
      </h2>
      
      <div className="space-y-3">
        <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl p-4 shadow-lg active:scale-98 transition-transform">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div className="text-left flex-1">
              <div className="font-semibold text-lg">AI Generate Plan</div>
              <div className="text-sm">
                Let AI create your schedule
              </div>
            </div>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>

        <button className="w-full bg-text text-black rounded-2xl p-4 shadow border border-gray-200 active:scale-98 transition-transform">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✏️</span>
            <div className="text-left flex-1">
              <div className="font-semibold text-lg">Manual Input</div>
              <div className="text-gray-500 text-sm">
                Create your own schedule
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}