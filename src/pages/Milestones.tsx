import { useState } from 'react';
import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { formatDate, isOverdue, generateId } from '../utils';
import { Plus, Target, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Milestone } from '../types';

export function Milestones() {
  const toast = useToast();
  const { milestones, projects, addMilestone, updateMilestone } = useStore();
  const [projectFilter, setProjectFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMilestone, setEditMilestone] = useState<Milestone | null>(null);

  const filtered = milestones.filter((m) => !projectFilter || m.projectId === projectFilter);
  const grouped = projects.reduce<Record<string, Milestone[]>>((acc, p) => {
    const ms = filtered.filter((m) => m.projectId === p.id);
    if (ms.length > 0) acc[p.id] = ms;
    return acc;
  }, {});

  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const overdueCount = milestones.filter((m) => m.status !== 'completed' && isOverdue(m.dueDate)).length;

  const handleSave = (data: Partial<Milestone>) => {
    if (editMilestone) {
      updateMilestone(editMilestone.id, data);
      toast.success('Milestone updated');
    } else {
      addMilestone({ ...data, id: generateId('m'), taskIds: [], order: 99 } as Milestone);
      toast.success('Milestone created');
    }
    setShowModal(false);
    setEditMilestone(null);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Milestones</h1>
          <p className="text-sm text-gray-500 mt-0.5">{milestones.length} total · {completedCount} completed · {overdueCount} overdue</p>
        </div>
        <div className="flex items-center gap-2">
          <Select options={[{ value: '', label: 'All Projects' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="w-48" />
          <Button leftIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => { setEditMilestone(null); setShowModal(true); }}>New Milestone</Button>
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <EmptyState icon={<Target className="h-12 w-12" />} title="No milestones" description="Create milestones to track project progress" action={<Button size="sm" onClick={() => setShowModal(true)}>Create Milestone</Button>} />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([projectId, projectMilestones]) => {
            const project = projects.find((p) => p.id === projectId);
            const sorted = [...projectMilestones].sort((a, b) => a.order - b.order);
            return (
              <div key={projectId}>
                <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  {project?.name}
                </h2>
                <div className="relative pl-6">
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
                  {sorted.map((m) => {
                    const overdue = isOverdue(m.dueDate) && m.status !== 'completed';
                    const Icon = m.status === 'completed' ? CheckCircle : overdue ? XCircle : Clock;
                    const bg = m.status === 'completed' ? 'bg-green-50 border-green-100' : overdue ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100';
                    return (
                      <div key={m.id} className={`relative mb-3 p-4 rounded-xl border ${bg} hover:shadow-sm transition-all cursor-pointer`} onClick={() => { setEditMilestone(m); setShowModal(true); }}>
                        <div className={`absolute -left-[18px] top-4 h-5 w-5 rounded-full bg-white border-2 flex items-center justify-center ${m.status === 'completed' ? 'border-green-400' : overdue ? 'border-red-400' : 'border-gray-300'}`}>
                          <Icon className={`h-3 w-3 ${m.status === 'completed' ? 'text-green-500' : overdue ? 'text-red-500' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">{m.title}</h3>
                            {m.description && <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>}
                            <p className={`text-xs mt-1.5 font-medium ${overdue ? 'text-red-600' : 'text-gray-500'}`}>
                              {m.status === 'completed' ? `Completed ${formatDate(m.completedAt!)}` : `Due ${formatDate(m.dueDate)}`}
                              {overdue && ' · OVERDUE'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {m.status !== 'completed' && (
                              <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={(e) => { e.stopPropagation(); updateMilestone(m.id, { status: 'completed', completedAt: new Date().toISOString() }); toast.success('Milestone completed'); }}>
                                Complete
                              </Button>
                            )}
                            <Badge className={m.status === 'completed' ? 'bg-green-50 text-green-700' : overdue ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}>
                              {m.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MilestoneModal open={showModal} onClose={() => { setShowModal(false); setEditMilestone(null); }} milestone={editMilestone} onSave={handleSave} />
    </div>
  );
}

function MilestoneModal({ open, onClose, milestone, onSave }: { open: boolean; onClose: () => void; milestone: Milestone | null; onSave: (d: Partial<Milestone>) => void }) {
  const { projects } = useStore();
  const [form, setForm] = useState<Partial<Milestone>>(milestone || { title: '', status: 'pending', dueDate: '' });
  const set = (k: keyof Milestone, v: any) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <Modal open={open} onClose={onClose} title={milestone ? 'Edit Milestone' : 'New Milestone'} size="md"
      footer={<><Button variant="outline" size="sm" onClick={onClose}>Cancel</Button><Button size="sm" onClick={() => { if (form.title?.trim()) onSave(form); }}>Save</Button></>}
    >
      <div className="space-y-3">
        <Input label="Title *" value={form.title || ''} onChange={(e) => set('title', e.target.value)} />
        <Select label="Project" value={form.projectId || ''} onChange={(e) => set('projectId', e.target.value)} options={[{ value: '', label: 'Select project' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Due Date *" type="date" value={form.dueDate?.split('T')[0] || ''} onChange={(e) => set('dueDate', e.target.value)} />
          <Select label="Status" value={form.status || 'pending'} onChange={(e) => set('status', e.target.value as any)} options={[{ value: 'pending', label: 'Pending' }, { value: 'in_progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }]} />
        </div>
        <Textarea label="Description" value={form.description || ''} onChange={(e) => set('description', e.target.value)} rows={2} />
      </div>
    </Modal>
  );
}
