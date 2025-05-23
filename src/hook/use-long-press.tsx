import { useCallback, useRef, useState } from 'react';

interface UseLongPressOptions {
  shouldPreventDefault?: boolean;
  delay?: number;
}

interface UseLongPressHandlers {
  isClicking: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLElement>) => void;
}

export const useLongPress = (
  onLongPress: (event: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => void,
  onClick: () => void,
  { shouldPreventDefault = true, delay = 300 }: UseLongPressOptions = {},
): UseLongPressHandlers => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<number | undefined>(undefined);
  const target = useRef<HTMLElement | null>(null);
  const [isClicking, setIsClicking] = useState(false);
  const start = useCallback(
    (event: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener('touchend', event.preventDefault, {
          passive: false,
        });
        target.current = event.target as HTMLElement;
        event.preventDefault();
      }
      setIsClicking(true);
      timeout.current = window.setTimeout(() => {
        onLongPress(event);
        setIsClicking(false);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault],
  );

  const clear = useCallback(
    (
      event: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>,
      shouldTriggerClick = true,
    ) => {
      setLongPressTriggered(false);
      setIsClicking(false);
      if (timeout.current) clearTimeout(timeout.current);
      if (shouldTriggerClick && !longPressTriggered) onClick();
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', event.preventDefault);
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered],
  );

  return {
    isClicking,
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onMouseLeave: (e) => clear(e, false),
    onTouchEnd: (e) => clear(e),
  };
};
