import React, { useState, useEffect } from "react";

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // convert to 12-hour format
    return `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <div style={{ padding: "16px" }} className="w-full h-18 cursor-auto flex flex-col items-center justify-center text-[#2d1b4e] font-sans rounded-xl bg-gradient-to-br from-[#faf9f6] to-[#fff8e7] border-[1.5px] border-black/15 shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(212,175,55,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-sm">
      <span className="text-xl md:text-xl tracking-widest font-bold uppercase text-[#2d1b4e]">
        {formatTime(time)}
      </span>
    </div>
  );
};

export default ClockWidget;
