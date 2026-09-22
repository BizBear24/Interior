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
import { formatDate, generateId } from '../utils';
import { Plus, Search, FileText, Trash2 } from 'lucide-react';
import type { Note, NoteType } from '../types';

const TYPE_COLORS: Record<NoteType, string> = {
  project: 'bg-blue-50 text-blue-700',
  client: 'bg-purple-50 text-purple-700',
  site: 'bg-orange-50 text-orange-700',
  internal: 'bg-gray-100 text-gray-700',
  general: 'bg-teal-50 text-teal-700',
};

export function Notes() {
  const toast = useToast();
  const { notes, projects, clients, users, addNote, updateNote, deleteNote, currentUserId } = useStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = notes.filter((n) => {
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.content.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter && n.type !== typeFilter) return false;
    if (projectFilter && n.projectId !== projectFilter) return false;
    return true;
  });

  const handleSave = (data: Partial<Note>) => {
    if (editNote) {
      updateNote(editNote.id, { ...data, updatedAt: new Date().toISOString() });
      toast.success('Note updated');
    } else {
      addNote({ ...data, id: generateId('n'), authorId: currentUserId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Note);
      toast.success('Note saved');
    }
    setShowModal(false);
    setEditNote(null);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notes</h1>
          <p className="text-sm text-gray-500">{notes.length} notes</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => { setEditNote(null); setShowModal(true); }}>New Note</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <Input placeholder="Search notes…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-3.5 w-3.5" />} className="w-56" />
        <Select options={[{ value: '', label: 'All Types' }, { value: 'project', label: 'Project' }, { value: 'client', label: 'Client' }, { value: 'site', label: 'Site' }, { value: 'internal', label: 'Internal' }, { value: 'general', label: 'General' }]} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-36" />
        <Select options={[{ value: '', label: 'All Projects' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="w-44" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<FileText className="h-12 w-12" />} title="No notes found" description="Start capturing project and client notes" action={<Button size="sm" onClick={() => setShowModal(true)}>Write Note</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((note) => {
            const author = users.find((u) => u.id === note.authorId);
            const project = projects.find((p) => p.id === note.projectId);
            const client = clients.find((c) => c.id === note.clientId);
            return (
              <div key={note.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer" onClick={() => { setEditNote(note); setShowModal(true); }}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={TYPE_COLORS[note.type]}>{note.type}</Badge>
                    {note.tags?.map((t) => <span key={t} className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">#{t}</span>)}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1 hover:bg-red-50 rounded" onClick={() => setDeleteId(note.id)}><Trash2 className="h-3.5 w-3.5 text-gray-300 hover:text-red-500" /></button>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{note.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{note.content}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1.5">
                    {author && <><Avatar name={author.name} size="xs" /><span className="text-xs text-gray-400">{author.name.split(' ')[0]}</span></>}
                  </div>
                  <div className="text-right">
                    {project && <p className="text-[10px] text-blue-500">{project.name.split(' — ')[0]}</p>}
                    {client && !project && <p className="text-[10px] text-purple-500">{client.name}</p>}
                    <p className="text-[10px] text-gray-400">{formatDate(note.updatedAt)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NoteModal open={showModal} onClose={() => { setShowModal(false); setEditNote(null); }} note={editNote} onSave={handleSave} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteNote(deleteId!); toast.success('Note deleted'); }} title="Delete Note" message="Are you sure you want to delete this note?" confirmLabel="Delete" destructive />
    </div>
  );
}

function NoteModal({ open, onClose, note, onSave }: { open: boolean; onClose: () => void; note: Note | null; onSave: (d: Partial<Note>) => void }) {
  const { projects } = useStore();
  const [form, setForm] = useState<Partial<Note>>(note || { title: '', content: '', type: 'project', tags: [] });
  const set = (k: keyof Note, v: any) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <Modal open={open} onClose={onClose} title={note ? 'Edit Note' : 'New Note'} size="xl"
      footer={<><Button variant="outline" size="sm" onClick={onClose}>Cancel</Button><Button size="sm" onClick={() => { if (form.title?.trim() && form.content?.trim()) onSave(form); }}>Save Note</Button></>}
    >
      <div className="space-y-3">
        <Input label="Title *" value={form.title || ''} onChange={(e) => set('title', e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Type" value={form.type || 'general'} onChange={(e) => set('type', e.target.value as NoteType)} options={[{ value: 'project', label: 'Project' }, { value: 'client', label: 'Client' }, { value: 'site', label: 'Site' }, { value: 'internal', label: 'Internal' }, { value: 'general', label: 'General' }]} />
          <Select label="Project" value={form.projectId || ''} onChange={(e) => set('projectId', e.target.value)} options={[{ value: '', label: 'No project' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} />
        </div>
        <Textarea label="Content *" value={form.content || ''} onChange={(e) => set('content', e.target.value)} rows={6} placeholder="Write your note here…" />
        <Input label="Tags (comma-separated)" value={(form.tags || []).join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} placeholder="e.g. design, client-preference, risk" />
      </div>
    </Modal>
  );
}
