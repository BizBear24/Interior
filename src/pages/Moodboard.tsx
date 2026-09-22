import { useState } from 'react';
import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { EmptyState } from '../components/ui/EmptyState';
import { Image } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  image: 'bg-blue-50 text-blue-700', text: 'bg-gray-100 text-gray-700',
  color: 'bg-purple-50 text-purple-700', pin: 'bg-green-50 text-green-700',
};

export function Moodboard() {
  const { moodboardItems, projects } = useStore();
  const [projectFilter, setProjectFilter] = useState('');

  const filtered = projectFilter ? moodboardItems.filter((m) => m.projectId === projectFilter) : moodboardItems;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Moodboard</h1>
          <p className="text-sm text-gray-500">{moodboardItems.length} design references</p>
        </div>
        <Select options={[{ value: '', label: 'All Projects' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="w-44" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Image className="h-12 w-12" />} title="No moodboard items" description="Add design references, color palettes, and inspiration" />
      ) : (
        <div className="columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
          {filtered.map((item) => {
            const project = projects.find((p) => p.id === item.projectId);
            return (
              <div key={item.id} className="break-inside-avoid bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {item.color ? (
                  <div className="h-32 w-full" style={{ backgroundColor: item.color }} />
                ) : (
                  <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-300" />
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Badge className={`${TYPE_COLORS[item.type] || 'bg-gray-100 text-gray-700'} text-[9px] px-1.5 py-0.5`}>{item.type}</Badge>
                    {item.pinCategory && <span className="text-[9px] text-gray-400">{item.pinCategory}</span>}
                  </div>
                  {item.title && <p className="text-xs font-medium text-gray-900">{item.title}</p>}
                  {item.content && item.type === 'text' && <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{item.content}</p>}
                  {item.color && <p className="text-[10px] font-mono text-gray-400 mt-1">{item.color}</p>}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">{item.tags.map((t) => <span key={t} className="text-[9px] text-gray-400">#{t}</span>)}</div>
                  )}
                  {project && <p className="text-[10px] text-blue-500 mt-1">{project.name.split(' — ')[0]}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
