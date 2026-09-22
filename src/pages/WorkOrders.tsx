import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate, formatCurrency } from '../utils';
import { Wrench } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700', pending_approval: 'bg-yellow-50 text-yellow-700',
  approved: 'bg-blue-50 text-blue-700', in_progress: 'bg-orange-50 text-orange-700',
  completed: 'bg-green-50 text-green-700', closed: 'bg-gray-100 text-gray-500',
};
const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft', pending_approval: 'Pending', approved: 'Approved',
  in_progress: 'In Progress', completed: 'Completed', closed: 'Closed',
};

export function WorkOrders() {
  const { workOrders, projects } = useStore();

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Work Orders</h1>
        <p className="text-sm text-gray-500">{workOrders.length} work orders</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">WO Number</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Project</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contractor</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">End Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {workOrders.map((wo) => {
              const project = projects.find((p) => p.id === wo.projectId);
              return (
                <tr key={wo.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{wo.woNumber}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[180px]">{wo.scope}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-600">{project?.name.split(' — ')[0]}</td>
                  <td className="px-4 py-3 text-xs text-gray-700">{wo.contractorName}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(wo.amount)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{formatDate(wo.endDate)}</td>
                  <td className="px-4 py-3"><Badge className={STATUS_COLORS[wo.status] || 'bg-gray-100 text-gray-700'}>{STATUS_LABELS[wo.status] || wo.status}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {workOrders.length === 0 && <EmptyState icon={<Wrench className="h-10 w-10" />} title="No work orders" />}
      </div>
    </div>
  );
}
