export const APP_STORAGE_KEY = 'lifeos_v1_data';

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
