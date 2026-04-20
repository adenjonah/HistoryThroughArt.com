import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "Relevance", label: "Sort: Relevance" },
  { value: "ID Ascending", label: "Sort: ID ↑" },
  { value: "ID Descending", label: "Sort: ID ↓" },
  { value: "Name Ascending", label: "Sort: Name A–Z" },
  { value: "Name Descending", label: "Sort: Name Z–A" },
  { value: "Unit Ascending", label: "Sort: Content Area ↑" },
  { value: "Unit Descending", label: "Sort: Content Area ↓" },
  { value: "Date Ascending", label: "Sort: Date ↑" },
  { value: "Date Descending", label: "Sort: Date ↓" },
  { value: "Korus Sort", label: "Sort: Korus Order" },
];

function SortComponent({ sort, setSort, setClearFilters }) {
  const handleSortChange = (value: string) => {
    setSort(value);
    setClearFilters(value === "Relevance" || value === "ID Ascending");
    localStorage.setItem("sort", value);
  };

  useEffect(() => {
    const savedSort = localStorage.getItem("sort");
    if (savedSort) {
      setSort(savedSort);
      setClearFilters(savedSort === "Relevance" || savedSort === "ID Ascending");
    }
  }, [setSort, setClearFilters]);

  return (
    <Select value={sort} onValueChange={handleSortChange}>
      <SelectTrigger
        className="min-h-[44px] w-full
                   bg-[var(--background-color)] border-[var(--accent-color)]/50
                   text-[var(--text-color)] text-sm sm:text-base
                   hover:bg-[var(--accent-color)]/20
                   focus:ring-[var(--button-color)] focus:ring-offset-0"
        aria-label="Sort artworks"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className="bg-[var(--background-color)] border-[var(--accent-color)]/40
                   text-[var(--text-color)] shadow-xl shadow-black/40"
      >
        {SORT_OPTIONS.map(({ value, label }) => (
          <SelectItem
            key={value}
            value={value}
            className="text-[var(--text-color)] focus:bg-[var(--accent-color)]/30
                       focus:text-[var(--text-color)] cursor-pointer"
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SortComponent;
