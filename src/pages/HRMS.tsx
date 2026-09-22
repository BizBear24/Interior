import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { Users } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = { active: 'bg-green-50 text-green-700', on_leave: 'bg-yellow-50 text-yellow-700', inactive: 'bg-gray-100 text-gray-500' };

export function HRMS() {
  const { employees } = useStore();
  const active = employees.filter((e) => e.status === 'active').length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">HR Management</h1>
        <p className="text-sm text-gray-500">{employees.length} employees · {active} active</p>
      </div>

      {employees.length === 0 ? (
        <EmptyState icon={<Users className="h-12 w-12" />} title="No employees found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={emp.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.role}</p>
                </div>
                <Badge className={STATUS_COLORS[emp.status] || 'bg-gray-100 text-gray-500'}>{emp.status.replace('_', ' ')}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><p className="text-gray-400">Department</p><p className="font-medium text-gray-700 mt-0.5">{emp.department}</p></div>
                <div><p className="text-gray-400">Joined</p><p className="font-medium text-gray-700 mt-0.5">{new Date(emp.joiningDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</p></div>
                <div className="col-span-2"><p className="text-gray-400">Phone</p><p className="font-medium text-gray-700 mt-0.5">{emp.phone}</p></div>
              </div>
              <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">{emp.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
