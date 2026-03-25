"use client";

import { VENDOR_STATUSES, VENDOR_STATUS_PIPELINE, type VendorStatus } from "@/lib/constants/vendor-statuses";
import { cn } from "@/lib/utils";
import { useUpdateVendor } from "@/lib/hooks/use-vendors";
import { toast } from "sonner";

interface VendorStatusPipelineProps {
  vendorId: string;
  currentStatus: VendorStatus;
}

export function VendorStatusPipeline({ vendorId, currentStatus }: VendorStatusPipelineProps) {
  const updateVendor = useUpdateVendor();
  const currentIndex = VENDOR_STATUS_PIPELINE.indexOf(currentStatus);

  async function handleStatusClick(status: VendorStatus) {
    if (status === currentStatus) return;

    try {
      await updateVendor.mutateAsync({ id: vendorId, status });
      toast.success(`Status diubah ke ${VENDOR_STATUSES[status].label}`);
    } catch {
      toast.error("Gagal mengubah status");
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max py-2">
        {VENDOR_STATUS_PIPELINE.map((status, i) => {
          const info = VENDOR_STATUSES[status];
          const isActive = status === currentStatus;
          const isPast = i < currentIndex;

          return (
            <div key={status} className="flex items-center">
              {i > 0 && (
                <div
                  className={cn(
                    "w-6 h-0.5 mx-0.5",
                    isPast ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
              <button
                onClick={() => handleStatusClick(status)}
                disabled={updateVendor.isPending}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                  isActive
                    ? "border-current"
                    : isPast
                      ? "border-transparent opacity-60"
                      : "border-transparent opacity-40 hover:opacity-70"
                )}
                style={{
                  color: isActive || isPast ? info.color : undefined,
                  backgroundColor: isActive ? info.bgColor : undefined,
                }}
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isActive || isPast ? "" : "bg-muted-foreground/30"
                  )}
                  style={{
                    backgroundColor: isActive || isPast ? info.color : undefined,
                  }}
                />
                {info.label}
              </button>
            </div>
          );
        })}

        {currentStatus !== "cancelled" && (
          <>
            <div className="w-6 h-0.5 mx-0.5 bg-muted" />
            <button
              onClick={() => handleStatusClick("cancelled")}
              disabled={updateVendor.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-red-500 border border-transparent hover:bg-red-50 transition-colors"
            >
              Batalkan
            </button>
          </>
        )}
      </div>
    </div>
  );
}
