import { useState } from 'react';
import { useStore } from '../store';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { BookOpen } from 'lucide-react';
import type { SOP } from '../types';

export function SOPs() {
  const { sops } = useStore();
  const [viewSOP, setViewSOP] = useState<SOP | null>(null);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Standard Operating Procedures</h1>
        <p className="text-sm text-gray-500">{sops.length} SOPs</p>
      </div>
      {sops.length === 0 ? (
        <EmptyState icon={<BookOpen className="h-12 w-12" />} title="No SOPs defined" description="Document your processes and workflows here" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sops.map((sop) => (
            <div key={sop.id} onClick={() => setViewSOP(sop)} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg shrink-0"><BookOpen className="h-4 w-4 text-blue-600" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{sop.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">{sop.category}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3 line-clamp-2">{sop.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                <span>{sop.steps.length} steps</span>
                <span className="capitalize">{sop.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewSOP && (
        <Modal open={!!viewSOP} onClose={() => setViewSOP(null)} title={viewSOP.title} size="xl">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{viewSOP.description}</p>
            <div className="space-y-3">
              {viewSOP.steps.map((step, idx) => (
                <div key={step.id} className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
