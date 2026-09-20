"use client";

import { useEffect, useState } from "react";

export function useTracePlayback(count: number, initialIndex = 0, interval = 700) {
  const [index, setIndex] = useState(initialIndex);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setIndex((current) => {
      if (current >= count - 1) {
        setPlaying(false);
        return current;
      }
      return current + 1;
    }), interval);
    return () => window.clearInterval(timer);
  }, [count, interval, playing]);

  return { index, setIndex, playing, setPlaying };
}
