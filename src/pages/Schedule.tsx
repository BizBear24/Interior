import { useStore } from '../store';
import { formatDate, isOverdue } from '../utils';
import { AlertCircle, Clock } from 'lucide-react';
import { format, addDays, startOfWeek, isToday, isSameDay } from 'date-fns';
import { useState } from 'react';

export function Schedule() {
  const { milestones, tasks, projects } = useStore();
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getDayTasks = (day: Date) =>
    tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), day) && t.status !== 'done');
  const getDayMilestones = (day: Date) =>
    milestones.filter((m) => m.dueDate && isSameDay(new Date(m.dueDate), day));

  const upcomingMilestones = milestones.filter((m) => m.status !== 'completed').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 8);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Schedule</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">← Prev</button>
          <span className="text-sm font-medium text-gray-700">{format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}</span>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Next →</button>
          <button onClick={() => setWeekOffset(0)} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">Today</button>
        </div>
      </div>

      {/* Weekly calendar */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-7 divide-x divide-gray-100">
          {days.map((day) => (
            <div key={day.toISOString()} className={`min-h-[140px] ${isToday(day) ? 'bg-blue-50/40' : ''}`}>
              <div className={`px-2 py-2 text-center border-b border-gray-100 ${isToday(day) ? 'bg-blue-600 text-white' : 'bg-gray-50'}`}>
                <p className="text-[10px] font-medium uppercase tracking-wide">{format(day, 'EEE')}</p>
                <p className="text-sm font-bold">{format(day, 'd')}</p>
              </div>
              <div className="p-1.5 space-y-1">
                {getDayMilestones(day).map((m) => (
                  <div key={m.id} className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-1 rounded font-medium truncate">🏁 {m.title}</div>
                ))}
                {getDayTasks(day).slice(0, 3).map((t) => {
                  const overdue = isOverdue(t.dueDate);
                  return <div key={t.id} className={`text-[10px] px-1.5 py-1 rounded truncate ${overdue ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>{t.title}</div>;
                })}
                {getDayTasks(day).length > 3 && <div className="text-[10px] text-gray-400 px-1">+{getDayTasks(day).length - 3} more</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming milestones */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Upcoming Milestones</h2>
        <div className="space-y-2">
          {upcomingMilestones.map((m) => {
            const project = projects.find((p) => p.id === m.projectId);
            const overdue = isOverdue(m.dueDate);
            return (
              <div key={m.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                {overdue ? <AlertCircle className="h-4 w-4 text-red-500 shrink-0" /> : <Clock className="h-4 w-4 text-gray-300 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{m.title}</p>
                  <p className="text-xs text-gray-400">{project?.name.split(' — ')[0]}</p>
                </div>
                <p className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>{formatDate(m.dueDate)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
