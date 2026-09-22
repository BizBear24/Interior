import { useState } from 'react';
import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { formatDate, formatCurrency, QUOTE_STATUS_COLORS } from '../utils';
import { FileText, Plus, Search, Eye } from 'lucide-react';
import type { Quote, QuoteStatus } from '../types';

const STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'Draft', sent: 'Sent', viewed: 'Viewed', approved: 'Approved', rejected: 'Rejected',
};

export function Quotes() {
  const toast = useToast();
  const { quotes, projects, clients, updateQuote } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewQuote, setViewQuote] = useState<Quote | null>(null);

  const filtered = quotes.filter((q) => {
    if (search && !q.quoteNumber.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && q.status !== statusFilter) return false;
    return true;
  });

  const totalValue = quotes.filter((q) => q.status === 'approved').reduce((s, q) => s + q.total, 0);
  const pendingValue = quotes.filter((q) => q.status === 'sent').reduce((s, q) => s + q.total, 0);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quotes</h1>
          <p className="text-sm text-gray-500">{quotes.length} quotes · Approved: {formatCurrency(totalValue)} · Pending: {formatCurrency(pendingValue)}</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => toast.info('Create quote from a project detail page')}>New Quote</Button>
      </div>

      <div className="flex gap-3 mb-5">
        <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-3.5 w-3.5" />} className="w-52" />
        <Select options={[{ value: '', label: 'All Status' }, ...Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))]} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-36" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Quote #</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Project</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Client</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Valid Until</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((q) => {
              const project = projects.find((p) => p.id === q.projectId);
              const client = clients.find((c) => c.id === q.clientId);
              return (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{q.quoteNumber}</p>
                    <p className="text-xs text-gray-400">{formatDate(q.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-600">{project?.name.split(' — ')[0]}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-600">{client?.name}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(q.total)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{formatDate(q.validUntil)}</td>
                  <td className="px-4 py-3"><Badge className={QUOTE_STATUS_COLORS[q.status]}>{STATUS_LABELS[q.status]}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setViewQuote(q)}><Eye className="h-3.5 w-3.5" /></Button>
                      {q.status === 'draft' && <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={() => { updateQuote(q.id, { status: 'sent' }); toast.success('Quote sent'); }}>Send</Button>}
                      {q.status === 'sent' && <Button size="sm" variant="outline" className="text-[10px] h-6 px-2 text-green-600 border-green-200" onClick={() => { updateQuote(q.id, { status: 'approved' }); toast.success('Quote approved'); }}>Approve</Button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={<FileText className="h-10 w-10" />} title="No quotes found" />}
      </div>

      {viewQuote && (
        <Modal open={!!viewQuote} onClose={() => setViewQuote(null)} title={`Quote ${viewQuote.quoteNumber}`} size="xl">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <div><p className="text-gray-500">Client</p><p className="font-medium">{clients.find((c) => c.id === viewQuote.clientId)?.name}</p></div>
              <div><p className="text-gray-500">Created</p><p className="font-medium">{formatDate(viewQuote.createdAt)}</p></div>
              <div><p className="text-gray-500">Valid Until</p><p className="font-medium">{formatDate(viewQuote.validUntil)}</p></div>
              <div><p className="text-gray-500">Status</p><Badge className={QUOTE_STATUS_COLORS[viewQuote.status]}>{STATUS_LABELS[viewQuote.status]}</Badge></div>
            </div>
            <table className="w-full text-sm border-t border-gray-100">
              <thead><tr className="bg-gray-50"><th className="text-left p-2 text-xs text-gray-500">Item</th><th className="text-right p-2 text-xs text-gray-500">Qty</th><th className="text-right p-2 text-xs text-gray-500">Rate</th><th className="text-right p-2 text-xs text-gray-500">Amount</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {viewQuote.items.map((item) => (
                  <tr key={item.id}><td className="p-2">{item.description}</td><td className="p-2 text-right">{item.quantity} {item.unit}</td><td className="p-2 text-right">{formatCurrency(item.unitPrice)}</td><td className="p-2 text-right font-medium">{formatCurrency(item.total)}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-gray-100 pt-3 flex justify-end gap-8 text-sm">
              <div><p className="text-gray-500">Subtotal</p><p className="font-medium">{formatCurrency(viewQuote.subtotal)}</p></div>
              <div><p className="text-gray-500">Tax</p><p className="font-medium">{formatCurrency(viewQuote.taxTotal)}</p></div>
              <div><p className="text-gray-500">Total</p><p className="text-lg font-bold text-blue-600">{formatCurrency(viewQuote.total)}</p></div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
