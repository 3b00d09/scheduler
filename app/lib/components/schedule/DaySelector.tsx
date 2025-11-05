import { DAYS, COLORS } from "@/app/lib/constants";
import { formatDate, getDateKey } from "@/app/lib/utils";

interface DaySelectorProps {
  weekDates: Date[];
  selectedDay: string;
  onSelectDay: (day: string) => void;
}

export function DaySelector({
  weekDates,
  selectedDay,
  onSelectDay,
}: DaySelectorProps) {
  const FULL_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="grid grid-cols-7 gap-1 mb-4">
      {DAYS.map((day, idx) => (
        <button
          key={day}
          onClick={() => onSelectDay(FULL_DAYS[idx])}
          className="flex flex-col items-center justify-center rounded-lg font-medium text-xs py-2 transition-all"
          style={{
            backgroundColor:
              selectedDay === FULL_DAYS[idx]
                ? COLORS.primary
                : COLORS.secondary,
            color:
              selectedDay === FULL_DAYS[idx] ? COLORS.background : COLORS.text,
          }}
        >
          <span className="mb-1">{day}</span>
          <span className="text-xs opacity-70">
            {formatDate(weekDates[idx])}
          </span>
        </button>
      ))}
    </div>
  );
}

interface DaySelectorWithIndexProps {
  weekDates: Date[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

export function DaySelectorWithIndex({
  weekDates,
  selectedDayIndex,
  onSelectDay,
}: DaySelectorWithIndexProps) {
  const today = getDateKey(new Date());

  return (
    <div className="grid grid-cols-7 gap-1 mb-4">
      {DAYS.map((day, idx) => {
        const isDayToday = getDateKey(weekDates[idx]) === today;
        return (
          <button
            key={day}
            onClick={() => onSelectDay(idx)}
            className="flex flex-col items-center justify-center rounded-lg font-medium text-xs py-2 transition-all relative"
            style={{
              backgroundColor:
                selectedDayIndex === idx ? COLORS.primary : COLORS.secondary,
              color: selectedDayIndex === idx ? COLORS.background : COLORS.text,
            }}
          >
            <span className="mb-1">{day}</span>
            <span className="text-xs opacity-70">
              {formatDate(weekDates[idx])}
            </span>
            {isDayToday && (
              <div
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS.primary }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}