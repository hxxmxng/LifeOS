import { Routine, SessionLog, Task } from '../types';
import { APP_STORAGE_KEY } from '../constants';

interface StorageData {
  routines: Routine[];
  logs: SessionLog[];
  currentPlan: Task[]; // Persist the active todo list
}

const INITIAL_DATA: StorageData = {
  routines: [],
  logs: [],
  currentPlan: []
};

export const loadData = (): StorageData => {
  try {
    const raw = localStorage.getItem(APP_STORAGE_KEY);
    if (!raw) return INITIAL_DATA;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_DATA, ...parsed }; // Ensure structure
  } catch (e) {
    console.error('Failed to load data', e);
    return INITIAL_DATA;
  }
};

export const saveData = (data: Partial<StorageData>) => {
  try {
    const current = loadData();
    const merged = { ...current, ...data };
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {
    console.error('Failed to save data', e);
  }
};
