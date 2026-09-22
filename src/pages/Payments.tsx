import { useStore } from '../store';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate, formatCurrency } from '../utils';
import { CreditCard, TrendingUp, Clock } from 'lucide-react';

export function Payments() {
  const { payments, invoices, projects } = useStore();

  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  const thisMonth = payments.filter((p) => new Date(p.date).getMonth() === new Date().getMonth()).reduce((s, p) => s + p.amount, 0);

  const METHOD_LABELS: Record<string, string> = { bank_transfer: 'Bank Transfer', cheque: 'Cheque', cash: 'Cash', upi: 'UPI', other: 'Other' };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500">{payments.length} payment records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg"><TrendingUp className="h-5 w-5 text-green-600" /></div>
          <div><p className="text-xs text-gray-500">Total Collected</p><p className="text-xl font-bold text-gray-900">{formatCurrency(totalCollected)}</p></div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg"><Clock className="h-5 w-5 text-blue-600" /></div>
          <div><p className="text-xs text-gray-500">This Month</p><p className="text-xl font-bold text-gray-900">{formatCurrency(thisMonth)}</p></div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg"><CreditCard className="h-5 w-5 text-purple-600" /></div>
          <div><p className="text-xs text-gray-500">Transactions</p><p className="text-xl font-bold text-gray-900">{payments.length}</p></div>
        </Card>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Invoice</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Project</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Method</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((pay) => {
              const invoice = invoices.find((i) => i.id === pay.invoiceId);
              const project = projects.find((p) => p.id === pay.projectId);
              return (
                <tr key={pay.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{pay.reference || `PAY-${pay.id}`}</p>
                    <p className="text-xs text-gray-400">{formatDate(pay.date)}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-600">{invoice?.invoiceNumber}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-600">{project?.name.split(' — ')[0]}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{METHOD_LABELS[pay.method] || pay.method}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">{formatCurrency(pay.amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {payments.length === 0 && <EmptyState icon={<CreditCard className="h-10 w-10" />} title="No payments recorded" />}
      </div>
    </div>
  );
}
