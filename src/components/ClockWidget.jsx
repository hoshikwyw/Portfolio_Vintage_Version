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
    <div style={{ padding: "12px" }} className="w-full h-18 cursor-auto flex flex-col items-center justify-center text-[#45473a] font-mono rounded-sm bg-white/95 border-2 border-[#000000] shadow-lg">
      <span className="text-xl md:text-xl tracking-widest font-bold uppercase">
        {formatTime(time)}
      </span>
    </div>
  );
};

export default ClockWidget;
