export interface Event {
  id: string;
  title: string;
  description?: string | null;
  date: string; // ISO string
  color: string;
  createdAt: string;
}

export interface EventFormData {
  title: string;
  description?: string;
  date: string;   // "YYYY-MM-DD"
  time: string;   // "HH:mm"
  color: string;
}

export const COLOR_OPTIONS = [
  { label: 'Indigo',   value: '#6366f1' },
  { label: 'Rose',     value: '#f43f5e' },
  { label: 'Emerald',  value: '#10b981' },
  { label: 'Amber',    value: '#f59e0b' },
  { label: 'Sky',      value: '#0ea5e9' },
  { label: 'Violet',   value: '#8b5cf6' },
  { label: 'Pink',     value: '#ec4899' },
  { label: 'Teal',     value: '#14b8a6' },
];
