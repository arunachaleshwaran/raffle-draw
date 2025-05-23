import './App.css';
import { useConfetti } from '@/magicui/use-confetti';
import WheelComponent from './components/wheel-component';
import { useLongPress } from '@/hook/use-long-press';
import { useMemo, useRef } from 'react';

function App() {
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
  const onFinished = (winner: string) => {
    trigger();
  };
  const { isClicking, ...longPressEvent } = useLongPress(
    () => trigger(),
    () => console.log('click'),
    { delay: 5000 },
  );
  console.log('isClicking', isClicking);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useMemo(() => {
    const rootEle = document.getElementById('root')!;
    if (!buttonRef.current) return;
    if (isClicking) {
      rootEle.style.setProperty('animation-timing-function', 'var(--ripple-animation)');
      rootEle.style.setProperty('animation-duration', '.3s');
      rootEle.style.setProperty('background-blend-mode', 'difference');

      buttonRef.current.classList.add('button-animate');
    } else {
      rootEle.style.removeProperty('animation-timing-function');
      rootEle.style.removeProperty('animation-duration');
      rootEle.style.removeProperty('background-blend-mode');
      buttonRef.current.classList.remove('button-animate');
    }
  }, [isClicking]);
  return (
    <>
      <WheelComponent
        segments={segments}
        segColors={segColors}
        winningSegment="won 10"
        onFinished={(winner) => onFinished(winner)}
        primaryColor="black"
        contrastColor="white"
        buttonText=""
        isOnlyOnce={true}
        size={300}
        upDuration={3000}
      />
      {!isRunning && (
        <button
          ref={buttonRef}
          {...longPressEvent}
          type="button"
          className="bg-primary-background  text-secondary p-2 rounded"
        >
          Button
        </button>
      )}
    </>
  );
}

export default App;
