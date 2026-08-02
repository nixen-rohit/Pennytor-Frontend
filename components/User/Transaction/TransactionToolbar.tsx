import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilterCount: number;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
}

export function TransactionToolbar({
  searchTerm,
  onSearchChange,
  activeFilterCount,
  hasActiveFilters,
  onOpenFilters,
}: Props) {
  return (
    <div className="bg-black flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      <div className="relative w-full lg:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search this table..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 focus-visible:ring-indigo-500"
        />
      </div>
      <Button variant="outline" onClick={onOpenFilters}>
        <Filter className="mr-2 h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <span className="ml-2 rounded-full bg-indigo-600 text-white px-2 py-0.5 text-xs font-medium">
            {activeFilterCount}
          </span>
        )}
      </Button>
    </div>
  );
}
