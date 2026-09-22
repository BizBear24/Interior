import { useState } from 'react';
import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { formatCurrency, formatDate, isOverdue, INVOICE_STATUS_COLORS } from '../utils';
import { Plus, Search, Receipt } from 'lucide-react';
import type { Invoice } from '../types';

const STATUS_OPTS = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'partially_paid', label: 'Partially Paid' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
];

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft', sent: 'Sent', partially_paid: 'Partially Paid', paid: 'Paid', overdue: 'Overdue',
};

export function Invoices() {
  const toast = useToast();
  const { invoices, clients, projects, updateInvoice } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  const filtered = invoices.filter((inv) => {
    const client = clients.find((c) => c.id === inv.clientId);
    if (search && !inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) && !client?.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && inv.status !== statusFilter) return false;
    return true;
  });

  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalOutstanding = invoices.filter((i) => i.status !== 'paid').reduce((s, i) => s + i.total, 0);
  const overdueCount = invoices.filter((i) => i.status === 'overdue' || (i.status !== 'paid' && isOverdue(i.dueDate))).length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-0.5">{invoices.length} total</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowModal(true)}>New Invoice</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Total Collected</p>
          <p className="text-xl font-bold text-green-600 mt-1">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Outstanding</p>
          <p className="text-xl font-bold text-orange-600 mt-1">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Overdue</p>
          <p className="text-xl font-bold text-red-600 mt-1">{overdueCount} invoices</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <Input placeholder="Search invoices…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-3.5 w-3.5" />} className="w-56" />
        <Select options={STATUS_OPTS} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice #</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Project</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Due Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((inv) => {
              const client = clients.find((c) => c.id === inv.clientId);
              const project = projects.find((p) => p.id === inv.projectId);
              const actuallyOverdue = inv.status !== 'paid' && isOverdue(inv.dueDate);
              const displayStatus = actuallyOverdue && inv.status !== 'overdue' ? 'overdue' : inv.status;
              return (
                <tr key={inv.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setViewInvoice(inv)}>
                  <td className="px-4 py-3 font-medium text-gray-900">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-gray-700">{client?.name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell text-xs">{project?.name.split(' — ')[0]}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(inv.total)}</td>
                  <td className={`px-4 py-3 text-xs hidden lg:table-cell ${actuallyOverdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}>{formatDate(inv.dueDate)}</td>
                  <td className="px-4 py-3"><Badge className={INVOICE_STATUS_COLORS[displayStatus]}>{STATUS_LABELS[displayStatus]}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      {inv.status !== 'paid' && (
                        <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={() => { updateInvoice(inv.id, { status: 'paid', updatedAt: new Date().toISOString() }); toast.success('Invoice marked as paid'); }}>Mark Paid</Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={<Receipt className="h-10 w-10" />} title="No invoices found" />}
      </div>

      {/* Invoice View Modal */}
      {viewInvoice && (
        <Modal open={!!viewInvoice} onClose={() => setViewInvoice(null)} title={`Invoice — ${viewInvoice.invoiceNumber}`} size="xl"
          footer={<><Button variant="outline" size="sm" onClick={() => setViewInvoice(null)}>Close</Button>{viewInvoice.status !== 'paid' && <Button size="sm" onClick={() => { updateInvoice(viewInvoice.id, { status: 'paid' }); toast.success('Marked as paid'); setViewInvoice(null); }}>Mark as Paid</Button>}</>}
        >
          <InvoicePrintView invoice={viewInvoice} />
        </Modal>
      )}

      {/* New Invoice Modal */}
      {showModal && (
        <Modal open={showModal} onClose={() => setShowModal(false)} title="New Invoice" size="lg"
          footer={<><Button variant="outline" size="sm" onClick={() => setShowModal(false)}>Cancel</Button><Button size="sm" onClick={() => { toast.info('Invoice creation', 'Fill details and save'); setShowModal(false); }}>Create Invoice</Button></>}
        >
          <p className="text-sm text-gray-500">Use the quick invoice creator — full invoice form would be here in production.</p>
        </Modal>
      )}
    </div>
  );
}

function InvoicePrintView({ invoice }: { invoice: Invoice }) {
  const { clients, projects } = useStore();
  const client = clients.find((c) => c.id === invoice.clientId);
  const project = projects.find((p) => p.id === invoice.projectId);
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <p className="text-xs text-gray-500">Client</p>
          <p className="text-sm font-semibold text-gray-900">{client?.name}</p>
          <p className="text-xs text-gray-500">{client?.email}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Invoice Date</p>
          <p className="text-sm font-semibold">{formatDate(invoice.createdAt)}</p>
          <p className="text-xs text-gray-500">Due: {formatDate(invoice.dueDate)}</p>
        </div>
      </div>
      {project && <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">Project: <span className="font-medium text-gray-700">{project.name}</span></div>}
      <table className="w-full text-sm">
        <thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-xs font-semibold text-gray-500">Description</th><th className="text-right py-2 text-xs font-semibold text-gray-500">Qty</th><th className="text-right py-2 text-xs font-semibold text-gray-500">Rate</th><th className="text-right py-2 text-xs font-semibold text-gray-500">Total</th></tr></thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-50">
              <td className="py-2 text-gray-700">{item.description}</td>
              <td className="py-2 text-right text-gray-500">{item.quantity}</td>
              <td className="py-2 text-right text-gray-500">{formatCurrency(item.unitPrice)}</td>
              <td className="py-2 text-right font-medium text-gray-900">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <div className="space-y-1 text-sm min-w-48">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(invoice.subtotal)}</span></div>
          {invoice.taxTotal > 0 && <div className="flex justify-between"><span className="text-gray-500">GST</span><span>{formatCurrency(invoice.taxTotal)}</span></div>}
          <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span>{formatCurrency(invoice.total)}</span></div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={INVOICE_STATUS_COLORS[invoice.status]}>{invoice.status.replace('_', ' ')}</Badge>
      </div>
    </div>
  );
}
