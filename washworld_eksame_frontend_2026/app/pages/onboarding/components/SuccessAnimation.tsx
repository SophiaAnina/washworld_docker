"use client";

type Props = {
  duration?: number;
};

export default function SuccessAnimation({ duration = 1500 }: Props) {
  const size = 160;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#333" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#22c55e" strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ animation: `fillRing ${duration}ms ease forwards` }}
        />
      </svg>
      <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0 }}>
        <path
          d="M50 82 L68 98 L110 58"
          fill="none" stroke="#22c55e" strokeWidth="7"
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="80" strokeDashoffset="80"
          style={{ opacity: 0, animation: `drawCheck 0.4s ease forwards ${duration}ms` }}
        />
      </svg>
      <style>{`
        @keyframes fillRing {
          from { stroke-dashoffset: ${circumference}; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 80; opacity: 0; }
          to   { stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>
    </div>
  );
}