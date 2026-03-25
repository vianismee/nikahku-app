import { create } from "zustand";
import { persist } from "zustand/middleware";

type ViewMode = "grid" | "list";
type BudgetTab = "overview" | "allocation" | "expenses";
type SeserahanTab = "semua" | "mahar" | "seserahan";

interface UIState {
  sidebarOpen: boolean;
  vendorViewMode: ViewMode;
  guestViewMode: ViewMode;
  budgetTab: BudgetTab;
  seserahanTab: SeserahanTab;
  vendorCompareIds: string[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setVendorViewMode: (mode: ViewMode) => void;
  setGuestViewMode: (mode: ViewMode) => void;
  setBudgetTab: (tab: BudgetTab) => void;
  setSeserahanTab: (tab: SeserahanTab) => void;
  addVendorCompare: (id: string) => void;
  removeVendorCompare: (id: string) => void;
  clearVendorCompare: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      vendorViewMode: "grid",
      guestViewMode: "list",
      budgetTab: "overview",
      seserahanTab: "semua",
      vendorCompareIds: [],
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setVendorViewMode: (mode) => set({ vendorViewMode: mode }),
      setGuestViewMode: (mode) => set({ guestViewMode: mode }),
      setBudgetTab: (tab) => set({ budgetTab: tab }),
      setSeserahanTab: (tab) => set({ seserahanTab: tab }),
      addVendorCompare: (id) =>
        set((s) => ({
          vendorCompareIds: s.vendorCompareIds.includes(id)
            ? s.vendorCompareIds
            : [...s.vendorCompareIds, id].slice(0, 4),
        })),
      removeVendorCompare: (id) =>
        set((s) => ({
          vendorCompareIds: s.vendorCompareIds.filter((v) => v !== id),
        })),
      clearVendorCompare: () => set({ vendorCompareIds: [] }),
    }),
    {
      name: "nikahku-ui",
      partialize: (state) => ({
        vendorViewMode: state.vendorViewMode,
        guestViewMode: state.guestViewMode,
      }),
    }
  )
);
