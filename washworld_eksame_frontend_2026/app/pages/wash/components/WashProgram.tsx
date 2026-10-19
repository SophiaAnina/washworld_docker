"use client";
import { useState, useEffect, useMemo } from "react";
import ProcessBar from "./ProcessBar";
import { useRouter } from "next/navigation";

type Package = "guld" | "premium" | "brilliant";

const steps: Record<Package, string[]> = {
  guld: ["Skumforvask", "Aktiv shampoo", "Hjulvask", "Højtryksvask", "Børstevask", "Voks", "Tørring"],
  premium: ["Skumforvask", "Aktiv shampoo", "Hjulvask", "Højtryksvask", "Børstevask", "Voks", "Tørring", "Højglans", "Undervognsvask"],
  brilliant: ["Skumforvask", "Aktiv shampoo", "Hjulvask", "Højtryksvask", "Børstevask", "Voks", "Tørring", "Højglans", "Undervognsvask", "Skumvask", "Affedtning", "Sæsonrens", "Slutskyl"],
};

const ITEM_HEIGHT = 32;
const VISIBLE_ITEMS = 5;
const DISPLAY_TOTAL = 20;
const START_DELAY = 3000;

export default function WashProgram({ package: pkg }: { package: Package }) {
  const programSteps = steps[pkg];
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DISPLAY_TOTAL);

  const [stepDurations] = useState(() => {
    const base = Math.floor(DISPLAY_TOTAL / programSteps.length);
    const durations = programSteps.map(() => base + Math.floor(Math.random() * 10) - 5);
    const total = durations.reduce((sum, d) => sum + d, 0);
    durations[durations.length - 1] += DISPLAY_TOTAL - total;
    return durations;
  });

  const currentStep = useMemo(() => {
    const elapsed = DISPLAY_TOTAL - secondsLeft;
    let acc = 0;
    for (let i = 0; i < stepDurations.length; i++) {
      acc += stepDurations[i];
      if (elapsed < acc) return i;
    }
    return programSteps.length - 1;
  }, [secondsLeft, stepDurations, programSteps]);

  useEffect(() => {
    const delay = setTimeout(() => setIsStarted(true), START_DELAY);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!isStarted) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isStarted]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setTimeout(() => router.push("/pages/wash/washcomplete"), 2000);
    }
  }, [secondsLeft, router]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const isLastStep = currentStep === programSteps.length - 1;
  const label = secondsLeft === 0 ? "0" : isLastStep ? `${secs}` : `${mins}:${secs.toString().padStart(2, "0")}`;

  const translateY = -currentStep * ITEM_HEIGHT + (VISIBLE_ITEMS * ITEM_HEIGHT) / 2 - ITEM_HEIGHT / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px", gap: 16, background: "transparent" }}>
      <ProcessBar totalSeconds={DISPLAY_TOTAL} secondsLeft={isStarted ? secondsLeft : DISPLAY_TOTAL} label={isStarted ? label : "00:30"} />
      <div style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, overflow: "hidden", position: "relative", width: "100%", maxWidth: 280 }}>
        <div
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: ITEM_HEIGHT, background: "linear-gradient(to bottom, #030303 0%, transparent 100%)", zIndex: 1, pointerEvents: "none" }}
        />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: ITEM_HEIGHT, background: "linear-gradient(to top, #000 0%, transparent 100%)", zIndex: 1, pointerEvents: "none" }} />
        <ol style={{ listStyle: "none", padding: 0, margin: 0, transform: `translateY(${translateY}px)`, transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
          {programSteps.map((step, i) => {
            const distance = Math.abs(i - currentStep);
            const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.2;
            const fontSize = distance === 0 ? 28 : 14;
            return (
              <li
                key={step}
                style={{
                  height: ITEM_HEIGHT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: i === currentStep ? "var(--color-primary)" : i < currentStep ? "#fff" : "#555",
                  fontWeight: i === currentStep ? 700 : 400,
                  fontSize,
                  opacity,
                  transition: "all 0.5s ease",
                }}
              >
                {i + 1}. {step}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
