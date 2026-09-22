import { useStore } from '../store';
import { Progress } from '../components/ui/Progress';
import { EmptyState } from '../components/ui/EmptyState';
import { CheckSquare, Square } from 'lucide-react';

export function Checklists() {
  const { checklists, projects, updateChecklist } = useStore();

  const toggleItem = (checklistId: string, itemId: string) => {
    const cl = checklists.find((c) => c.id === checklistId);
    if (!cl) return;
    const updated = cl.items.map((item) =>
      item.id === itemId
        ? { ...item, status: item.status === 'done' ? ('pending' as const) : ('done' as const) }
        : item
    );
    updateChecklist(checklistId, { items: updated });
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Checklists</h1>
        <p className="text-sm text-gray-500">{checklists.length} checklists</p>
      </div>
      {checklists.length === 0 ? (
        <EmptyState icon={<CheckSquare className="h-12 w-12" />} title="No checklists yet" description="Checklists help track site and handover readiness" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklists.map((cl) => {
            const project = projects.find((p) => p.id === cl.projectId);
            const done = cl.items.filter((i) => i.status === 'done').length;
            const progress = cl.items.length ? (done / cl.items.length) * 100 : 0;
            return (
              <div key={cl.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-gray-900">{cl.title}</h3>
                    <span className="text-xs text-gray-400">{done}/{cl.items.length}</span>
                  </div>
                  {project && <p className="text-xs text-blue-500 mb-2">{project.name.split(' — ')[0]}</p>}
                  <Progress value={progress} showLabel />
                </div>
                <div className="space-y-2 mt-3">
                  {cl.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-2 cursor-pointer group" onClick={() => toggleItem(cl.id, item.id)}>
                      {item.status === 'done' ? <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 shrink-0" /> : <Square className="h-4 w-4 text-gray-300 mt-0.5 shrink-0 group-hover:text-blue-400" />}
                      <span className={`text-xs leading-5 ${item.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
