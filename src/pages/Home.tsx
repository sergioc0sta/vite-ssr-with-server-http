import { useState, useEffect } from "react";

const Home = () => {
  console.log(
    "IF you see this messange in terminal and console of browser this page was render in SSR",
  );
  const [count, setCount] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    console.log("✅ App hydrated successfully");
  }, []);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          SSR with Vite + TypeScript
        </h1>
        <p className="text-gray-600 mb-8">
          This page was server-side rendered with Tailwind CSS v3!
        </p>
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            React Counter
          </h2>
          <div className="mb-6">
            <span className="text-6xl font-bold text-gray-900 bg-white px-6 py-4 rounded-lg border-2 border-gray-200 inline-block min-w-[160px]">
              {count}
            </span>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={decrement}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors transform hover:scale-105"
            >
              -1
            </button>
            <button
              onClick={reset}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors transform hover:scale-105"
            >
              Reset
            </button>
            <button
              onClick={increment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors transform hover:scale-105"
            >
              +1
            </button>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 mb-2">
            Status: {isHydrated ? "Hydrated ✅" : "Waiting for hydration ⏳"}
          </p>
          <p className="text-green-700 text-sm">
            If buttons work, hydration is perfect with Tailwind v3!
          </p>
        </div>
        <div className="mt-6">
          <a href="/about" className="text-blue-500 hover:underline">
            Go to About page (CSR)
          </a>
        </div>
      </div>
    </div>
  );
};

export { Home };
