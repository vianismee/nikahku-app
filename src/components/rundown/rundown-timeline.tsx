"use client";

import { useState, useMemo } from "react";
import { Clock, MapPin, User, Pencil, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/lib/supabase/database.types";

interface RundownTimelineProps {
  events: Tables<"rundown_events">[];
  onEdit: (event: Tables<"rundown_events">) => void;
  onDelete: (event: Tables<"rundown_events">) => void;
  onReorder?: (orderedIds: string[]) => void;
}

// Unique pastel color per session name
function getSessionColor(session: string): string {
  const colors = [
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
    "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  ];
  let hash = 0;
  for (let i = 0; i < session.length; i++) hash += session.charCodeAt(i);
  return colors[hash % colors.length];
}

function getDotColor(session: string): string {
  const dots = [
    "bg-blue-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-sky-500",
    "bg-orange-500",
  ];
  let hash = 0;
  for (let i = 0; i < session.length; i++) hash += session.charCodeAt(i);
  return dots[hash % dots.length];
}

export function RundownTimeline({ events, onEdit, onDelete, onReorder }: RundownTimelineProps) {
  const [collapsedSessions, setCollapsedSessions] = useState<Set<string>>(new Set());
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [localOrder, setLocalOrder] = useState<string[]>([]);

  const orderedEvents = useMemo(() => {
    if (localOrder.length > 0) {
      const map = new Map(events.map((e) => [e.id, e]));
      const result = localOrder.map((id) => map.get(id)).filter(Boolean) as Tables<"rundown_events">[];
      const unordered = events.filter((e) => !localOrder.includes(e.id));
      return [...result, ...unordered];
    }
    return events;
  }, [events, localOrder]);

  const sessions = useMemo(() => {
    const seen = new Set<string>();
    const order: string[] = [];
    for (const e of orderedEvents) {
      if (!seen.has(e.session)) {
        seen.add(e.session);
        order.push(e.session);
      }
    }
    return order;
  }, [orderedEvents]);

  function toggleSession(session: string) {
    setCollapsedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(session)) next.delete(session);
      else next.add(session);
      return next;
    });
  }

  function handleDragStart(id: string) {
    setDragId(id);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    setDragOverId(id);
    if (!dragId || dragId === id) return;
    const base = localOrder.length > 0 ? localOrder : events.map((e) => e.id);
    const next = [...base];
    const from = next.indexOf(dragId);
    const to = next.indexOf(id);
    if (from === -1 || to === -1) return;
    next.splice(from, 1);
    next.splice(to, 0, dragId);
    setLocalOrder(next);
  }

  function handleDragEnd() {
    setDragId(null);
    setDragOverId(null);
    if (localOrder.length > 0 && onReorder) {
      onReorder(localOrder);
    }
  }

  return (
    <div className="space-y-6">
      {sessions.map((session) => {
        const sessionEvents = orderedEvents.filter((e) => e.session === session);
        const isCollapsed = collapsedSessions.has(session);
        const dotColor = getDotColor(session);

        return (
          <div key={session}>
            {/* Session header */}
            <button
              className="flex items-center gap-2 w-full text-left mb-3 group"
              onClick={() => toggleSession(session)}
            >
              <div className={`h-2.5 w-2.5 rounded-full ${dotColor} shrink-0`} />
              <span className="text-sm font-semibold text-foreground">{session}</span>
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                {sessionEvents.length} acara
              </Badge>
              <div className="flex-1 h-px bg-border" />
              {isCollapsed ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>

            {/* Events */}
            {!isCollapsed && (
              <div className="relative ml-1">
                {/* Vertical line */}
                <div className="absolute left-[5px] top-0 bottom-0 w-px bg-border" />

                <div className="space-y-1">
                  {sessionEvents.map((event) => {
                    const sessionColor = getSessionColor(session);
                    const isDragging = dragId === event.id;
                    const isDragOver = dragOverId === event.id;

                    return (
                      <div
                        key={event.id}
                        draggable
                        onDragStart={() => handleDragStart(event.id)}
                        onDragOver={(e) => handleDragOver(e, event.id)}
                        onDragEnd={handleDragEnd}
                        className={`relative flex items-start gap-3 pl-6 pb-3 group/event transition-all ${
                          isDragging ? "opacity-50 scale-[0.98]" : ""
                        } ${isDragOver && !isDragging ? "translate-y-[-2px]" : ""}`}
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-3 h-[11px] w-[11px] rounded-full border-2 border-background ring-2 ring-border bg-background shrink-0 z-10" />

                        {/* Event card */}
                        <div
                          className={`flex-1 rounded-xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md ${
                            isDragOver && !isDragging ? "border-primary" : ""
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {/* Drag handle */}
                            <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0 cursor-grab mt-0.5 opacity-0 group-hover/event:opacity-100 transition-opacity" />

                            <div className="flex-1 min-w-0">
                              {/* Title row */}
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-medium text-sm leading-snug">{event.title}</p>
                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/event:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => onEdit(event)}
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={() => onDelete(event)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              {/* Time */}
                              <div className="flex items-center gap-1 mt-1 text-xs text-primary font-medium">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {event.start_time}
                                  {event.end_time ? ` – ${event.end_time}` : ""}
                                </span>
                              </div>

                              {/* Description */}
                              {event.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {event.description}
                                </p>
                              )}

                              {/* Meta */}
                              {(event.pic || event.location) && (
                                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                                  {event.pic && (
                                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                      <User className="h-3 w-3" />
                                      {event.pic}
                                    </span>
                                  )}
                                  {event.location && (
                                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                      <MapPin className="h-3 w-3" />
                                      {event.location}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
