// ============================================================
// CORE TYPES
// ============================================================

export type ID = string;
export type ISODate = string;

// ============================================================
// USER & ROLES
// ============================================================

export type UserRole = 'admin' | 'project_manager' | 'designer' | 'procurement' | 'finance' | 'site_supervisor' | 'hr' | 'client';

export interface User {
  id: ID;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
  joiningDate?: ISODate;
  status: 'active' | 'inactive';
}

// ============================================================
// CLIENT / CRM
// ============================================================

export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Lead {
  id: ID;
  name: string;
  email: string;
  phone: string;
  company?: string;
  source: string;
  stage: LeadStage;
  budget?: number;
  projectType?: string;
  location?: string;
  followUpDate?: ISODate;
  notes?: string;
  assignedTo?: ID;
  createdAt: ISODate;
  updatedAt: ISODate;
  activities?: Activity[];
  convertedToClientId?: ID;
}

export interface Client {
  id: ID;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  city?: string;
  gstin?: string;
  notes?: string;
  leadId?: ID;
  createdAt: ISODate;
  projectIds: ID[];
}

// ============================================================
// PROJECT
// ============================================================

export type ProjectStatus = 'lead' | 'planning' | 'design' | 'procurement' | 'execution' | 'handover' | 'completed' | 'on_hold';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Project {
  id: ID;
  name: string;
  clientId: ID;
  projectType: string;
  location: string;
  startDate: ISODate;
  targetCompletion: ISODate;
  projectManagerId: ID;
  budget: number;
  status: ProjectStatus;
  progress: number;
  priority: ProjectPriority;
  description?: string;
  area?: number;
  teamIds: ID[];
  createdAt: ISODate;
  updatedAt: ISODate;
  tags?: string[];
}

// ============================================================
// TASKS
// ============================================================

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: ID;
  title: string;
  status: 'todo' | 'done';
  assigneeId?: ID;
  dueDate?: ISODate;
}

export interface TaskComment {
  id: ID;
  taskId: ID;
  authorId: ID;
  content: string;
  createdAt: ISODate;
}

