import { ImageResponse } from "next/og";
import { brandFonts } from "@/lib/og-font";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ayush Anand | Full-Stack & Freelance Web Developer";

const tagline = "Premium websites & full-stack products.";

export default async function OpengraphImage() {
  const { fonts, hasDisplay, hasSerif } = await brandFonts(
    "AYUSH ANAND.",
    tagline,
    "FULL-STACK ENGINEER · PROJECTS & FULL-TIME ROLES DELHI, INDIA",
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0b0a",
          color: "#efebe3",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#9d978b",
            borderTop: "1px solid #3a3731",
            paddingTop: 18,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#ff3b1f",
              }}
            />
            Full-stack engineer · Projects &amp; full-time roles
          </span>
          <span>Delhi, India</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: hasDisplay ? 150 : 132,
              fontWeight: 900,
              fontFamily: hasDisplay ? "Archivo" : undefined,
              lineHeight: 0.88,
              letterSpacing: hasDisplay ? -1 : -4,
              textTransform: "uppercase",
            }}
          >
            <span>Ayush</span>
            <span style={{ display: "flex" }}>
              Anand
              <span style={{ color: "#ff3b1f" }}>.</span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: hasSerif ? 50 : 40,
              fontFamily: hasSerif ? "Instrument Serif" : undefined,
              fontStyle: hasSerif ? "italic" : "normal",
              color: "#9d978b",
            }}
          >
            {tagline}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            height: 18,
            background: "#ff3b1f",
            margin: "0 -72px -64px",
          }}
        />
      </div>
    ),
    { ...size, fonts },
  );
}
