import React from 'react';
import { IOSHeader } from '../components/IOSComponents';
import { SessionLog } from '../types';
import { formatTime } from '../constants';

interface DiaryProps {
  logs: SessionLog[];
  onBack: () => void;
}

export const Diary: React.FC<DiaryProps> = ({ logs, onBack }) => {
  // Sort logs by date desc
  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);
  
  // Group by date
  const groupedLogs: Record<string, SessionLog[]> = {};
  sortedLogs.forEach(log => {
    const date = new Date(log.timestamp).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    if (!groupedLogs[date]) groupedLogs[date] = [];
    groupedLogs[date].push(log);
  });

  return (
    <div className="flex flex-col h-full bg-linen-light">
      <IOSHeader 
        title="My Diary" 
        leftButton={
          <button onClick={onBack} className="text-[#007aff] text-sm font-bold text-inset-light-bg">Back</button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Paper Container */}
        <div className="bg-paper min-h-full w-full max-w-lg mx-auto shadow-xl relative pt-10 px-6 pb-10 transform rotate-1 rounded-sm border border-gray-200">
          {/* Red margin line */}
          <div className="absolute top-0 bottom-0 left-12 w-px bg-red-400 opacity-40"></div>
          
          <h2 className="text-center font-handwriting text-2xl text-gray-700 mb-8 border-b-2 border-gray-300 pb-2">
            Focus Log
          </h2>

          {Object.keys(groupedLogs).length === 0 ? (
            <p className="text-gray-400 text-center italic mt-10">The pages are empty...</p>
          ) : (
            Object.keys(groupedLogs).map(date => (
              <div key={date} className="mb-8">
                <h3 className="text-gray-500 uppercase text-xs font-bold tracking-widest mb-2 pl-8">{date}</h3>
                <ul className="space-y-0">
                  {groupedLogs[date].map(log => (
                    <li key={log.id} className="flex items-baseline py-[2px] text-gray-800 relative pl-8 hover:bg-yellow-100/30">
                      <span className="absolute left-2 text-sm opacity-50">{log.categoryEmoji}</span>
                      <span className="font-semibold mr-2">{log.taskTitle}</span>
                      <div className="flex-1 border-b border-dotted border-gray-400 mx-2 opacity-30"></div>
                      <span className="font-mono text-sm text-blue-600">{formatTime(log.durationSpent)}</span>
                    </li>
                  ))}
                </ul>
                {/* Daily Total */}
                <div className="text-right mt-2 text-xs text-gray-400 pr-2">
                   Total: {Math.round(groupedLogs[date].reduce((acc, curr) => acc + curr.durationSpent, 0) / 60)} mins
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
