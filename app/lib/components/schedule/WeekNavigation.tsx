import { ChevronLeft, ChevronRight } from "lucide-react";
import { getWeekRange } from "@/app/lib/utils";
import { COLORS } from "@/app/lib/constants";

interface WeekNavigationProps {
  weekOffset: number;
  onPrevious: () => void;
  onNext: () => void;
  weekDates: Date[];
}

export default function WeekNavigation({
  weekOffset,
  onPrevious,
  onNext,
  weekDates,
}: WeekNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={onPrevious}
        className="p-2 rounded-lg transition-all"
        style={{ backgroundColor: COLORS.secondary }}
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-sm font-medium">{getWeekRange(weekDates)}</span>
      <button
        onClick={onNext}
        className="p-2 rounded-lg transition-all"
        style={{ backgroundColor: COLORS.secondary }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
