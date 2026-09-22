import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { X } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/crm': 'CRM',
  '/calendar': 'Calendar',
  '/updates': 'Quick Updates',
  '/tasks': 'Tasks',
  '/milestones': 'Milestones',
  '/schedule': 'Schedule',
  '/checklists': 'Checklists',
  '/snags': 'Snags & Issues',
  '/client-progress': 'Client Progress',
  '/notes': 'Notes',
  '/files': 'Files',
  '/moodboard': 'Moodboard',
  '/quotes': 'Quotes',
  '/purchase-requests': 'Purchase Requests',
  '/purchase-orders': 'Purchase Orders',
  '/work-orders': 'Work Orders',
  '/invoices': 'Invoices',
  '/payments': 'Payments',
  '/expenses': 'Expenses',
  '/finances': 'Finances',
  '/warehouse': 'Warehouse',
  '/inventory': 'Inventory',
  '/attendance': 'Attendance',
  '/timesheets': 'Timesheets',
  '/hrms': 'HRMS',
  '/ai': 'AI Assistant',
  '/ai-pro': 'AI Pro',
  '/predictive': 'Predictive Analysis',
  '/automations': 'Automations',
  '/roles': 'Roles & Permissions',
  '/approvals': 'Approval Hierarchy',
  '/sops': 'SOPs',
  '/integrations': 'Integrations',
  '/settings': 'Settings',
};

export function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    const exact = PAGE_TITLES[location.pathname];
    if (exact) return exact;
    for (const [path, title] of Object.entries(PAGE_TITLES)) {
      if (path !== '/' && location.pathname.startsWith(path)) return title;
    }
    return 'Studio Forma';
  };

  const breadcrumb = [{ label: 'Studio Forma' }, { label: getTitle() }];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - desktop */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/5">
        <Sidebar />
      </div>

      {/* Sidebar - mobile */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-72 flex flex-col">
            <Sidebar mobile onClose={() => setMobileSidebarOpen(false)} />
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav onMenuToggle={() => setMobileSidebarOpen(true)} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
