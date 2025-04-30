import { Button } from "@/components/ui/button";
import { useState } from "react";
import AppShell from "./components/layout/app-shell";

function App() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-svh">
        <h1 className="text-2xl font-bold">Counter: {count}</h1>
        <div className="flex gap-4 mt-4">
          <Button onClick={increment}>Increment</Button>
          <Button onClick={decrement}>Decrement</Button>
        </div>
        <p className="mt-4 text-lg">
          Click the buttons to increment or decrement the counter.
        </p>
      </div>
    </AppShell>
  );
}

export default App;
