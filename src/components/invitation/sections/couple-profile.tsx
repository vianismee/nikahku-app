"use client";

import type { InvitationPageProps } from "../types";

const A = "/templates/heritage-01-jawa/assets";

/** Circular ornament column + "We Are Getting Married" + one couple profile */
function CoupleProfile({
  data,
  side,
}: {
  data: InvitationPageProps;
  side: "wanita" | "pria";
}) {
  const isWanita = side === "wanita";
  const bgUrl = isWanita
    ? `${A}/JAWA-COUPLE-1.png`
    : `${A}/JAWA-COUPLE-3.png`;
  const bgPos = isWanita ? "25% 60%" : "75% 60%";
  const photoOverlayUrl = isWanita
    ? `${A}/Heritage-cpw.jpeg`
    : `${A}/Heritage-cpp.jpeg`;
  const ornamentUrl = isWanita
    ? `${A}/JAWA-COUPLE-2.png`
    : `${A}/JAWA-COUPLE-4.png`;
  const ornamentAlign = isWanita ? "right" : "left";
  const ornamentMargin = isWanita ? "-25px 70px 0 0" : "-25px 0 0 70px";

  const nickname = isWanita ? data.namaWanitaPanggil : data.namaPriaPanggil;
  const fullName = isWanita ? data.namaWanitaLengkap : data.namaPriaLengkap;
  const parents = isWanita ? data.ortuWanita : data.ortuPria;
  const igUrl = isWanita ? data.igWanitaUrl : data.igPriaUrl;
  const igHandle = isWanita ? data.igWanita : data.igPria;

  return (
    <>
      {/* Couple background + round photo */}
      <div
        style={{
          backgroundImage: `url("${bgUrl}")`,
          backgroundPosition: bgPos,
          backgroundRepeat: "no-repeat",
          backgroundSize: "50% auto",
          marginTop: 0,
          marginBottom: -150,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {/* Spacer col */}
          <div style={{ width: "25%" }} />

          {/* Round photo */}
          <div style={{ width: "50%", zIndex: 1 }}>
            <div
              className="h-couple-photo"
              style={{
                margin: "0 0 50px 0",
              }}
            >
              <div
                className="h-couple-photo-inner"
                style={{ position: "relative" }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url("${photoOverlayUrl}")`,
                    backgroundPosition: "50% 0%",
                    backgroundSize: "cover",
                    opacity: 1,
                    zIndex: 1,
                    borderRadius: "inherit",
                  }}
                />
                <div style={{ height: 300 }} />
              </div>
            </div>
          </div>

          {/* Spacer col */}
          <div style={{ width: "25%", marginTop: 200 }}>
            <div style={{ height: 20 }} />
            {/* Ornament image */}
            <div
              style={{
                textAlign: ornamentAlign,
                zIndex: 1,
                position: "relative",
                margin: ornamentMargin,
              }}
            >
              <img
                src={ornamentUrl}
                alt=""
                style={{ width: 110, maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Name card */}
      <div style={{ margin: 0, padding: 0 }}>
        <div
          style={{
            border: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <div
            style={{
              margin: 0,
              padding: `0 20px`,
            }}
          >
            <div style={{ height: 30 }} />

            <p
              className="h-title-script"
              style={{
                color: "#000",
                fontSize: 48,
                fontWeight: 500,
                textAlign: "center",
                margin: 0,
                lineHeight: "1.3em",
              }}
            >
              {nickname}
            </p>

            <div style={{ height: 5 }} />

            <p
              className="h-title-serif"
              style={{
                color: "#000",
                fontSize: 20,
                fontWeight: 600,
                textTransform: "uppercase",
                textAlign: "center",
                margin: 0,
                lineHeight: "1em",
              }}
            >
              {fullName}
            </p>

            <div style={{ height: 5 }} />

            <p
              className="h-text-sans"
              style={{
                color: "#000",
                textAlign: "center",
                margin: 0,
                lineHeight: "1.5em",
                letterSpacing: "0.5px",
              }}
            >
              {parents}
            </p>

            <div style={{ height: 10 }} />

            {igHandle && (
              <div style={{ textAlign: "center", margin: 0 }}>
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-btn h-btn--sm"
                >
                  <i className="fab fa-instagram" />
                  <span>Instagram</span>
                </a>
              </div>
            )}

            <div style={{ height: 50 }} />
          </div>
        </div>
      </div>
    </>
  );
}

/** Full couple section: both profiles with shared header */
export default function CoupleProfileSection({ data }: { data: InvitationPageProps }) {
  return (
    <>
      {/* Section header inside the ornament column */}
      <div className="h-section" style={{ background: "#FFFCF3ED" }}>
        {/* Circular ornament column */}
        <div className="h-ornament-col">
          <div style={{ height: 80 }} />

          {/* Gunungan ornament */}
          <div style={{ textAlign: "center" }}>
            <img
              src={`${A}/JAWA-GUNUNGAN.png`}
              alt=""
              style={{ width: 50, maxWidth: "100%" }}
            />
          </div>

          <div style={{ height: 30 }} />

          {/* "We Are Getting Married" */}
          <div style={{ padding: "0 40px" }}>
            <p
              className="h-title-script"
              style={{
                color: "#000",
                fontSize: 36,
                fontWeight: 500,
                textAlign: "center",
                margin: 0,
                lineHeight: "1.3em",
              }}
            >
              We Are
              <br />
              Getting Married!
            </p>

            <div style={{ height: 10 }} />

            <p
              className="h-text-sans"
              style={{
                color: "#000",
                textAlign: "center",
                margin: 0,
                lineHeight: "1.5em",
                letterSpacing: "0.5px",
              }}
            >
              Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
              Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami:
            </p>

            <div style={{ height: 30 }} />
          </div>

          {/* Wanita profile */}
          <CoupleProfile data={data} side="wanita" />

          {/* Large ampersand */}
          <div
            style={{
              padding: "5px 0",
              textAlign: "center",
            }}
          >
            <p
              className="h-title-serif"
              style={{
                color: "#000",
                fontSize: 60,
                fontWeight: 600,
                textTransform: "uppercase",
                lineHeight: "1em",
                margin: 0,
              }}
            >
              &amp;
            </p>
            <div style={{ height: 50 }} />
          </div>

          {/* Pria profile */}
          <CoupleProfile data={data} side="pria" />

          <div style={{ height: 100 }} />
        </div>
      </div>
    </>
  );
}
