import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Progress } from '../components/ui/Progress';
import { Modal } from '../components/ui/Modal';
import { Avatar } from '../components/ui/Avatar';
import { useToast } from '../components/ui/Toast';
import {
  formatCurrency, formatDate, isOverdue, PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS,
  PRIORITY_COLORS, calcProjectHealth, generateId,
} from '../utils';
import {
  Plus, Search, FolderOpen, MapPin, Calendar, DollarSign,
  TrendingUp, AlertTriangle, MoreHorizontal,
} from 'lucide-react';
import type { Project, ProjectStatus, ProjectPriority } from '../types';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'lead', label: 'Lead' },
  { value: 'planning', label: 'Planning' },
  { value: 'design', label: 'Design' },
  { value: 'procurement', label: 'Procurement' },
  { value: 'execution', label: 'Execution' },
  { value: 'handover', label: 'Handover' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const PROJECT_TYPES = [
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Hospitality', label: 'Hospitality' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Industrial', label: 'Industrial' },
];

export function Projects() {
  const navigate = useNavigate();
  const toast = useToast();
  const { projects, clients, users, addProject, updateProject, tasks, milestones, expenses, snags } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const client = clients.find((c) => c.id === p.clientId);
    if (q && !p.name.toLowerCase().includes(q) && !client?.name.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    if (priorityFilter && p.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">{projects.length} total · {filtered.length} shown</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setEditProject(null); setShowModal(true); }}>
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <Input
          placeholder="Search projects, clients, locations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-3.5 w-3.5" />}
          className="w-64"
        />
        <Select options={STATUS_OPTIONS} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40" />
        <Select options={PRIORITY_OPTIONS} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-36" />
        {(search || statusFilter || priorityFilter) && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter(''); setPriorityFilter(''); }}>Clear filters</Button>
        )}
      </div>

      {/* Status summary strip */}
      <div className="flex gap-3 mb-5 overflow-x-auto pb-1 no-scrollbar">
        {[{ s: 'execution', label: 'Execution' }, { s: 'design', label: 'Design' }, { s: 'procurement', label: 'Procurement' }, { s: 'planning', label: 'Planning' }, { s: 'handover', label: 'Handover' }].map(({ s, label }) => {
          const count = projects.filter((p) => p.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors ${statusFilter === s ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
            >
              <span className={`h-2 w-2 rounded-full ${PROJECT_STATUS_COLORS[s].split(' ')[0]}`} />
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Projects grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="h-10 w-10 text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-600">No projects found</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or create a new project</p>
          <Button size="sm" className="mt-4" onClick={() => setShowModal(true)}>Create Project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const client = clients.find((c) => c.id === project.clientId);
            const pm = users.find((u) => u.id === project.projectManagerId);
            const health = calcProjectHealth(project.id, tasks, milestones, expenses, snags, project);
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const overdueTasks = projectTasks.filter((t) => t.status !== 'done' && isOverdue(t.dueDate)).length;
            const projectSnags = snags.filter((s) => s.projectId === project.id && ['open', 'in_progress'].includes(s.status));

            return (
              <Card
                key={project.id}
                hoverable
                onClick={() => navigate(`/projects/${project.id}`)}
                className="group"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={PROJECT_STATUS_COLORS[project.status]}>
                          {PROJECT_STATUS_LABELS[project.status]}
                        </Badge>
                        <Badge className={PRIORITY_COLORS[project.priority]}>
                          {project.priority}
                        </Badge>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug">{project.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{client?.name || 'No client'}</p>
                    </div>
                    <button
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                      onClick={(e) => { e.stopPropagation(); setEditProject(project); setShowModal(true); }}
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>Progress</span>
                      <span className="font-medium text-gray-700">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3 w-3 text-gray-400" />
                      <span>{formatCurrency(project.budget)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="truncate">{project.location.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span>{formatDate(project.targetCompletion)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3 text-gray-400" />
                      <span>{project.projectType}</span>
                    </div>
                  </div>

                  {/* Health + Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      {pm && <Avatar name={pm.name} size="xs" />}
                      <span className="text-xs text-gray-500">{pm?.name?.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {overdueTasks > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-red-500">
                          <AlertTriangle className="h-3 w-3" />{overdueTasks}
                        </span>
                      )}
                      {projectSnags.length > 0 && (
                        <span className="text-[10px] text-orange-500">{projectSnags.length} snags</span>
                      )}
                      <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${health.overall >= 70 ? 'bg-green-50 text-green-700' : health.overall >= 40 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                        {health.overall} Health
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <ProjectModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditProject(null); }}
        project={editProject}
        onSave={(data) => {
          if (editProject) {
            updateProject(editProject.id, data);
            toast.success('Project updated');
          } else {
            addProject({ ...data, id: generateId('p'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), progress: 0, teamIds: [], } as Project);
            toast.success('Project created');
          }
          setShowModal(false);
          setEditProject(null);
        }}
      />
    </div>
  );
}

function ProjectModal({ open, onClose, project, onSave }: {
  open: boolean; onClose: () => void; project: Project | null;
  onSave: (data: Partial<Project>) => void;
}) {
  const { clients, users } = useStore();
  const [form, setForm] = useState<Partial<Project>>(project || {
    name: '', status: 'planning', priority: 'medium', projectType: 'Residential',
    location: '', budget: 0, startDate: new Date().toISOString().split('T')[0],
    targetCompletion: '', clientId: '', projectManagerId: '', description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof Project, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = 'Project name is required';
    if (!form.clientId) e.clientId = 'Client is required';
    if (!form.projectManagerId) e.projectManagerId = 'Project manager is required';
    if (!form.location?.trim()) e.location = 'Location is required';
    if (!form.budget || form.budget <= 0) e.budget = 'Valid budget is required';
    if (!form.targetCompletion) e.targetCompletion = 'Target completion is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => { if (validate()) onSave(form); };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? 'Edit Project' : 'New Project'}
      size="xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSave}>{project ? 'Update' : 'Create'} Project</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input label="Project Name *" value={form.name || ''} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Malhotra Residence — DLF Phase 2" error={errors.name} />
        </div>
        <Select label="Client *" value={form.clientId || ''} onChange={(e) => set('clientId', e.target.value)} options={clients.map((c) => ({ value: c.id, label: c.name }))} placeholder="Select client" error={errors.clientId} />
        <Select label="Project Manager *" value={form.projectManagerId || ''} onChange={(e) => set('projectManagerId', e.target.value)} options={users.filter((u) => ['admin', 'project_manager'].includes(u.role)).map((u) => ({ value: u.id, label: u.name }))} placeholder="Select PM" error={errors.projectManagerId} />
        <Select label="Project Type" value={form.projectType || ''} onChange={(e) => set('projectType', e.target.value)} options={PROJECT_TYPES} />
        <Select label="Status" value={form.status || 'planning'} onChange={(e) => set('status', e.target.value as ProjectStatus)} options={STATUS_OPTIONS.slice(1)} />
        <Input label="Location *" value={form.location || ''} onChange={(e) => set('location', e.target.value)} placeholder="e.g. DLF Phase 2, Gurugram" error={errors.location} />
        <Select label="Priority" value={form.priority || 'medium'} onChange={(e) => set('priority', e.target.value as ProjectPriority)} options={PRIORITY_OPTIONS.slice(1)} />
        <Input label="Budget (₹) *" type="number" value={form.budget || ''} onChange={(e) => set('budget', Number(e.target.value))} error={errors.budget} />
        <Input label="Start Date" type="date" value={form.startDate?.split('T')[0] || ''} onChange={(e) => set('startDate', e.target.value)} />
        <Input label="Target Completion *" type="date" value={form.targetCompletion?.split('T')[0] || ''} onChange={(e) => set('targetCompletion', e.target.value)} error={errors.targetCompletion} />
        <div className="col-span-2">
          <Input label="Description" value={form.description || ''} onChange={(e) => set('description', e.target.value)} placeholder="Brief project description…" />
        </div>
      </div>
    </Modal>
  );
}
