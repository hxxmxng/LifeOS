import React, { useState, useEffect, useRef } from 'react';
import { IOSButton, IOSCard, IOSHeader, IOSListItem, IOSSegmentedControl } from '../components/IOSComponents';
import { Category, DEFAULT_CATEGORIES, Task, Routine, QUICK_EMOJIS } from '../types';
import { generateId } from '../constants';
import { ChevronUp, ChevronDown, Trash2, Check, X } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  onStartRoutine: (tasks: Task[]) => void;
  onViewLogs: () => void;
  savedRoutines: Routine[];
  onSaveRoutine: (routine: Routine) => void;
  onDeleteRoutine: (id: string) => void;
}

const TIME_PRESETS = [3, 5, 8, 10, 15, 20, 25, 30, 45, 60];

export const Dashboard: React.FC<DashboardProps> = ({ 
  tasks: todayTasks,
  onUpdateTasks: setTodayTasks,
  onStartRoutine, 
  onViewLogs, 
  savedRoutines, 
  onSaveRoutine, 
  onDeleteRoutine 
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'templates'>('today');
  
  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState('25');
  const [newTaskCategory, setNewTaskCategory] = useState<Category>(DEFAULT_CATEGORIES[0]);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(DEFAULT_CATEGORIES[0].emoji);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  // Sync emoji with category change unless manually set
  useEffect(() => {
    setSelectedEmoji(newTaskCategory.emoji);
  }, [newTaskCategory]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const task: Task = {
      id: generateId(),
      title: newTaskTitle,
      categoryId: newTaskCategory.id,
      emoji: selectedEmoji,
      targetDuration: parseInt(newTaskDuration) || 25,
      isCompleted: false,
    };

    setTodayTasks([...todayTasks, task]);
    setNewTaskTitle('');
    setShowEmojiPicker(false);
  };

  const removeTask = (id: string) => {
    setTodayTasks(todayTasks.filter(t => t.id !== id));
    if (editingId === id) cancelEdit();
  };

  const moveTask = (index: number, direction: 'up' | 'down') => {
    const newTasks = [...todayTasks];
    if (direction === 'up' && index > 0) {
      [newTasks[index], newTasks[index - 1]] = [newTasks[index - 1], newTasks[index]];
    } else if (direction === 'down' && index < newTasks.length - 1) {
      [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
    }
    setTodayTasks(newTasks);
  };

  const handleSaveToTemplates = () => {
    if (todayTasks.length === 0) return;
    const name = prompt("Name this Routine Template:");
    if (name) {
      const newRoutine: Routine = {
        id: generateId(),
        name,
        tasks: todayTasks
      };
      onSaveRoutine(newRoutine);
      alert("Template saved!");
    }
  };

  const loadTemplate = (routine: Routine) => {
    // Clone tasks with new IDs so they are fresh
    const newTasks = routine.tasks.map(t => ({...t, id: generateId(), isCompleted: false}));
    setTodayTasks(newTasks);
    setActiveTab('today');
  };

  // --- Inline Edit Functions ---
  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDuration(task.targetDuration.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDuration('');
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) {
      cancelEdit();
      return;
    }
    const updatedTasks = todayTasks.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          title: editTitle, 
          targetDuration: parseInt(editDuration) || t.targetDuration 
        };
      }
      return t;
    });
    setTodayTasks(updatedTasks);
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <IOSHeader 
        title="Organizer" 
        rightButton={
          <button onClick={onViewLogs} className="text-[#007aff] text-sm font-bold text-inset-light-bg active:opacity-50">Logs</button>
        }
      />

      {/* Tab Control */}
      <div className="px-4 py-3 bg-[#e8ecf0] border-b border-gray-300">
        <IOSSegmentedControl 
          options={[
            { label: "Today's Plan", value: 'today' },
            { label: "Templates", value: 'templates' }
          ]}
          value={activeTab}
          onChange={(v) => setActiveTab(v as any)}
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {activeTab === 'today' && (
          <div className="space-y-6">
            {/* Task Input */}
            <IOSCard className="p-4 relative z-20">
              <h3 className="text-gray-500 text-xs font-bold uppercase mb-2">New Task</h3>
              
              <div className="flex gap-2 mb-3">
                 {/* Emoji Picker Button */}
                 <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-12 h-12 bg-white border border-gray-300 rounded shadow-inner text-2xl flex items-center justify-center shrink-0 active:bg-gray-100"
                 >
                   {selectedEmoji}
                 </button>

                 <input 
                  type="text" 
                  placeholder="What needs focus?" 
                  className="flex-1 p-2 rounded border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                />
              </div>

              {/* Emoji Popover */}
              {showEmojiPicker && (
                <div className="mb-3 p-2 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-wrap gap-2">
                   {DEFAULT_CATEGORIES.map(c => (
                     <button key={c.id} onClick={() => { setSelectedEmoji(c.emoji); setNewTaskCategory(c); setShowEmojiPicker(false); }} className="text-xl p-1 hover:bg-gray-100 rounded">
                       {c.emoji}
                     </button>
                   ))}
                   <div className="w-px h-6 bg-gray-300 mx-1"></div>
                   {QUICK_EMOJIS.map(e => (
                     <button key={e} onClick={() => { setSelectedEmoji(e); setShowEmojiPicker(false); }} className="text-xl p-1 hover:bg-gray-100 rounded">
                       {e}
                     </button>
                   ))}
                </div>
              )}
              
              <div className="flex gap-2 mb-3">
                <select 
                  className="flex-1 p-2 rounded border border-gray-300 shadow-inner bg-white text-sm"
                  value={newTaskCategory.id}
                  onChange={(e) => setNewTaskCategory(DEFAULT_CATEGORIES.find(c => c.id === e.target.value) || DEFAULT_CATEGORIES[0])}
                >
                  {DEFAULT_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                  ))}
                </select>
                <div className="w-24 relative">
                    <input 
                    type="number" 
                    className="w-full p-2 rounded border border-gray-300 shadow-inner text-center font-bold"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(e.target.value)}
                  />
                  <span className="absolute right-2 top-2 text-gray-400 text-xs">min</span>
                </div>
              </div>

              {/* Quick Time Select */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
                {TIME_PRESETS.map(min => (
                  <button 
                    key={min}
                    onClick={() => setNewTaskDuration(min.toString())}
                    className={`
                      px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap transition-colors
                      ${newTaskDuration === min.toString() 
                        ? 'bg-[#007aff] border-[#005fb8] text-white shadow-md' 
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    {min}m
                  </button>
                ))}
              </div>

              <IOSButton variant="secondary" className="w-full" onClick={addTask}>
                + Add to List
              </IOSButton>
            </IOSCard>

            {/* Current List */}
            {todayTasks.length > 0 ? (
              <div className="space-y-2 pb-10">
                <div className="flex items-center justify-between ml-2">
                  <h3 className="text-gray-600 text-inset-light-bg text-xs font-bold uppercase">To-Do Sequence</h3>
                  <span className="text-gray-500 text-xs font-bold">{todayTasks.length} Items</span>
                </div>
                
                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-400">
                  {todayTasks.map((task, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === todayTasks.length - 1;
                    const isEditing = editingId === task.id;

                    return (
                      <IOSListItem 
                        key={task.id} 
                        className={`flex justify-between items-center group transition-colors ${isEditing ? 'bg-blue-50' : ''}`}
                        onClick={() => !isEditing && startEditing(task)}
                      >
                        {isEditing ? (
                          // Edit Mode
                          <div className="flex items-center gap-2 w-full animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                            <span className="text-xl flex-shrink-0 opacity-50">{task.emoji}</span>
                            <div className="flex-1 flex gap-2">
                               <input 
                                ref={editInputRef}
                                type="text" 
                                value={editTitle} 
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                                className="w-full p-1 px-2 border border-blue-400 rounded shadow-inner text-sm focus:outline-none"
                              />
                            </div>
                            <div className="w-16 relative">
                               <input 
                                type="number" 
                                value={editDuration}
                                onChange={(e) => setEditDuration(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                                className="w-full p-1 px-2 border border-blue-400 rounded shadow-inner text-sm text-center focus:outline-none"
                              />
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => saveEdit(task.id)} className="p-1 bg-green-500 rounded text-white shadow-sm active:scale-95">
                                <Check size={16} />
                              </button>
                              <button onClick={cancelEdit} className="p-1 bg-gray-400 rounded text-white shadow-sm active:scale-95">
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className="flex items-center justify-between w-full">
                            {/* Left Content: Emoji & Text */}
                            <div className="flex items-center gap-3 overflow-hidden flex-1">
                              <span className="text-xl flex-shrink-0">{task.emoji || '📝'}</span>
                              <div className="min-w-0">
                                <div className="font-bold text-gray-800 text-sm truncate">{task.title}</div>
                                <div className="text-[10px] text-gray-500">{task.targetDuration} mins</div>
                              </div>
                            </div>

                            {/* Right Controls: Sort & Delete */}
                            <div className="flex items-center gap-2 pl-2 flex-none" onClick={(e) => e.stopPropagation()}>
                              <div className="flex flex-col bg-gray-100 rounded border border-gray-200">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); moveTask(idx, 'up'); }}
                                  disabled={isFirst}
                                  className={`p-0.5 px-1.5 ${isFirst ? 'text-gray-300' : 'text-gray-600 hover:text-blue-600 active:bg-blue-100'}`}
                                >
                                  <ChevronUp size={12} />
                                </button>
                                <div className="h-px bg-gray-200"></div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); moveTask(idx, 'down'); }}
                                  disabled={isLast}
                                  className={`p-0.5 px-1.5 ${isLast ? 'text-gray-300' : 'text-gray-600 hover:text-blue-600 active:bg-blue-100'}`}
                                >
                                  <ChevronDown size={12} />
                                </button>
                              </div>
                              
                              <button 
                                onClick={(e) => { e.stopPropagation(); removeTask(task.id); }} 
                                className="text-gray-400 p-1.5 rounded hover:bg-gray-100 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </IOSListItem>
                    );
                  })}
                </div>
                
                <div className="pt-4 flex flex-col gap-3">
                  <IOSButton variant="primary" className="w-full h-12 text-lg shadow-lg" onClick={() => onStartRoutine(todayTasks)}>
                    Start Focus Flow
                  </IOSButton>
                  <button 
                    onClick={handleSaveToTemplates}
                    className="text-[#007aff] text-sm font-bold text-center py-2 hover:underline"
                  >
                    Save Current List as Template
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <div className="text-6xl mb-4 grayscale opacity-50">📝</div>
                <p className="text-gray-800 text-inset-light-bg font-bold text-lg">No tasks planned.</p>
                <p className="text-gray-500 text-sm">Add tasks or load a template.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
             <div className="bg-[#fcf8e3] border border-[#fbeed5] text-[#c09853] px-4 py-3 rounded-lg text-sm mb-4 shadow-sm">
               Tap a template to load it into your Today's Plan.
             </div>

             <div className="rounded-xl overflow-hidden shadow-sm border border-gray-400 bg-white">
                {savedRoutines.length === 0 && (
                   <div className="p-8 text-center text-gray-400">
                     No saved templates yet.<br/>
                     Create a list in "Today" and save it!
                   </div>
                )}
                {savedRoutines.map(routine => (
                  <IOSListItem 
                    key={routine.id} 
                    onClick={() => loadTemplate(routine)}
                    hasArrow
                    className="group"
                  >
                     <div className="flex justify-between items-center pr-2">
                       <div>
                         <div className="font-bold text-gray-800 text-lg">{routine.name}</div>
                         <div className="text-xs text-gray-500">{routine.tasks.length} tasks • {Math.floor(routine.tasks.reduce((acc, t) => acc + t.targetDuration, 0))} min total</div>
                       </div>
                       <button 
                         onClick={(e) => { e.stopPropagation(); onDeleteRoutine(routine.id); }}
                         className="text-red-500 font-bold text-sm px-2 py-1 rounded hover:bg-red-50"
                       >
                         Delete
                       </button>
                     </div>
                  </IOSListItem>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
