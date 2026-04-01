import React, { useEffect, useState } from "react";

export default function BootSplash({ onFinish = () => { } }) {
  const [percent, setPercent] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing system...");

  useEffect(() => {
    let current = 0;
    const loadingMessages = [
      "Initializing system...",
      "Loading modules...",
      "Preparing interface...",
      "Almost ready...",
    ];
    let messageIndex = 0;

    const timer = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setLoadingText("Ready!");
        setTimeout(onFinish, 600);
      } else {
        const newIndex = Math.floor((current / 100) * loadingMessages.length);
        if (newIndex < loadingMessages.length && newIndex !== messageIndex) {
          messageIndex = newIndex;
          setLoadingText(loadingMessages[messageIndex]);
        }
      }
      setPercent(current);
    }, 300);
    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#a4b3f2] via-[#b9c2f5] to-[#c8caf9] text-[#45473a] font-mono overflow-hidden">
      {/* Vintage scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
        }}
      />

      {/* Main container with vintage border */}
      <div className="relative bg-white/90 backdrop-blur-sm border-2 border-[#000000] rounded-lg shadow-2xl p-12 max-w-lg w-11/12 flex flex-col items-center gap-8">
        {/* Vintage corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#000000]"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#000000]"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#000000]"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#000000]"></div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-2 text-[#45473a]">
            VINTAGE ORO
          </h1>
          <div className="h-1 w-24 bg-[#ebbd8c] mx-auto mb-4"></div>
          <p className="text-sm uppercase tracking-widest text-[#5768ad] font-semibold">
            Operating System
          </p>
        </div>

        {/* Loading text */}
        <div className="w-full text-center min-h-[24px]">
          <p className="text-sm font-medium text-[#45473a] tracking-wide">
            {loadingText}
          </p>
        </div>

        {/* Progress bar container */}
        <div className="w-full space-y-3">
          {/* Progress bar */}
          <div className="w-full h-4 bg-[#dfdde0] border-2 border-[#000000] rounded-sm overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#5768ad] via-[#7d9adc] to-[#ebbd8c] transition-all duration-300 ease-out relative"
              style={{ width: `${percent}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>

          {/* Percentage and status */}
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-[#45473a] tabular-nums">{percent}%</span>
            <span className="text-[#5768ad] uppercase tracking-wider">
              {percent < 100 ? "Loading" : "Complete"}
            </span>
          </div>
        </div>

        {/* Vintage footer text */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-[#a9a9ab] uppercase tracking-widest">
            © 2024 Oro Development
          </p>
        </div>
      </div>
    </div>
  );
}
