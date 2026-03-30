"use client";

import type { InvitationPageProps } from "../types";

const A = "/templates/heritage-01-jawa/assets";

export default function LoveStorySection({ data }: { data: InvitationPageProps }) {
  const stories = data.loveStory.length > 0
    ? data.loveStory
    : [
        { tahun: "Pertama Bertemu", cerita: "Kami bertemu untuk pertama kalinya dan langsung merasa ada kecocokan." },
        { tahun: "Mulai Dekat", cerita: "Kami mulai sering berkomunikasi dan saling mengenal lebih dalam." },
        { tahun: "Jadian", cerita: "Akhirnya kami memutuskan untuk menjalin hubungan secara resmi." },
        { tahun: "Lamaran", cerita: "Dengan izin Allah dan restu kedua orang tua, kami melanjutkan ke jenjang pernikahan." },
      ];

  return (
    <div className="h-section" style={{ overflow: "hidden", position: "relative" }}>
      {/* Card wrapper */}
      <div
        style={{
          background: "#FFFCF3",
          backgroundImage: `url("${A}/JAWA-MOTIF-ATAS.png")`,
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% auto",
          border: "4px solid #D7BB83",
          borderRadius: 20,
          margin: "50px 30px",
          padding: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("${A}/JAWA-BACKGROUND.jpg")`,
            backgroundPosition: "bottom center",
            backgroundSize: "cover",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", padding: "50px 20px 30px 20px" }}>
          {/* Ornament */}
          <div style={{ textAlign: "center" }}>
            <img
              src={`${A}/JAWA-GUNUNGAN.png`}
              alt=""
              style={{ width: 60, maxWidth: "100%" }}
            />
          </div>

          <div style={{ height: 30 }} />

          <p
            className="h-title-script"
            style={{ color: "#000", fontSize: 38, fontWeight: 500, textAlign: "center", margin: 0 }}
          >
            Our Love Story
          </p>

          <div style={{ height: 20 }} />

          {/* Story cards */}
          {stories.map((story, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#FFFCF3DE",
                border: "2px solid #D7BB83",
                borderRadius: 20,
                boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
                margin: "5px 0",
                padding: 15,
              }}
            >
              <p
                className="h-title-serif"
                style={{
                  color: "#000",
                  fontSize: 24,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  lineHeight: "1em",
                  margin: "5px 0",
                  textAlign: "left",
                }}
              >
                {story.tahun}
              </p>
              <p
                className="h-text-sans"
                style={{
                  color: "#000",
                  fontSize: 12,
                  lineHeight: "1.3em",
                  letterSpacing: "0.5px",
                  margin: "5px 0",
                  textAlign: "justify",
                }}
              >
                {story.cerita}
              </p>
            </div>
          ))}

          <div style={{ height: 30 }} />
        </div>
      </div>
    </div>
  );
}
