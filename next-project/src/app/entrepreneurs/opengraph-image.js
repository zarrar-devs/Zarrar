import { ImageResponse } from "next/og";
import { BRAND, SEO } from "./founders-data";


export const alt = `${SEO.h1} ${BRAND}: websites, email marketing and social media for founders and CEOs`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Generated at build time, so you don't need to design or host a PNG. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000",
          color: "#fff",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", fontSize: 38, fontWeight: 700 }}>{BRAND}</div>

        <div
          style={{
            display: "flex",
            maxWidth: 980,
            fontSize: 92,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: -3,
          }}
        >
          {SEO.h1}
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#a8a8a8" }}>
          Websites, email marketing and social media for founders and CEOs
        </div>
      </div>
    ),
    { ...size }
  );
}
