import './App.css';
import { useConfetti } from './components/magicui/use-confetti';
function App() {
  const { trigger, isRunning } = useConfetti();
  return (
      <div className="App" onClick={trigger}>
        {!isRunning && <>Hello World</>}
      </div>
  );
}

export default App;
