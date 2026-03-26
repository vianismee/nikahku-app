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
  vendorCompareCategoryId: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setVendorViewMode: (mode: ViewMode) => void;
  setGuestViewMode: (mode: ViewMode) => void;
  setBudgetTab: (tab: BudgetTab) => void;
  setSeserahanTab: (tab: SeserahanTab) => void;
  addVendorCompare: (id: string, categoryId: string | null) => void;
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
      vendorCompareCategoryId: null,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setVendorViewMode: (mode) => set({ vendorViewMode: mode }),
      setGuestViewMode: (mode) => set({ guestViewMode: mode }),
      setBudgetTab: (tab) => set({ budgetTab: tab }),
      setSeserahanTab: (tab) => set({ seserahanTab: tab }),
      addVendorCompare: (id, categoryId) =>
        set((s) => {
          if (s.vendorCompareIds.includes(id)) return s;
          // Lock to category of first vendor selected
          const catId = s.vendorCompareIds.length === 0 ? categoryId : s.vendorCompareCategoryId;
          // Reject if different category
          if (s.vendorCompareIds.length > 0 && categoryId !== s.vendorCompareCategoryId) return s;
          return {
            vendorCompareIds: [...s.vendorCompareIds, id].slice(0, 4),
            vendorCompareCategoryId: catId,
          };
        }),
      removeVendorCompare: (id) =>
        set((s) => {
          const next = s.vendorCompareIds.filter((v) => v !== id);
          return {
            vendorCompareIds: next,
            vendorCompareCategoryId: next.length === 0 ? null : s.vendorCompareCategoryId,
          };
        }),
      clearVendorCompare: () => set({ vendorCompareIds: [], vendorCompareCategoryId: null }),
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
