import { ImageResponse } from "next/og";

/* Social share card for /for-speakers (used by Open Graph; copy this file to
   twitter-image.jsx too if a platform doesn't pick it up). */

export const alt = "Zarrar for speakers: book more stages, chase fewer emails";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const line = { display: "flex" };

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
          background: "#f2eee3",
          color: "#101010",
          padding: 72,
        }}
      >
        <div style={{ ...line, fontSize: 30, fontWeight: 700, color: "#5b3df5" }}>
          Zarrar for keynote speakers
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: -3,
            textTransform: "uppercase",
          }}
        >
          <div style={line}>Book more</div>
          <div style={line}>stages.</div>
          <div style={{ ...line, color: "#5b3df5" }}>Chase fewer</div>
          <div style={{ ...line, color: "#5b3df5" }}>emails.</div>
        </div>

        <div style={{ ...line, fontSize: 28, color: "#565144" }}>
          Website, outreach and social media for speakers
        </div>
      </div>
    ),
    { ...size }
  );
}
