import React, { useState, useEffect, useRef } from 'react';
import { IOSButton, IOSHeader } from '../components/IOSComponents';
import { AnalogClock } from '../components/AnalogClock';
import { Task, DEFAULT_CATEGORIES, SessionLog } from '../types';
import { generateId } from '../constants';

interface FocusModeProps {
  tasks: Task[];
  onExit: () => void;
  onCompleteLog: (log: SessionLog) => void;
  onTaskCompleted: (taskId: string) => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({ tasks, onExit, onCompleteLog, onTaskCompleted }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(tasks[0]?.targetDuration * 60 || 0);
  const [sessionTotalDuration, setSessionTotalDuration] = useState(tasks[0]?.targetDuration * 60 || 0);
  const [overtime, setOvertime] = useState(0); // Track extra time
  const [isPaused, setIsPaused] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  
  const timeSpentRef = useRef(0);

  const currentTask = tasks[currentIndex];
  // Fallback if emoji is missing (older data)
  const category = DEFAULT_CATEGORIES.find(c => c.id === currentTask?.categoryId);
  const displayEmoji = currentTask?.emoji || category?.emoji || '📝';

  useEffect(() => {
    if (currentTask && !showBreak) {
      const duration = currentTask.targetDuration * 60;
      setTimeLeft(duration);
      setSessionTotalDuration(duration);
      setOvertime(0);
      timeSpentRef.current = 0;
      setIsPaused(false);
    }
  }, [currentIndex, currentTask, showBreak]);

  useEffect(() => {
    let interval: any;
    if (!isPaused) {
      interval = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft((prev) => prev - 1);
        } else {
          // Enter Overtime Mode
          setOvertime((prev) => prev + 1);
        }
        // Always track total time spent (regular + overtime)
        timeSpentRef.current += 1;
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, timeLeft]);

  const addExtraTime = () => {
    // Add 3 minutes (180 seconds)
    setTimeLeft((prev) => {
      const newVal = prev + 180;
      // If the new time exceeds the current total duration scale, extend the scale
      // This prevents the clock ring from being > 100% and gives a natural countdown feel for the extension
      setSessionTotalDuration(curr => Math.max(curr, newVal));
      return newVal;
    });
    setOvertime(0); // Reset overtime if we add more buffer
    setIsPaused(false); // Auto resume if added
  };

  const handleTaskComplete = () => {
    // Only log if it is NOT a break
    if (!showBreak) {
      const log: SessionLog = {
        id: generateId(),
        taskId: currentTask.id,
        taskTitle: currentTask.title,
        categoryEmoji: displayEmoji,
        timestamp: Date.now(),
        durationSpent: timeSpentRef.current,
        completed: true
      };
      onCompleteLog(log);
      
      // Update global list (remove completed task)
      onTaskCompleted(currentTask.id);
    }

    if (currentIndex < tasks.length - 1) {
      const shouldBreak = (currentIndex + 1) % 2 === 0;
      if (shouldBreak && !showBreak) {
        startBreak();
      } else {
        nextTask();
      }
    } else {
      if (!showBreak) {
        alert("🎉 Routine Complete! Amazing flow.");
        onExit();
      } else {
        // If break finished and no more tasks (unlikely but safe)
        onExit();
      }
    }
  };

  const startBreak = () => {
    setShowBreak(true);
    const duration = 5 * 60; // 5 minute break default
    setTimeLeft(duration);
    setSessionTotalDuration(duration);
    setOvertime(0);
    timeSpentRef.current = 0;
  };

  const nextTask = () => {
    setShowBreak(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handleSafeExit = () => {
    // Message updated to reflect that only the current progress is lost, but completed tasks are saved.
    if (confirm("Stop timer and return to dashboard? Progress on the current task will not be saved.")) {
      onExit();
    }
  };

  if (!currentTask) return <div className="text-gray-800">Loading...</div>;

  const isOvertime = timeLeft === 0 && overtime > 0;

  return (
    <div className="flex flex-col h-full bg-linen-light relative overflow-hidden">
      <IOSHeader 
        title={showBreak ? "Recharge" : "Focus"} 
        leftButton={
          <button onClick={handleSafeExit} className="text-[#007aff] text-sm font-bold text-inset-light-bg active:opacity-70">
            Exit
          </button>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col px-6 py-6 relative z-10">
        
        {/* Glass Card Info */}
        <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Now Playing</span>
              <span className="font-bold text-gray-800 text-lg truncate max-w-[150px]">{showBreak ? "Break Time" : currentTask.title}</span>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Next</span>
              <span className="text-gray-600 text-sm truncate max-w-[100px]">
                {showBreak ? tasks[currentIndex + 1]?.title : (currentIndex < tasks.length - 1 ? "Break" : "Finish")}
              </span>
            </div>
        </div>

        {/* Centerpiece: Clock & Time */}
        <div className="flex flex-col items-center flex-1 justify-center -mt-8">
          <div className={`transition-all duration-500 transform ${isPaused ? 'scale-95 opacity-80 blur-[1px]' : 'scale-100 opacity-100'}`}>
            <AnalogClock 
              durationSeconds={timeLeft} 
              totalDurationSeconds={sessionTotalDuration} 
            />
          </div>
          
          <div className="mt-6 text-center">
            {/* Digital Time - Bigger & Bolder */}
            {isOvertime ? (
               <div className="text-7xl font-sans font-thin text-red-500 text-inset-light-bg tracking-tighter tabular-nums leading-none animate-pulse">
                 + {Math.floor(overtime / 60).toString().padStart(2,'0')}:{Math.floor(overtime % 60).toString().padStart(2,'0')}
               </div>
            ) : (
               <div className="text-7xl font-sans font-thin text-gray-800 text-inset-light-bg tracking-tighter tabular-nums leading-none">
                  {Math.floor(timeLeft / 60).toString().padStart(2,'0')}:{Math.floor(timeLeft % 60).toString().padStart(2,'0')}
               </div>
            )}
            
            {/* Minimal Progress Indicator */}
            <div className="mt-4">
              <span className={`text-xs font-bold uppercase tracking-widest ${isOvertime ? 'text-red-400' : 'text-gray-400'}`}>
                {isOvertime ? 'Exceeded Duration' : (showBreak ? 'Break Session' : `${currentIndex + 1} / ${tasks.length}`)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="w-full mt-auto mb-4 space-y-3">
           {!showBreak ? (
             <div className="flex items-center gap-3">
               <IOSButton 
                  variant={isPaused ? "success" : "secondary"} 
                  className={`flex-1 h-14 text-lg shadow-lg transition-all active:scale-[0.98] ${isPaused ? 'text-white' : ''}`}
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? "Resume" : "Pause"}
                </IOSButton>

                <IOSButton 
                  variant="secondary" 
                  className="w-20 h-14 text-sm font-bold shadow-lg active:scale-[0.98] flex flex-col items-center justify-center leading-tight"
                  onClick={addExtraTime}
                >
                  <span>+3</span>
                  <span className="text-[10px]">Min</span>
                </IOSButton>
                
               <IOSButton 
                  variant="primary" 
                  className="flex-1 h-14 text-lg shadow-lg transition-all active:scale-[0.98]"
                  onClick={handleTaskComplete}
                >
                  Complete
                </IOSButton>
             </div>
           ) : (
             <IOSButton variant="secondary" className="w-full h-14 text-xl shadow-lg active:scale-[0.98]" onClick={nextTask}>
                Skip Break
              </IOSButton>
           )}
        </div>
      </div>
      
      {/* Background Vignette for depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.6)_100%)] opacity-60" />
    </div>
  );
};
