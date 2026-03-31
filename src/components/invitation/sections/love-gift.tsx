"use client";

import { useState } from "react";
import type { InvitationPageProps } from "../types";

const A = "/templates/heritage-01-jawa/assets";

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className="h-btn h-btn--dark"
      style={{ display: "inline-flex", flexDirection: "row-reverse", gap: 10, padding: "10px 20px" }}
      onClick={handleCopy}
    >
      <span>{label}</span>
      <i className="fas fa-copy" />
      {copied && (
        <div className="h-copy-toast">Berhasil disalin!</div>
      )}
    </button>
  );
}

export default function LoveGiftSection({ data }: { data: InvitationPageProps }) {
  const showBank = data.bankNama && data.bankNorek;
  const showKado = data.kadoNama && data.kadoAlamat;

  if (!showBank && !showKado) return null;

  return (
    <div className="h-section" style={{ position: "relative", overflow: "hidden" }}>
      {/* Brown gradient bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(at center center, #8B5B43 0%, #472A1C 80%)",
        }}
      />
      {/* Pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#5C4324",
          backgroundImage: `url("${A}/JAWA-PATTERN.png")`,
          backgroundPosition: "center",
          backgroundSize: "150px auto",
          opacity: 0.3,
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", padding: "30px 30px", zIndex: 2 }}>
        <div style={{ height: 50 }} />

        {/* Gift icon */}
        <div style={{ textAlign: "center" }}>
          <i className="fas fa-gift" style={{ color: "#fff", fontSize: 50 }} />
        </div>

        <div style={{ height: 10 }} />

        <p
          className="h-title-script"
          style={{ color: "#fff", fontSize: 38, fontWeight: 500, textAlign: "center", margin: 0, lineHeight: "1em" }}
        >
          Love Gift
        </p>

        <div style={{ height: 10 }} />

        <p
          className="h-text-sans"
          style={{
            color: "#fff",
            fontSize: 12,
            textAlign: "center",
            margin: 0,
            lineHeight: "1.5em",
            letterSpacing: "0.5px",
          }}
        >
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
          <br />
          Namun jika Anda ingin memberikan tanda kasih, kami menyediakan informasi berikut:
        </p>

        <div style={{ height: 20 }} />

        {/* Bank card */}
        {showBank && (
          <div
            className="h-card h-card--bordered"
            style={{ padding: 30, margin: 0, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}
          >
            <div style={{ textAlign: "right", marginBottom: 10 }}>
              <img
                src={`${A}/iconmandiri.png`}
                alt={data.bankNama}
                style={{ width: 100, maxWidth: "100%" }}
              />
            </div>

            <p
              className="h-text-sans"
              style={{ color: "#000", margin: 0, lineHeight: "1.5em", letterSpacing: "0.5px", textAlign: "left" }}
            >
              {data.bankNama}
              <br />
              <strong>{data.bankNorek}</strong>
              <br />
              a.n. {data.bankAtasnama}
            </p>

            <div style={{ height: 10 }} />

            <CopyBtn text={data.bankNorek} label="Salin Nomor Rekening" />
          </div>
        )}

        {/* Divider */}
        {showBank && showKado && (
          <>
            <div style={{ height: 10 }} />
            <div style={{ textAlign: "center", margin: "15px 0" }}>
              <i className="fas fa-gift" style={{ color: "#D7BB83", fontSize: 50 }} />
            </div>
            <p
              className="h-text-sans"
              style={{ color: "#000", fontSize: 12, fontWeight: "bold", textAlign: "center", margin: 0, lineHeight: "1.5em", letterSpacing: "0.5px" }}
            >
              Kado Fisik
            </p>
            <p
              className="h-text-sans"
              style={{ color: "#000", fontSize: 12, textAlign: "center", margin: 0, lineHeight: "1.5em", letterSpacing: "0.5px" }}
            >
              {data.kadoNama}
              <br />
              {data.kadoAlamat}
            </p>
            <div style={{ height: 10 }} />
            <div style={{ textAlign: "center" }}>
              <CopyBtn text={`${data.kadoNama}\n${data.kadoAlamat}`} label="Salin Alamat" />
            </div>
          </>
        )}

        <div style={{ height: 20 }} />

        <p
          className="h-title-script"
          style={{ color: "#fff", fontSize: 28, fontWeight: 400, textAlign: "center", margin: 0, lineHeight: "1.3em" }}
        >
          {data.namaWanitaPanggil} &amp; {data.namaPriaPanggil}
        </p>

        <div style={{ height: 50 }} />
      </div>
    </div>
  );
}
