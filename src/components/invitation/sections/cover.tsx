"use client";

import type { InvitationPageProps } from "../types";

const A = "/templates/heritage-01-jawa/assets";

export default function CoverSection({
  data,
  guestName,
  onOpen,
}: {
  data: InvitationPageProps;
  guestName: string;
  onOpen: () => void;
}) {
  const bg = data.heroPhotoUrl || data.galleryUrls[3] || `${A}/Heritage-4-qx4cuqcivvpf5fr756pmxy94f8syt8qst2se1g1bgg.jpeg`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("${bg}")`,
          backgroundPosition: "50% 100%",
          backgroundSize: "cover",
          backgroundColor: "#000",
        }}
      />
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.44) 70%, #472A1C 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: "70px 0 50px 0",
        }}
      >
        <p
          className="h-title-script"
          style={{ color: "#fff", fontSize: 24, textAlign: "center", margin: 0 }}
        >
          The Wedding of
        </p>

        <p
          className="h-title-serif"
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: 600,
            textTransform: "uppercase",
            textAlign: "center",
            margin: 0,
          }}
        >
          {data.namaWanitaPanggil} &amp; {data.namaPriaPanggil}
        </p>

        {/* Spacer */}
        <div style={{ height: "53vh", flexShrink: 0 }} />

        <p
          className="h-text-sans"
          style={{
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            textAlign: "center",
            margin: 0,
          }}
        >
          Kepada Yth:
        </p>
        <div style={{ height: 10 }} />
        <p
          style={{
            fontFamily: "var(--h-font-sans)",
            fontSize: 16,
            color: "#fff",
            fontWeight: 600,
            textAlign: "center",
            margin: 0,
          }}
        >
          {guestName || "Nama Tamu"}
        </p>

        <div style={{ height: 10 }} />

        <button className="h-btn" onClick={onOpen}>
          <i className="far fa-envelope" />
          <span>Buka Undangan</span>
        </button>

        <div style={{ height: 50, width: "78%" }} />
      </div>
    </div>
  );
}
