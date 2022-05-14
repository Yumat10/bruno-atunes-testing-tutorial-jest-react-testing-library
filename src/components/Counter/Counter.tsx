import { useState } from 'react';

export interface CounterProps {
  description: string;
  defaultCount: number;
}

export function Counter({ description, defaultCount }: CounterProps) {
  const [count, setCount] = useState(defaultCount);
  const [incrementor, setIncrementor] = useState(1);

  return (
    <div>
      <h2>
        DESC: {description} - DC: {defaultCount}
      </h2>
      <label>
        Incrementor:
        <input
          value={incrementor}
          onChange={(evt) => {
            setIncrementor(parseInt(evt.target.value) || 1);
          }}
          type="number"
        />
      </label>
      <button
        aria-label="Decrement counter"
        disabled={count === -10}
        onClick={() => {
          const newCount: number = count - incrementor;
          setCount(newCount < -10 ? -10 : newCount);
        }}
      >
        -
      </button>
      Current Count: {count}
      <button
        aria-label="Increment counter"
        disabled={count === 10}
        onClick={() => {
          const newCount: number = count + incrementor;
          setCount(newCount > 10 ? 10 : newCount);
        }}
      >
        +
      </button>
    </div>
  );
}
