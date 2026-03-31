"use client";

import { useState } from "react";
import type { InvitationPageProps } from "../types";

const A = "/templates/heritage-01-jawa/assets";

const FALLBACKS = [
  "Heritage-12-qx4cv1ml5w4v0ratbbl5rvenjv9ddlzkumm7srklds.jpeg",
  "Heritage-11-qx4cuv1pu1vurhkddqqrsf2fe65svq9ghq1tftuclc.jpeg",
  "Heritage-9-qx4cuyt2le101xewrsda2e49rpn9qiodu8nrcxorwg.jpeg",
];

function imgSrc(idx: number, urls: string[]): string {
  return urls[idx] || `${A}/${FALLBACKS[idx % FALLBACKS.length]}`;
}

export default function GallerySection({ data }: { data: InvitationPageProps }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  const urls = data.galleryUrls.length > 0
    ? data.galleryUrls
    : FALLBACKS.map((f) => `${A}/${f}`);

  return (
    <div
      className="h-section h-section--fullheight"
      style={{
        background: "radial-gradient(at center, #8B5B43 0%, #472A1C 80%)",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "100px 20px",
        }}
      >
        <p
          className="h-title-script"
          style={{ color: "#fff", fontSize: 38, fontWeight: 500, textAlign: "center", margin: 0 }}
        >
          Our Gallery
        </p>

        <div style={{ height: 20 }} />

        {/* Row 1: two small + one tall */}
        <div style={{ display: "flex", width: "100%", gap: 4 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "40%" }}>
            {/* Two small photos stacked */}
            <div
              className="h-gallery-img"
              onClick={() => setLightbox(imgSrc(0, urls))}
              style={{
                height: 148,
                backgroundImage: `url("${imgSrc(0, urls)}")`,
                flex: 1,
              }}
            />
            <div
              className="h-gallery-img"
              onClick={() => setLightbox(imgSrc(4, urls))}
              style={{
                height: 148,
                backgroundImage: `url("${imgSrc(4, urls)}")`,
                flex: 1,
              }}
            />
          </div>
          {/* Large photo */}
          <div style={{ width: "60%", display: "flex", flexDirection: "column" }}>
            <div
              className="h-gallery-img"
              onClick={() => setLightbox(imgSrc(10, urls))}
              style={{
                height: 300,
                backgroundImage: `url("${imgSrc(10, urls)}")`,
                flex: 1,
              }}
            />
          </div>
        </div>

        <div style={{ height: 5 }} />

        {/* Row 2: carousel of 3 */}
        <div style={{ display: "flex", width: "100%", gap: 4 }}>
          {[1, 2, 3].map((offset) => (
            <div
              key={offset}
              className="h-gallery-img"
              onClick={() => setLightbox(imgSrc(offset, urls))}
              style={{
                flex: 1,
                height: 120,
                backgroundImage: `url("${imgSrc(offset, urls)}")`,
              }}
            />
          ))}
        </div>

        <div style={{ height: 5 }} />

        {/* Row 3: wide photo */}
        <div
          className="h-gallery-img"
          onClick={() => setLightbox(imgSrc(8, urls))}
          style={{
            width: "100%",
            height: 200,
            backgroundImage: `url("${imgSrc(8, urls)}")`,
          }}
        />

        <div style={{ height: 100 }} />
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="h-lightbox" onClick={() => setLightbox(null)}>
          <button className="h-lightbox-close" onClick={() => setLightbox(null)}>
            <i className="fas fa-times" />
          </button>
          <img src={lightbox} alt="Gallery" />
        </div>
      )}
    </div>
  );
}
