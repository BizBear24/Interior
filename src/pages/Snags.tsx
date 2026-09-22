import { useState } from 'react';
import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Textarea } from '../components/ui/Textarea';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { ConfirmDialog } from '../components/ui/Modal';
import { formatDate, isOverdue, SNAG_SEVERITY_COLORS, SNAG_STATUS_COLORS, generateId } from '../utils';
import { Plus, Search, AlertTriangle, Trash2, Edit2 } from 'lucide-react';
import type { Snag, SnagSeverity, SnagStatus } from '../types';

const SEVERITY_OPTS = [{ value: '', label: 'All Severity' }, { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }];
const STATUS_OPTS = [{ value: '', label: 'All Status' }, { value: 'open', label: 'Open' }, { value: 'in_progress', label: 'In Progress' }, { value: 'resolved', label: 'Resolved' }, { value: 'verified', label: 'Verified' }];

export function Snags() {
  const toast = useToast();
  const { snags, projects, users, addSnag, updateSnag, deleteSnag } = useStore();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editSnag, setEditSnag] = useState<Snag | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = snags.filter((s) => {
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.area.toLowerCase().includes(search.toLowerCase())) return false;
    if (severityFilter && s.severity !== severityFilter) return false;
    if (statusFilter && s.status !== statusFilter) return false;
    if (projectFilter && s.projectId !== projectFilter) return false;
    return true;
  });

  const openCount = snags.filter((s) => s.status === 'open').length;
  const inProgressCount = snags.filter((s) => s.status === 'in_progress').length;
  const criticalCount = snags.filter((s) => s.severity === 'critical' && s.status !== 'verified').length;
  const resolvedCount = snags.filter((s) => ['resolved', 'verified'].includes(s.status)).length;

  const handleSave = (data: Partial<Snag>) => {
    if (editSnag) {
      updateSnag(editSnag.id, { ...data, updatedAt: new Date().toISOString() });
      toast.success('Snag updated');
    } else {
      addSnag({ ...data, id: generateId('sn'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Snag);
      toast.success('Snag created');
    }
    setShowModal(false);
    setEditSnag(null);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Snags & Issues</h1>
          <p className="text-sm text-gray-500 mt-0.5">{snags.length} total · {openCount} open</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => { setEditSnag(null); setShowModal(true); }}>Log Snag</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[{ label: 'Open', value: openCount, color: 'text-red-600', bg: 'bg-red-50' }, { label: 'In Progress', value: inProgressCount, color: 'text-yellow-700', bg: 'bg-yellow-50' }, { label: 'Critical', value: criticalCount, color: 'text-red-700', bg: 'bg-red-100' }, { label: 'Resolved', value: resolvedCount, color: 'text-green-700', bg: 'bg-green-50' }].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Input placeholder="Search snags…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-3.5 w-3.5" />} className="w-52" />
        <Select options={SEVERITY_OPTS} value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="w-36" />
        <Select options={STATUS_OPTS} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-36" />
        <Select options={[{ value: '', label: 'All Projects' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="w-44" />
      </div>

      {/* Snag cards */}
      {filtered.length === 0 ? (
        <EmptyState icon={<AlertTriangle className="h-12 w-12" />} title="No snags found" description="All clear! Or adjust your filters." action={<Button size="sm" onClick={() => setShowModal(true)}>Log Snag</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((snag) => {
            const project = projects.find((p) => p.id === snag.projectId);
            const assignee = users.find((u) => u.id === snag.assignedToId);
            const overdueSnag = snag.status !== 'resolved' && snag.status !== 'verified' && isOverdue(snag.dueDate);
            return (
              <div key={snag.id} className={`bg-white border rounded-xl p-4 group hover:shadow-sm transition-all ${snag.severity === 'critical' ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={SNAG_SEVERITY_COLORS[snag.severity]}>{snag.severity}</Badge>
                    <Badge className={SNAG_STATUS_COLORS[snag.status]}>{snag.status.replace('_', ' ')}</Badge>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-gray-100 rounded" onClick={() => { setEditSnag(snag); setShowModal(true); }}><Edit2 className="h-3.5 w-3.5 text-gray-400" /></button>
                    <button className="p-1 hover:bg-red-50 rounded" onClick={() => setDeleteId(snag.id)}><Trash2 className="h-3.5 w-3.5 text-gray-300 hover:text-red-500" /></button>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{snag.title}</h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{snag.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex flex-col gap-0.5">
                    <span>{project?.name.split(' — ')[0]}</span>
                    <span>Area: {snag.area}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {snag.dueDate && <span className={overdueSnag ? 'text-red-500 font-medium' : 'text-gray-400'}>Due {formatDate(snag.dueDate)}</span>}
                    {assignee && <Avatar name={assignee.name} size="xs" />}
                  </div>
                </div>
                {/* Quick status update */}
                {snag.status !== 'verified' && (
                  <div className="flex gap-1.5 mt-3 pt-3 border-t border-gray-50">
                    {snag.status === 'open' && <Button size="sm" variant="outline" className="text-[10px] h-6 px-2 flex-1" onClick={() => updateSnag(snag.id, { status: 'in_progress' })}>Start</Button>}
                    {snag.status === 'in_progress' && <Button size="sm" variant="outline" className="text-[10px] h-6 px-2 flex-1" onClick={() => updateSnag(snag.id, { status: 'resolved', resolvedAt: new Date().toISOString() })}>Resolve</Button>}
                    {snag.status === 'resolved' && <Button size="sm" variant="outline" className="text-[10px] h-6 px-2 flex-1 text-green-600 border-green-200" onClick={() => updateSnag(snag.id, { status: 'verified' })}>Verify</Button>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <SnagModal open={showModal} onClose={() => { setShowModal(false); setEditSnag(null); }} snag={editSnag} onSave={handleSave} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteSnag(deleteId!); toast.success('Snag deleted'); }} title="Delete Snag" message="Delete this snag record?" confirmLabel="Delete" destructive />
    </div>
  );
}

function SnagModal({ open, onClose, snag, onSave }: { open: boolean; onClose: () => void; snag: Snag | null; onSave: (d: Partial<Snag>) => void }) {
  const { projects, users } = useStore();
  const [form, setForm] = useState<Partial<Snag>>(snag || { title: '', area: '', description: '', severity: 'medium', status: 'open' });
  const set = (k: keyof Snag, v: any) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <Modal open={open} onClose={onClose} title={snag ? 'Edit Snag' : 'Log Snag'} size="lg"
      footer={<><Button variant="outline" size="sm" onClick={onClose}>Cancel</Button><Button size="sm" onClick={() => { if (form.title?.trim()) onSave(form); }}>Save</Button></>}
    >
      <div className="grid grid-cols-2 gap-3">
        <Input label="Title *" value={form.title || ''} onChange={(e) => set('title', e.target.value)} className="col-span-2" />
        <Select label="Project" value={form.projectId || ''} onChange={(e) => set('projectId', e.target.value)} options={[{ value: '', label: 'Select project' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} />
        <Input label="Area / Room" value={form.area || ''} onChange={(e) => set('area', e.target.value)} placeholder="e.g. Master Bedroom" />
        <Select label="Severity" value={form.severity || 'medium'} onChange={(e) => set('severity', e.target.value as SnagSeverity)} options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }]} />
        <Select label="Status" value={form.status || 'open'} onChange={(e) => set('status', e.target.value as SnagStatus)} options={[{ value: 'open', label: 'Open' }, { value: 'in_progress', label: 'In Progress' }, { value: 'resolved', label: 'Resolved' }, { value: 'verified', label: 'Verified' }]} />
        <Select label="Assigned To" value={form.assignedToId || ''} onChange={(e) => set('assignedToId', e.target.value)} options={[{ value: '', label: 'Unassigned' }, ...users.map((u) => ({ value: u.id, label: u.name }))]} />
        <Input label="Due Date" type="date" value={form.dueDate?.split('T')[0] || ''} onChange={(e) => set('dueDate', e.target.value)} />
        <Textarea label="Description *" value={form.description || ''} onChange={(e) => set('description', e.target.value)} rows={3} className="col-span-2" />
      </div>
    </Modal>
  );
}
