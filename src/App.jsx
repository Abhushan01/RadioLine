import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button className="bg-blue-500 text-red-100 font-bold py-2 px-4 rounded"
        onClick={() => {
          setCount(count => count + 1);
        }}
      >
        Hello world-{count}
      </button>
    </div>
  );
}

export default App;
