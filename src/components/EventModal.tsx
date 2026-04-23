'use client';

import { useState, useCallback } from 'react';
import { Event, EventFormData, COLOR_OPTIONS } from '@/lib/types';

interface EventModalProps {
  mode: 'create' | 'edit';
  initialDate?: string;
  event?: Event;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete?: (id: string) => void;
}

export default function EventModal({
  mode,
  initialDate,
  event,
  onClose,
  onSave,
  onDelete,
}: EventModalProps) {
  const getInitialDate = () => {
    if (event) return event.date.slice(0, 10);
    if (initialDate) return initialDate;
    return new Date().toISOString().slice(0, 10);
  };

  const getInitialTime = () => {
    if (event) {
      const d = new Date(event.date);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    return '09:00';
  };

  const [form, setForm] = useState<EventFormData>({
    title: event?.title || '',
    description: event?.description || '',
    date: getInitialDate(),
    time: getInitialTime(),
    color: event?.color || '#f97316',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = useCallback(
    (field: keyof EventFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setError('');
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Please enter a title'); return; }
    if (!form.date) { setError('Select a date'); return; }

    setLoading(true);
    try {
      const isoDate = new Date(`${form.date}T${form.time}:00`).toISOString();
      const payload = {
        title: form.title.trim(),
        description: form.description?.trim() || '',
        date: isoDate,
        color: form.color,
      };

      const url = mode === 'edit' ? `/api/events/${event!.id}` : '/api/events';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save');
      const saved: Event = await res.json();
      onSave(saved);
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event || !onDelete) return;
    if (!confirm('Are you sure you want to delete this event?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      onDelete(event.id);
    } catch {
      setError('Failed to delete.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-xl" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg overflow-hidden glass shadow-[0_20px_60px_rgba(0,0,0,0.1)] rounded-[40px] border border-black/[0.03]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: form.color, boxShadow: `0 0 10px ${form.color}60` }}
            />
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {mode === 'create' ? 'New Event' : 'Edit Event'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2.5 text-gray-400 transition-all bg-white/40 border border-black/[0.03] rounded-2xl hover:text-gray-900 hover:bg-white backdrop-blur-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Title</label>
              <input
                className="w-full px-6 py-4 text-sm font-bold text-gray-800 placeholder-gray-300 transition-all border border-black/[0.03] bg-white/40 rounded-2xl focus:bg-white focus:ring-8 focus:ring-accent/5 focus:border-accent outline-none backdrop-blur-md"
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Event name"
                maxLength={80}
                autoFocus
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Date</label>
                <input
                  className="w-full px-6 py-4 text-sm font-bold text-gray-800 border border-black/[0.03] bg-white/40 rounded-2xl focus:bg-white focus:ring-8 focus:ring-accent/5 focus:border-accent outline-none backdrop-blur-md"
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Time</label>
                <input
                  className="w-full px-6 py-4 text-sm font-bold text-gray-800 border border-black/[0.03] bg-white/40 rounded-2xl focus:bg-white focus:ring-8 focus:ring-accent/5 focus:border-accent outline-none backdrop-blur-md"
                  type="time"
                  value={form.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Notes</label>
              <textarea
                className="w-full px-6 py-4 text-sm font-semibold text-gray-600 placeholder-gray-300 transition-all border border-black/[0.03] bg-white/40 rounded-2xl focus:bg-white focus:ring-8 focus:ring-accent/5 focus:border-accent outline-none backdrop-blur-md resize-none"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description..."
                rows={3}
              />
            </div>

            {/* Color */}
            <div>
              <label className="block mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Theme</label>
              <div className="flex flex-wrap gap-3.5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() => handleChange('color', c.value)}
                    className={`w-9 h-9 rounded-full border-4 transition-all hover:scale-110 active:scale-90 ${form.color === c.value ? 'border-white ring-2 ring-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ background: c.value }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="mt-4 text-xs font-bold text-red-500 flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</p>}

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {mode === 'edit' && onDelete ? (
              <button type="button" className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors" onClick={handleDelete} disabled={loading}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                Delete
              </button>
            ) : <div />}
            
            <div className="flex items-center gap-4">
              <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-400 transition-colors hover:text-gray-600">Cancel</button>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3.5 text-sm font-black text-white bg-accent rounded-2xl hover:bg-accent-hover shadow-xl shadow-accent/20 transition-all active:scale-95 disabled:grayscale flex items-center gap-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {mode === 'create' ? 'Create Event' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
