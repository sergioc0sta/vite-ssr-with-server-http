import { useState, useEffect } from "react";

const About = () => {
  console.log('This message shouldt see in terminal but in console of browser')
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">
          About Page (CSR Only)
        </h1>
        <p className="text-gray-600 mb-4">
          This page is client-side rendered only
        </p>
        <p className="text-sm text-purple-600 mb-6">
          Status: {mounted ? "Client Rendered ✅" : "Loading..."}
        </p>

        <p className="text-gray-700 mb-6">
          No SSR, no JSON+LD - pure client-side rendering!
        </p>

        <div className="mt-6">
          <a href="/" className="text-blue-500 hover:underline">
            ← Back to Homepage (SSR)
          </a>
        </div>
      </div>
    </div>
  );
};

export { About };
