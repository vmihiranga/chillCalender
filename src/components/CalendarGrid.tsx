'use client';

import { Event } from '@/lib/types';

interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  events: Event[];
  selectedDate: Date | null;
  onDayClick: (date: Date) => void;
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
}: CalendarGridProps) {
  const today = new Date();
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

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/30">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-3 text-[10px] font-extrabold text-center text-gray-400 uppercase tracking-[0.15em]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid flex-1 grid-cols-7 auto-rows-fr">
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
              />
            );
          }

          const cellDate = new Date(year, month, day);
          const isToday = isSameDay(cellDate, today);
          const isSelected = selectedDate && isSameDay(cellDate, selectedDate);
          const dayEvents = eventsByDay[day] || [];
          const isPast = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <button
              key={day}
              onClick={() => onDayClick(cellDate)}
              className={`
                relative flex flex-col items-start p-2 transition-all group
                ${(idx + 1) % 7 !== 0 ? 'border-r border-gray-100' : ''}
                ${idx < cells.length - 7 ? 'border-b border-gray-100' : ''}
                ${isSelected ? 'bg-orange-50/50' : 'hover:bg-gray-50'}
              `}
              style={{ minHeight: 'clamp(80px, 12vh, 140px)' }}
            >
              {/* Day number */}
              <div className="flex items-start justify-between w-100">
                <span
                  className={`
                    flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-bold
                    transition-transform group-hover:scale-110
                    ${isToday ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : ''}
                    ${!isToday && isSelected ? 'text-orange-600' : ''}
                    ${!isToday && !isSelected ? (isPast ? 'text-gray-300' : 'text-gray-700') : ''}
                  `}
                >
                  {day}
                </span>
              </div>

              {/* Event dots / pills */}
              <div className="flex flex-col w-full gap-1 mt-1 sm:mt-2">
                {/* Mobile View (Dots) */}
                <div className="flex flex-wrap gap-1 md:hidden">
                  {dayEvents.slice(0, 4).map((ev) => (
                    <div
                      key={ev.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: ev.color }}
                    />
                  ))}
                  {dayEvents.length > 4 && (
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  )}
                </div>

                {/* Desktop View (Pills) */}
                <div className="hidden space-y-1 md:block">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="px-1.5 py-0.5 text-[10px] font-bold rounded border-l-2 truncate transition-transform hover:translate-x-0.5"
                      style={{
                        background: `${ev.color}15`,
                        borderLeftColor: ev.color,
                        color: ev.color,
                      }}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="px-1 text-[9px] font-bold text-gray-400">
                      + {dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
