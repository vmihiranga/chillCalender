'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/lib/types';

interface DayEventsDrawerProps {
  date: Date;
  events: Event[];
  onClose: () => void;
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
  isAdmin: boolean;
}

function formatTime(isoString: string) {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true,
    timeZone: 'Asia/Colombo' 
  });
}

export default function DayEventsDrawer({
  date,
  events,
  onClose,
  onAddEvent,
  onEditEvent,
  isAdmin,
}: DayEventsDrawerProps) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Colombo',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).formatToParts(new Date());

    const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
    const todayY = getPart('year');
    const todayM = getPart('month') - 1;
    const todayD = getPart('day');

    setIsToday(
      date.getDate() === todayD &&
      date.getMonth() === todayM &&
      date.getFullYear() === todayY
    );
  }, [date]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-end pointer-events-none sm:items-stretch">
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-md pointer-events-auto"
        onClick={onClose}
      />
      <div
        className={`
          relative w-full sm:max-w-md h-[85vh] sm:h-screen glass shadow-2xl border-t sm:border-t-0 sm:border-l border-black/5
          flex flex-col pointer-events-auto rounded-t-[40px] sm:rounded-none
        `}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </div>

        <div className="sticky top-0 z-10 px-8 py-8 border-b border-black/[0.03] bg-white/40 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-accent">
                  {dayNames[date.getDay()]}
                </span>
                {isToday && (
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-accent text-white rounded-full tracking-tighter uppercase shadow-lg shadow-accent/20">
                    Today
                  </span>
                )}
              </div>
              <h2 className="text-4xl font-black leading-none text-gray-900">
                {date.getDate()}
              </h2>
              <p className="mt-1 text-sm font-semibold text-gray-500">
                {monthNames[date.getMonth()]} {date.getFullYear()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 transition-all bg-white border border-black/5 rounded-2xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 active:scale-90"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto bg-gray-50/50">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-white border border-gray-200 rounded-2xl shadow-sm shadow-gray-100">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-800">Clear for now</p>
              <p className="mt-1 text-xs font-medium text-gray-400">No events scheduled for this day.</p>
            </div>
          ) : (
            events.map((ev) => (
              <button
                key={ev.id}
                onClick={() => isAdmin && onEditEvent(ev)}
                disabled={!isAdmin}
                className={`group w-full flex items-stretch gap-5 p-5 transition-all bg-white/60 border border-black/[0.03] rounded-3xl text-left ${isAdmin ? 'hover:bg-white hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-0.5 active:scale-[0.98]' : 'cursor-default'}`}
              >
                <div
                  className="w-1.5 rounded-full transition-all group-hover:scale-x-150"
                  style={{ background: ev.color, boxShadow: `0 0 12px ${ev.color}40` }}
                />
                <div className="flex-1 py-1">
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {ev.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {formatTime(ev.date)}
                  </div>
                  {ev.description && (
                    <p className="mt-2 text-xs font-medium text-gray-400 line-clamp-1 italic">
                      "{ev.description}"
                    </p>
                  )}
                </div>
                {isAdmin && (
                  <div className="flex items-center pr-1 transition-opacity opacity-0 group-hover:opacity-100">
                    <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {isAdmin && (
          <div className="p-8 border-t border-black/[0.03] bg-white/20">
            <button
              className="flex items-center justify-center w-full gap-3 py-4 text-sm font-black text-white transition-all bg-accent rounded-2xl hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30 active:scale-95"
              onClick={onAddEvent}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Schedule New Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
