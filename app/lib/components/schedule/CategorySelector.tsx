import { CATEGORIES, COLORS } from "@/app/lib/constants";

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategorySelector({
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <div>
      <label className="block text-sm mb-2 opacity-80">Category</label>
      <div className="grid grid-cols-3 gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className="p-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
            style={{
              backgroundColor:
                selectedCategory === cat.id ? COLORS.primary : COLORS.secondary,
              color:
                selectedCategory === cat.id ? COLORS.background : COLORS.text,
            }}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
