import './App.css';
import { useConfetti } from '@/magicui/use-confetti';
import WheelComponent from '@/components/wheel-component';
import { useLongPress } from '@/hook/use-long-press';
import { useMemo, useRef, useState } from 'react';
import { ScratchToReveal } from '@/components/magicui/scratch-to-reveal';
import { AnimatedList } from '@/components/magicui/animated-list';
import { PriceCard } from './components/price-card';
import BrandVsPeople from './brand-vs-people.json';
function App() {
  const [state, setState] = useState<
    'button' | 'button-click' | 'spin-wheel' | 'winner' | 'price-revile'
  >('button');
  const [winners, setWinners] = useState<Array<{ brand: string; prize: number; name: string }>>([]);
  const homeSpanRef = useRef<HTMLSpanElement>(null);
  const priceCardRef = useRef<HTMLDivElement>(null);
  const { trigger, isRunning } = useConfetti();
  const rootEle = document.getElementById('root')!;
  const { isClicking, ...longPressEvent } = useLongPress(
    () => {
      setState('spin-wheel');
      rootEle.style.setProperty('background-blend-mode', 'difference');
    },
    () => {
      setState('button');
      rootEle.style.setProperty('animation-duration', '.1s');
      removeRootStyle();
      priceCardRef.current?.style.setProperty('animation-duration', '.1s');
    },
    { delay: 5000, shouldPreventDefault: true },
  );
  useMemo(() => {
    if (!priceCardRef.current) return;
    if (isClicking) {
      setState('button-click');
      rootEle.style.setProperty('animation-timing-function', 'var(--ripple-animation)');
      rootEle.style.setProperty('animation-duration', '.2s');

      priceCardRef.current.classList.add('w-full', 'h-full');
    } else {
      priceCardRef.current.classList.remove('w-full', 'h-full');
    }
  }, [isClicking]);
  const prizes: Array<{ amount: number; title: React.ReactNode }> = [
    {
      amount: 500,
      title: (
        <>
          3<sup>rd</sup> Prize: Pit Stop
        </>
      ),
    },
    {
      amount: 1000,
      title: (
        <>
          2<sup>nd</sup> Prize: Turbocharged
        </>
      ),
    },
    {
      amount: 2000,
      title: (
        <>
          1<sup>st</sup> Prize: Pole Position
        </>
      ),
    },
  ];
  const currentPriceIndex = winners.filter((winner) => winner.prize).length;
  const prizeDetail = useMemo(() => {
    return prizes[currentPriceIndex];
  }, [currentPriceIndex]);
  const segments = [
    'Trust',
    'Transparency',
    'People First',
    'Empathy',
    'Persistence',
    'Empowerment',
    'Respect',
    'Listen',
    'Resilience',
    'Evolve',
  ];
  const segColors = [
    '#0077FF',
    '#A7F3D0',
    '#A4E100',
    '#00B0B9',
    '#9B2D9F',
    '#FFCC00',
    '#4DB8FF',
    '#D5006D',
    '#333333',
    '#FF6F61',
  ];
  const isComplete = state == 'button' && winners.length === prizes.length;
  const removeRootStyle = () => {
    rootEle.style.removeProperty('animation-timing-function');
    rootEle.style.removeProperty('animation-duration');
    rootEle.style.removeProperty('background-blend-mode');
  };
  const onFinished = () => {
    trigger();
    setTimeout(() => setState('winner'), 5000);
    const winner = BrandVsPeople[Math.floor(Math.random() * BrandVsPeople.length)];
    setWinners((state) => [...state, { brand: winner.brand, prize: 0, name: winner.name }]);
    priceCardRef.current?.classList.remove('button-animate');
    removeRootStyle();
  };

  const goHome = () => {
    if (state === 'price-revile') setState('button');
  };
  return (
    <>
      {!isComplete && (
        <span
          className="absolute w-[80vmin] h-[80vmin] flex justify-center items-center"
          ref={homeSpanRef}
        >
          {state == 'button-click' && (
            <span className="rounded-full w-full h-full absolute backdrop-brightness-130 z-0" />
          )}
          {(state == 'button' || state == 'button-click') && (
            <PriceCard
              ref={priceCardRef}
              price={prizeDetail.amount}
              title={prizeDetail.title}
              color="13551f"
              className="h-3/12 w-2/3  select-none button-animate rounded-full "
              {...longPressEvent}
            />
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
                upTime={5000}
              />
            </span>
          )}
          {(state === 'winner' || state === 'price-revile') && (
            <ScratchToReveal
              width={300}
              height={300}
              className="flex items-center justify-center overflow-hidden rounded-[20%] animate-out fade-in-0 fade-out-50 animation-duration-2000 select-none"
              minScratchPercentage={50}
              gradientColors={['#A97CF8', '#F38CB8', '#FDCC92']}
              onComplete={() => {
                trigger();
                setWinners((state) => {
                  const newWinners = [...state];
                  newWinners[newWinners.length - 1].prize = prizes[winners.length - 1].amount;
                  setState('price-revile');
                  return newWinners;
                });
              }}
            >
              <span className="bg-secondary-background border-8 border-dashed w-full h-full flex justify-center items-center rounded-[20%] text-6xl">
                {winners[winners.length - 1].brand}
              </span>
            </ScratchToReveal>
          )}
        </span>
      )}
      <AnimatedList
        className={
          'absolute p-8 h-full' +
          (isComplete ? ' animate-in scale-200 origin-top' : ' left-0 top-0 ')
        }
        onClick={goHome}
        onTouchEnd={goHome}
        style={{ opacity: isRunning ? 0.5 : 1 }}
      >
        {winners
          .filter((winner) => winner.prize)
          .map((winner) => (
            <div
              key={winner.prize}
              className="bg-card-background rounded-lg p-4 flex flex-col items-center justify-center"
            >
              <h3 className="text-xl7 font-bold ">{winner.brand}</h3>
              <p className="text-lg">{winner.prize}</p>
            </div>
          ))}
      </AnimatedList>
    </>
  );
}

export default App;
