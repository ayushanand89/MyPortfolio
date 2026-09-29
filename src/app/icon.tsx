import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0b0a",
          color: "#efebe3",
          fontSize: 22,
          fontWeight: 900,
          borderRadius: 7,
          position: "relative",
        }}
      >
        A
        <div
          style={{
            position: "absolute",
            right: 5,
            bottom: 6,
            width: 6,
            height: 6,
            borderRadius: 999,
            background: "#ff3b1f",
          }}
        />
      </div>
    ),
    size,
  );
}
