import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ayush Anand — Software Developer";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0f0d",
          color: "#ecebe4",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#7cc8a2",
          }}
        >
          Software Developer
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, lineHeight: 1 }}>
            Ayush Anand
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 36,
              color: "#a39e92",
            }}
          >
            I build products, end to end.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
