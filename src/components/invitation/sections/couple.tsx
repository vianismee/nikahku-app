"use client";

import type { InvitationPageProps } from "../types";

const A = "/templates/heritage-01-jawa/assets";

/** Couple section: photo card + initials + verse quote */
export default function CoupleSection({ data }: { data: InvitationPageProps }) {
  const photoBg = data.galleryUrls[9] || `${A}/Heritage-10-qx4cuzqws82adjdjmarwmvvqd3imy7s46db8u7ndq8.jpeg`;

  return (
    <div className="h-section h-bg-brown h-section--fullheight" style={{ zIndex: 9998 }}>
      <div className="h-ornament-col" style={{ width: "100%", maxWidth: 1140, margin: "0 auto" }}>
        {/* Photo card */}
        <div
          style={{
            margin: "0 30px",
            marginTop: "-50px",
            zIndex: 1,
            position: "relative",
          }}
        >
          <div
            className="h-card"
            style={{
              backgroundImage: `url("${photoBg}")`,
              backgroundPosition: "50% 50%",
              backgroundSize: "cover",
              padding: 30,
            }}
          >
            <div style={{ height: 330 }} />
          </div>
        </div>

        {/* Names + verse card */}
        <div
          style={{
            margin: 0,
            padding: "0 30px",
            position: "relative",
          }}
        >
          <div
            className="h-card"
            style={{
              borderColor: "transparent",
              backgroundImage: `url("${A}/JAWA-MOTIF-ATAS.png")`,
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% auto",
              padding: "50px 30px",
            }}
          >
            {/* Verse background overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url("${A}/Heritage-cpw.jpeg")`,
                backgroundPosition: "bottom center",
                backgroundSize: "cover",
                opacity: 0.2,
                borderRadius: 20,
                pointerEvents: "none",
              }}
            />

            <div style={{ height: 30, position: "relative" }} />

            {/* Initials */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                position: "relative",
              }}
            >
              <span
                className="h-title-serif"
                style={{ color: "#D7BB83", fontSize: 48, fontWeight: 500 }}
              >
                {data.inisialWanita}
              </span>
              <span
                className="h-title-script"
                style={{ color: "#000", fontSize: 36, fontWeight: 500 }}
              >
                &amp;
              </span>
              <span
                className="h-title-serif"
                style={{ color: "#D7BB83", fontSize: 48, fontWeight: 500 }}
              >
                {data.inisialPria}
              </span>
            </div>

            <div style={{ height: 20 }} />

            {/* Verse */}
            <p
              className="h-title-serif"
              style={{
                color: "#000",
                fontSize: 14,
                fontStyle: "italic",
                textAlign: "center",
                margin: 0,
                lineHeight: "1.3em",
                position: "relative",
              }}
            >
              &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan
              pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan
              merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan
              sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda
              (kebesaran Allah) bagi kaum yang berpikir.&rdquo;
            </p>

            <div style={{ height: 10 }} />

            <p
              className="h-title-serif"
              style={{
                color: "#000",
                fontSize: 16,
                fontWeight: 700,
                textAlign: "center",
                margin: 0,
                position: "relative",
              }}
            >
              <b>- QS. Ar-Rum : 21 -</b>
            </p>

            <div style={{ height: 30 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
