"use client";

import { VENDOR_STATUSES, VENDOR_STATUS_PIPELINE, type VendorStatus } from "@/lib/constants/vendor-statuses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateVendor } from "@/lib/hooks/use-vendors";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface VendorStatusPipelineProps {
  vendorId: string;
  currentStatus: VendorStatus;
}

export function VendorStatusPipeline({ vendorId, currentStatus }: VendorStatusPipelineProps) {
  const updateVendor = useUpdateVendor();
  const currentInfo = VENDOR_STATUSES[currentStatus];
  const currentIndex = VENDOR_STATUS_PIPELINE.indexOf(currentStatus);

  async function handleChange(value: string | null) {
    if (!value || value === currentStatus) return;
    try {
      await updateVendor.mutateAsync({ id: vendorId, status: value as VendorStatus });
      toast.success(`Status diubah ke ${VENDOR_STATUSES[value as VendorStatus].label}`);
    } catch {
      toast.error("Gagal mengubah status");
    }
  }

  return (
    <Select
      value={currentStatus}
      onValueChange={handleChange}
      disabled={updateVendor.isPending}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          <div className="flex items-center gap-2.5">
            {/* Ping dot */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                style={{ backgroundColor: currentInfo.color }}
              />
              <span
                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: currentInfo.color }}
              />
            </span>
            <span className="text-sm font-medium">{currentInfo.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {VENDOR_STATUS_PIPELINE.map((status, i) => {
          const info = VENDOR_STATUSES[status];
          const isPast = i < currentIndex;
          const isActive = status === currentStatus;

          return (
            <SelectItem key={status} value={status}>
              <div className="flex items-center gap-2.5 w-full">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: info.color }}
                />
                <span className={isActive ? "font-medium" : ""}>{info.label}</span>
                {isPast && (
                  <Check className="h-3 w-3 text-muted-foreground ml-auto" />
                )}
              </div>
            </SelectItem>
          );
        })}

        <SelectSeparator />

        <SelectItem value="cancelled">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full shrink-0 bg-red-500" />
            <span className="text-red-500">Dibatalkan</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
