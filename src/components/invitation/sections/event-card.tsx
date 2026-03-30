"use client";

import type { InvitationPageProps, SessionData } from "../types";

const A = "/templates/heritage-01-jawa/assets";

function EventCard({
  title,
  session,
  heading,
}: {
  title: string;
  session: SessionData;
  heading: string;
}) {
  const dateStr = session.session_date
    ? new Date(session.session_date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const timeStr =
    session.time_start && session.time_end
      ? `${session.time_start.slice(0, 5)} - ${session.time_end.slice(0, 5)} WIB`
      : "";

  const mapsQuery = session.venue
    ? encodeURIComponent(session.venue)
    : "";

  return (
    <div style={{ margin: "0 30px 30px 30px" }}>
      {/* Outer card */}
      <div
        style={{
          backgroundColor: "#FFFCF3",
          backgroundImage: `url("${A}/JAWA-BACKGROUND.jpg")`,
          backgroundPosition: "bottom center",
          backgroundSize: "cover",
          borderRadius: 20,
          boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
          padding: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Inner card */}
        <div
          style={{
            backgroundColor: "#FFFCF3DE",
            border: "2px solid #D7BB83",
            borderRadius: 20,
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
            padding: "50px 20px",
            textAlign: "center",
          }}
        >
          <p
            className="h-title-script"
            style={{ color: "#000", fontSize: 38, fontWeight: 500, margin: 0, lineHeight: "1em" }}
          >
            {heading}
          </p>
          <div style={{ height: 20 }} />

          <p
            className="h-title-serif"
            style={{
              color: "#000",
              fontSize: 24,
              fontWeight: 700,
              textTransform: "uppercase",
              margin: 0,
              lineHeight: "1.3em",
            }}
          >
            {title}
          </p>

          <p
            className="h-title-serif"
            style={{
              color: "#000",
              fontSize: 22,
              fontWeight: 700,
              textTransform: "uppercase",
              margin: 0,
              lineHeight: "1.3em",
            }}
          >
            {dateStr}
          </p>

          <p
            className="h-text-sans"
            style={{
              color: "#000",
              fontSize: 14,
              margin: 0,
              lineHeight: "1.5em",
              letterSpacing: "0.5px",
            }}
          >
            {timeStr}
          </p>

          <div style={{ height: 20 }} />

          {/* Map icon */}
          <div style={{ textAlign: "center" }}>
            <i className="fas fa-map-marker-alt" style={{ color: "#D7BB83", fontSize: 20 }} />
          </div>

          <div style={{ height: 10 }} />

          <p
            className="h-title-serif"
            style={{
              color: "#000",
              fontSize: 18,
              fontWeight: 700,
              textTransform: "uppercase",
              margin: 0,
              lineHeight: "1.3em",
            }}
          >
            {session.venue || ""}
          </p>

          <div style={{ height: 5 }} />

          <p
            className="h-text-sans"
            style={{
              color: "#000",
              margin: 0,
              lineHeight: "1.5em",
              letterSpacing: "0.5px",
            }}
          >
            {session.venue || ""}
          </p>

          <div style={{ height: 20 }} />

          {mapsQuery && (
            <a
              href={`https://maps.google.com/?q=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-btn"
              style={{
                backgroundImage: "linear-gradient(180deg, #D7BB83 0%, #A38C5E 100%)",
              }}
            >
              <i className="fas fa-map-marker-alt" />
              <span>Google Map</span>
            </a>
          )}

          <div style={{ height: 30 }} />
        </div>
      </div>
    </div>
  );
}

/** Full event cards section */
export default function EventCardSection({ data }: { data: InvitationPageProps }) {
  return (
    <div className="h-section" style={{ overflow: "hidden", position: "relative" }}>
      {/* Brown bg with pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#472A1C",
          zIndex: 0,
        }}
      />
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
          zIndex: 1,
        }}
      />

      {/* Gradient top + motif bottom */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          backgroundImage: "linear-gradient(180deg, #472A1C 0%, rgba(92,67,36,0) 100%)",
        }}
      >
        {/* Motif bawah overlay */}
        <div
          style={{
            backgroundImage: `url("${A}/JAWA-MOTIF-BAWAH.png")`,
            backgroundPosition: "bottom center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% auto",
            padding: "0 0 0 0",
          }}
        >
          {/* Akad card */}
          {data.akad && (
            <div style={{ padding: "0 0 0 0" }}>
              <EventCard heading="Akad Nikah" title="Akad Nikah" session={data.akad} />
            </div>
          )}

          {/* Resepsi card */}
          {data.resepsi && (
            <div style={{ padding: "0 0 0 0" }}>
              <EventCard heading="Resepsi" title="Resepsi Pernikahan" session={data.resepsi} />
            </div>
          )}

          <div style={{ height: 50 }} />
        </div>
      </div>
    </div>
  );
}
