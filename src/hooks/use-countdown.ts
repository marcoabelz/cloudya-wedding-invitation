"use client";

import { useEffect, useMemo, useState } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isReady: boolean;
}

export function useCountdown(targetDate: Date): CountdownTime {
  // Memoize the timestamp to prevent infinite loops
  const targetTime = useMemo(() => targetDate.getTime(), [targetDate.getTime()]);

  // Start with placeholder to avoid hydration mismatch
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    isReady: false,
  });

  useEffect(() => {
    const target = new Date(targetTime);

    // Calculate immediately on mount
    setCountdown({ ...calculateCountdown(target), isReady: true });

    const interval = setInterval(() => {
      setCountdown({ ...calculateCountdown(target), isReady: true });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return countdown;
}

function calculateCountdown(targetDate: Date): Omit<CountdownTime, "isReady"> {
  const now = new Date();

  if (now >= targetDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const totalSeconds = differenceInSeconds(targetDate, now);
  const days = differenceInDays(targetDate, now);
  const hours = differenceInHours(targetDate, now) % 24;
  const minutes = differenceInMinutes(targetDate, now) % 60;
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isExpired: false };
}
