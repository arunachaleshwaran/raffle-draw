import './App.css';
import { useConfetti } from '@/magicui/use-confetti';
import WheelComponent from '@/components/wheel-component';
import { useLongPress } from '@/hook/use-long-press';
import { useMemo, useRef, useState } from 'react';
import { ScratchToReveal } from '@/components/magicui/scratch-to-reveal';
import { AnimatedList } from '@/components/magicui/animated-list';

function App() {
  const [state, setState] = useState<'button' | 'button-click' | 'spin-wheel' | 'winner'>('button');
  const [winners, setWinners] = useState<Array<{ name: string; prize: string }>>([]);
  const prizes = ['2000', '1000', '500'];
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
    setWinners((state) => [...state, { name: winner, prize: '' }]);
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
    { delay: 5000, shouldPreventDefault: true },
  );
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
  const goHome = () => {
    if (state === 'winner') setState('button');
  };
  console.log(winners);
  return (
    <>
      {!(state == 'button' && winners.length === prizes.length) && (
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
              Hold
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
                upDuration={2000}
              />
            </span>
          )}
          {state === 'winner' && (
            <ScratchToReveal
              width={300}
              height={300}
              className="flex items-center justify-center overflow-hidden rounded-[20%]"
              minScratchPercentage={70}
              gradientColors={['#A97CF8', '#F38CB8', '#FDCC92']}
              onComplete={() => {
                trigger();
                setWinners((state) => {
                  const newWinners = [...state];
                  newWinners[newWinners.length - 1].prize = prizes[winners.length - 1];
                  return newWinners;
                });
              }}
            >
              <span className="text-3xl bg-secondary-background border-8 border-dashed w-full h-full flex justify-center items-center rounded-[20%] text-6xl">
                {prizes[winners.length - 1]}
              </span>
            </ScratchToReveal>
          )}
        </span>
      )}
      <AnimatedList
        className={
          'absolute p-8 h-full' +
          (state == 'button' && winners.length === prizes.length ? '' : ' left-0 top-0 ')
        }
        onClick={goHome}
        onTouchEnd={goHome}
      >
        {winners
          .filter((winner) => winner.prize)
          .map((winner) => (
            <div
              key={winner.prize}
              className="bg-card-background rounded-lg p-4 flex flex-col items-center justify-center"
            >
              <h3 className="text-xl7 font-bold ">{winner.name}</h3>
              <p className="text-lg">{winner.prize}</p>
            </div>
          ))}
      </AnimatedList>
    </>
  );
}

export default App;
