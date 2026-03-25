import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  label: string;
  color: string;
  bgColor: string;
  className?: string;
}

export function StatusBadge({ label, color, bgColor, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium border-0", className)}
      style={{
        color,
        backgroundColor: bgColor,
      }}
    >
      {label}
    </Badge>
  );
}
