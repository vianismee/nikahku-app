import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
}

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold font-number mt-0.5 sm:mt-1 truncate">
              {value}
            </p>
            {description && (
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">{description}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-[10px] sm:text-xs font-medium mt-0.5 sm:mt-1",
                  trend.value >= 0 ? "text-green-600" : "text-destructive"
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}% {trend.label}
              </p>
            )}
          </div>
          {Icon && (
            <div className="rounded-lg border border-border p-1.5 sm:p-2 shrink-0">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
