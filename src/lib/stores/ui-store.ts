import { create } from "zustand";
import { persist } from "zustand/middleware";

type ViewMode = "grid" | "list";
type BudgetTab = "overview" | "allocation" | "expenses";
type SeserahanTab = "semua" | "mahar" | "seserahan";

export const DEFAULT_MOBILE_NAV_ITEMS = [
  "/dashboard",
  "/vendor",
  "/seserahan",
  "/guest",
  "/dokumen",
];

export const DASHBOARD_WIDGETS = [
  { id: "tasks", label: "Task Mendatang" },
  { id: "seserahan", label: "Progress Seserahan" },
  { id: "booked_vendors", label: "Vendor Booked" },
  { id: "quick_links", label: "Menu Utama" },
] as const;

export const DEFAULT_WIDGET_ORDER = DASHBOARD_WIDGETS.map((w) => w.id);

interface UIState {
  sidebarOpen: boolean;
  vendorViewMode: ViewMode;
  guestViewMode: ViewMode;
  budgetTab: BudgetTab;
  seserahanTab: SeserahanTab;
  vendorCompareIds: string[];
  vendorCompareCategoryId: string | null;
  dashboardWidgetOrder: string[];
  dashboardHiddenWidgets: string[];
  mobileNavItems: string[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setVendorViewMode: (mode: ViewMode) => void;
  setGuestViewMode: (mode: ViewMode) => void;
  setBudgetTab: (tab: BudgetTab) => void;
  setSeserahanTab: (tab: SeserahanTab) => void;
  addVendorCompare: (id: string, categoryId: string | null) => void;
  removeVendorCompare: (id: string) => void;
  clearVendorCompare: () => void;
  setDashboardWidgetOrder: (order: string[]) => void;
  toggleDashboardWidget: (id: string) => void;
  resetDashboardLayout: () => void;
  setMobileNavItems: (items: string[]) => void;
  resetMobileNav: () => void;
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
      dashboardWidgetOrder: [...DEFAULT_WIDGET_ORDER],
      dashboardHiddenWidgets: [],
      mobileNavItems: [...DEFAULT_MOBILE_NAV_ITEMS],
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setVendorViewMode: (mode) => set({ vendorViewMode: mode }),
      setGuestViewMode: (mode) => set({ guestViewMode: mode }),
      setBudgetTab: (tab) => set({ budgetTab: tab }),
      setSeserahanTab: (tab) => set({ seserahanTab: tab }),
      addVendorCompare: (id, categoryId) =>
        set((s) => {
          if (s.vendorCompareIds.includes(id)) return s;
          const catId = s.vendorCompareIds.length === 0 ? categoryId : s.vendorCompareCategoryId;
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
      setDashboardWidgetOrder: (order) => set({ dashboardWidgetOrder: order }),
      toggleDashboardWidget: (id) =>
        set((s) => ({
          dashboardHiddenWidgets: s.dashboardHiddenWidgets.includes(id)
            ? s.dashboardHiddenWidgets.filter((w) => w !== id)
            : [...s.dashboardHiddenWidgets, id],
        })),
      resetDashboardLayout: () =>
        set({ dashboardWidgetOrder: [...DEFAULT_WIDGET_ORDER], dashboardHiddenWidgets: [] }),
      setMobileNavItems: (items) => set({ mobileNavItems: items }),
      resetMobileNav: () => set({ mobileNavItems: [...DEFAULT_MOBILE_NAV_ITEMS] }),
    }),
    {
      name: "nikahku-ui",
      partialize: (state) => ({
        vendorViewMode: state.vendorViewMode,
        guestViewMode: state.guestViewMode,
        dashboardWidgetOrder: state.dashboardWidgetOrder,
        dashboardHiddenWidgets: state.dashboardHiddenWidgets,
        mobileNavItems: state.mobileNavItems,
      }),
    }
  )
);
