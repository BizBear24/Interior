import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Shield } from 'lucide-react';

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-50 text-red-700', pm: 'bg-blue-50 text-blue-700', designer: 'bg-purple-50 text-purple-700',
  procurement: 'bg-orange-50 text-orange-700', finance: 'bg-green-50 text-green-700',
  site_supervisor: 'bg-yellow-50 text-yellow-700', hr: 'bg-pink-50 text-pink-700', viewer: 'bg-gray-100 text-gray-600',
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['Full Access', 'User Management', 'Settings', 'All Modules'],
  pm: ['Projects', 'Tasks', 'Milestones', 'Quotes', 'Procurement', 'Snags'],
  designer: ['Projects', 'Tasks', 'Files', 'Moodboard', 'Notes'],
  procurement: ['Purchase Requests', 'Purchase Orders', 'Inventory', 'Vendors'],
  finance: ['Invoices', 'Payments', 'Expenses', 'Finances', 'Quotes'],
  site_supervisor: ['Tasks', 'Snags', 'Timesheets', 'Attendance', 'Work Orders'],
  hr: ['HRMS', 'Attendance', 'Employees', 'Timesheets'],
  viewer: ['Read Only', 'Projects', 'Dashboard'],
};

export function Roles() {
  const { users } = useStore();

  const roleGroups = users.reduce<Record<string, typeof users>>((acc, u) => {
    if (!acc[u.role]) acc[u.role] = [];
    acc[u.role].push(u);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Roles & Permissions</h1>
        <p className="text-sm text-gray-500">Role-based access control for Studio Forma</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(ROLE_PERMISSIONS).map(([role, perms]) => {
          const roleUsers = roleGroups[role] || [];
          return (
            <div key={role} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-50 rounded-lg"><Shield className="h-4 w-4 text-gray-500" /></div>
                <div>
                  <Badge className={ROLE_COLORS[role] || 'bg-gray-100 text-gray-700'}>{role.replace('_', ' ').toUpperCase()}</Badge>
                  <p className="text-xs text-gray-400 mt-0.5">{roleUsers.length} user{roleUsers.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {perms.map((p) => <span key={p} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100">{p}</span>)}
              </div>
              {roleUsers.length > 0 && (
                <div className="flex items-center gap-1.5 pt-3 border-t border-gray-50">
                  {roleUsers.slice(0, 4).map((u) => <Avatar key={u.id} name={u.name} size="xs" />)}
                  {roleUsers.length > 4 && <span className="text-[10px] text-gray-400">+{roleUsers.length - 4}</span>}
                  <span className="text-xs text-gray-500 ml-1">{roleUsers.map((u) => u.name.split(' ')[0]).join(', ')}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
