"use client";

import { useState, useEffect, useCallback } from "react";
import type { InvitationPageProps } from "../types";

type Wish = {
  id: string;
  guest_name: string;
  message: string;
  created_at: string;
};

export default function WishesSection({
  data,
  guestId,
  guestName,
}: {
  data: InvitationPageProps;
  guestId: string | null;
  guestName: string;
}) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState(guestName);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch(`/api/i/${data.slug}/wishes`);
      if (res.ok) {
        const json = await res.json();
        setWishes(json.wishes || json || []);
      }
    } catch {
      /* ignore */
    }
  }, [data.slug]);

  useEffect(() => {
    fetchWishes();
    const id = setInterval(fetchWishes, 30000);
    return () => clearInterval(id);
  }, [fetchWishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/i/${data.slug}/wishes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_id: guestId,
          name: name || guestName || "Tamu",
          message: message.trim(),
        }),
      });
      if (res.ok) {
        setMessage("");
        setSubmitted(true);
        fetchWishes();
      }
    } catch {
      /* ignore */
    }
    setSubmitting(false);
  };

  return (
    <div
      className="h-section h-section--fullheight"
      style={{ position: "relative", background: "transparent" }}
    >
      {/* Cream overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#FFFCF3",
          opacity: 0.8,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "100px 40px 100px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p
          className="h-title-script"
          style={{ color: "#000", fontSize: 48, fontWeight: 500, textAlign: "center", margin: 0, lineHeight: "1.3em" }}
        >
          Ucapan &amp; Doa
        </p>

        <div style={{ height: 20 }} />

        <p
          className="h-text-sans"
          style={{ color: "#000", textAlign: "center", margin: 0, lineHeight: "1.5em", letterSpacing: "0.5px" }}
        >
          Berikan ucapan &amp; doa terbaik untuk kedua mempelai
        </p>

        <div style={{ height: 20 }} />

        {/* Form */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              maxWidth: 500,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <input
              type="text"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={!!guestName}
              style={{
                fontFamily: "var(--h-font-sans)",
                fontSize: 12,
                fontWeight: 500,
                padding: "10px 14px",
                border: "1px solid #ccc",
                borderRadius: 6,
                background: "transparent",
                color: "#000",
                outline: "none",
              }}
            />
            <textarea
              placeholder="Tulis ucapan & doa..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{
                fontFamily: "var(--h-font-sans)",
                fontSize: 12,
                fontWeight: 500,
                padding: "10px 14px",
                border: "1px solid #ccc",
                borderRadius: 6,
                background: "transparent",
                color: "#000",
                resize: "vertical",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              style={{
                fontFamily: "var(--h-font-sans)",
                fontSize: 12,
                fontWeight: 500,
                padding: "10px 20px",
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: 20,
                cursor: submitting ? "wait" : "pointer",
                alignSelf: "flex-start",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Mengirim..." : "Kirim"}
            </button>
          </form>
        ) : (
          <p
            className="h-text-sans"
            style={{ color: "#000", textAlign: "center", margin: "20px 0" }}
          >
            Terima kasih atas ucapan &amp; doa Anda!
          </p>
        )}

        <div style={{ height: 10 }} />

        {/* Wishes feed */}
        <div style={{ width: "100%", maxWidth: 500 }}>
          {wishes.map((w) => (
            <div className="h-wish-item" key={w.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#D7BB83",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: "bold", color: "#472A1C" }}>
                    {(w.guest_name || "T")[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="h-wish-name">{w.guest_name || "Tamu"}</span>
                  <span className="h-wish-time" style={{ marginLeft: 8 }}>
                    {new Date(w.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
              <p className="h-wish-text" style={{ marginLeft: 36 }}>
                {w.message}
              </p>
            </div>
          ))}
        </div>

        <div style={{ height: 100 }} />
      </div>
    </div>
  );
}
