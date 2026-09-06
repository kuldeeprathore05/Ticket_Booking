import { useEffect, useState } from "react";

// Renders a mm:ss countdown to a given epoch-ms deadline. This is purely
// visual - the server-side Redis TTL is the real source of truth, so the
// booking flow always re-verifies with the backend rather than trusting
// this timer reaching zero.
export const useCountdown = (deadline) => {
  const [remainingMs, setRemainingMs] = useState(
    deadline ? Math.max(deadline - Date.now(), 0) : 0
  );

  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => {
      setRemainingMs(Math.max(deadline - Date.now(), 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return { label: `${minutes}:${seconds}`, expired: deadline ? remainingMs <= 0 : false };
};
