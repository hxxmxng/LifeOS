import React, { useState, useEffect } from 'react';
import { Dashboard } from './views/Dashboard';
import { FocusMode } from './views/FocusMode';
import { Diary } from './views/Diary';
import { ViewState, Task, SessionLog, Routine } from './types';
import { loadData, saveData } from './services/storage';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);

  // Load initial data
  useEffect(() => {
    const data = loadData();
    setLogs(data.logs);
    setRoutines(data.routines);
  }, []);

  const handleStartRoutine = (tasks: Task[]) => {
    if (tasks.length === 0) return;
    setActiveTasks(tasks);
    setView(ViewState.FOCUS_MODE);
  };

  const handleLogCompletion = (log: SessionLog) => {
    const updatedLogs = [...logs, log];
    setLogs(updatedLogs);
    saveData({ logs: updatedLogs });
  };

  const handleSaveRoutine = (routine: Routine) => {
    const updatedRoutines = [...routines, routine];
    setRoutines(updatedRoutines);
    saveData({ routines: updatedRoutines });
  };

  const handleDeleteRoutine = (id: string) => {
    const updatedRoutines = routines.filter(r => r.id !== id);
    setRoutines(updatedRoutines);
    saveData({ routines: updatedRoutines });
  };

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      setLogs([]);
      saveData({ logs: [] });
    }
  };

  return (
    <div className="w-full h-full max-w-md mx-auto bg-white relative shadow-2xl overflow-hidden border-x border-gray-300">
      {/* View Switcher */}
      {view === ViewState.DASHBOARD && (
        <Dashboard 
          onStartRoutine={handleStartRoutine}
          onViewLogs={() => setView(ViewState.DIARY)}
          savedRoutines={routines}
          onSaveRoutine={handleSaveRoutine}
          onDeleteRoutine={handleDeleteRoutine}
        />
      )}

      {view === ViewState.FOCUS_MODE && (
        <FocusMode 
          tasks={activeTasks}
          onExit={() => setView(ViewState.DASHBOARD)}
          onCompleteLog={handleLogCompletion}
        />
      )}

      {view === ViewState.DIARY && (
        <Diary 
          logs={logs}
          onBack={() => setView(ViewState.DASHBOARD)}
          onClearLogs={handleClearLogs}
        />
      )}
    </div>
  );
};

export default App;