import { useState } from 'react';
import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Avatar } from '../components/ui/Avatar';
import { Progress } from '../components/ui/Progress';
import { Textarea } from '../components/ui/Textarea';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { ConfirmDialog } from '../components/ui/Modal';
import {
  formatDate, isOverdue, TASK_STATUS_COLORS, TASK_STATUS_LABELS,
  PRIORITY_COLORS, generateId,
} from '../utils';
import {
  Plus, Search, CheckSquare, List, Columns, Trash2,
  Edit2, ChevronDown, ChevronRight, CheckCircle,
} from 'lucide-react';
import type { Task, TaskStatus, TaskPriority } from '../types';

const STATUS_COLS: TaskStatus[] = ['todo', 'in_progress', 'blocked', 'review', 'done'];

export function Tasks() {
  const toast = useToast();
  const { tasks, projects, users, addTask, updateTask, deleteTask, currentUserId } = useStore();
  const [view, setView] = useState<'list' | 'kanban' | 'mine'>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = tasks.filter((t) => {
    if (view === 'mine' && t.assigneeId !== currentUserId) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (projectFilter && t.projectId !== projectFilter) return false;
    return true;
  });

  const handleSave = (data: Partial<Task>) => {
    if (editTask) {
      updateTask(editTask.id, { ...data, updatedAt: new Date().toISOString() });
      toast.success('Task updated');
    } else {
      addTask({
        ...data,
        id: generateId('t'),
        subtasks: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Task);
      toast.success('Task created');
    }
    setShowModal(false);
    setEditTask(null);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} tasks shown</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {([['list', List], ['kanban', Columns], ['mine', CheckSquare]] as const).map(([v, Icon]) => (
              <button key={v} onClick={() => setView(v)} className={`p-1.5 rounded-md transition-colors ${view === v ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <Button leftIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => { setEditTask(null); setShowModal(true); }}>New Task</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <Input placeholder="Search tasks…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-3.5 w-3.5" />} className="w-56" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: '', label: 'All Statuses' }, ...STATUS_COLS.map((s) => ({ value: s, label: TASK_STATUS_LABELS[s] }))]} className="w-36" />
        <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} options={[{ value: '', label: 'All Projects' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} className="w-44" />
      </div>

      {/* List View */}
      {(view === 'list' || view === 'mine') && (
        <div className="space-y-1.5">
          {filtered.length === 0 ? (
            <EmptyState icon={<CheckSquare className="h-12 w-12" />} title="No tasks found" description="Create a task or adjust filters" action={<Button size="sm" onClick={() => setShowModal(true)}>Create Task</Button>} />
          ) : filtered.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            const assignee = users.find((u) => u.id === task.assigneeId);
            const isExpanded = expandedTask === task.id;
            const overdueTask = task.status !== 'done' && isOverdue(task.dueDate);

            return (
              <div key={task.id} className={`bg-white border rounded-lg transition-all ${overdueTask ? 'border-red-100 bg-red-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={() => setExpandedTask(isExpanded ? null : task.id)}>
                  <button
                    className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${task.status === 'done' ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-blue-400'}`}
                    onClick={(e) => { e.stopPropagation(); updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done', updatedAt: new Date().toISOString() }); }}
                  >
                    {task.status === 'done' && <CheckCircle className="h-3 w-3 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</span>
                    {task.subtasks.length > 0 && (
                      <div className="flex items-center gap-2 mt-0.5">
                        <Progress value={(task.subtasks.filter((s) => s.status === 'done').length / task.subtasks.length) * 100} className="w-20" />
                        <span className="text-[10px] text-gray-400">{task.subtasks.filter((s) => s.status === 'done').length}/{task.subtasks.length}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {project && <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[100px]">{project.name.split(' — ')[0]}</span>}
                    {task.dueDate && <span className={`text-xs ${overdueTask ? 'text-red-500 font-medium' : 'text-gray-400'}`}>{formatDate(task.dueDate)}</span>}
                    {assignee && <Avatar name={assignee.name} size="xs" />}
                    <Badge className={TASK_STATUS_COLORS[task.status]}>{TASK_STATUS_LABELS[task.status]}</Badge>
                    <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
                    <button className="p-1 hover:bg-gray-100 rounded" onClick={(e) => { e.stopPropagation(); setEditTask(task); setShowModal(true); }}>
                      <Edit2 className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-red-50 rounded" onClick={(e) => { e.stopPropagation(); setDeleteId(task.id); }}>
                      <Trash2 className="h-3.5 w-3.5 text-gray-300 hover:text-red-500" />
                    </button>
                    {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-gray-400" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
                  </div>
                </div>
                {isExpanded && task.subtasks.length > 0 && (
                  <div className="px-10 pb-3 space-y-1.5">
                    {task.subtasks.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-2.5">
                        <div className={`h-3 w-3 rounded border flex items-center justify-center ${sub.status === 'done' ? 'bg-green-400 border-green-400' : 'border-gray-300'}`}>
                          {sub.status === 'done' && <CheckCircle className="h-2 w-2 text-white" />}
                        </div>
                        <span className={`text-xs ${sub.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700'}`}>{sub.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_COLS.map((status) => {
            const colTasks = filtered.filter((t) => t.status === status);
            return (
              <div key={status} className="min-w-64 w-64 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${status === 'done' ? 'bg-green-400' : status === 'in_progress' ? 'bg-blue-400' : status === 'blocked' ? 'bg-red-400' : status === 'review' ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                    <span className="text-sm font-semibold text-gray-700">{TASK_STATUS_LABELS[status]}</span>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {colTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    const assignee = users.find((u) => u.id === task.assigneeId);
                    return (
                      <div key={task.id} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow cursor-pointer" onClick={() => { setEditTask(task); setShowModal(true); }}>
                        <p className="text-sm font-medium text-gray-900 mb-2">{task.title}</p>
                        {project && <p className="text-[10px] text-gray-400 mb-2">{project.name.split(' — ')[0]}</p>}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
                            {task.dueDate && <span className={`text-[10px] ${isOverdue(task.dueDate) && status !== 'done' ? 'text-red-500' : 'text-gray-400'}`}>{formatDate(task.dueDate)}</span>}
                          </div>
                          {assignee && <Avatar name={assignee.name} size="xs" />}
                        </div>
                      </div>
                    );
                  })}
                  <button
                    className="w-full py-2 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 border border-dashed border-gray-200 rounded-lg transition-colors"
                    onClick={() => { setEditTask(null); setShowModal(true); }}
                  >
                    + Add task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal open={showModal} onClose={() => { setShowModal(false); setEditTask(null); }} task={editTask} onSave={handleSave} />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteTask(deleteId!); toast.success('Task deleted'); }}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}

function TaskModal({ open, onClose, task, onSave }: { open: boolean; onClose: () => void; task: Task | null; onSave: (data: Partial<Task>) => void }) {
  const { projects, users } = useStore();
  const [form, setForm] = useState<Partial<Task>>(task || { title: '', status: 'todo', priority: 'medium', description: '' });
  const set = (k: keyof Task, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.title?.trim()) return;
    onSave(form);
  };

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit Task' : 'New Task'} size="lg"
      footer={<><Button variant="outline" size="sm" onClick={onClose}>Cancel</Button><Button size="sm" onClick={handleSave}>{task ? 'Update' : 'Create'}</Button></>}
    >
      <div className="space-y-3">
        <Input label="Task Title *" value={form.title || ''} onChange={(e) => set('title', e.target.value)} placeholder="Enter task title…" />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Project" value={form.projectId || ''} onChange={(e) => set('projectId', e.target.value)} options={[{ value: '', label: 'No project' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} />
          <Select label="Assignee" value={form.assigneeId || ''} onChange={(e) => set('assigneeId', e.target.value)} options={[{ value: '', label: 'Unassigned' }, ...users.map((u) => ({ value: u.id, label: u.name }))]} />
          <Select label="Status" value={form.status || 'todo'} onChange={(e) => set('status', e.target.value as TaskStatus)} options={STATUS_COLS.map((s) => ({ value: s, label: TASK_STATUS_LABELS[s] }))} />
          <Select label="Priority" value={form.priority || 'medium'} onChange={(e) => set('priority', e.target.value as TaskPriority)} options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' }]} />
          <Input label="Due Date" type="date" value={form.dueDate?.split('T')[0] || ''} onChange={(e) => set('dueDate', e.target.value)} />
          <Input label="Estimated Hours" type="number" value={form.estimatedHours || ''} onChange={(e) => set('estimatedHours', Number(e.target.value))} />
        </div>
        <Textarea label="Description" value={form.description || ''} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Optional task description…" />
      </div>
    </Modal>
  );
}
