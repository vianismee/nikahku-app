"use client";

import { useEffect, useState } from "react";
import type { InvitationPageProps } from "../types";

const A = "/templates/heritage-01-jawa/assets";

export default function OpenRevealSection({ data }: { data: InvitationPageProps }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!show) {
    return <div style={{ minHeight: "100vh" }} />;
  }

  return (
    <div
      id="open"
      className="h-section h-section--fullheight"
      style={{ position: "relative", background: "#000" }}
    >
      {/* Video background */}
      <video
        muted
        playsInline
        autoPlay
        src={`${A}/JAWA-MOTION-COMPRESS-1.mp4`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.6,
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
          justifyContent: "center",
          width: "100%",
          padding: "130px 0 120px 0",
        }}
      >
        <p
          className="h-anim-zoom"
          style={{
            color: "#fff",
            fontFamily: "var(--h-font-script)",
            fontSize: 24,
            fontWeight: 500,
            textAlign: "center",
            margin: 0,
            animationDelay: "1s",
          }}
        >
          The Wedding of
        </p>

        <p
          className="h-anim-zoom"
          style={{
            color: "#D7BB83",
            fontFamily: "var(--h-font-serif)",
            fontSize: 38,
            fontWeight: 600,
            textTransform: "uppercase",
            textAlign: "center",
            margin: 0,
            animationDelay: "1.4s",
          }}
        >
          {data.namaWanitaPanggil}
        </p>

        <p
          className="h-anim-zoom"
          style={{
            color: "#D7BB83",
            fontFamily: "var(--h-font-brush)",
            fontSize: 28,
            fontWeight: 500,
            textTransform: "uppercase",
            textAlign: "center",
            margin: 0,
            animationDelay: "1.5s",
          }}
        >
          &amp;
        </p>

        <p
          className="h-anim-zoom"
          style={{
            color: "#D7BB83",
            fontFamily: "var(--h-font-serif)",
            fontSize: 38,
            fontWeight: 600,
            textTransform: "uppercase",
            textAlign: "center",
            margin: 0,
            animationDelay: "1.8s",
          }}
        >
          {data.namaPriaPanggil}
        </p>

        <div style={{ height: 10 }} />

        <p
          className="h-anim-zoom"
          style={{
            color: "#fff",
            fontFamily: "var(--h-font-serif)",
            fontSize: 18,
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: "3.5px",
            margin: 0,
            animationDelay: "2s",
          }}
        >
          {data.tanggalSingkat}
        </p>

        <div style={{ height: 20 }} />

        {/* Lottie placeholder (ring animation) */}
        <div
          className="h-anim-zoom"
          style={{
            width: 40,
            height: 40,
            animationDelay: "2s",
          }}
        >
          <img
            src={`${A}/JAWA-GUNUNGAN.png`}
            alt=""
            style={{ width: 40, height: 40, opacity: 0.7 }}
          />
        </div>
      </div>
    </div>
  );
}
