import { forwardRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: "recent" | "alphabetical" | "progress";
  onSortChange: (sort: "recent" | "alphabetical" | "progress") => void;
}

export const SearchFilterBar = forwardRef<HTMLInputElement, SearchFilterBarProps>(
  ({ searchQuery, onSearchChange, sortBy, onSortChange }, ref) => {
    return (
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            ref={ref}
            placeholder="Search flashcard sets... (Press / to focus)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: any) => onSortChange(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

SearchFilterBar.displayName = "SearchFilterBar";
