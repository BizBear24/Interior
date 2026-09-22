import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import {
  formatCurrency, formatDate, isOverdue, calcProjectHealth,
  PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS,
} from '../utils';
import {
  FolderOpen, AlertTriangle, DollarSign, CreditCard, Clock,
  Package, CheckSquare, ArrowRight, Milestone,
} from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';

export function Dashboard() {
  const navigate = useNavigate();
  const store = useStore();
  const { projects, tasks, milestones, invoices, payments, expenses, snags,
    purchaseRequests, quickUpdates, users } = store;

  // Key metrics
  const activeProjects = projects.filter((p) => !['completed', 'on_hold', 'lead'].includes(p.status));
  const atRiskProjects = projects.filter((p) => {
    const health = calcProjectHealth(p.id, tasks, milestones, expenses, snags, p);
    return health.overall < 60 && !['completed', 'on_hold'].includes(p.status);
  });
  const totalProjectValue = projects.reduce((sum, p) => sum + p.budget, 0);

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstanding = totalInvoiced - totalPaid;

  const pendingApprovals = purchaseRequests.filter((pr) => pr.status === 'pending_approval').length;
  const pendingProcurement = purchaseRequests.filter((pr) => ['draft', 'pending_approval', 'approved'].includes(pr.status)).length;
  const openSnags = snags.filter((s) => ['open', 'in_progress'].includes(s.status)).length;
  const criticalSnags = snags.filter((s) => s.severity === 'critical' && s.status !== 'verified').length;

  const thisWeekTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'done') return false;
    const due = new Date(t.dueDate);
    const today = new Date();
    const nextWeek = addDays(today, 7);
    return due >= today && due <= nextWeek;
  });

  const upcomingMilestones = milestones.filter((m) => {
    if (m.status === 'completed') return false;
    const due = new Date(m.dueDate);
    const today = new Date();
    const nextMonth = addDays(today, 30);
    return due >= today && due <= nextMonth;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 4);

  // Project progress chart data
  const projectProgressData = activeProjects.map((p) => ({
    name: p.name.split(' — ')[0].split(' ').slice(0, 2).join(' '),
    progress: p.progress,
    budget: Math.round(p.budget / 100000),
  }));

  // Budget vs actual data
  const budgetVsActual = activeProjects.map((p) => {
    const spent = expenses.filter((e) => e.projectId === p.id).reduce((sum, e) => sum + e.amount, 0);
    return {
      name: p.name.split(' — ')[0].split(' ').slice(0, 2).join(' '),
      budget: Math.round(p.budget / 100000),
      actual: Math.round(spent / 100000),
    };
  });

  // Payment collection trend (last 6 months mock)
  const paymentTrend = Array.from({ length: 6 }, (_, i) => ({
    month: format(subDays(new Date(), (5 - i) * 30), 'MMM'),
    collected: Math.round((totalPaid / 6) * (0.5 + Math.random() * 0.5) / 100000),
    invoiced: Math.round((totalInvoiced / 6) * (0.5 + Math.random() * 0.5) / 100000),
  }));

  // Task status distribution
  const taskStatusData = [
    { name: 'To Do', value: tasks.filter((t) => t.status === 'todo').length, color: '#94A3B8' },
    { name: 'In Progress', value: tasks.filter((t) => t.status === 'in_progress').length, color: '#3B82F6' },
    { name: 'Blocked', value: tasks.filter((t) => t.status === 'blocked').length, color: '#EF4444' },
    { name: 'Review', value: tasks.filter((t) => t.status === 'review').length, color: '#F59E0B' },
    { name: 'Done', value: tasks.filter((t) => t.status === 'done').length, color: '#10B981' },
  ].filter((d) => d.value > 0);

  // Overdue invoices
  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue' || (inv.status !== 'paid' && isOverdue(inv.dueDate)));

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Studio Forma Interiors · {format(new Date(), 'EEEE, d MMMM yyyy')}</p>
        </div>
        <Button size="sm" onClick={() => navigate('/projects')} leftIcon={<FolderOpen className="h-4 w-4" />}>
          View All Projects
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={<FolderOpen className="h-5 w-5 text-blue-600" />} label="Active Projects" value={activeProjects.length.toString()} sub={`${atRiskProjects.length} at risk`} subColor={atRiskProjects.length > 0 ? 'text-red-500' : 'text-gray-400'} onClick={() => navigate('/projects')} bg="bg-blue-50" />
        <KPICard icon={<DollarSign className="h-5 w-5 text-emerald-600" />} label="Total Project Value" value={formatCurrency(totalProjectValue)} sub={`${projects.length} total projects`} onClick={() => navigate('/finances')} bg="bg-emerald-50" />
        <KPICard icon={<CreditCard className="h-5 w-5 text-orange-600" />} label="Outstanding" value={formatCurrency(outstanding)} sub={`${overdueInvoices.length} overdue invoices`} subColor={overdueInvoices.length > 0 ? 'text-red-500' : 'text-gray-400'} onClick={() => navigate('/invoices')} bg="bg-orange-50" />
        <KPICard icon={<AlertTriangle className="h-5 w-5 text-red-500" />} label="Open Snags" value={openSnags.toString()} sub={`${criticalSnags} critical`} subColor={criticalSnags > 0 ? 'text-red-500' : 'text-gray-400'} onClick={() => navigate('/snags')} bg="bg-red-50" />
        <KPICard icon={<Clock className="h-5 w-5 text-yellow-600" />} label="Pending Approvals" value={pendingApprovals.toString()} sub="Purchase requests" onClick={() => navigate('/purchase-requests')} bg="bg-yellow-50" />
        <KPICard icon={<Package className="h-5 w-5 text-purple-600" />} label="Pending Procurement" value={pendingProcurement.toString()} sub="Items awaiting action" onClick={() => navigate('/purchase-requests')} bg="bg-purple-50" />
        <KPICard icon={<CheckSquare className="h-5 w-5 text-teal-600" />} label="Tasks This Week" value={thisWeekTasks.length.toString()} sub="Due in 7 days" onClick={() => navigate('/tasks')} bg="bg-teal-50" />
        <KPICard icon={<Milestone className="h-5 w-5 text-indigo-600" />} label="Upcoming Milestones" value={upcomingMilestones.length.toString()} sub="Next 30 days" onClick={() => navigate('/milestones')} bg="bg-indigo-50" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Project Progress */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={projectProgressData} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[0, 100]} unit="%" />
                <Tooltip formatter={(v: unknown) => `${v as number}%` as unknown as string} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                <Bar dataKey="progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget vs Actual */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Budget vs Actual (₹L)</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={budgetVsActual} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} formatter={(v: unknown) => `₹${Number(v)}L`} />
                <Bar dataKey="budget" fill="#E2E8F0" name="Budget" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#3B82F6" name="Actual" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={taskStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                  {taskStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend iconSize={8} iconType="circle" formatter={(v: string) => <span style={{ fontSize: 10, color: '#94A3B8' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Projects Health */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Project Health</CardTitle>
              <button onClick={() => navigate('/projects')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                All projects <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {activeProjects.slice(0, 5).map((project) => {
              const client = store.clients.find((c) => c.id === project.clientId);
              const health = calcProjectHealth(project.id, tasks, milestones, expenses, snags, project);
              const healthColor = health.overall >= 70 ? 'text-green-600' : health.overall >= 40 ? 'text-yellow-600' : 'text-red-600';
              const healthBg = health.overall >= 70 ? 'bg-green-50' : health.overall >= 40 ? 'bg-yellow-50' : 'bg-red-50';

              return (
                <div
                  key={project.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 truncate">{project.name}</span>
                      <Badge className={PROJECT_STATUS_COLORS[project.status]}>
                        {PROJECT_STATUS_LABELS[project.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{client?.name}</span>
                      <span>·</span>
                      <span>{formatCurrency(project.budget)}</span>
                      <span>·</span>
                      <span>Due {formatDate(project.targetCompletion)}</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={project.progress} showLabel size="sm" />
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {(['schedule', 'budget', 'procurement', 'site'] as const).map((key) => {
                      const status = health[key];
                      const color = status === 'Healthy' ? 'bg-green-100 text-green-700' : status === 'Watch' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
                      return (
                        <div key={key} className="text-center">
                          <div className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md ${color}`}>{key[0].toUpperCase()}</div>
                        </div>
                      );
                    })}
                    <div className={`ml-1 px-2 py-0.5 rounded-md text-xs font-bold ${healthBg} ${healthColor}`}>
                      {health.overall}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-4">
          {/* Upcoming Milestones */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Milestones</CardTitle>
                <button onClick={() => navigate('/milestones')} className="text-xs text-blue-600 hover:underline">View all</button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {upcomingMilestones.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">No upcoming milestones</p>
              ) : upcomingMilestones.map((m) => {
                const project = projects.find((p) => p.id === m.projectId);
                const overdue = isOverdue(m.dueDate);
                return (
                  <div key={m.id} className="flex items-start gap-3">
                    <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${overdue ? 'bg-red-100' : 'bg-blue-50'}`}>
                      <Milestone className={`h-3 w-3 ${overdue ? 'text-red-500' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{m.title}</p>
                      <p className="text-[10px] text-gray-500 truncate">{project?.name}</p>
                      <p className={`text-[10px] font-medium mt-0.5 ${overdue ? 'text-red-500' : 'text-gray-500'}`}>
                        {overdue ? 'OVERDUE · ' : ''}{formatDate(m.dueDate)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Updates</CardTitle>
                <button onClick={() => navigate('/updates')} className="text-xs text-blue-600 hover:underline">View all</button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {quickUpdates.slice(0, 4).map((update) => {
                const author = users.find((u) => u.id === update.authorId);
                const project = projects.find((p) => p.id === update.projectId);
                return (
                  <div key={update.id} className="flex items-start gap-2.5">
                    <Avatar name={author?.name || '?'} size="xs" className="shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{update.text}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {project && <span className="text-[10px] text-gray-400">{project.name.split(' — ')[0]}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Collection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment Collection</CardTitle>
              <button onClick={() => navigate('/payments')} className="text-xs text-blue-600 hover:underline">Manage</button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Total Invoiced</p>
                <p className="text-base font-bold text-gray-900">{formatCurrency(totalInvoiced)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Collected</p>
                <p className="text-base font-bold text-green-600">{formatCurrency(totalPaid)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Outstanding</p>
                <p className="text-base font-bold text-orange-600">{formatCurrency(outstanding)}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={paymentTrend} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: unknown) => `₹${Number(v)}L`} />
                <Area type="monotone" dataKey="invoiced" stroke="#E2E8F0" fill="#F1F5F9" strokeWidth={1.5} name="Invoiced" />
                <Area type="monotone" dataKey="collected" stroke="#10B981" fill="#D1FAE5" strokeWidth={1.5} name="Collected" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Overdue invoices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Overdue Invoices</CardTitle>
              <button onClick={() => navigate('/invoices')} className="text-xs text-blue-600 hover:underline">All invoices</button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {overdueInvoices.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-gray-400">No overdue invoices</p>
              </div>
            ) : (
              <div className="space-y-2">
                {overdueInvoices.slice(0, 5).map((inv) => {
                  const client = store.clients.find((c) => c.id === inv.clientId);
                  const project = projects.find((p) => p.id === inv.projectId);
                  return (
                    <div key={inv.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-xs font-medium text-gray-900">{inv.invoiceNumber}</p>
                        <p className="text-[10px] text-gray-500">{client?.name} · {project?.name.split(' — ')[0]}</p>
                        <p className="text-[10px] text-red-500">Due {formatDate(inv.dueDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(inv.total)}</p>
                        <Badge className="bg-red-50 text-red-700 mt-1">Overdue</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, sub, subColor = 'text-gray-400', onClick, bg }: {
  icon: React.ReactNode; label: string; value: string; sub: string; subColor?: string; onClick?: () => void; bg?: string;
}) {
  return (
    <Card hoverable onClick={onClick} className="p-4">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${bg || 'bg-gray-100'}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5 leading-tight">{value}</p>
          <p className={`text-[10px] mt-0.5 ${subColor}`}>{sub}</p>
        </div>
      </div>
    </Card>
  );
}
