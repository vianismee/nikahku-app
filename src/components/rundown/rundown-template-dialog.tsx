"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Sun,
  Moon,
  ScrollText,
  CalendarDays,
  Clock,
  MapPin,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { RUNDOWN_TEMPLATES, type RundownTemplate } from "@/lib/utils/rundown-templates";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  mosque: Building2,
  sun: Sun,
  moon: Moon,
  scroll: ScrollText,
  calendar: CalendarDays,
};

interface RundownTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (template: RundownTemplate) => Promise<void>;
  isLoading?: boolean;
}

export function RundownTemplateDialog({
  open,
  onOpenChange,
  onApply,
  isLoading,
}: RundownTemplateDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const selectedTemplate = RUNDOWN_TEMPLATES.find((t) => t.id === selectedId);

  const handleApply = async () => {
    if (!selectedTemplate) return;
    await onApply(selectedTemplate);
    setSelectedId(null);
    setExpandedId(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl flex flex-col" style={{ maxHeight: "90vh" }}>
        <DialogHeader>
          <DialogTitle>Pilih Template Rundown</DialogTitle>
          <DialogDescription>
            Pilih template yang sesuai dengan jenis acaramu. Event akan ditambahkan ke rundown yang sudah ada.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-3 py-2">
          {RUNDOWN_TEMPLATES.map((template) => {
            const Icon = ICON_MAP[template.icon] ?? CalendarDays;
            const isSelected = selectedId === template.id;
            const isExpanded = expandedId === template.id;

            return (
              <div
                key={template.id}
                className={`rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 bg-background"
                }`}
                onClick={() => setSelectedId(template.id)}
              >
                {/* Header */}
                <div className="flex items-start gap-3 p-4">
                  <div
                    className={`rounded-lg p-2 shrink-0 ${
                      isSelected ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{template.name}</p>
                      <Badge variant="secondary" className="text-[10px]">
                        {template.events.length} acara
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {template.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(isExpanded ? null : template.id);
                    }}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Preview events */}
                {isExpanded && (
                  <div className="border-t px-4 pb-4 pt-3 space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Preview Acara
                    </p>
                    {template.events.map((event, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-xs bg-muted/40 rounded-lg p-2.5"
                      >
                        <div className="flex items-center gap-1 text-muted-foreground shrink-0 w-20">
                          <Clock className="h-3 w-3" />
                          <span>
                            {event.start_time}
                            {event.end_time ? ` – ${event.end_time}` : ""}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{event.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <Badge variant="outline" className="text-[10px] h-4 px-1">
                              {event.session}
                            </Badge>
                            {event.pic && (
                              <span className="flex items-center gap-0.5 text-muted-foreground">
                                <User className="h-2.5 w-2.5" />
                                {event.pic}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-0.5 text-muted-foreground">
                                <MapPin className="h-2.5 w-2.5" />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleApply} disabled={!selectedId || isLoading}>
            {isLoading
              ? "Menerapkan..."
              : selectedId
              ? `Gunakan "${selectedTemplate?.name}"`
              : "Pilih Template Dulu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
