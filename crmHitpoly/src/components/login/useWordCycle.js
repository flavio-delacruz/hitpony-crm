// features/login/useWordCycle.js
import { useState, useEffect } from "react";

export const useWordCycle = (words, interval = 4000) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words, interval]);
  return index;
};
