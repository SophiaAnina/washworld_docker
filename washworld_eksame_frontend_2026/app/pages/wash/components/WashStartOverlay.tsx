"use client";
import { useEffect, useState } from "react";

type Props = {
  onComplete: () => void;
};

export default function WashStartOverlay({ onComplete }: Props) {
  const [fading, setFading] = useState(false); 
  
useEffect(() => {
  const fadeTimer = setTimeout(() => setFading(true), 2000);
  const completeTimer = setTimeout(() => onComplete(), 2600);
  return () => {
    clearTimeout(fadeTimer);
    clearTimeout(completeTimer);
  };
}, []); // tom dependency array

  return (
    <div style={{
  position: "fixed",
  inset: 0,
  background: "#000",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: "30vh",
  zIndex: 999,
  opacity: fading ? 0 : 1,
  transition: "opacity 0.6s ease-in-out",
}}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
      <h3 style={{ fontSize: "var(--h3-size)", fontWeight: 800, textAlign: "center",maxWidth: "240px", color: "var(--color-active-bg)" }}>
        Din vask starter om et øjeblik
        <span style={{ display: "inline-flex", gap: 3, marginLeft: 4, verticalAlign: "middle", paddingTop: "8px" }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--color-active-bg)",
                display: "inline-block",
                animation: `pulse 1.2s ease-in-out ${i * 0.4}s infinite`,
              }}
            />
          ))}
        </span>
      </h3>
    </div>
  );
}