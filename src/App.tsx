import './App.css';
import { useConfetti } from '@/magicui/use-confetti';
import WheelComponent from './components/wheel-component';
import { useLongPress } from '@/hook/use-long-press';
import { useMemo, useRef, useState } from 'react';

function App() {
  const [state, setState] = useState<'button' | 'button-click' | 'spin-wheel' | 'winner'>('button');
  const [winner, setWinner] = useState<null | { name: string; prize: string }>(null);
  const homeSpanRef = useRef<HTMLSpanElement>(null);
  const { trigger, isRunning } = useConfetti();
  const segments = [
    'better luck next time',
    'won 70',
    'won 10',
    'better luck next time',
    'won 2',
    'won uber pass',
    'better luck next time',
    'won a voucher',
  ];
  const segColors = [
    '#EE4040',
    '#F0CF50',
    '#815CD1',
    '#3DA5E0',
    '#34A24F',
    '#F9AA1F',
    '#EC3F3F',
    '#FF9000',
  ];
  const rootEle = document.getElementById('root')!;
  const removeRootStyle = () => {
    rootEle.style.removeProperty('animation-timing-function');
    rootEle.style.removeProperty('animation-duration');
    rootEle.style.removeProperty('background-blend-mode');
  };
  const onFinished = (winner: string) => {
    trigger();
    setTimeout(() => setState('winner'), 5000);
    setWinner({ name: winner, prize: 'voucher' });
    buttonRef.current?.classList.remove('button-animate');
    removeRootStyle();
  };
  const { isClicking, ...longPressEvent } = useLongPress(
    () => {
      setState('spin-wheel');
      rootEle.style.setProperty('background-blend-mode', 'difference');
    },
    () => {
      setState('button');
      rootEle.style.setProperty('animation-duration', '.2s');
      removeRootStyle();
      buttonRef.current?.style.setProperty('animation-duration', '.2s');
    },
    { delay: 5000 },
  );
  console.log('isClicking', isClicking);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useMemo(() => {
    if (!buttonRef.current) return;
    if (isClicking) {
      setState('button-click');
      rootEle.style.setProperty('animation-timing-function', 'var(--ripple-animation)');
      rootEle.style.setProperty('animation-duration', '.2s');

      buttonRef.current.classList.add('w-full');
      buttonRef.current.classList.add('h-full');
    } else {
      buttonRef.current.classList.remove('w-full');
      buttonRef.current.classList.remove('h-full');
    }
  }, [isClicking]);
  return (
    <>
      <span
        className="absolute w-[80vmin] h-[80vmin] flex justify-center items-center"
        ref={homeSpanRef}
      >
        {state == 'button-click' && (
          <span className="rounded-full w-full h-full absolute backdrop-brightness-130" />
        )}
        {(state == 'button' || state == 'button-click') && (
          <button
            ref={buttonRef}
            {...longPressEvent}
            type="button"
            className="bg-secondary-background rounded-full w-1/6 h-1/6 absolute button-animate"
          >
            Click Me
          </button>
        )}
        {state === 'spin-wheel' && (
          <span className="absolute">
            <WheelComponent
              segments={segments}
              segColors={segColors}
              winningSegment="won 10"
              onFinished={(winner) => onFinished(winner)}
              primaryColor="black"
              contrastColor="white"
              buttonText=""
              isOnlyOnce={true}
              size={homeSpanRef.current ? homeSpanRef.current.clientWidth / 2 : 300}
              upDuration={1000}
            />
          </span>
        )}
        {state === 'winner' && (
          <span className="absolute text-3xl text-white font-bold">
            {winner?.name} won {winner?.prize}!
          </span>
        )}
      </span>
    </>
  );
}

export default App;
