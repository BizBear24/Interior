import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

const INTEGRATIONS = [
  { id: 'whatsapp', name: 'WhatsApp Business', desc: 'Send project updates and invoice notifications via WhatsApp', icon: '💬', status: 'available' },
  { id: 'tally', name: 'Tally ERP', desc: 'Sync invoices, payments and expense data with Tally', icon: '📊', status: 'available' },
  { id: 'google_drive', name: 'Google Drive', desc: 'Auto-backup project files to Google Drive folders', icon: '☁️', status: 'available' },
  { id: 'google_calendar', name: 'Google Calendar', desc: 'Sync milestones and site visits with Google Calendar', icon: '📅', status: 'available' },
  { id: 'slack', name: 'Slack', desc: 'Receive notifications and project alerts in Slack channels', icon: '⚡', status: 'available' },
  { id: 'zoom', name: 'Zoom', desc: 'Schedule client presentation meetings directly from projects', icon: '🎥', status: 'available' },
  { id: 'autodesk', name: 'AutoCAD / Revit', desc: 'Link design files from Autodesk suite to project file manager', icon: '📐', status: 'coming_soon' },
  { id: 'excel', name: 'Excel Export', desc: 'Export reports, timesheets and financial data to Excel', icon: '📋', status: 'active' },
  { id: 'pdf', name: 'PDF Reports', desc: 'Generate branded PDF reports for clients and internal use', icon: '📄', status: 'active' },
];

export function Integrations() {
  const toast = useToast();

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Integrations</h1>
        <p className="text-sm text-gray-500">Connect Studio Forma with your favorite tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {INTEGRATIONS.map((intg) => (
          <div key={intg.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-all">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{intg.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900 text-sm">{intg.name}</p>
                  {intg.status === 'active' && <Badge className="bg-green-50 text-green-700 text-[9px]">Active</Badge>}
                  {intg.status === 'coming_soon' && <Badge className="bg-gray-100 text-gray-500 text-[9px]">Soon</Badge>}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{intg.desc}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50">
              {intg.status === 'active' ? (
                <Button size="sm" variant="outline" className="w-full text-xs h-7" onClick={() => toast.info(`${intg.name} is already connected`)}>Configure</Button>
              ) : intg.status === 'coming_soon' ? (
                <Button size="sm" variant="ghost" className="w-full text-xs h-7 text-gray-400" disabled>Coming Soon</Button>
              ) : (
                <Button size="sm" variant="outline" className="w-full text-xs h-7" onClick={() => toast.info(`${intg.name} integration would open an OAuth flow in production`)}>Connect</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
