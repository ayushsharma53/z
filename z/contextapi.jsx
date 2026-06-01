import React, { createContext, useContext, useState } from "react";

// Create Context
const CounterContext = createContext();

// Display Component
function Display() {
  const { count, step } = useContext(CounterContext);

  return (
    <div>
      <h2>Current Count: {count}</h2>
      <h3>Current Step: {step}</h3>
    </div>
  );
}

// Controls Component
function Controls() {
  const {
    increment,
    decrement,
    reset,
    setStep,
  } = useContext(CounterContext);

  return (
    <div>
      <button onClick={increment}>
        Increment ➕
      </button>

      <button onClick={decrement}>
        Decrement ➖
      </button>

      <button onClick={reset}>
        Reset 🔄
      </button>

      <br /><br />

      <button onClick={() => setStep(1)}>
        Step +1
      </button>

      <button onClick={() => setStep(5)}>
        Step +5
      </button>
    </div>
  );
}

// App Component
function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = () => {
    setCount((prev) => prev + step);
  };

  const decrement = () => {
    setCount((prev) => prev - step);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <CounterContext.Provider
      value={{
        count,
        step,
        increment,
        decrement,
        reset,
        setStep,
      }}
    >
      <h1>Context API Counter</h1>

      <Display />
      <Controls />
    </CounterContext.Provider>
  );
}

export default App;