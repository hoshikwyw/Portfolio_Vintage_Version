import React, { useEffect, useState } from "react";

export default function BootSplash({ onFinish = () => {} }) {
  const [percent, setPercent] = useState(0);

  // Simulate boot progress
  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5; // 5‑19 % bumps
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        // Small pause so users can see 100 %
        setTimeout(onFinish, 600);
      }
      setPercent(current);
    }, 300); // every 0.3 s
    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#161b22] text-gray-100 font-mono">
      {/* Title */}
      <h1 className="mb-8 text-3xl tracking-widest md:text-4xl animate-pulse">
        Loading Oro OS<span className="animate-blink">…</span>
      </h1>

      {/* Progress bar */}
      <div className="w-3/4 max-w-md h-2 rounded bg-gray-700">
        <div
          className="h-full rounded bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Percentage */}
      <p className="mt-4 text-sm tabular-nums">{percent}%</p>
    </div>
  );
}