export interface Task {
  id: ID;
  title: string;
  description?: string;
  projectId: ID;
  milestoneId?: ID;
  assigneeId?: ID;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: ISODate;
  startDate?: ISODate;
  completedAt?: ISODate;
  tags?: string[];
  subtasks: Subtask[];
  comments: TaskComment[];
  estimatedHours?: number;
  actualHours?: number;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ============================================================
// MILESTONES
// ============================================================

export interface Milestone {
  id: ID;
  projectId: ID;
  title: string;
  description?: string;
  dueDate: ISODate;
  completedAt?: ISODate;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  taskIds: ID[];
  order: number;
}

// ============================================================
// ACTIVITIES / SCHEDULE
// ============================================================

export interface Activity {
  id: ID;
  projectId?: ID;
  entityId?: ID;
  entityType?: string;
  title: string;
  description?: string;
  startDate: ISODate;
  endDate: ISODate;
  ownerId?: ID;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  type: 'task' | 'meeting' | 'site_visit' | 'approval' | 'delivery' | 'inspection' | 'update';
  dependencies?: ID[];
  createdAt: ISODate;
}

// ============================================================
// NOTES
// ============================================================

export type NoteType = 'project' | 'client' | 'site' | 'internal' | 'general';

export interface Note {
  id: ID;
  title: string;
  content: string;
  authorId: ID;
  projectId?: ID;
  clientId?: ID;
  type: NoteType;
  tags?: string[];
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ============================================================
// QUOTES
// ============================================================

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected';

export interface QuoteItem {
  id: ID;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  discount: number;
  total: number;
}

export interface Quote {
  id: ID;
  quoteNumber: string;
  clientId: ID;
  projectId?: ID;
  items: QuoteItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  validUntil: ISODate;
  status: QuoteStatus;
  notes?: string;
  terms?: string;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ============================================================
// PURCHASE REQUESTS / ORDERS
// ============================================================

export type ApprovalStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'ordered' | 'received' | 'closed';

export interface PRItem {
  id: ID;
  description: string;
  quantity: number;
  unit: string;
  estimatedRate: number;
}

export interface PurchaseRequest {
  id: ID;
  prNumber: string;
  projectId: ID;
  requestedById: ID;
  items: PRItem[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requiredBy: ISODate;
  status: ApprovalStatus;
  approvedById?: ID;
  notes?: string;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface POItem {
  id: ID;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
}

export interface PurchaseOrder {
  id: ID;
  poNumber: string;
  vendorId?: ID;
  vendorName: string;
  projectId: ID;
  prId?: ID;
  items: POItem[];
  total: number;
  expectedDelivery: ISODate;
  status: ApprovalStatus;
  notes?: string;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface WorkOrder {
  id: ID;
  woNumber: string;
  contractorName: string;
  projectId: ID;
  scope: string;
  amount: number;
  startDate: ISODate;
  endDate: ISODate;
  status: 'draft' | 'pending_approval' | 'approved' | 'in_progress' | 'completed' | 'closed';
  notes?: string;
  createdAt: ISODate;
}

// ============================================================
// INVOICES & PAYMENTS
// ============================================================

export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue';

export interface InvoiceItem {
  id: ID;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface Invoice {
  id: ID;
  invoiceNumber: string;
  clientId: ID;
  projectId: ID;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  dueDate: ISODate;
  status: InvoiceStatus;
  notes?: string;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface Payment {
  id: ID;
  invoiceId: ID;
  projectId: ID;
  clientId: ID;
  amount: number;
  method: 'bank_transfer' | 'cash' | 'cheque' | 'upi' | 'other';
  reference?: string;
  date: ISODate;
  notes?: string;
  createdAt: ISODate;
}

// ============================================================
// EXPENSES
// ============================================================

export type ExpenseCategory = 'material' | 'labor' | 'transport' | 'site' | 'design' | 'miscellaneous';

export interface Expense {
  id: ID;
  projectId: ID;
  category: ExpenseCategory;
  vendorName?: string;
  amount: number;
  date: ISODate;
  description: string;
  submittedById: ID;
  approvedById?: ID;
  status: 'pending' | 'approved' | 'rejected';
  receiptUrl?: string;
  createdAt: ISODate;
}

// ============================================================
// INVENTORY
// ============================================================

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface InventoryItem {
  id: ID;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  minimumStock: number;
  vendorName?: string;
  cost: number;
  status: StockStatus;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface StockTransaction {
  id: ID;
  itemId: ID;
  type: 'receive' | 'issue' | 'adjust' | 'transfer';
  quantity: number;
  projectId?: ID;
  reference?: string;
  notes?: string;
  performedById: ID;
  createdAt: ISODate;
}

// ============================================================
// SNAGS
// ============================================================

export type SnagSeverity = 'low' | 'medium' | 'high' | 'critical';
export type SnagStatus = 'open' | 'in_progress' | 'resolved' | 'verified';

export interface Snag {
  id: ID;
  title: string;
  projectId: ID;
  area: string;
  description: string;
  severity: SnagSeverity;
  assignedToId?: ID;
  dueDate?: ISODate;
  status: SnagStatus;
  photoUrl?: string;
  resolvedAt?: ISODate;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ============================================================
// TIMESHEETS
// ============================================================

export interface Timesheet {
  id: ID;
  userId: ID;
  projectId: ID;
  taskId?: ID;
  date: ISODate;
  hours: number;
  description: string;
  createdAt: ISODate;
}

// ============================================================
// CHECKLISTS
// ============================================================

export interface ChecklistItem {
  id: ID;
  title: string;
  assigneeId?: ID;
  dueDate?: ISODate;
  status: 'pending' | 'in_progress' | 'done';
  notes?: string;
}

export interface Checklist {
  id: ID;
  title: string;
  projectId?: ID;
  templateId?: ID;
  category: string;
  items: ChecklistItem[];
  progress: number;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ============================================================
// FILES
// ============================================================

export type FileCategory = 'drawings' | 'contracts' | 'invoices' | 'site_photos' | 'moodboards' | 'vendor_docs' | 'other';

export interface ProjectFile {
  id: ID;
  name: string;
  projectId?: ID;
  category: FileCategory;
  size: number;
  mimeType: string;
  url?: string;
  uploadedById: ID;
  createdAt: ISODate;
}

// ============================================================
// MOODBOARD
// ============================================================

export type MoodboardItemType = 'image' | 'text' | 'color' | 'pin';

export interface MoodboardItem {
  id: ID;
  projectId: ID;
  type: MoodboardItemType;
  content: string;
  title?: string;
  color?: string;
  tags?: string[];
  pinCategory?: 'material' | 'furniture' | 'lighting' | 'color' | 'reference';
  x?: number;
  y?: number;
  createdAt: ISODate;
}

// ============================================================
// NOTIFICATIONS
// ============================================================

export type NotificationType = 'task_overdue' | 'invoice_overdue' | 'po_approval' | 'inventory_low' | 'milestone_due' | 'snag_assigned' | 'client_approval' | 'payment_received' | 'general';

export interface Notification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  entityId?: ID;
  entityType?: string;
  userId?: ID;
  read: boolean;
  createdAt: ISODate;
}

// ============================================================
// QUICK UPDATES
// ============================================================

export type UpdateCategory = 'progress' | 'site' | 'delay' | 'approval' | 'procurement' | 'general';

export interface QuickUpdate {
  id: ID;
  projectId?: ID;
  authorId: ID;
  category: UpdateCategory;
  text: string;
  attachmentUrl?: string;
  createdAt: ISODate;
}

// ============================================================
// AUTOMATION
// ============================================================

export interface AutomationRule {
  id: ID;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  createdAt: ISODate;
}

// ============================================================
// SOP
// ============================================================

export interface SOPStep {
  id: ID;
  order: number;
  title: string;
  description?: string;
  completed: boolean;
}

export interface SOP {
  id: ID;
  title: string;
  description: string;
  category: string;
  ownerId?: ID;
  steps: SOPStep[];
  status: 'active' | 'draft' | 'archived';
  createdAt: ISODate;
}

// ============================================================
// ATTENDANCE
// ============================================================

export interface AttendanceRecord {
  id: ID;
  userId: ID;
  date: ISODate;
  checkIn?: ISODate;
  checkOut?: ISODate;
  lat?: number;
  lng?: number;
  locationStatus: 'on_site' | 'remote' | 'manual' | 'unknown';
  notes?: string;
}

// ============================================================
// EMPLOYEES (HRMS)
// ============================================================

export interface Employee {
  id: ID;
  userId?: ID;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  joiningDate: ISODate;
  status: 'active' | 'inactive' | 'on_leave';
  salary?: number;
  managerId?: ID;
}

// ============================================================
// CUSTOM FIELDS
// ============================================================

export type CustomFieldType = 'text' | 'number' | 'date' | 'select' | 'checkbox';

export interface CustomFieldDef {
  id: ID;
  entity: 'project' | 'client' | 'task' | 'vendor';
  label: string;
  type: CustomFieldType;
  options?: string[];
  required: boolean;
  createdAt: ISODate;
}

// ============================================================
// APP STORE STATE
// ============================================================

export interface AppSettings {
  companyName: string;
  companyLogo?: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  timezone: string;
}
