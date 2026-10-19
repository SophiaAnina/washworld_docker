"use client";
type Package = "guld" | "premium" | "brilliant";
type Props = {
  active: Package;
  onChange: (pkg: Package) => void;
};

function GuldBtn({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <div style={{ flex: 1, clipPath: "polygon(0 0, 100% 0, calc(100% - 39px) 100%, 0 100%)", background: "var(--color-primary)" }}>
      <div
        onClick={onClick}
        style={{
          background: "#0a0a0a",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 18,
          cursor: "pointer",
          clipPath: "polygon(2px 2px, calc(100% - 4px) 2px, calc(100% - 41px) calc(100% - 2px), 2px calc(100% - 2px))",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "var(--body-sm-size)", color: "var(--color-primary)" }}>Guld</div>
        <div style={{ fontSize: "var(--body-xs-size)", lineHeight: "var(--price-light-line-small)", color: "#fff" }}>139kr./md</div>
        {active && <div style={{ position: "absolute", inset: 0, background: "rgba(6, 193, 103, 0.28)", pointerEvents: "none" }} />}
      </div>
    </div>
  );
}

function PremiumBtn({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    // <div style={{ flex: 1, marginLeft: -20, clipPath: "polygon(39px 0, calc(100% - 0px) 0, calc(100% - 39px) 100%, 0 100%)", background: "var(--color-primary)" }}>
      <div style={{ flex: 1.4, marginLeft: -36, clipPath: "polygon(39px 0, calc(100% - 0px) 0, calc(100% - 39px) 100%, 0 100%)", background: "var(--color-primary)" }}>
      <div
        onClick={onClick}
        style={{
          background: "#0a0a0a",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 52,
          cursor: "pointer",
          clipPath: "polygon(41px 2px, calc(100% - 4px) 2px, calc(100% - 41px) calc(100% - 2px), 4px calc(100% - 2px))",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "var(--body-sm-size)", color: "var(--color-primary)" }}>Premium</div>
        <div style={{ fontSize: "var(--body-xs-size)", lineHeight: "var(--price-light-line-small)", color: "#fff" }}>169kr./md</div>
        {active && <div style={{ position: "absolute", inset: 0, background: "rgba(6, 193, 103, 0.28)", pointerEvents: "none" }} />}
      </div>
    </div>
  );
}

function BrilliantBtn({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <div style={{ flex: 1, marginLeft: -36, clipPath: "polygon(39px 0, 100% 0, 100% 100%, 0 100%)", background: "var(--color-primary)" }}>
      <div
        onClick={onClick}
        style={{
          background: "#0a0a0a",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 48,
          cursor: "pointer",
          clipPath: "polygon(41px 2px, calc(100% - 2px) 2px, calc(100% - 2px) calc(100% - 2px), 4px calc(100% - 2px))",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "var(--body-sm-size)", color: "var(--color-primary)" }}>Brilliant</div>
        <div style={{ fontSize: "var(--body-xs-size)", lineHeight: "var(--price-light-line-small)", color: "#fff" }}>199kr./md</div>
        {active && <div style={{ position: "absolute", inset: 0, background: "rgba(6, 193, 103, 0.28)", pointerEvents: "none" }} />}
      </div>
    </div>
  );
}

export default function PackageSelector({ active, onChange }: Props) {
  return (
    <div style={{ display: "flex", margin: "0 4px", height: 68, gap: 0 }}>
      <GuldBtn active={active === "guld"} onClick={() => onChange("guld")} />
      <PremiumBtn active={active === "premium"} onClick={() => onChange("premium")} />
      <BrilliantBtn active={active === "brilliant"} onClick={() => onChange("brilliant")} />
    </div>
  );
}