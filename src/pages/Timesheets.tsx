import { useStore } from '../store';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate } from '../utils';
import { Clock } from 'lucide-react';

export function Timesheets() {
  const { timesheets, users, projects } = useStore();

  const totalHours = timesheets.reduce((s, t) => s + t.hours, 0);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Timesheets</h1>
        <p className="text-sm text-gray-500">{timesheets.length} entries · {totalHours}h total</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg"><Clock className="h-5 w-5 text-blue-600" /></div>
          <div><p className="text-xs text-gray-500">Total Hours</p><p className="text-xl font-bold">{totalHours}</p></div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg"><Clock className="h-5 w-5 text-green-600" /></div>
          <div><p className="text-xs text-gray-500">Entries</p><p className="text-xl font-bold">{timesheets.length}</p></div>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Team Member</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Project</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Hours</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {timesheets.map((ts) => {
              const user = users.find((u) => u.id === ts.userId);
              const project = projects.find((p) => p.id === ts.projectId);
              return (
                <tr key={ts.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.role?.replace('_', ' ')}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-600">{project?.name.split(' — ')[0]}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(ts.date)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{ts.hours}h</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500 max-w-[200px] truncate">{ts.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {timesheets.length === 0 && <EmptyState icon={<Clock className="h-10 w-10" />} title="No timesheet entries" />}
      </div>
    </div>
  );
}
