"use client";

import { useState } from "react";
import { Plus, X, Store, Wallet, Users, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VendorFormSheet } from "@/components/vendor/vendor-form-sheet";
import { TaskFormDialog } from "@/components/planning/task-form-dialog";
import { ExpenseFormDialog } from "@/components/budget/expense-form-dialog";
import { GuestFormDialog } from "@/components/guest/guest-form-dialog";

interface QuickActionsFabProps {
  weddingId: string;
}

const ACTIONS = [
  { id: "vendor", label: "Vendor", icon: Store },
  { id: "expense", label: "Pengeluaran", icon: Wallet },
  { id: "guest", label: "Tamu", icon: Users },
  { id: "task", label: "Task", icon: ClipboardList },
] as const;

export function QuickActionsFab({ weddingId }: QuickActionsFabProps) {
  const [open, setOpen] = useState(false);
  const [vendorFormOpen, setVendorFormOpen] = useState(false);
  const [expenseFormOpen, setExpenseFormOpen] = useState(false);
  const [guestFormOpen, setGuestFormOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);

  function handleAction(id: (typeof ACTIONS)[number]["id"]) {
    setOpen(false);
    if (id === "vendor") setVendorFormOpen(true);
    else if (id === "expense") setExpenseFormOpen(true);
    else if (id === "guest") setGuestFormOpen(true);
    else if (id === "task") setTaskFormOpen(true);
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 flex flex-col items-end gap-2">
        {/* Action items */}
        {open && (
          <div className="flex flex-col items-end gap-2">
            {ACTIONS.map((action) => (
              <div key={action.id} className="flex items-center gap-2">
                <span className="text-sm font-medium bg-background border border-border rounded-md px-2 py-1 shadow-sm whitespace-nowrap">
                  {action.label}
                </span>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full shadow-md"
                  onClick={() => handleAction(action.id)}
                >
                  <action.icon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setOpen((v) => !v)}
          aria-label="Quick actions"
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </Button>
      </div>

      <VendorFormSheet
        weddingId={weddingId}
        open={vendorFormOpen}
        onOpenChange={setVendorFormOpen}
      />

      <ExpenseFormDialog
        weddingId={weddingId}
        open={expenseFormOpen}
        onOpenChange={setExpenseFormOpen}
      />

      <GuestFormDialog
        weddingId={weddingId}
        open={guestFormOpen}
        onOpenChange={setGuestFormOpen}
      />

      <TaskFormDialog
        weddingId={weddingId}
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        task={null}
      />
    </>
  );
}
