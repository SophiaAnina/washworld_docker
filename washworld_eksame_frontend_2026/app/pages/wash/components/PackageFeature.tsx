"use client";
type Package = "guld" | "premium" | "brilliant";
type Props = {
  active: Package;
};

const features = [
  { name: "Skumforvask", icon: "/svg/vaskeikoner/skumforvask.svg", guld: true, premium: true, brilliant: true },
  { name: "Aktiv shampoo", icon: "/svg/vaskeikoner/aktiv_shampoo.svg", guld: true, premium: true, brilliant: true },
  { name: "Hjulvask", icon: "/svg/vaskeikoner/hjulvask.svg", guld: true, premium: true, brilliant: true },
  { name: "Højtryksvask", icon: "/svg/vaskeikoner/hojtryksvask.svg", guld: true, premium: true, brilliant: true },
  { name: "Børstevask", icon: "/svg/vaskeikoner/borstevask.svg", guld: true, premium: true, brilliant: true },
  { name: "Voks", icon: "/svg/vaskeikoner/skyllevoks.svg", guld: true, premium: true, brilliant: true },
  { name: "Tørring", icon: "/svg/vaskeikoner/torring.svg", guld: true, premium: true, brilliant: true },
  { name: "Højglans", icon: "/svg/vaskeikoner/hojglas.svg", guld: false, premium: true, brilliant: true },
  { name: "Undervognsvask", icon: "/svg/vaskeikoner/undervognsvask.svg", guld: false, premium: true, brilliant: true },
  { name: "Skumvask", icon: "/svg/vaskeikoner/skumforvask.svg", guld: false, premium: false, brilliant: true },
  { name: "Affedtning", icon: "/svg/vaskeikoner/affedtning.svg", guld: false, premium: false, brilliant: true },
  { name: "Sæsonrens", icon: "/svg/vaskeikoner/saesonrens.svg", guld: false, premium: false, brilliant: true },
];

const PACKAGES: Package[] = ["guld", "premium", "brilliant"];

function Check({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke={active ? "#22c55e" : "#000"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PackageFeatures({ active }: Props) {
  const activeIndex = PACKAGES.indexOf(active);
  return (
    <div style={{ background: "#111", padding: "26px 25px", display: "flex", flexDirection: "column", gap: 6 }}>
      {features.map((feature) => (
        <div key={feature.name} style={{ display: "flex", height: 32, gap: 2 }}>
          <div
            style={{
              flex: 1,
              background: "var(--color-primary)",
              clipPath: "polygon(0 0, 100% 0, calc(100% - 24px) 100%, 0 100%)",
              display: "flex",
              alignItems: "center",
              paddingLeft: 12,
              fontWeight: 700,
              fontSize: 12,
              color: "#000",
              marginRight: -20,
              gap: 12,
            }}
          >
            <img src={feature.icon} alt={feature.name} style={{ width: 18, height: 18, filter: "brightness(0)" }} />
            {feature.name}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {PACKAGES.map((pkg, i) => {
              const included = feature[pkg];
              const isActive = i === activeIndex;
              return (
                <div
                  key={pkg}
                  style={{
                    width: 44,
                    background: "#2a2a2a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    ...(i === 0 ? { clipPath: "polygon(24px 0, 100% 0, 100% 100%, 0 100%)", paddingLeft: 12, width: 56 } : {}),
                  }}
                >
                  {included && <Check active={isActive} />}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}