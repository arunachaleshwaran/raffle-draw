import './App.css';
import { useConfetti } from '@/magicui/use-confetti';
import WheelComponent from './components/wheel-component';

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
    console.log(winner);
    trigger();
  };
  return (
    <>
      <WheelComponent
        segments={segments}
        segColors={segColors}
        winningSegment="won 10"
        onFinished={(winner) => onFinished(winner)}
        primaryColor="black"
        contrastColor="white"
        buttonText="Spin"
        isOnlyOnce={true}
        size={300}
        upDuration={3000}
      />
      <div className="App" onClick={trigger}>
        {!isRunning && <>Hello World</>}
      </div>
    </>
  );
}

export default App;
