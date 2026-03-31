"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { upsertInvitation } from "@/app/actions/invitation";
import { useWedding } from "@/lib/hooks/use-wedding";
import {
  GOOGLE_FONTS,
  loadGoogleFont,
  loadAllPickerFonts,
  getFontStack,
} from "@/lib/utils/google-fonts";
import {
  Heart,
  ExternalLink,
  Copy,
  CheckCircle2,
  Mail,
  AlertTriangle,
  Plus,
  Trash2,
  Palette,
  X,
  ChevronDown,
  Search,
} from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type InvitationType = "classic" | "modern" | "rustic";

interface GiftAccount {
  id: string;
  bank: string;
  account_number: string;
  account_name: string;
}

interface InvitationExtra {
  groom_instagram?: string;
  bride_instagram?: string;
  venue_name?: string;
  venue_address?: string;
  venue_maps_url?: string;
  gift_accounts?: GiftAccount[];
  font_body?: "dmsans" | "serif";
  ayat_source?: string;
  font_heading_name?: string; // Google Font family name for heading
  font_body_name?: string;    // Google Font family name for body
}

interface FormData {
  // Template
  template: InvitationType;
  // Couple
  groom_full_name: string;
  groom_nickname: string;
  groom_parents: string;
  groom_instagram: string;
  bride_full_name: string;
  bride_nickname: string;
  bride_parents: string;
  bride_instagram: string;
  // Pembuka
  opening_text: string;
  ayat_source: string;
  // Lokasi
  venue_name: string;
  venue_address: string;
  venue_maps_url: string;
  // Gift
  gift_accounts: GiftAccount[];
  // Penutup
  closing_text: string;
  hashtag: string;
  // Tampilan
  font_heading: "playfair" | "cormorant" | "montserrat";
  font_body: "dmsans" | "serif";
  font_heading_name: string; // free Google Font name (overrides font_heading)
  font_body_name: string;    // free Google Font name (overrides font_body)
  theme_color: string;
  show_rsvp: boolean;
  show_wishes: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TEMPLATES: {
  id: InvitationType;
  label: string;
  description: string;
  available: boolean;
}[] = [
  {
    id: "classic",
    label: "Classic",
    description: "Elegan dengan sentuhan tradisional, cocok untuk pernikahan formal.",
    available: true,
  },
  {
    id: "modern",
    label: "Modern",
    description: "Desain minimalis dan kontemporer.",
    available: false,
  },
  {
    id: "rustic",
    label: "Rustic",
    description: "Nuansa alam dengan sentuhan hangat.",
    available: false,
  },
];

const COLOR_SWATCHES = [
  { label: "Warm Gold", hex: "#8B6F4E" },
  { label: "Dusty Rose", hex: "#C4837A" },
  { label: "Sage", hex: "#6B7C5C" },
  { label: "Navy", hex: "#2C4A7C" },
  { label: "Blush", hex: "#D4928A" },
  { label: "Terracotta", hex: "#C07858" },
  { label: "Mauve", hex: "#9E7D9E" },
  { label: "Slate", hex: "#5A7A8A" },
];

// ─── Template Previews ────────────────────────────────────────────────────────

function ClassicPreview() {
  return (
    <div className="w-full h-full bg-[#FAF7F2] flex flex-col items-center justify-between p-4 rounded overflow-hidden">
      <div className="flex items-center gap-1.5 mt-1">
        <div className="h-px w-8 bg-[#8B6F4E]/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#8B6F4E]" />
        <div className="h-px w-8 bg-[#8B6F4E]/60" />
      </div>
      <div className="text-center space-y-1 my-2">
        <p className="text-[8px] text-[#8B6F4E] tracking-[0.2em] uppercase">
          Undangan Pernikahan
        </p>
        <p className="text-[13px] font-semibold text-[#5C4033]">Raka & Dewi</p>
        <p className="text-[8px] text-[#8B6F4E]">Sabtu, 14 Juni 2025</p>
      </div>
      <div className="w-full space-y-1.5 mb-1">
        <div className="h-1.5 bg-[#8B6F4E]/20 rounded-full" />
        <div className="h-1.5 bg-[#8B6F4E]/12 rounded-full w-3/4 mx-auto" />
        <div className="h-1.5 bg-[#8B6F4E]/10 rounded-full w-1/2 mx-auto" />
      </div>
      <div className="flex items-center gap-1.5 mb-1">
        <div className="h-px w-8 bg-[#8B6F4E]/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#8B6F4E]" />
        <div className="h-px w-8 bg-[#8B6F4E]/60" />
      </div>
    </div>
  );
}

function ModernPreview() {
  return (
    <div className="w-full h-full bg-[#0D0D0D] flex flex-col items-center justify-between p-4 rounded overflow-hidden">
      <div className="h-px w-full bg-white/20 mt-2" />
      <div className="text-center space-y-1">
        <p className="text-[8px] text-white/50 tracking-[0.2em] uppercase">
          Wedding Invitation
        </p>
        <p className="text-[13px] font-bold text-white tracking-wide">
          Raka & Dewi
        </p>
        <p className="text-[8px] text-white/40">14 . 06 . 2025</p>
      </div>
      <div className="h-px w-full bg-white/20 mb-2" />
    </div>
  );
}

function RusticPreview() {
  return (
    <div className="w-full h-full bg-[#F4EFE6] flex flex-col items-center justify-between p-4 rounded overflow-hidden">
      <div className="flex items-center gap-1.5 mt-1 text-[#6B5C3E]">
        <span className="text-[10px]">🌿</span>
        <div className="h-px w-6 bg-[#6B5C3E]/40" />
        <span className="text-[10px]">🌿</span>
      </div>
      <div className="text-center space-y-1 my-2">
        <p className="text-[8px] text-[#6B5C3E] tracking-[0.15em] uppercase">
          Pernikahan
        </p>
        <p className="text-[13px] font-semibold text-[#4A3728] italic">
          Raka & Dewi
        </p>
        <p className="text-[8px] text-[#6B5C3E]">14 Juni 2025</p>
      </div>
      <div className="flex items-center gap-1.5 mb-1 text-[#6B5C3E]">
        <span className="text-[10px]">🌿</span>
        <div className="h-px w-6 bg-[#6B5C3E]/40" />
        <span className="text-[10px]">🌿</span>
      </div>
    </div>
  );
}

function ComingSoonPreview({ preview }: { preview: React.ReactNode }) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 opacity-40 pointer-events-none">{preview}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/50 backdrop-blur-[2px] rounded">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <Mail className="w-4 h-4 text-muted-foreground/60" />
        </div>
        <p className="text-[11px] text-muted-foreground font-medium">Segera Hadir</p>
      </div>
    </div>
  );
}

