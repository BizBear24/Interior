import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import {
  formatCurrency, formatDate, isOverdue, PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS,
  TASK_STATUS_COLORS, TASK_STATUS_LABELS, SNAG_SEVERITY_COLORS, calcProjectHealth,
} from '../utils';
import {
  ArrowLeft, Edit2, MapPin, Calendar, DollarSign, Users, AlertTriangle,
  CheckSquare, Milestone as MilestoneIcon, BarChart2,
  CheckCircle, XCircle, Plus,
} from 'lucide-react';

const TABS = ['Overview', 'Tasks', 'Milestones', 'Budget', 'Procurement', 'Snags', 'Team', 'Notes'];

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const store = useStore();
  const { projects, clients, users, tasks, milestones, expenses, snags, invoices, payments, purchaseRequests, notes } = store;

  const [activeTab, setActiveTab] = useState('Overview');
  const [showHealthModal, setShowHealthModal] = useState(false);

  const project = projects.find((p) => p.id === id);
  if (!project) return (
    <div className="p-6">
      <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/projects')}>Back</Button>
      <p className="mt-4 text-gray-500">Project not found.</p>
    </div>
  );

  const client = clients.find((c) => c.id === project.clientId);
  const pm = users.find((u) => u.id === project.projectManagerId);
  const team = users.filter((u) => project.teamIds.includes(u.id));
  const projectTasks = tasks.filter((t) => t.projectId === id);
  const projectMilestones = milestones.filter((m) => m.projectId === id).sort((a, b) => a.order - b.order);
  const projectExpenses = expenses.filter((e) => e.projectId === id);
  const projectSnags = snags.filter((s) => s.projectId === id);
  const projectInvoices = invoices.filter((i) => i.projectId === id);
  const projectPayments = payments.filter((p) => projectInvoices.some((inv) => inv.id === p.invoiceId));
  const projectPRs = purchaseRequests.filter((pr) => pr.projectId === id);
  const projectNotes = notes.filter((n) => n.projectId === id);
  const health = calcProjectHealth(id!, tasks, milestones, projectExpenses, snags, project);
  const totalExpenses = projectExpenses.reduce((s, e) => s + e.amount, 0);
  const totalPaid = projectPayments.reduce((s, p) => s + p.amount, 0);
  const totalInvoiced = projectInvoices.reduce((s, i) => s + i.total, 0);

  const doneTasks = projectTasks.filter((t) => t.status === 'done').length;
  const openSnags = projectSnags.filter((s) => ['open', 'in_progress'].includes(s.status)).length;

  return (
    <div className="flex flex-col h-full">
      {/* Project header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3 mb-3">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/projects')}>
            Projects
          </Button>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={PROJECT_STATUS_COLORS[project.status]}>{PROJECT_STATUS_LABELS[project.status]}</Badge>
              <Badge className="bg-gray-100 text-gray-600">{project.projectType}</Badge>
              <Badge className="bg-orange-50 text-orange-700">{project.priority} priority</Badge>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{client?.name}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{project.location}</span>
              <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />{formatCurrency(project.budget)}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Target: {formatDate(project.targetCompletion)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" leftIcon={<BarChart2 className="h-4 w-4" />} onClick={() => setShowHealthModal(true)}>
              Health {health.overall}
            </Button>
            <Button size="sm" leftIcon={<Edit2 className="h-4 w-4" />} onClick={() => navigate('/projects')}>
              Edit
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 max-w-lg">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>Overall Progress</span>
            <span className="font-semibold text-gray-700">{project.progress}%</span>
          </div>
          <Progress value={project.progress} size="md" />
        </div>

        {/* Quick stats */}
        <div className="flex gap-6 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><CheckSquare className="h-3.5 w-3.5 text-blue-500" />{doneTasks}/{projectTasks.length} tasks</span>
          <span className="flex items-center gap-1.5"><MilestoneIcon className="h-3.5 w-3.5 text-purple-500" />{projectMilestones.filter((m) => m.status === 'completed').length}/{projectMilestones.length} milestones</span>
          <span className="flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5 text-orange-500" />{openSnags} open snags</span>
          <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-green-500" />{formatCurrency(totalPaid)} collected</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 -mb-4 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Health cards */}
            <div className="space-y-3">
              {([['Schedule', health.schedule], ['Budget', health.budget], ['Procurement', health.procurement], ['Site Issues', health.site]] as [string, string][]).map(([label, status]) => {
                const color = status === 'Healthy' ? 'text-green-600 bg-green-50 border-green-100' : status === 'Watch' ? 'text-yellow-600 bg-yellow-50 border-yellow-100' : 'text-red-600 bg-red-50 border-red-100';
                const Icon = status === 'Healthy' ? CheckCircle : status === 'Watch' ? AlertTriangle : XCircle;
                return (
                  <div key={label} className={`flex items-center justify-between p-3 rounded-lg border ${color}`}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <span className="text-xs font-semibold">{status}</span>
                  </div>
                );
              })}
            </div>

            {/* Recent tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Tasks</CardTitle>
                  <button onClick={() => setActiveTab('Tasks')} className="text-xs text-blue-600 hover:underline">View all</button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {projectTasks.slice(0, 5).map((task) => {
                  const assignee = users.find((u) => u.id === task.assigneeId);
                  return (
                    <div key={task.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{task.title}</p>
                        {task.dueDate && <p className={`text-[10px] ${isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-500' : 'text-gray-400'}`}>Due {formatDate(task.dueDate)}</p>}
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {assignee && <Avatar name={assignee.name} size="xs" />}
                        <Badge className={TASK_STATUS_COLORS[task.status]}>{TASK_STATUS_LABELS[task.status]}</Badge>
                      </div>
                    </div>
                  );
                })}
                {projectTasks.length === 0 && <p className="text-xs text-gray-400 py-4 text-center">No tasks yet</p>}
              </CardContent>
            </Card>

            {/* Financial summary */}
            <Card>
              <CardHeader><CardTitle>Financial Summary</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-3">
                {[
                  { label: 'Budget', value: project.budget, color: 'text-gray-900' },
                  { label: 'Expenses', value: totalExpenses, color: 'text-orange-600' },
                  { label: 'Invoiced', value: totalInvoiced, color: 'text-blue-600' },
                  { label: 'Collected', value: totalPaid, color: 'text-green-600' },
                  { label: 'Outstanding', value: totalInvoiced - totalPaid, color: 'text-red-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className={`text-sm font-semibold ${color}`}>{formatCurrency(value)}</span>
                  </div>
                ))}
                <Progress value={Math.min(100, (totalExpenses / project.budget) * 100)} className="mt-2" showLabel />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'Tasks' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">{projectTasks.length} Tasks</h2>
              <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => toast.info('Open Tasks page to create a task')}>Add Task</Button>
            </div>
            {projectTasks.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No tasks yet. Create some in the Tasks module.</div>
            ) : projectTasks.map((task) => {
              const assignee = users.find((u) => u.id === task.assigneeId);
              return (
                <div key={task.id} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200">
                  <div className={`h-2 w-2 rounded-full shrink-0 ${task.status === 'done' ? 'bg-green-400' : task.status === 'blocked' ? 'bg-red-400' : task.status === 'in_progress' ? 'bg-blue-400' : 'bg-gray-200'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</p>
                    {task.subtasks.length > 0 && <p className="text-xs text-gray-400 mt-0.5">{task.subtasks.filter((s) => s.status === 'done').length}/{task.subtasks.length} subtasks</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {task.dueDate && <span className={`text-xs ${isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-500 font-medium' : 'text-gray-400'}`}>{formatDate(task.dueDate)}</span>}
                    {assignee && <Avatar name={assignee.name} size="xs" />}
                    <Badge className={TASK_STATUS_COLORS[task.status]}>{TASK_STATUS_LABELS[task.status]}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'Milestones' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">{projectMilestones.length} Milestones</h2>
              <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => toast.info('Open Milestones page to create milestones')}>Add Milestone</Button>
            </div>
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
              {projectMilestones.map((m) => {
                const overdue = isOverdue(m.dueDate) && m.status !== 'completed';
                const bgColor = m.status === 'completed' ? 'bg-green-50 border-green-100' : overdue ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100';
                return (
                  <div key={m.id} className={`relative mb-4 p-4 rounded-lg border ${bgColor}`}>
                    <div className={`absolute -left-[18px] top-4 h-5 w-5 rounded-full bg-white border-2 flex items-center justify-center ${m.status === 'completed' ? 'border-green-400' : overdue ? 'border-red-400' : 'border-gray-300'}`}>
                      <div className={`h-2 w-2 rounded-full ${m.status === 'completed' ? 'bg-green-400' : overdue ? 'bg-red-400' : 'bg-gray-300'}`} />
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{m.title}</p>
                        {m.description && <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>}
                        <p className={`text-xs mt-1.5 font-medium ${overdue ? 'text-red-600' : 'text-gray-500'}`}>
                          {m.status === 'completed' ? `Completed ${formatDate(m.completedAt!)}` : `Due ${formatDate(m.dueDate)}`}
                          {overdue && ' · OVERDUE'}
                        </p>
                      </div>
                      <Badge className={m.status === 'completed' ? 'bg-green-50 text-green-700' : overdue ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}>
                        {m.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'Budget' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Budget Overview</CardTitle></CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Budget Utilization</span>
                      <span className="font-semibold">{totalExpenses > 0 ? Math.round((totalExpenses / project.budget) * 100) : 0}%</span>
                    </div>
                    <Progress value={Math.min(100, (totalExpenses / project.budget) * 100)} size="md" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Total Budget', value: project.budget, color: 'text-gray-900' },
                      { label: 'Expenses', value: totalExpenses, color: 'text-orange-600' },
                      { label: 'Remaining', value: project.budget - totalExpenses, color: project.budget - totalExpenses < 0 ? 'text-red-600' : 'text-green-600' },
                      { label: 'Invoiced', value: totalInvoiced, color: 'text-blue-600' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className={`text-base font-bold mt-0.5 ${color}`}>{formatCurrency(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Expenses by Category</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-2">
                {Object.entries(
                  projectExpenses.reduce((acc, e) => ({ ...acc, [e.category]: (acc[e.category] || 0) + e.amount }), {} as Record<string, number>)
                ).map(([cat, amount]) => (
                  <div key={cat} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-400" />
                      <span className="text-sm capitalize text-gray-700">{cat}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(amount)}</span>
                  </div>
                ))}
                {projectExpenses.length === 0 && <p className="text-xs text-gray-400 py-4 text-center">No expenses yet</p>}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'Procurement' && (
          <div className="space-y-3">
            {projectPRs.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No purchase requests for this project.</div>
            ) : projectPRs.map((pr) => {
              const statusColors: Record<string, string> = { draft: 'bg-gray-100 text-gray-600', pending_approval: 'bg-yellow-50 text-yellow-700', approved: 'bg-blue-50 text-blue-700', ordered: 'bg-purple-50 text-purple-700', received: 'bg-green-50 text-green-700' };
              return (
                <div key={pr.id} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-gray-900">{pr.prNumber}</span>
                      <span className="ml-2 text-xs text-gray-500">Required by {formatDate(pr.requiredBy)}</span>
                    </div>
                    <Badge className={statusColors[pr.status] || 'bg-gray-100 text-gray-600'}>{pr.status.replace('_', ' ')}</Badge>
                  </div>
                  {pr.items.map((item) => (
                    <div key={item.id} className="text-xs text-gray-600 flex justify-between py-0.5">
                      <span>{item.description}</span>
                      <span>{item.quantity} {item.unit}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'Snags' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">{projectSnags.length} Snags</h2>
              <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => toast.info('Open Snags module to create snags')}>Add Snag</Button>
            </div>
            {projectSnags.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No snags for this project.</div>
            ) : projectSnags.map((snag) => {
              const assignee = users.find((u) => u.id === snag.assignedToId);
              return (
                <div key={snag.id} className="p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={SNAG_SEVERITY_COLORS[snag.severity]}>{snag.severity}</Badge>
                        <span className="text-xs text-gray-500">{snag.area}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{snag.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{snag.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={snag.status === 'open' ? 'bg-red-50 text-red-700' : snag.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}>
                        {snag.status.replace('_', ' ')}
                      </Badge>
                      {assignee && <Avatar name={assignee.name} size="xs" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'Team' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[pm, ...team.filter((u) => u.id !== pm?.id)].filter(Boolean).map((member) => (
              member && (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={member.name} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{member.role.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </div>
                  </div>
                </Card>
              )
            ))}
          </div>
        )}

        {activeTab === 'Notes' && (
          <div className="space-y-3">
            {projectNotes.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No notes for this project.</div>
            ) : projectNotes.map((note) => {
              const author = users.find((u) => u.id === note.authorId);
              return (
                <Card key={note.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-gray-100 text-gray-600">{note.type}</Badge>
                        {note.tags?.map((t) => <span key={t} className="text-[10px] text-gray-400">#{t}</span>)}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900">{note.title}</h4>
                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{note.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-50">
                    {author && <><Avatar name={author.name} size="xs" /><span className="text-xs text-gray-400">{author.name} · {formatDate(note.createdAt)}</span></>}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Health Modal */}
      <Modal open={showHealthModal} onClose={() => setShowHealthModal(false)} title={`Project Health — ${project.name}`} size="md">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="text-sm font-medium text-gray-700">Overall Health Score</span>
            <div className={`text-2xl font-bold ${health.overall >= 70 ? 'text-green-600' : health.overall >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>{health.overall}/100</div>
          </div>
          {([['Schedule', health.schedule], ['Budget', health.budget], ['Procurement', health.procurement], ['Site Issues', health.site]] as [string, string][]).map(([label, status]) => {
            const color = status === 'Healthy' ? 'text-green-600 bg-green-50 border-green-100' : status === 'Watch' ? 'text-yellow-700 bg-yellow-50 border-yellow-100' : 'text-red-700 bg-red-50 border-red-100';
            return (
              <div key={label} className={`flex items-center justify-between p-3 rounded-lg border ${color}`}>
                <span className="text-sm font-medium">{label}</span>
                <span className="text-sm font-bold">{status}</span>
              </div>
            );
          })}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 space-y-1">
            <p className="font-medium text-gray-700 mb-2">Score breakdown:</p>
            <p>• Tasks overdue: {tasks.filter((t) => t.projectId === id && t.status !== 'done' && isOverdue(t.dueDate)).length}</p>
            <p>• Milestones overdue: {milestones.filter((m) => m.projectId === id && m.status !== 'completed' && isOverdue(m.dueDate)).length}</p>
            <p>• Open snags: {openSnags}</p>
            <p>• Budget utilization: {totalExpenses > 0 ? Math.round((totalExpenses / project.budget) * 100) : 0}%</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
