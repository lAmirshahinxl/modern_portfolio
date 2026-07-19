import { ImageResponse } from "next/og";
import { portfolio } from "@/data/portfolio";

export const alt = "Amir Abasi — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fbfbfb",
        color: "#111110",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          borderBottom: "1px solid #dfdfdc",
          color: "#737371",
          fontSize: 16,
        }}
      >
        <span style={{ display: "flex", gap: 7, color: "#ff5f57" }}><span>●</span><span style={{ color: "#febc2e" }}>●</span><span style={{ color: "#28c840" }}>●</span></span>
        <span>{portfolio.site.windowTitle} › profile.md</span>
        <span style={{ color: "#016094" }}>● available_for_hire: true</span>
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ width: 220, display: "flex", flexDirection: "column", borderRight: "1px solid #dfdfdc", padding: "34px 24px", color: "#737371", fontSize: 15 }}>
          <span>⌄ EXPLORER</span>
          <span style={{ marginTop: 45, color: "#016094" }}>M&nbsp;&nbsp; profile.md</span>
          <span style={{ marginTop: 20 }}>✳&nbsp;&nbsp; experience.tsx</span>
          <span style={{ marginTop: 20 }}>▸&nbsp;&nbsp; projects.dir</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "52px 70px", maxWidth: 850 }}>
          <span style={{ color: "#aaa9a6", fontSize: 15, letterSpacing: 3 }}>01 · ABOUT</span>
          <span style={{ marginTop: 22, fontSize: 66, lineHeight: 1, letterSpacing: -3 }}>{portfolio.brand.name}.</span>
          <span style={{ marginTop: 14, color: "#aaa9a6", fontSize: 17 }}>{portfolio.intro.eyebrow}</span>
          <span style={{ marginTop: 34, color: "#737371", fontSize: 29, lineHeight: 1.35 }}>
            {portfolio.intro.headline}
          </span>
        </div>
      </div>
      <div style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "#0092E0", color: "white", fontSize: 13 }}>
        <span>⌘ main&nbsp;&nbsp;&nbsp; Flutter · React</span>
        <span>TypeScript&nbsp;&nbsp;&nbsp; {portfolio.intro.timezone}</span>
      </div>
    </div>,
    size,
  );
}
