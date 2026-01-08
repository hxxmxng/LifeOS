export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export interface Task {
  id: string;
  title: string;
  categoryId: string;
  emoji?: string; // Optional custom emoji
  targetDuration: number; // in minutes
  isCompleted: boolean;
}

export interface Routine {
  id: string;
  name: string;
  tasks: Task[];
}

export interface SessionLog {
  id: string;
  taskId: string;
  taskTitle: string;
  categoryEmoji: string;
  timestamp: number; // ms
  durationSpent: number; // in seconds
  completed: boolean;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  FOCUS_MODE = 'FOCUS_MODE',
  DIARY = 'DIARY',
  SETTINGS = 'SETTINGS'
}

// Default Categories
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'job', name: 'Job', emoji: '💼' },
  { id: 'study', name: 'Study', emoji: '📖' },
  { id: 'hobby', name: 'Hobby', emoji: '🫐' },
  { id: 'house', name: 'Housework', emoji: '🛋️' },
  { id: 'selfcare', name: 'Self Care', emoji: '🩶' },
];

// Common Emojis for quick selection
export const QUICK_EMOJIS = ['💻', '🫧', '🏃', '🧘', '🎨', '🧹', '🧺', '🖋️', '🥗', '🪥', '💊', '🚿', '🪮', '🥣', '🧴'];
