import { useStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { formatCurrency } from '../utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  material: '#3B82F6', labor: '#10B981', transport: '#F59E0B', site: '#8B5CF6', design: '#EC4899', miscellaneous: '#6B7280',
};

export function Finances() {
  const { projects, invoices, payments, expenses } = useStore();

  const totalProjectValue = projects.reduce((s, p) => s + p.budget, 0);
  const totalInvoiced = invoices.reduce((s, i) => s + i.total, 0);
  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const outstanding = totalInvoiced - totalCollected;
  const projectFinancials = projects.map((p) => {
    const projectExpenses = expenses.filter((e) => e.projectId === p.id).reduce((s, e) => s + e.amount, 0);
    const projectInvoiced = invoices.filter((i) => i.projectId === p.id).reduce((s, i) => s + i.total, 0);
    const projectPaid = payments.filter((pay) => invoices.some((i) => i.projectId === p.id && i.id === pay.invoiceId)).reduce((s, pay) => s + pay.amount, 0);
    return { ...p, expenses: projectExpenses, invoiced: projectInvoiced, collected: projectPaid, remaining: p.budget - projectExpenses };
  });

  const expByCategory = expenses.reduce<Record<string, number>>((acc, e) => ({ ...acc, [e.category]: (acc[e.category] || 0) + e.amount }), {});
  const categoryData = Object.entries(expByCategory).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  const projectBudgetData = projects.filter((p) => !['lead', 'on_hold'].includes(p.status)).map((p) => {
    const spent = expenses.filter((e) => e.projectId === p.id).reduce((s, e) => s + e.amount, 0);
    return { name: p.name.split(' — ')[0].split(' ').slice(0, 2).join(' '), budget: Math.round(p.budget / 100000), spent: Math.round(spent / 100000) };
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Finances</h1>
          <p className="text-sm text-gray-500">Financial overview across all projects</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Project Value', value: formatCurrency(totalProjectValue), icon: <DollarSign className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Total Collected', value: formatCurrency(totalCollected), icon: <TrendingUp className="h-5 w-5 text-green-600" />, bg: 'bg-green-50' },
          { label: 'Outstanding', value: formatCurrency(outstanding), icon: <CreditCard className="h-5 w-5 text-orange-600" />, bg: 'bg-orange-50' },
          { label: 'Total Expenses', value: formatCurrency(totalExpenses), icon: <TrendingDown className="h-5 w-5 text-red-500" />, bg: 'bg-red-50' },
        ].map(({ label, value, icon, bg }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
              <div><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-bold text-gray-900 mt-0.5">{value}</p></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Budget vs spent */}
        <Card>
          <CardHeader><CardTitle>Budget vs Spent (₹L)</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={projectBudgetData} margin={{ left: -10, right: 0, top: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip formatter={(v: unknown) => `₹${Number(v)}L`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="budget" name="Budget" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Spent" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense by category */}
        <Card>
          <CardHeader><CardTitle>Expenses by Category</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="40%" cy="50%" outerRadius={75} dataKey="value" labelLine={false}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[entry.name.toLowerCase()] || '#94A3B8'} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: unknown) => formatCurrency(Number(v))} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend iconSize={8} iconType="circle" formatter={(v) => <span style={{ fontSize: 10, color: '#6B7280' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Per-project breakdown */}
      <Card>
        <CardHeader><CardTitle>Project Financial Breakdown</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Expenses</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoiced</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Collected</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {projectFinancials.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-gray-900">{p.name.split(' — ')[0]}</p>
                      <p className="text-xs text-gray-400 capitalize">{p.status.replace('_', ' ')}</p>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-gray-700">{formatCurrency(p.budget)}</td>
                    <td className="py-3 px-4 text-right text-sm text-orange-600 font-medium">{formatCurrency(p.expenses)}</td>
                    <td className="py-3 px-4 text-right text-sm text-blue-600">{formatCurrency(p.invoiced)}</td>
                    <td className="py-3 px-4 text-right text-sm text-green-600 font-medium">{formatCurrency(p.collected)}</td>
                    <td className="py-3 px-4 w-32">
                      <Progress value={Math.min(100, (p.expenses / p.budget) * 100)} showLabel />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
