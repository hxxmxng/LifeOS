import React, { useEffect, useState } from 'react';

interface AnalogClockProps {
  durationSeconds: number;
  totalDurationSeconds: number;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ durationSeconds, totalDurationSeconds }) => {
  const [rotation, setRotation] = useState(0);

  // We want the hand to move smoothly relative to the total duration of the task.
  // Let's treat the clock as a 60-minute face, but visually tracking completion.
  // Actually, for a Focus timer, a visual countdown (pomodoro style) or just a standard clock is good.
  // Prompt asks for "Realistic ticking analog clock". Let's do a standard clock that ticks.

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const secondHandDegrees = (time.getSeconds() / 60) * 360;
  const minuteHandDegrees = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hourHandDegrees = ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360;

  // Calculate progress circle
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = 1 - (durationSeconds / totalDurationSeconds);
  const strokeDashoffset = circumference * (1 - progress); // Invert to fill up

  return (
    <div className="relative w-64 h-64 mx-auto my-8">
      {/* Clock Bezel */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-700 to-black shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.3)] flex items-center justify-center">
        <div className="w-[95%] h-[95%] rounded-full bg-[#e0e0e0] shadow-inner relative">
          
           {/* Progress Ring (Subtle background indicator of task progress) */}
           <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
             <circle
               cx="50%" cy="50%" r="46%"
               stroke="#cccccc" strokeWidth="6" fill="transparent"
             />
             <circle
               cx="50%" cy="50%" r="46%"
               stroke="#007aff" strokeWidth="6" fill="transparent"
               strokeDasharray={circumference}
               strokeDashoffset={isNaN(strokeDashoffset) ? 0 : strokeDashoffset}
               strokeLinecap="round"
               className="transition-all duration-1000 ease-linear"
             />
           </svg>

          {/* Clock Face Markers */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-full h-full top-0 left-0" 
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div className="w-1 h-3 bg-gray-800 mx-auto mt-2"></div>
            </div>
          ))}

          {/* Hands */}
          {/* Hour */}
          <div 
            className="absolute top-1/2 left-1/2 w-1.5 h-16 bg-black origin-bottom -translate-x-1/2 -translate-y-full rounded-full shadow-sm"
            style={{ transform: `translateX(-50%) translateY(-100%) rotate(${hourHandDegrees}deg)` }}
          />
          {/* Minute */}
          <div 
            className="absolute top-1/2 left-1/2 w-1 h-24 bg-gray-700 origin-bottom -translate-x-1/2 -translate-y-full rounded-full shadow-sm"
            style={{ transform: `translateX(-50%) translateY(-100%) rotate(${minuteHandDegrees}deg)` }}
          />
          {/* Second */}
          <div 
            className="absolute top-1/2 left-1/2 w-0.5 h-28 bg-[#ff3b30] origin-bottom -translate-x-1/2 -translate-y-full rounded-full shadow-sm"
            style={{ transform: `translateX(-50%) translateY(-100%) rotate(${secondHandDegrees}deg)` }}
          />
          
          {/* Center Pin */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-silver rounded-full border border-gray-400 bg-gradient-to-br from-white to-gray-400 -translate-x-1/2 -translate-y-1/2 shadow-md z-10"></div>
        </div>
      </div>
    </div>
  );
};
