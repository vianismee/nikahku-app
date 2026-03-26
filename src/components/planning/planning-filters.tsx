"use client";

import { Search, Kanban, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKanbanStore } from "@/lib/stores/kanban-store";
import { cn } from "@/lib/utils";

const TASK_CATEGORIES = [
  { value: "all", label: "Semua" },
  { value: "venue", label: "Venue" },
  { value: "catering", label: "Catering" },
  { value: "dekorasi", label: "Dekorasi" },
  { value: "fotografi", label: "Fotografi" },
  { value: "busana", label: "Busana" },
  { value: "undangan", label: "Undangan" },
  { value: "lainnya", label: "Lainnya" },
];

const PRIORITY_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

interface PlanningFiltersProps {
  viewMode: "kanban" | "list";
  onViewModeChange: (mode: "kanban" | "list") => void;
}

export function PlanningFilters({
  viewMode,
  onViewModeChange,
}: PlanningFiltersProps) {
  const { searchQuery, setSearchQuery, setFilterCategory, setFilterPriority } =
    useKanbanStore();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="relative flex-1 w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari task..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        defaultValue="all"
        onValueChange={(val) =>
          setFilterCategory(val === "all" ? null : val)
        }
      >
        <SelectTrigger className="w-full sm:w-auto">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          {TASK_CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue="all"
        onValueChange={(val) =>
          setFilterPriority(val === "all" ? null : val)
        }
      >
        <SelectTrigger className="w-full sm:w-auto">
          <SelectValue placeholder="Prioritas" />
        </SelectTrigger>
        <SelectContent>
          {PRIORITY_OPTIONS.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1 border rounded-lg p-0.5">
        <Button
          variant={viewMode === "kanban" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => onViewModeChange("kanban")}
          aria-label="Tampilan Kanban"
        >
          <Kanban className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => onViewModeChange("list")}
          aria-label="Tampilan List"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
