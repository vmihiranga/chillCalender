'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/lib/types';

interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  events: Event[];
  selectedDate: Date | null;
  onDayClick: (date: Date) => void;
  zoom?: number;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getEventsByDay(events: Event[], year: number, month: number) {
  const map: Record<number, Event[]> = {};
  events.forEach((ev) => {
    const d = new Date(ev.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      map[day] = map[day] ? [...map[day], ev] : [ev];
    }
  });
  return map;
}

export default function CalendarGrid({
  year,
  month,
  events,
  selectedDate,
  onDayClick,
  zoom = 1,
}: CalendarGridProps) {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Colombo',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).formatToParts(new Date());

    const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
    setToday(new Date(getPart('year'), getPart('month') - 1, getPart('day')));
  }, []);

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const eventsByDay = getEventsByDay(events, year, month);

  // Build grid: leading empty cells + days
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  // Dynamic values based on zoom
  const baseHeight = 100 * zoom; 
  const fontSizeFactor = zoom < 0.8 ? 'text-[0.6rem]' : zoom > 1.2 ? 'text-sm' : 'text-xs';
  const pillVisibilityCount = zoom < 0.8 ? 1 : zoom > 1.4 ? 4 : 2;

  return (
    <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-black/[0.03] bg-white/10 sticky top-0 z-10 backdrop-blur-xl">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-4 text-[11px] font-black text-center text-gray-400 uppercase tracking-[0.2em]"
            style={{ fontSize: `${10 * zoom}px` }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 flex-1 w-full relative">
        {cells.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                className={`
                  bg-gray-50/20
                  ${(idx + 1) % 7 !== 0 ? 'border-r border-gray-100' : ''}
                  ${idx < cells.length - 7 ? 'border-b border-gray-100' : ''}
                `}
                style={{ minHeight: `${baseHeight}px` }}
              />
            );
          }

          const cellDate = new Date(year, month, day);
          const isToday = today ? isSameDay(cellDate, today) : false;
          const isSelected = selectedDate && isSameDay(cellDate, selectedDate);
          const dayEvents = eventsByDay[day] || [];
          const isPast = today ? cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate()) : false;

          return (
            <button
              key={day}
              onClick={() => onDayClick(cellDate)}
              className={`
                relative flex flex-col items-start p-2.5 transition-all
                ${(idx + 1) % 7 !== 0 ? 'border-r border-black/[0.03]' : ''}
                ${idx < cells.length - 7 ? 'border-b border-black/[0.03]' : ''}
                ${isSelected ? 'bg-accent/[0.03]' : 'hover:bg-white/40'}
              `}
              style={{ minHeight: `${baseHeight}px` }}
            >
              {/* Day number */}
              <div className="flex items-start justify-between w-full">
                <span
                  className={`
                    flex items-center justify-center rounded-full font-black transition-all
                    ${isToday ? 'bg-accent text-white shadow-xl shadow-accent/30 scale-105' : ''}
                    ${!isToday && isSelected ? 'text-accent' : ''}
                    ${!isToday && !isSelected ? (isPast ? 'text-gray-300' : 'text-gray-800') : ''}
                  `}
                  style={{ 
                    width: `${30 * Math.max(0.8, zoom)}px`, 
                    height: `${30 * Math.max(0.8, zoom)}px`,
                    fontSize: `${13 * zoom}px` 
                  }}
                >
                  {day}
                </span>
              </div>

              {/* Event indications */}
              <div className="flex flex-col w-full gap-1 mt-1">
                {/* Mobile/Compact Dots */}
                {zoom < 0.9 ? (
                  <div className="flex flex-wrap gap-1">
                    {dayEvents.slice(0, 4).map((ev) => (
                      <div
                        key={ev.id}
                        className="rounded-full shadow-sm"
                        style={{ background: ev.color, width: `${4 * zoom}px`, height: `${4 * zoom}px` }}
                      />
                    ))}
                  </div>
                ) : (
                  /* Standard/Zoomed Pills */
                  <div className="w-full space-y-1">
                      <div
                        key={ev.id}
                        className={`px-2 py-0.5 font-bold rounded-lg border-l-2 truncate transition-all ${fontSizeFactor}`}
                        style={{
                          background: `${ev.color}10`,
                          borderLeftColor: ev.color,
                          color: ev.color,
                          fontSize: `${10 * zoom}px`
                        }}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > pillVisibilityCount && (
                      <div className="px-1 font-black text-gray-300" style={{ fontSize: `${8 * zoom}px` }}>
                        + {dayEvents.length - pillVisibilityCount}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
