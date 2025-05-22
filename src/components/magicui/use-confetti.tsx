import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';

export interface UseConfettiResult {
  trigger: () => void;
  isRunning: boolean;
}

export const useConfetti = (): UseConfettiResult => {
  const [running, setRunning] = useState(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    isRunningRef.current = running;
  }, [running]);

  const trigger = useCallback(() => {
    setRunning(true);
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        setRunning(false);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  return { trigger, isRunning: running };
};
