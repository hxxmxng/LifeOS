import React, { useEffect, useState } from 'react';

interface AnalogClockProps {
  durationSeconds: number;
  totalDurationSeconds: number;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ durationSeconds, totalDurationSeconds }) => {
  // Use real wall-clock time for the hands
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const secondHandDegrees = (time.getSeconds() / 60) * 360;
  const minuteHandDegrees = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hourHandDegrees = ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360;

  // Progress Ring Math
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  
  // Logic: 
  // We want the ring to represent "Time Remaining".
  // Full = 100% time remaining. 
  // Emptying clockwise means the strokeDashoffset increases from 0 to circumference.
  // Clamp percentage between 0 and 1 to avoid visual glitches if time exceeds total
  const safeTotal = totalDurationSeconds > 0 ? totalDurationSeconds : 1;
  const percentage = Math.min(Math.max(durationSeconds / safeTotal, 0), 1);
  
  // DashOffset:
  // 0 = Full circle
  // circumference = Empty circle
  // To drain clockwise starting from top:
  // SVG Circle stroke starts at 3 o'clock by default.
  // We rotate the SVG -90deg so start is 12 o'clock.
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <div className="relative w-64 h-64 mx-auto my-4">
      {/* Clock Bezel */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_2px_5px_rgba(255,255,255,0.8)] flex items-center justify-center border border-gray-300">
        <div className="w-[95%] h-[95%] rounded-full bg-[#f0f0f0] shadow-inner relative overflow-hidden">
          
           {/* Progress Ring */}
           <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none p-1 z-0">
             {/* Background Track */}
             <circle
               cx="50%" cy="50%" r="46%"
               stroke="#e0e0e0" strokeWidth="6" fill="transparent"
             />
             {/* Active Time Ring */}
             <circle
               cx="50%" cy="50%" r="46%"
               stroke="#007aff" strokeWidth="6" fill="transparent"
               strokeDasharray={circumference}
               strokeDashoffset={strokeDashoffset}
               strokeLinecap="round"
               className="transition-all duration-1000 ease-linear"
             />
           </svg>

          {/* Clock Face Markers */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-full h-full top-0 left-0 pointer-events-none" 
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div className="w-1 h-3 bg-gray-400 mx-auto mt-2"></div>
            </div>
          ))}

          {/* Hands */}
          {/* Hour */}
          <div 
            className="absolute top-1/2 left-1/2 w-1.5 h-16 bg-gray-800 origin-bottom -translate-x-1/2 -translate-y-full rounded-full shadow-sm z-10"
            style={{ transform: `translateX(-50%) translateY(-100%) rotate(${hourHandDegrees}deg)` }}
          />
          {/* Minute */}
          <div 
            className="absolute top-1/2 left-1/2 w-1 h-24 bg-gray-600 origin-bottom -translate-x-1/2 -translate-y-full rounded-full shadow-sm z-10"
            style={{ transform: `translateX(-50%) translateY(-100%) rotate(${minuteHandDegrees}deg)` }}
          />
          {/* Second */}
          <div 
            className="absolute top-1/2 left-1/2 w-0.5 h-28 bg-[#ff3b30] origin-bottom -translate-x-1/2 -translate-y-full rounded-full shadow-sm z-10"
            style={{ transform: `translateX(-50%) translateY(-100%) rotate(${secondHandDegrees}deg)` }}
          />
          
          {/* Center Pin */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-silver rounded-full border border-gray-400 bg-gradient-to-br from-white to-gray-400 -translate-x-1/2 -translate-y-1/2 shadow-md z-20"></div>

          {/* Glass Reflection Overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-30 opacity-70" style={{ clipPath: 'circle(100% at 50% -10%)' }}></div>
        </div>
      </div>
    </div>
  );
};