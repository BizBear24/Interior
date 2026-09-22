import { useState } from 'react';
import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { formatDate, APPROVAL_STATUS_COLORS } from '../utils';
import { ShoppingCart, Plus, Search } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft', pending_approval: 'Pending Approval', approved: 'Approved',
  rejected: 'Rejected', ordered: 'Ordered', received: 'Received', closed: 'Closed',
};

export function PurchaseRequests() {
  const toast = useToast();
  const { purchaseRequests, projects, users, updatePurchaseRequest } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = purchaseRequests.filter((pr) => {
    if (search && !pr.prNumber.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && pr.status !== statusFilter) return false;
    return true;
  });

  const pendingCount = purchaseRequests.filter((pr) => pr.status === 'pending_approval').length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Purchase Requests</h1>
          <p className="text-sm text-gray-500">{purchaseRequests.length} total · {pendingCount} pending approval</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => toast.info('PR creation', 'Use the PR form to create a new purchase request')}>New PR</Button>
      </div>

      {pendingCount > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-xl flex items-center gap-2 text-sm text-yellow-800">
          <ShoppingCart className="h-4 w-4" />
          <span>{pendingCount} purchase request{pendingCount > 1 ? 's' : ''} awaiting your approval</span>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-3.5 w-3.5" />} className="w-52" />
        <Select options={[{ value: '', label: 'All Status' }, ...Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))]} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-44" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">PR Number</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Project</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Required By</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((pr) => {
              const project = projects.find((p) => p.id === pr.projectId);
              const requester = users.find((u) => u.id === pr.requestedById);
              return (
                <tr key={pr.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{pr.prNumber}</p>
                    <p className="text-xs text-gray-400">{requester?.name}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">{project?.name.split(' — ')[0]}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-700">{pr.items.length} item{pr.items.length > 1 ? 's' : ''}</p>
                    <p className="text-[10px] text-gray-400">{pr.items[0]?.description}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{formatDate(pr.requiredBy)}</td>
                  <td className="px-4 py-3">
                    <Badge className={pr.priority === 'urgent' ? 'bg-red-50 text-red-700' : pr.priority === 'high' ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-600'}>
                      {pr.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3"><Badge className={APPROVAL_STATUS_COLORS[pr.status]}>{STATUS_LABELS[pr.status]}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {pr.status === 'pending_approval' && (
                        <>
                          <Button size="sm" variant="outline" className="text-[10px] h-6 px-2 text-green-600 border-green-200" onClick={() => { updatePurchaseRequest(pr.id, { status: 'approved' }); toast.success('PR approved'); }}>Approve</Button>
                          <Button size="sm" variant="outline" className="text-[10px] h-6 px-2 text-red-500 border-red-200" onClick={() => { updatePurchaseRequest(pr.id, { status: 'rejected' }); toast.warning('PR rejected'); }}>Reject</Button>
                        </>
                      )}
                      {pr.status === 'approved' && (
                        <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={() => { updatePurchaseRequest(pr.id, { status: 'ordered' }); toast.success('Marked as ordered'); }}>Mark Ordered</Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={<ShoppingCart className="h-10 w-10" />} title="No purchase requests" />}
      </div>
    </div>
  );
}
