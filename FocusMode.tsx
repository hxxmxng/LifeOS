import React, { useState, useEffect, useRef } from 'react';
import { IOSButton, IOSHeader } from '../components/IOSComponents';
import { AnalogClock } from '../components/AnalogClock';
import { Task, DEFAULT_CATEGORIES, SessionLog } from '../types';
import { generateId } from '../constants';

interface FocusModeProps {
  tasks: Task[];
  onExit: () => void;
  onCompleteLog: (log: SessionLog) => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({ tasks, onExit, onCompleteLog }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(tasks[0]?.targetDuration * 60 || 0);
  const [isPaused, setIsPaused] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  
  const timeSpentRef = useRef(0);

  const currentTask = tasks[currentIndex];
  const category = DEFAULT_CATEGORIES.find(c => c.id === currentTask?.categoryId);

  useEffect(() => {
    if (currentTask && !showBreak) {
      setTimeLeft(currentTask.targetDuration * 60);
      timeSpentRef.current = 0;
      setIsPaused(false);
    }
  }, [currentIndex, currentTask, showBreak]);

  useEffect(() => {
    let interval: any;
    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        timeSpentRef.current += 1;
      }, 1000);
    } else if (timeLeft === 0 && !isPaused) {
      handleTaskComplete();
    }
    return () => clearInterval(interval);
  }, [isPaused, timeLeft]);

  const handleTaskComplete = () => {
    const log: SessionLog = {
      id: generateId(),
      taskId: currentTask.id,
      taskTitle: currentTask.title,
      categoryEmoji: category?.emoji || '📝',
      timestamp: Date.now(),
      durationSpent: timeSpentRef.current,
      completed: true
    };
    onCompleteLog(log);

    if (currentIndex < tasks.length - 1) {
      const shouldBreak = (currentIndex + 1) % 2 === 0;
      if (shouldBreak && !showBreak) {
        startBreak();
      } else {
        nextTask();
      }
    } else {
      alert("🎉 Routine Complete! Amazing flow.");
      onExit();
    }
  };

  const startBreak = () => {
    setShowBreak(true);
    setTimeLeft(5 * 60);
    timeSpentRef.current = 0;
  };

  const nextTask = () => {
    setShowBreak(false);
    setCurrentIndex(prev => prev + 1);
  };

  if (!currentTask) return <div className="text-gray-800">Loading...</div>;

  return (
    <div className="flex flex-col h-full bg-linen-light relative overflow-hidden">
      <IOSHeader 
        title={showBreak ? "Recharge" : "Focus"} 
        leftButton={
          <button onClick={onExit} className="text-[#007aff] text-sm font-bold text-inset-light-bg active:opacity-70">End</button>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-between py-12 px-6">
        
        {/* Top Spacer / Task Context */}
        <div className="text-center mt-4">
          <div className="text-gray-500 text-inset-light-bg font-medium tracking-wide uppercase text-xs mb-1">
            {showBreak ? 'Next Up' : 'Current Task'}
          </div>
          <div className="text-gray-400 text-sm font-semibold truncate max-w-[200px] mx-auto">
             {showBreak ? tasks[currentIndex + 1]?.title || 'Finish' : `${currentIndex + 1} of ${tasks.length}`}
          </div>
        </div>

        {/* Centerpiece: Clock & Time */}
        <div className="flex flex-col items-center relative z-10">
          <div className={`transition-all duration-700 ${isPaused ? 'opacity-70 grayscale-[0.8]' : 'opacity-100'}`}>
            <AnalogClock 
              durationSeconds={timeLeft} 
              totalDurationSeconds={showBreak ? 300 : currentTask.targetDuration * 60} 
            />
          </div>
          
          <div className="mt-8 text-center space-y-2">
            {/* Digital Time */}
            <div className="text-6xl font-mono text-gray-800 text-inset-light-bg font-bold tracking-widest tabular-nums">
               {Math.floor(timeLeft / 60).toString().padStart(2,'0')}:{Math.floor(timeLeft % 60).toString().padStart(2,'0')}
            </div>
            
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-3xl filter drop-shadow-sm">
                {showBreak ? '☕' : category?.emoji}
              </span>
              <h2 className="text-2xl font-bold text-gray-800 text-inset-light-bg leading-tight max-w-[250px] truncate">
                {showBreak ? "Take a Break" : currentTask.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="w-full max-w-xs space-y-5 mb-6 z-10">
           {!showBreak ? (
             <div className="flex items-center gap-4">
               <IOSButton 
                  variant={isPaused ? "success" : "secondary"} 
                  className={`flex-1 h-12 text-lg shadow-lg ${isPaused ? 'text-white' : ''}`}
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? "Resume" : "Pause"}
                </IOSButton>
                
               <IOSButton 
                  variant="primary" 
                  className="flex-1 h-12 text-lg shadow-lg"
                  onClick={handleTaskComplete}
                >
                  Complete
                </IOSButton>
             </div>
           ) : (
             <IOSButton variant="secondary" className="w-full h-12 text-lg shadow-lg" onClick={nextTask}>
                Skip Break
              </IOSButton>
           )}
        </div>
      </div>
      
      {/* Background Vignette for depth (light mode version) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)] opacity-50" />
    </div>
  );
};