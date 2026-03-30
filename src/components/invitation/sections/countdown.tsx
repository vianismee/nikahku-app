"use client";

import { useEffect, useState } from "react";
import type { InvitationPageProps } from "../types";

const A = "/templates/heritage-01-jawa/assets";

export default function CountdownSection({ data }: { data: InvitationPageProps }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date(data.countdownDate).getTime();
    if (isNaN(target)) return;

    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [data.countdownDate]);

  // Slideshow bg images
  const slides = [
    data.galleryUrls[0] || `${A}/Heritage-1-qx4cuhvz6ddu8y3hil1ztidz2rynvyt7rwx0pydv0g.jpeg`,
    data.galleryUrls[1] || `${A}/Heritage-2-qx4cuml64jk9uzwnr534nz7a1pbhygbvgk6g4c6w5c.jpeg`,
    data.galleryUrls[2] || `${A}/Heritage-3-qx4cuogui7mui7txg5wdsyq78h28dujc4thf2w43sw.jpeg`,
  ];
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <>
      {/* Slideshow background section */}
      <div
        className="h-section"
        style={{
          position: "relative",
          overflow: "hidden",
          zIndex: 9998,
        }}
      >
        <div
          style={{
            position: "relative",
            height: "600px",
            backgroundImage: `url("${slides[slideIdx]}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "background-image 1s ease-in-out",
          }}
        >
          {/* Gradient overlay on slideshow */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "200px",
              background: "linear-gradient(180deg, rgba(92,67,36,0) 80%, #472A1C 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Countdown section */}
      <div
        className="h-section"
        style={{
          backgroundColor: "#472A1C",
          overflow: "hidden",
          padding: 0,
          zIndex: 9998,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "50px 0 30px 0",
          }}
        >
          {/* Ornament */}
          <img
            src={`${A}/JAWA-GUNUNGAN.png`}
            alt=""
            style={{ width: 60, maxWidth: "100%" }}
          />
          <div style={{ height: 30 }} />

          {/* Save the date heading */}
          <p
            className="h-title-script"
            style={{
              color: "#fff",
              fontSize: 42,
              fontWeight: 500,
              textAlign: "center",
              lineHeight: "1em",
              margin: 0,
            }}
          >
            Save The Date
          </p>
          <div style={{ height: 20 }} />

          {/* Countdown boxes */}
          <div style={{ display: "flex", justifyContent: "center", padding: "0 10px" }}>
            {[
              { val: time.d, label: "Hari" },
              { val: time.h, label: "Jam" },
              { val: time.m, label: "Menit" },
              { val: time.s, label: "Detik" },
            ].map(({ val, label }) => (
              <div className="h-countdown-box" key={label}>
                <span className="h-countdown-digits">{String(val).padStart(2, "0")}</span>
                <span className="h-countdown-label">{label}</span>
              </div>
            ))}
          </div>

          <div style={{ height: 20 }} />

          {/* Date text */}
          <p
            className="h-text-sans"
            style={{
              color: "#fff",
              fontSize: 12,
              textAlign: "center",
              margin: 0,
              lineHeight: "1.5em",
            }}
          >
            {data.tanggalHeader}
          </p>
          <div style={{ height: 30 }} />
        </div>
      </div>
    </>
  );
}
