import { format, formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  if (currency === 'INR') {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
}

export function formatCurrencyFull(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(date: string | Date, fmt = 'dd MMM yyyy'): string {
  if (!date) return '-';
  try {
    return format(new Date(date), fmt);
  } catch {
    return '-';
  }
}

export function formatRelativeDate(date: string | Date): string {
  if (!date) return '-';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '-';
  }
}

export function isOverdue(date: string | undefined): boolean {
  if (!date) return false;
  return isBefore(new Date(date), new Date());
}

export function isDueSoon(date: string | undefined, days = 7): boolean {
  if (!date) return false;
  const d = new Date(date);
  return isAfter(d, new Date()) && isBefore(d, addDays(new Date(), days));
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getProgressColor(progress: number): string {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 25) return 'bg-yellow-500';
  return 'bg-red-500';
}

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  lead: 'Lead',
  planning: 'Planning',
  design: 'Design',
  procurement: 'Procurement',
  execution: 'Execution',
  handover: 'Handover',
  completed: 'Completed',
  on_hold: 'On Hold',
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  lead: 'bg-gray-100 text-gray-600',
  planning: 'bg-blue-50 text-blue-700',
  design: 'bg-purple-50 text-purple-700',
  procurement: 'bg-amber-50 text-amber-700',
  execution: 'bg-orange-50 text-orange-700',
  handover: 'bg-teal-50 text-teal-700',
  completed: 'bg-green-50 text-green-700',
  on_hold: 'bg-red-50 text-red-700',
};

export const TASK_STATUS_COLORS: Record<string, string> = {
  todo: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-50 text-blue-700',
  blocked: 'bg-red-50 text-red-700',
  review: 'bg-yellow-50 text-yellow-700',
  done: 'bg-green-50 text-green-700',
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  review: 'In Review',
  done: 'Done',
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-50 text-blue-700',
  high: 'bg-orange-50 text-orange-700',
  urgent: 'bg-red-50 text-red-700',
  critical: 'bg-red-100 text-red-800',
};

export const SNAG_SEVERITY_COLORS: Record<string, string> = {
  low: 'bg-green-50 text-green-700',
  medium: 'bg-yellow-50 text-yellow-700',
  high: 'bg-orange-50 text-orange-700',
  critical: 'bg-red-50 text-red-700',
};

export const SNAG_STATUS_COLORS: Record<string, string> = {
  open: 'bg-red-50 text-red-700',
  in_progress: 'bg-yellow-50 text-yellow-700',
  resolved: 'bg-blue-50 text-blue-700',
  verified: 'bg-green-50 text-green-700',
};

export const INVOICE_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-50 text-blue-700',
  partially_paid: 'bg-yellow-50 text-yellow-700',
  paid: 'bg-green-50 text-green-700',
  overdue: 'bg-red-50 text-red-700',
};

export const QUOTE_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-50 text-blue-700',
  viewed: 'bg-purple-50 text-purple-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
};

export const APPROVAL_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  pending_approval: 'bg-yellow-50 text-yellow-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  ordered: 'bg-blue-50 text-blue-700',
  received: 'bg-teal-50 text-teal-700',
  closed: 'bg-gray-50 text-gray-600',
};

export const LEAD_STAGE_COLORS: Record<string, string> = {
  new: 'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-50 text-blue-700',
  qualified: 'bg-purple-50 text-purple-700',
  proposal: 'bg-yellow-50 text-yellow-700',
  negotiation: 'bg-orange-50 text-orange-700',
  won: 'bg-green-50 text-green-700',
  lost: 'bg-red-50 text-red-600',
};

export const STOCK_STATUS_COLORS: Record<string, string> = {
  in_stock: 'bg-green-50 text-green-700',
  low_stock: 'bg-yellow-50 text-yellow-700',
  out_of_stock: 'bg-red-50 text-red-700',
};

export function calcProjectHealth(projectId: string, tasks: any[], milestones: any[], expenses: any[], snags: any[], project: any): { schedule: string; budget: string; procurement: string; site: string; overall: number } {
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  const projectMilestones = milestones.filter((m) => m.projectId === projectId);
  const projectSnags = snags.filter((s) => s.projectId === projectId);
  const projectExpenses = expenses.filter((e) => e.projectId === projectId);

  const overdueTasks = projectTasks.filter((t) => t.status !== 'done' && isOverdue(t.dueDate)).length;
  const blockedTasks = projectTasks.filter((t) => t.status === 'blocked').length;
  const overdueMilestones = projectMilestones.filter((m) => m.status !== 'completed' && isOverdue(m.dueDate)).length;

  const totalExpenses = projectExpenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetUtilization = project.budget > 0 ? (totalExpenses / project.budget) * 100 : 0;

  const openSnags = projectSnags.filter((s) => s.status === 'open' || s.status === 'in_progress').length;
  const criticalSnags = projectSnags.filter((s) => s.severity === 'critical' && s.status !== 'verified').length;

  const scheduleScore = Math.max(0, 100 - overdueTasks * 20 - overdueMilestones * 30 - blockedTasks * 10);
  const budgetScore = budgetUtilization > 95 ? 40 : budgetUtilization > 80 ? 70 : 100;
  const siteScore = Math.max(0, 100 - criticalSnags * 40 - openSnags * 5);
  const overallScore = Math.round((scheduleScore + budgetScore + siteScore) / 3);

  const getStatus = (score: number) => score >= 70 ? 'Healthy' : score >= 40 ? 'Watch' : 'At Risk';

  return {
    schedule: getStatus(scheduleScore),
    budget: getStatus(budgetScore),
    procurement: overdueTasks > 2 ? 'At Risk' : overdueTasks > 0 ? 'Watch' : 'Healthy',
    site: getStatus(siteScore),
    overall: overallScore,
  };
}

export function truncate(str: string, n = 50): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}
