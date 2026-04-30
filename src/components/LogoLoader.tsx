"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/*
  3×3 grid indices:
    0 1 2
    3 4 5
    6 7 8
  Clockwise from top-left: 0→1→2→5→8→7→6→3
*/
const CLOCKWISE = [0, 1, 2, 5, 8, 7, 6, 3];

export default function LogoLoader({
  size = 36,
  label,
  labelColor = "#2C2C2A",
  bg = "#2D1B4E",
}: {
  size?: number;
  label?: string;
  labelColor?: string;
  bg?: string;
}) {
  const [spinKey, setSpinKey]   = useState(0);
  const [phase, setPhase]       = useState<1 | 2 | 3>(1);
  const [litCount, setLitCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    clear();
    if (phase === 1) {
      // Wait for spin (600 ms) then start lighting up
      timer.current = setTimeout(() => setPhase(2), 600);
    } else if (phase === 2) {
      if (litCount < 8) {
        // Light up one dot every 120 ms
        timer.current = setTimeout(() => setLitCount((c) => c + 1), 120);
      } else {
        // All dots lit — brief hold then reset
        timer.current = setTimeout(() => setPhase(3), 120);
      }
    } else {
      // Phase 3: dots fade to dim (CSS transition 300 ms) + 400 ms hold = 700 ms total
      timer.current = setTimeout(() => {
        setLitCount(0);
        setSpinKey((k) => k + 1);
        setPhase(1);
      }, 700);
    }
    return clear;
  }, [phase, litCount, clear]);

  // Scale all pixel values from the 36 px base
  const s      = size / 36;
  const dotSz  = Math.max(2, Math.round(5 * s));
  const ctrSz  = Math.max(3, Math.round(7 * s));
  const gap    = Math.max(2, Math.round(4 * s));
  const pad    = Math.max(3, Math.round(6 * s));
  const radius = Math.max(2, Math.round(4 * s));
  // Negative margin keeps the larger center dot from pushing the grid wider
  const ctrMargin = -Math.ceil((ctrSz - dotSz) / 2);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: Math.max(6, Math.round(8 * s)),
      }}
    >
      {/* Logo mark box */}
      <div
        style={{
          width: size,
          height: size,
          background: bg,
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: radius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Grid rotates in Phase 1; center dot is at transform-origin so it appears fixed */}
        <div
          key={spinKey}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap,
            padding: pad,
            animation:
              phase === 1
                ? "em-logo-spin 600ms ease-in-out forwards"
                : undefined,
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            if (i === 4) {
              return (
                <div
                  key={4}
                  style={{
                    width: ctrSz,
                    height: ctrSz,
                    borderRadius: "50%",
                    background: "#00D4AA",
                    margin: ctrMargin,
                  }}
                />
              );
            }
            const cwIdx    = CLOCKWISE.indexOf(i);
            const isLit    = phase === 2 && cwIdx < litCount;
            const isDimming = phase === 3;
            return (
              <div
                key={i}
                style={{
                  width: dotSz,
                  height: dotSz,
                  borderRadius: "50%",
                  background: isLit ? "#5C3D8A" : "rgba(250,249,247,0.18)",
                  transition: isDimming
                    ? "background 0.3s ease"
                    : isLit
                    ? "background 0.08s ease"
                    : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      {label && (
        <span
          style={{
            fontSize: Math.max(10, Math.round(12 * s)),
            color: labelColor,
            fontFamily: "var(--font-inter)",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      )}

    </div>
  );
}
