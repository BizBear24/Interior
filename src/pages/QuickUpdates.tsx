import { useState } from 'react';
import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Avatar } from '../components/ui/Avatar';
import { useToast } from '../components/ui/Toast';
import { formatRelativeDate, generateId } from '../utils';
import { MessageSquare, Send } from 'lucide-react';
import type { UpdateCategory } from '../types';

const CAT_COLORS: Record<UpdateCategory, string> = {
  progress: 'bg-blue-50 text-blue-700',
  site: 'bg-orange-50 text-orange-700',
  delay: 'bg-red-50 text-red-700',
  approval: 'bg-purple-50 text-purple-700',
  procurement: 'bg-teal-50 text-teal-700',
  general: 'bg-gray-100 text-gray-700',
};

export function QuickUpdates() {
  const toast = useToast();
  const { quickUpdates, projects, users, addQuickUpdate, currentUserId } = useStore();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<UpdateCategory>('general');
  const [projectId, setProjectId] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const filtered = projectFilter ? quickUpdates.filter((u) => u.projectId === projectFilter) : quickUpdates;

  const handlePost = () => {
    if (!text.trim()) return;
    addQuickUpdate({
      id: generateId('qu'),
      authorId: currentUserId,
      category,
      text,
      projectId: projectId || undefined,
      createdAt: new Date().toISOString(),
    });
    setText('');
    toast.success('Update posted');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900">Quick Updates</h1>
        <Select options={[{ value: '', label: 'All Projects' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="w-48" />
      </div>

      {/* Post update */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-5">
        <div className="flex items-start gap-3">
          {users.find((u) => u.id === currentUserId) && (
            <Avatar name={users.find((u) => u.id === currentUserId)!.name} size="sm" className="mt-0.5 shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Post a project update…" rows={2} />
            <div className="flex items-center gap-2">
              <Select options={[{ value: 'general', label: 'General' }, { value: 'progress', label: 'Progress' }, { value: 'site', label: 'Site Update' }, { value: 'delay', label: 'Delay' }, { value: 'approval', label: 'Approval Needed' }, { value: 'procurement', label: 'Procurement' }]} value={category} onChange={(e) => setCategory(e.target.value as UpdateCategory)} className="w-40" />
              <Select options={[{ value: '', label: 'No project' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-44" />
              <Button size="sm" leftIcon={<Send className="h-3.5 w-3.5" />} onClick={handlePost} disabled={!text.trim()}>Post</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {filtered.map((update) => {
          const author = users.find((u) => u.id === update.authorId);
          const project = projects.find((p) => p.id === update.projectId);
          return (
            <div key={update.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
              <div className="flex items-start gap-3">
                {author && <Avatar name={author.name} size="sm" className="shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-gray-900">{author?.name}</span>
                    <Badge className={CAT_COLORS[update.category]}>{update.category}</Badge>
                    {project && <span className="text-xs text-gray-400">· {project.name.split(' — ')[0]}</span>}
                    <span className="text-xs text-gray-300 ml-auto">{formatRelativeDate(update.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{update.text}</p>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No updates yet. Post the first one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
