import { Clock } from "lucide-react";
import { COLORS } from "@/app/lib/constants";

export default function EmptyState() {
  return (
    <div
      className="p-6 rounded-lg text-center"
      style={{ backgroundColor: COLORS.accent }}
    >
      <Clock size={32} className="mx-auto mb-2 opacity-50" />
      <p className="opacity-70">No tasks scheduled</p>
    </div>
  );
}
