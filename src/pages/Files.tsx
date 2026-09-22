import { useState } from 'react';
import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate } from '../utils';
import { File as FileIcon, Search, FolderOpen } from 'lucide-react';

const CAT_COLORS: Record<string, string> = {
  drawings: 'bg-blue-50 text-blue-700', contracts: 'bg-orange-50 text-orange-700',
  invoices: 'bg-green-50 text-green-700', site_photos: 'bg-yellow-50 text-yellow-700',
  moodboards: 'bg-purple-50 text-purple-700', vendor_docs: 'bg-teal-50 text-teal-700', other: 'bg-gray-100 text-gray-700',
};

export function Files() {
  const { projectFiles, projects, users } = useStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const filtered = projectFiles.filter((f) => {
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter && f.category !== catFilter) return false;
    if (projectFilter && f.projectId !== projectFilter) return false;
    return true;
  });

  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  const getExt = (name: string) => name.split('.').pop()?.toUpperCase() || '?';

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Files</h1>
          <p className="text-sm text-gray-500">{projectFiles.length} files</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-5">
        <Input placeholder="Search files…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-3.5 w-3.5" />} className="w-52" />
        <Select options={[{ value: '', label: 'All Types' }, ...Object.keys(CAT_COLORS).map((c) => ({ value: c, label: c.replace('_', ' ').charAt(0).toUpperCase() + c.replace('_', ' ').slice(1) }))]} value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="w-36" />
        <Select options={[{ value: '', label: 'All Projects' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="w-44" />
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={<FolderOpen className="h-12 w-12" />} title="No files found" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">File</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Project</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Uploaded By</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Size</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((f) => {
                const project = projects.find((p) => p.id === f.projectId);
                const uploader = users.find((u) => u.id === f.uploadedById);
                return (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{f.name}</p>
                          <p className="text-xs text-gray-400 uppercase">{getExt(f.name)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge className={CAT_COLORS[f.category] || 'bg-gray-100 text-gray-700'}>{f.category.replace('_', ' ')}</Badge></td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-600">{project?.name.split(' — ')[0]}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-600">{uploader?.name}</td>
                    <td className="px-4 py-3 text-right text-xs text-gray-500">{formatSize(f.size)}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{formatDate(f.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
