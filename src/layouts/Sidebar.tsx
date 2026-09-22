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
    <div className={cn('flex flex-col h-full bg-[#0F1117] text-gray-300', mobile ? 'w-full' : 'w-64')}>
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Home className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">Studio Forma</p>
            <p className="text-[10px] text-gray-500">Interior OS</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin no-scrollbar">
        {sections.map((section) => (
          <div key={section.title} className="mb-1">
            <button
              className="flex items-center justify-between w-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500 hover:text-gray-400 transition-colors"
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
                      className={cn(
                        'flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-sm transition-colors',
                        isActive ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      )}
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
      <div className="h-12 border-t border-white/5 flex items-center px-4">
        <p className="text-[10px] text-gray-600">{settings.companyName} · v1.0</p>
      </div>
    </div>
  );
}
