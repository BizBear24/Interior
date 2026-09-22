import { useState } from 'react';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
import { Building2, Palette } from 'lucide-react';
import type { AppSettings } from '../types';

export function Settings() {
  const toast = useToast();
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState<AppSettings>(settings);
  const set = (k: keyof AppSettings, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const save = () => { updateSettings(form); toast.success('Settings saved'); };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Configure Studio Forma Interiors</p>
        </div>
        <Button size="sm" onClick={save}>Save Changes</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Company</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input label="Company Name" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Currency" value={form.currency} onChange={(e) => set('currency', e.target.value)} />
            <Input label="Timezone" value={form.timezone} onChange={(e) => set('timezone', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-4 w-4" /> Branding</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: form.primaryColor }}>SF</div>
            <div>
              <p className="text-sm font-medium text-gray-900">Logo Preview</p>
              <p className="text-xs text-gray-500">Based on your primary color below</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Primary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.primaryColor} onChange={(e) => set('primaryColor', e.target.value)} className="h-8 w-8 rounded cursor-pointer" />
                <span className="text-xs text-gray-500 font-mono">{form.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.secondaryColor} onChange={(e) => set('secondaryColor', e.target.value)} className="h-8 w-8 rounded cursor-pointer" />
                <span className="text-xs text-gray-500 font-mono">{form.secondaryColor}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
