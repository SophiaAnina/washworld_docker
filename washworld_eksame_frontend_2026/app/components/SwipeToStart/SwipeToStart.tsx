"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { LuChevronRight } from "react-icons/lu";
import styles from "./SwipeToStart.module.css";

interface SwipeToStartProps {
  label?: string;
  completedLabel?: string;
  onComplete?: () => void;
  flush?: boolean;
}

export default function SwipeToStart({
  label = "Start din vask",
  completedLabel = "Vask startet",
  onComplete,
  flush = false,
}: SwipeToStartProps) {
  const [offset, setOffset] = useState(0);
  const [completed, setCompleted] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef(0);
  const initialOffsetRef = useRef(0);

  const getMax = () => {
    const track = trackRef.current;
    if (!track) return 0;
    return Math.max(0, track.clientWidth - 52);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (completed) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    startXRef.current = event.clientX;
    initialOffsetRef.current = offset;
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId) || completed) return;
    const delta = event.clientX - startXRef.current;
    const max = getMax();
    setOffset(Math.min(max, Math.max(0, initialOffsetRef.current + delta)));
  };

  const finishSwipe = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.currentTarget.releasePointerCapture(event.pointerId);

    const max = getMax();
    if (offset >= max * 0.82 && max > 0) {
      setOffset(max);
      setCompleted(true);
      onComplete?.();
      return;
    }

    setOffset(0);
  };

  return (
    <div className={`${styles.swipeButton} ${flush ? styles.flush : ""} ${completed ? styles.completed : ""}`} ref={trackRef}>
      <button
        type="button"
        className={styles.thumb}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishSwipe}
        onPointerCancel={finishSwipe}
        style={{ transform: `translateX(${offset}px)` }}
        aria-label="Swipe for at starte vask"
      >
        {completed ? "✓" : <LuChevronRight aria-hidden="true" />}
      </button>
      <span className={styles.swipeLabel}>
        {completed ? completedLabel : label}
      </span>
    </div>
  );
}
