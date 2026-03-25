import { create } from "zustand";

export interface KanbanColumn {
  id: string;
  title: string;
}

const DEFAULT_COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

interface KanbanState {
  columns: KanbanColumn[];
  draggedTaskId: string | null;
  filterCategory: string | null;
  filterPriority: string | null;
  searchQuery: string;
  setColumns: (columns: KanbanColumn[]) => void;
  setDraggedTaskId: (id: string | null) => void;
  setFilterCategory: (category: string | null) => void;
  setFilterPriority: (priority: string | null) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useKanbanStore = create<KanbanState>()((set) => ({
  columns: DEFAULT_COLUMNS,
  draggedTaskId: null,
  filterCategory: null,
  filterPriority: null,
  searchQuery: "",
  setColumns: (columns) => set({ columns }),
  setDraggedTaskId: (id) => set({ draggedTaskId: id }),
  setFilterCategory: (category) => set({ filterCategory: category }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () =>
    set({ filterCategory: null, filterPriority: null, searchQuery: "" }),
}));
