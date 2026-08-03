import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ReferralFilters {
  active: string;
  level: string;
  kyc: string;
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ReferralFilters;
  onFiltersChange: (filters: ReferralFilters) => void;
  onClear: () => void;
}

const LEVELS = ["0", "1", "2", "3"];

export function FilterDialog({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onClear,
}: FilterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Referrals</DialogTitle>
          <DialogDescription>
            Apply filters to narrow down referral records.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.active}
              onValueChange={(v) => onFiltersChange({ ...filters, active: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <Select
              value={filters.level}
              onValueChange={(v) => onFiltersChange({ ...filters, level: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    Level {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClear}>
            Clear Filters
          </Button>
          <Button onClick={() => onOpenChange(false)}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
