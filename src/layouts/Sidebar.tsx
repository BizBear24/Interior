import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../utils';
import {
  LayoutDashboard, FolderOpen, Users, Calendar,
  CheckSquare, Milestone, Clock, ClipboardList, AlertTriangle,
  Eye, FileText, Paperclip, Image,
  FileSignature, ShoppingCart, Package, Briefcase, Receipt, CreditCard, DollarSign, BarChart2,
  Warehouse, Box, UserCheck, Timer, UserCog,
  Brain, TrendingUp, Workflow, Cpu,
  Shield, GitBranch, Settings, Link2,
  ChevronDown, ChevronRight, Home, MessageSquare,
} from 'lucide-react';
import { useStore } from '../store';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const sections: NavSection[] = [
  {
    title: 'Workspace',
    defaultOpen: true,
    items: [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      { label: 'Projects', path: '/projects', icon: FolderOpen },
      { label: 'CRM', path: '/crm', icon: Users },
      { label: 'Calendar', path: '/calendar', icon: Calendar },
      { label: 'Quick Updates', path: '/updates', icon: MessageSquare },
    ],
  },
  {
    title: 'Project Management',
    defaultOpen: true,
    items: [
      { label: 'Tasks', path: '/tasks', icon: CheckSquare },
      { label: 'Milestones', path: '/milestones', icon: Milestone },
      { label: 'Schedule', path: '/schedule', icon: Clock },
      { label: 'Checklists', path: '/checklists', icon: ClipboardList },
      { label: 'Snags & Issues', path: '/snags', icon: AlertTriangle },
      { label: 'Client Progress', path: '/client-progress', icon: Eye },
      { label: 'Notes', path: '/notes', icon: FileText },
      { label: 'Files', path: '/files', icon: Paperclip },
      { label: 'Moodboard', path: '/moodboard', icon: Image },
    ],
  },
  {
    title: 'Commercial',
    defaultOpen: false,
    items: [
      { label: 'Quotes', path: '/quotes', icon: FileSignature },
      { label: 'Purchase Requests', path: '/purchase-requests', icon: ShoppingCart },
      { label: 'Purchase Orders', path: '/purchase-orders', icon: Package },
      { label: 'Work Orders', path: '/work-orders', icon: Briefcase },
      { label: 'Invoices', path: '/invoices', icon: Receipt },
      { label: 'Payments', path: '/payments', icon: CreditCard },
      { label: 'Expenses', path: '/expenses', icon: DollarSign },
      { label: 'Finances', path: '/finances', icon: BarChart2 },
    ],
  },
  {
    title: 'Operations',
    defaultOpen: false,
    items: [
      { label: 'Warehouse', path: '/warehouse', icon: Warehouse },
      { label: 'Inventory', path: '/inventory', icon: Box },
      { label: 'Attendance', path: '/attendance', icon: UserCheck },
      { label: 'Timesheets', path: '/timesheets', icon: Timer },
      { label: 'HRMS', path: '/hrms', icon: UserCog },
    ],
  },
  {
    title: 'Intelligence',
    defaultOpen: false,
    items: [
      { label: 'AI Assistant', path: '/ai', icon: Brain },
      { label: 'AI Pro', path: '/ai-pro', icon: Cpu },
      { label: 'Predictive Analysis', path: '/predictive', icon: TrendingUp },
      { label: 'Automations', path: '/automations', icon: Workflow },
    ],
  },
  {
    title: 'Administration',
    defaultOpen: false,
    items: [
      { label: 'Roles & Permissions', path: '/roles', icon: Shield },
      { label: 'Approval Hierarchy', path: '/approvals', icon: GitBranch },
      { label: 'SOPs', path: '/sops', icon: ClipboardList },
      { label: 'Integrations', path: '/integrations', icon: Link2 },
      { label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const { settings } = useStore();
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(sections.map((s) => [s.title, s.defaultOpen ?? false]))
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className={cn('flex flex-col h-full text-stone-300', mobile ? 'w-full' : 'w-64')} style={{ background: 'var(--brown-dark)' }}>
      {/* Logo */}
      <div className="h-14 flex items-center px-4 shrink-0" style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)' }}>
            <Home className="h-4 w-4" style={{ color: 'var(--brown-dark)' }} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--gold-light)' }}>Studio Forma</p>
            <p className="text-[10px]" style={{ color: 'var(--brown-light)' }}>Interior OS</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin no-scrollbar">
        {sections.map((section) => (
          <div key={section.title} className="mb-1">
            <button
              className="flex items-center justify-between w-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-colors"
              style={{ color: 'var(--brown-light)' }}
              onClick={() => toggleSection(section.title)}
            >
              {section.title}
              {openSections[section.title] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {openSections[section.title] && (
              <div className="mt-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={cn('flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-sm transition-all')}
                      style={isActive
                        ? { background: 'rgba(201,168,76,0.18)', color: 'var(--gold)', fontWeight: 600 }
                        : { color: '#A89880' }}
                      onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--gold-light)'; } }}
                      onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A89880'; } }}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="h-12 flex items-center px-4" style={{ borderTop: '1px solid rgba(201,168,76,0.12)' }}>
        <p className="text-[10px]" style={{ color: 'var(--brown-light)' }}>{settings.companyName} · v1.0</p>
      </div>
    </div>
  );
}
