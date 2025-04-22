import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FilterButton({ onClick, hasActiveFilters }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <SlidersHorizontal className="h-4 w-4" />
      <span>Filter</span>
      {hasActiveFilters && (
        <Badge variant="secondary">
          Active
        </Badge>
      )}
    </Button>
  );
}