// ─── Font Picker ──────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  semua: "Semua",
  serif: "Serif",
  "sans-serif": "Sans-Serif",
  script: "Script",
  display: "Display",
};

function FontPicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (family: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("semua");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load selected font for trigger preview
  useEffect(() => {
    if (value) loadGoogleFont(value);
  }, [value]);

  // Load all picker fonts when panel opens
  useEffect(() => {
    if (!open || fontsLoaded) return;
    loadAllPickerFonts();
    setFontsLoaded(true);
  }, [open, fontsLoaded]);

  const filtered = GOOGLE_FONTS.filter((f) => {
    const matchSearch = f.family.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "semua" || f.category === category;
    return matchSearch && matchCat;
  });

  const currentFont = GOOGLE_FONTS.find((f) => f.family === value);
  const catLabel =
    currentFont?.category === "sans-serif"
      ? "Sans-Serif"
      : currentFont
      ? currentFont.category.charAt(0).toUpperCase() +
        currentFont.category.slice(1)
      : "";

  function close() {
    setOpen(false);
    setSearch("");
  }

  return (
    <>
      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-3 hover:bg-muted transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-md bg-muted/70 flex items-center justify-center shrink-0 overflow-hidden">
            <span
              style={{ fontFamily: getFontStack(value), fontSize: 16, lineHeight: 1 }}
              className="text-foreground"
            >
              Aa
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{value || "Pilih Font"}</p>
            <p className="text-xs text-muted-foreground">{catLabel || label}</p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      {/* ── Modal overlay ── */}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Panel */}
          <div className="relative w-full sm:max-w-lg max-h-[92vh] sm:max-h-[82vh] bg-background sm:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl overflow-hidden">
            {/* Mobile drag handle */}
            <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
              <div>
                <h3 className="font-semibold text-sm">Pilih {label}</h3>
                {value && (
                  <p className="text-xs text-muted-foreground">
                    Terpilih:{" "}
                    <span
                      style={{ fontFamily: getFontStack(value) }}
                      className="font-medium text-foreground"
                    >
                      {value}
                    </span>
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Cari font..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                  autoFocus
                />
              </div>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 px-4 py-2.5 border-b shrink-0 overflow-x-auto">
              {Object.entries(CATEGORY_LABELS).map(([id, lbl]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCategory(id)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    category === id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>

            {/* Font grid */}
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filtered.map((font) => {
                const isSelected = value === font.family;
                return (
                  <button
                    key={font.family}
                    type="button"
                    onClick={() => {
                      onChange(font.family);
                      close();
                    }}
                    className={`relative text-left rounded-xl border p-3 transition-all hover:shadow-sm ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    )}
                    <p
                      style={{
                        fontFamily: getFontStack(font.family, font.category),
                        fontSize:
                          font.category === "script"
                            ? 24
                            : font.category === "display"
                            ? 20
                            : 20,
                        lineHeight: 1.1,
                      }}
                      className="text-foreground mb-2"
                    >
                      Aa
                    </p>
                    <p className="text-[11px] text-foreground font-medium leading-tight truncate">
                      {font.family}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 capitalize">
                      {font.category === "sans-serif"
                        ? "Sans-Serif"
                        : font.category.charAt(0).toUpperCase() +
                          font.category.slice(1)}
                    </p>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
                  Font &ldquo;{search}&rdquo; tidak ditemukan
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2 mb-3">
      {children}
    </h3>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InvitationPage() {
  const { data: wedding, isLoading: weddingLoading } = useWedding();
  const weddingId = wedding?.id;
  const queryClient = useQueryClient();

  const [savingTemplate, setSavingTemplate] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<InvitationType | null>(null);
  const [formData, setFormData] = useState<FormData>({
    template: "classic",
    groom_full_name: "",
    groom_nickname: "",
    groom_parents: "",
    groom_instagram: "",
    bride_full_name: "",
    bride_nickname: "",
    bride_parents: "",
    bride_instagram: "",
    opening_text: "",
    ayat_source: "",
    venue_name: "",
    venue_address: "",
    venue_maps_url: "",
    gift_accounts: [],
    closing_text: "",
    hashtag: "",
    font_heading: "playfair",
    font_body: "dmsans",
    font_heading_name: "Playfair Display",
    font_body_name: "DM Sans",
    theme_color: "#8B6F4E",
    show_rsvp: true,
    show_wishes: true,
  });
  const [formLoaded, setFormLoaded] = useState(false);

  const { data: invitation, isLoading: invLoading } = useQuery({
    queryKey: ["invitation", weddingId],
    queryFn: async () => {
      if (!weddingId) return null;
      const supabase = createClient();
      const { data } = (await supabase
        .from("invitations")
        .select("*")
        .eq("wedding_id", weddingId)
        .single()) as unknown as { data: Tables<"invitations"> | null };
      return data;
    },
    enabled: !!weddingId,
  });

  // Populate form when invitation loads
  useEffect(() => {
    if (invitation && !formLoaded) {
      let extra: InvitationExtra = {};
      try {
        extra = JSON.parse(invitation.love_story_text || "{}");
      } catch {
        extra = {};
      }
      setFormData({
        template: (invitation.template as InvitationType) ?? "classic",
        groom_full_name: invitation.groom_full_name ?? "",
        groom_nickname: invitation.groom_nickname ?? "",
        groom_parents: invitation.groom_parents ?? "",
        groom_instagram: extra.groom_instagram ?? "",
        bride_full_name: invitation.bride_full_name ?? "",
        bride_nickname: invitation.bride_nickname ?? "",
        bride_parents: invitation.bride_parents ?? "",
        bride_instagram: extra.bride_instagram ?? "",
        opening_text: invitation.opening_text ?? "",
        ayat_source: extra.ayat_source ?? "",
        venue_name: extra.venue_name ?? "",
        venue_address: extra.venue_address ?? "",
        venue_maps_url: extra.venue_maps_url ?? "",
        gift_accounts: extra.gift_accounts ?? [],
        closing_text: invitation.closing_text ?? "",
        hashtag: invitation.hashtag ?? "",
        font_heading: (invitation.font_heading as FormData["font_heading"]) ?? "playfair",
        font_body: extra.font_body ?? "dmsans",
        font_heading_name: extra.font_heading_name ?? "Playfair Display",
        font_body_name: extra.font_body_name ?? "DM Sans",
        theme_color: invitation.theme_color ?? "#8B6F4E",
        show_rsvp: invitation.show_rsvp ?? true,
        show_wishes: invitation.show_wishes ?? true,
      });
      setFormLoaded(true);
    }
  }, [invitation, formLoaded]);

  const slug = wedding?.rsvp_slug;
  const invitationUrl = slug ? `/i/${slug}` : null;

  const currentTemplate: InvitationType = pendingTemplate ?? formData.template;
  const templateDirty =
    pendingTemplate !== null && pendingTemplate !== (invitation?.template ?? "classic");

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  // ─── Build payload helper ─────────────────────────────────────────────────

  function buildPayload(overrides?: Partial<FormData>) {
    const d = { ...formData, ...overrides };
    const extra: InvitationExtra = {
      groom_instagram: d.groom_instagram || undefined,
      bride_instagram: d.bride_instagram || undefined,
      venue_name: d.venue_name || undefined,
      venue_address: d.venue_address || undefined,
      venue_maps_url: d.venue_maps_url || undefined,
      gift_accounts: d.gift_accounts.length > 0 ? d.gift_accounts : undefined,
      font_body: d.font_body,
      ayat_source: d.ayat_source || undefined,
      font_heading_name: d.font_heading_name || undefined,
      font_body_name: d.font_body_name || undefined,
    };
    return {
      slug: slug ?? weddingId!,
      template: d.template,
      headline:
        invitation?.headline ??
        `${wedding?.partner_1_name ?? ""} & ${wedding?.partner_2_name ?? ""}`,
      groom_full_name: d.groom_full_name || null,
      groom_nickname: d.groom_nickname || null,
      groom_parents: d.groom_parents || null,
      bride_full_name: d.bride_full_name || null,
      bride_nickname: d.bride_nickname || null,
      bride_parents: d.bride_parents || null,
      opening_text: d.opening_text || null,
      closing_text: d.closing_text || null,
      hashtag: d.hashtag || null,
      font_heading: d.font_heading,
      theme_color: d.theme_color,
      show_rsvp: d.show_rsvp,
      show_wishes: d.show_wishes,
      love_story_text: JSON.stringify(extra),
    };
  }

  // ─── Save Template ────────────────────────────────────────────────────────

  async function handleSaveTemplate() {
    if (!weddingId || !pendingTemplate) return;
    setSavingTemplate(true);
    const res = await upsertInvitation(
      weddingId,
      buildPayload({ template: pendingTemplate })
    );
    setSavingTemplate(false);
    if (res.success) {
      toast.success("Template berhasil disimpan");
      setFormData((prev) => ({ ...prev, template: pendingTemplate }));
      setPendingTemplate(null);
      queryClient.invalidateQueries({ queryKey: ["invitation", weddingId] });
    } else {
      toast.error(res.error ?? "Gagal menyimpan");
    }
  }

  // ─── Save Content ─────────────────────────────────────────────────────────

  async function handleSaveContent() {
    if (!weddingId) return;
    setSavingContent(true);
    const res = await upsertInvitation(weddingId, buildPayload());
    setSavingContent(false);
    if (res.success) {
      toast.success("Konten berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["invitation", weddingId] });
    } else {
      toast.error(res.error ?? "Gagal menyimpan");
    }
  }

  // ─── Auto-save Tampilan ───────────────────────────────────────────────────

  async function autoSaveTampilan(patch: Partial<FormData>) {
    if (!weddingId) return;
    const updated = { ...formData, ...patch };
    setFormData(updated);
    const res = await upsertInvitation(weddingId, buildPayload(patch));
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ["invitation", weddingId] });
    } else {
      toast.error(res.error ?? "Gagal menyimpan");
    }
  }

  // ─── Gift accounts helpers ────────────────────────────────────────────────

  function addGiftAccount() {
    setFormData((prev) => ({
      ...prev,
      gift_accounts: [
        ...prev.gift_accounts,
        { id: crypto.randomUUID(), bank: "", account_number: "", account_name: "" },
      ],
    }));
  }

  function updateGiftAccount(id: string, field: keyof Omit<GiftAccount, "id">, value: string) {
    setFormData((prev) => ({
      ...prev,
      gift_accounts: prev.gift_accounts.map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    }));
  }

  function removeGiftAccount(id: string) {
    setFormData((prev) => ({
      ...prev,
      gift_accounts: prev.gift_accounts.filter((a) => a.id !== id),
    }));
  }

  // ─── Loading ──────────────────────────────────────────────────────────────

  if (weddingLoading || invLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Undangan Digital"
        description="Atur tampilan dan konten undangan pernikahan digital Anda"
      />

      {/* ── Link Card ── */}
      {invitationUrl ? (
        <Card className="p-5 overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #8B6F4E 0%, transparent 60%)",
            }}
          />
          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-0.5">
                  Undangan Digital
                </p>
                <p className="text-base font-semibold leading-tight truncate">
                  {wedding?.partner_1_name ?? ""} &amp; {wedding?.partner_2_name ?? ""}
                </p>
                <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
                  {typeof window !== "undefined" ? window.location.origin : ""}
                  {invitationUrl}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = `${window.location.origin}${invitationUrl}`;
                  navigator.clipboard.writeText(url);
                  toast.success("Link disalin!");
                }}
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Salin Link
              </Button>
              <Link
                href={invitationUrl}
                target="_blank"
                className="inline-flex items-center h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] font-medium border border-border bg-background hover:bg-muted hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Buka
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Atur <strong>slug undangan</strong> di halaman{" "}
            <Link href="/guest" className="underline underline-offset-2 font-medium">
              Tamu &rarr; Pengaturan RSVP
            </Link>{" "}
            untuk mengaktifkan link undangan digital Anda.
          </p>
        </Card>
      )}

      {/* ── Tabs ── */}
      <Tabs defaultValue="template">
        <TabsList className="w-full">
          <TabsTrigger value="template" className="flex-1">
            Template
          </TabsTrigger>
          <TabsTrigger value="konten" className="flex-1">
            Konten
          </TabsTrigger>
          <TabsTrigger value="tampilan" className="flex-1">
            Tampilan
          </TabsTrigger>
        </TabsList>

        {/* ─────────────────────────────────────── TAB: Template ── */}
        <TabsContent value="template" className="mt-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Pilih Template</h2>
              <p className="text-sm text-muted-foreground">
                Tentukan tampilan undangan digital Anda
              </p>
            </div>
            {templateDirty && (
              <Button
                onClick={handleSaveTemplate}
                disabled={savingTemplate}
                size="sm"
              >
                {savingTemplate ? "Menyimpan..." : "Simpan Template"}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TEMPLATES.map((t) => {
              const isSelected = currentTemplate === t.id;
              const preview =
                t.id === "classic" ? (
                  <ClassicPreview />
                ) : t.id === "modern" ? (
                  <ModernPreview />
                ) : (
                  <RusticPreview />
                );

              return (
                <button
                  key={t.id}
                  disabled={!t.available}
                  onClick={() => t.available && setPendingTemplate(t.id)}
                  className={`relative rounded-xl border-2 p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? "border-primary shadow-md"
                      : t.available
                      ? "border-border hover:border-primary/40 hover:shadow-sm cursor-pointer"
                      : "border-border opacity-60 cursor-not-allowed"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    </div>
                  )}

                  <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden border border-border/50">
                    {t.available ? preview : <ComingSoonPreview preview={preview} />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{t.label}</span>
                      {!t.available && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-4 px-1.5"
                        >
                          Segera
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </TabsContent>

        {/* ─────────────────────────────────────── TAB: Konten ── */}
        <TabsContent value="konten" className="mt-5 space-y-6">
          {/* Mempelai Pria */}
          <div>
            <SectionHeading>Mempelai Pria</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="groom_full_name">Nama Lengkap</Label>
                <Input
                  id="groom_full_name"
                  value={formData.groom_full_name}
                  onChange={(e) => setField("groom_full_name", e.target.value)}
                  placeholder="Muhammad Raka Pratama"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="groom_nickname">Nama Panggilan</Label>
                <Input
                  id="groom_nickname"
                  value={formData.groom_nickname}
                  onChange={(e) => setField("groom_nickname", e.target.value)}
                  placeholder="Raka"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="groom_parents">Putra dari</Label>
                <Input
                  id="groom_parents"
                  value={formData.groom_parents}
                  onChange={(e) => setField("groom_parents", e.target.value)}
                  placeholder="Putra dari Bapak Ahmad dan Ibu Sari"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="groom_instagram">Instagram</Label>
                <Input
                  id="groom_instagram"
                  value={formData.groom_instagram}
                  onChange={(e) => setField("groom_instagram", e.target.value)}
                  placeholder="@raka.pratama"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Mempelai Wanita */}
          <div>
            <SectionHeading>Mempelai Wanita</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bride_full_name">Nama Lengkap</Label>
                <Input
                  id="bride_full_name"
                  value={formData.bride_full_name}
                  onChange={(e) => setField("bride_full_name", e.target.value)}
                  placeholder="Dewi Kusuma Putri"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bride_nickname">Nama Panggilan</Label>
                <Input
                  id="bride_nickname"
                  value={formData.bride_nickname}
                  onChange={(e) => setField("bride_nickname", e.target.value)}
                  placeholder="Dewi"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="bride_parents">Putri dari</Label>
                <Input
                  id="bride_parents"
                  value={formData.bride_parents}
                  onChange={(e) => setField("bride_parents", e.target.value)}
                  placeholder="Putri dari Bapak Budi dan Ibu Rina"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bride_instagram">Instagram</Label>
                <Input
                  id="bride_instagram"
                  value={formData.bride_instagram}
                  onChange={(e) => setField("bride_instagram", e.target.value)}
                  placeholder="@dewi.kusuma"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Pembuka & Ayat */}
          <div>
            <SectionHeading>Pembuka &amp; Ayat</SectionHeading>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="opening_text">Teks Ayat / Pembuka</Label>
                <Textarea
                  id="opening_text"
                  value={formData.opening_text}
                  onChange={(e) => setField("opening_text", e.target.value)}
                  placeholder="Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ayat_source">Sumber Ayat</Label>
                <Input
                  id="ayat_source"
                  value={formData.ayat_source}
                  onChange={(e) => setField("ayat_source", e.target.value)}
                  placeholder="QS. Ar-Rum: 21"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Lokasi */}
          <div>
            <SectionHeading>Lokasi</SectionHeading>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="venue_name">Nama Venue</Label>
                <Input
                  id="venue_name"
                  value={formData.venue_name}
                  onChange={(e) => setField("venue_name", e.target.value)}
                  placeholder="Masjid Al-Falah"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="venue_address">Alamat</Label>
                <Input
                  id="venue_address"
                  value={formData.venue_address}
                  onChange={(e) => setField("venue_address", e.target.value)}
                  placeholder="Jl. Merdeka No. 1, Jakarta Pusat"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="venue_maps_url">Link Google Maps</Label>
                <Input
                  id="venue_maps_url"
                  value={formData.venue_maps_url}
                  onChange={(e) => setField("venue_maps_url", e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Hadiah Digital */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <SectionHeading>Hadiah Digital</SectionHeading>
              <Button
                variant="outline"
                size="sm"
                onClick={addGiftAccount}
                type="button"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Tambah Rekening
              </Button>
            </div>

            {formData.gift_accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center">
                Belum ada rekening. Klik &quot;Tambah Rekening&quot; untuk menambahkan.
              </p>
            ) : (
              <div className="space-y-3">
                {formData.gift_accounts.map((account, idx) => (
                  <Card key={account.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Rekening {idx + 1}
                      </span>
                      <button
                        onClick={() => removeGiftAccount(account.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        type="button"
                        aria-label="Hapus rekening"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label>Nama Bank</Label>
                        <Input
                          value={account.bank}
                          onChange={(e) =>
                            updateGiftAccount(account.id, "bank", e.target.value)
                          }
                          placeholder="BCA / BRI / Mandiri"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Nomor Rekening</Label>
                        <Input
                          value={account.account_number}
                          onChange={(e) =>
                            updateGiftAccount(
                              account.id,
                              "account_number",
                              e.target.value
                            )
                          }
                          placeholder="1234567890"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Atas Nama</Label>
                        <Input
                          value={account.account_name}
                          onChange={(e) =>
                            updateGiftAccount(
                              account.id,
                              "account_name",
                              e.target.value
                            )
                          }
                          placeholder="Nama pemilik rekening"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Penutup */}
          <div>
            <SectionHeading>Penutup</SectionHeading>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="closing_text">Pesan Penutup</Label>
                <Textarea
                  id="closing_text"
                  value={formData.closing_text}
                  onChange={(e) => setField("closing_text", e.target.value)}
                  placeholder="Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hashtag">Hashtag</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    #
                  </span>
                  <Input
                    id="hashtag"
                    value={formData.hashtag}
                    onChange={(e) =>
                      setField(
                        "hashtag",
                        e.target.value.replace(/^#/, "")
                      )
                    }
                    className="pl-7"
                    placeholder="RakaDewi2025"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleSaveContent}
              disabled={savingContent}
              className="w-full sm:w-auto"
            >
              {savingContent ? "Menyimpan..." : "Simpan Konten"}
            </Button>
          </div>
        </TabsContent>

        {/* ─────────────────────────────────────── TAB: Tampilan ── */}
        <TabsContent value="tampilan" className="mt-5 space-y-6">
          {/* Font Judul */}
          <div className="space-y-2">
            <SectionHeading>Font Judul</SectionHeading>
            {/* Live preview */}
            {formData.font_heading_name && (
              <div
                className="rounded-lg bg-muted/40 px-4 py-3 text-center mb-3"
                style={{ fontFamily: getFontStack(formData.font_heading_name) }}
              >
                <p className="text-2xl text-foreground leading-tight">
                  {wedding?.partner_1_name ?? "Raka"} &amp;{" "}
                  {wedding?.partner_2_name ?? "Dewi"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.font_heading_name}
                </p>
              </div>
            )}
            <FontPicker
              value={formData.font_heading_name}
              label="Font Judul"
              onChange={(family) =>
                autoSaveTampilan({ font_heading_name: family })
              }
            />
          </div>

          {/* Font Teks */}
          <div className="space-y-2">
            <SectionHeading>Font Teks</SectionHeading>
            {/* Live preview */}
            {formData.font_body_name && (
              <div
                className="rounded-lg bg-muted/40 px-4 py-3 mb-3"
                style={{ fontFamily: getFontStack(formData.font_body_name) }}
              >
                <p className="text-sm text-foreground leading-relaxed">
                  Bersama dalam suka dan duka, kami mengundang kehadiran
                  Bapak/Ibu/Saudara/i untuk menjadi bagian dari hari istimewa kami.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.font_body_name}
                </p>
              </div>
            )}
            <FontPicker
              value={formData.font_body_name}
              label="Font Teks"
              onChange={(family) =>
                autoSaveTampilan({ font_body_name: family })
              }
            />
          </div>

          {/* Palet Warna */}
          <div>
            <SectionHeading>
              <span className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" />
                Palet Warna
              </span>
            </SectionHeading>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2.5">
                {COLOR_SWATCHES.map((swatch) => {
                  const isSelected =
                    formData.theme_color.toLowerCase() ===
                    swatch.hex.toLowerCase();
                  return (
                    <button
                      key={swatch.hex}
                      onClick={() =>
                        autoSaveTampilan({ theme_color: swatch.hex })
                      }
                      title={swatch.label}
                      className={`w-9 h-9 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isSelected
                          ? "ring-2 ring-offset-2 ring-foreground scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                      aria-label={swatch.label}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full border border-border shrink-0"
                  style={{ backgroundColor: formData.theme_color }}
                />
                <div className="space-y-1">
                  <Label htmlFor="custom_color" className="text-xs">
                    Warna kustom
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="custom_color"
                      type="color"
                      value={formData.theme_color}
                      onChange={(e) =>
                        setField("theme_color", e.target.value)
                      }
                      onBlur={(e) =>
                        autoSaveTampilan({ theme_color: e.target.value })
                      }
                      className="w-8 h-8 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                    <Input
                      value={formData.theme_color}
                      onChange={(e) => setField("theme_color", e.target.value)}
                      onBlur={(e) =>
                        autoSaveTampilan({ theme_color: e.target.value })
                      }
                      className="w-28 font-mono text-sm h-8"
                      placeholder="#8B6F4E"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div>
            <SectionHeading>Tampilkan di Undangan</SectionHeading>
            <Card className="divide-y divide-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-4">
                <div>
                  <Label
                    className="text-sm font-medium cursor-pointer"
                    htmlFor="toggle-rsvp"
                  >
                    Formulir RSVP
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Izinkan tamu konfirmasi kehadiran melalui undangan
                  </p>
                </div>
                <Switch
                  id="toggle-rsvp"
                  checked={formData.show_rsvp}
                  onCheckedChange={(val) =>
                    autoSaveTampilan({ show_rsvp: val })
                  }
                />
              </div>
              <div className="flex items-center justify-between px-4 py-4">
                <div>
                  <Label
                    className="text-sm font-medium cursor-pointer"
                    htmlFor="toggle-wishes"
                  >
                    Feed Ucapan &amp; Doa
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tampilkan ucapan dan doa dari para tamu
                  </p>
                </div>
                <Switch
                  id="toggle-wishes"
                  checked={formData.show_wishes}
                  onCheckedChange={(val) =>
                    autoSaveTampilan({ show_wishes: val })
                  }
                />
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
