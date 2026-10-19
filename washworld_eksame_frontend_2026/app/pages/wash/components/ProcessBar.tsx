type Props = {
  totalSeconds: number;
  secondsLeft: number;
  label: string;
};

export default function ProcessBar({ totalSeconds, secondsLeft, label }: Props) {
  const size = 220;
const r = 98;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ * (secondsLeft / totalSeconds);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx="110" cy="110" r={r} fill="none" stroke="#333" strokeWidth="8" />
        <circle
          cx="110" cy="110" r={r}
          fill="none" stroke="#22c55e" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 500, fontSize: 54, color: "#fff",
      }}>
        {label}
      </div>
    </div>
  );
}