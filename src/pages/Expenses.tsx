import { useState } from 'react';
import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { formatCurrency, formatDate } from '../utils';
import { Plus, Search, DollarSign } from 'lucide-react';

const CAT_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'material', label: 'Material' },
  { value: 'labor', label: 'Labor' },
  { value: 'transport', label: 'Transport' },
  { value: 'site', label: 'Site' },
  { value: 'design', label: 'Design' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
};

export function Expenses() {
  const toast = useToast();
  const { expenses, projects, updateExpense } = useStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = expenses.filter((e) => {
    if (search && !e.description.toLowerCase().includes(search.toLowerCase()) && !e.vendorName?.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter && e.category !== catFilter) return false;
    if (projectFilter && e.projectId !== projectFilter) return false;
    return true;
  });

  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const approved = filtered.filter((e) => e.status === 'approved').reduce((s, e) => s + e.amount, 0);
  const pending = filtered.filter((e) => e.status === 'pending').reduce((s, e) => s + e.amount, 0);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500 mt-0.5">{expenses.length} records</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowModal(true)}>Add Expense</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border p-4"><p className="text-xs text-gray-500">Total Expenses</p><p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(total)}</p></div>
        <div className="bg-white rounded-xl border p-4"><p className="text-xs text-gray-500">Approved</p><p className="text-xl font-bold text-green-600 mt-1">{formatCurrency(approved)}</p></div>
        <div className="bg-white rounded-xl border p-4"><p className="text-xs text-gray-500">Pending Approval</p><p className="text-xl font-bold text-yellow-600 mt-1">{formatCurrency(pending)}</p></div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-3.5 w-3.5" />} className="w-52" />
        <Select options={CAT_OPTIONS} value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="w-40" />
        <Select options={[{ value: '', label: 'All Projects' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="w-44" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Project</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((exp) => {
              const project = projects.find((p) => p.id === exp.projectId);
              return (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{exp.description}</p>
                    {exp.vendorName && <p className="text-xs text-gray-400">{exp.vendorName}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell"><Badge className="bg-gray-100 text-gray-600 capitalize">{exp.category}</Badge></td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{project?.name.split(' — ')[0]}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(exp.amount)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{formatDate(exp.date)}</td>
                  <td className="px-4 py-3"><Badge className={STATUS_COLORS[exp.status]}>{exp.status}</Badge></td>
                  <td className="px-4 py-3">
                    {exp.status === 'pending' && (
                      <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={() => { updateExpense(exp.id, { status: 'approved' }); toast.success('Expense approved'); }}>Approve</Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={<DollarSign className="h-10 w-10" />} title="No expenses found" />}
      </div>

      {showModal && (
        <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Expense" size="md"
          footer={<><Button variant="outline" size="sm" onClick={() => setShowModal(false)}>Cancel</Button><Button size="sm" onClick={() => { toast.success('Expense added'); setShowModal(false); }}>Add Expense</Button></>}
        >
          <p className="text-sm text-gray-500">Expense form — fill in the details to record a new expense.</p>
        </Modal>
      )}
    </div>
  );
}
