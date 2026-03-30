"use client";

import type { InvitationPageProps } from "../types";

const A = "/templates/heritage-01-jawa/assets";

export default function FooterSection({ data }: { data: InvitationPageProps }) {
  const bgPhoto = data.galleryUrls[11] || `${A}/Heritage-12-qx4cv1ml5w4v0ratbbl5rvenjv9ddlzkumm7srklds.jpeg`;

  return (
    <div
      className="h-section h-section--fullheight"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Black bg with photo overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#000" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("${bgPhoto}")`,
          backgroundPosition: "50% 100%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: 0.5,
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
          alignItems: "flex-end",
          justifyContent: "flex-end",
          minHeight: "100vh",
          padding: "0 20px",
        }}
      >
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
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
          berkenan hadir untuk memberikan doa restu kepada kami.
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
          Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.
        </p>

        <div style={{ height: 10 }} />

        <p
          className="h-title-script"
          style={{
            color: "#fff",
            fontSize: 36,
            fontWeight: 400,
            textAlign: "center",
            margin: 0,
            lineHeight: "1.3em",
          }}
        >
          {data.namaWanitaPanggil} &amp; {data.namaPriaPanggil}
        </p>

        <div style={{ height: 50 }} />

        {/* Logo */}
        <div style={{ textAlign: "center", width: "100%" }}>
          <img
            src={`${A}/LOGO-ELPRESS-01.jpg`}
            alt="NIKAHKU"
            style={{ width: 40, maxWidth: "100%", margin: "0 auto" }}
          />
          <div style={{ height: 10 }} />
          <p
            style={{
              fontFamily: "var(--h-font-sans)",
              fontSize: 14,
              fontWeight: 500,
              color: "#fff",
              textAlign: "center",
              margin: 0,
              lineHeight: "1.3em",
            }}
          >
            Made with &#9829; by NIKAHKU
          </p>
          <div style={{ height: 10 }} />

          {/* Social icons */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {data.igWanitaUrl && (
              <a
                href={data.igWanitaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 32,
                  height: 32,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFFFA",
                  fontSize: 14,
                }}
              >
                <i className="fab fa-instagram" />
              </a>
            )}
            {data.igPriaUrl && (
              <a
                href={data.igPriaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 32,
                  height: 32,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFFFA",
                  fontSize: 14,
                }}
              >
                <i className="fab fa-instagram" />
              </a>
            )}
          </div>
        </div>

        <div style={{ height: 50 }} />
      </div>
    </div>
  );
}
