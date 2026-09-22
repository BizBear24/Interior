import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { Zap, Play, Pause } from 'lucide-react';

export function Automations() {
  const { automationRules, updateAutomationRule } = useStore();
  const toast = useToast();

  const toggle = (id: string, current: boolean) => {
    updateAutomationRule(id, { enabled: !current });
    toast.success(current ? 'Automation paused' : 'Automation activated');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Automations</h1>
          <p className="text-sm text-gray-500">{automationRules.filter((r) => r.enabled).length} active rules</p>
        </div>
      </div>
      <div className="space-y-3">
        {automationRules.map((rule) => (
          <div key={rule.id} className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-all ${rule.enabled ? 'border-blue-100' : 'border-gray-100 opacity-60'}`}>
            <div className={`p-2 rounded-lg ${rule.enabled ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <Zap className={`h-4 w-4 ${rule.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{rule.name}</p>
              <div className="mt-1">
                <p className="text-xs text-gray-500">Trigger: {rule.trigger}</p>
                <p className="text-xs text-gray-400">Action: {rule.action}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={rule.enabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}>
                {rule.enabled ? 'Active' : 'Paused'}
              </Badge>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => toggle(rule.id, rule.enabled)}>
                {rule.enabled ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
