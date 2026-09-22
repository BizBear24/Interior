import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User, Project, Client, Lead, Task, Milestone, Activity, Note, Quote,
  PurchaseRequest, PurchaseOrder, WorkOrder, Invoice, Payment, Expense,
  InventoryItem, StockTransaction, Snag, Timesheet, Checklist, Notification,
  QuickUpdate, AutomationRule, SOP, Employee, AppSettings, MoodboardItem,
  ProjectFile,
} from '../types';
import * as seed from '../data/seed';

interface AppStore {
  // Settings
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;

  // Current user
  currentUserId: string;
  setCurrentUser: (id: string) => void;

  // Users
  users: User[];

  // Employees
  employees: Employee[];
  addEmployee: (e: Employee) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;

  // Projects
  projects: Project[];
  addProject: (p: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Clients
  clients: Client[];
  addClient: (c: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Leads
  leads: Lead[];
  addLead: (l: Lead) => void;
  updateLead: (id: string, data: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (t: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Milestones
  milestones: Milestone[];
  addMilestone: (m: Milestone) => void;
  updateMilestone: (id: string, data: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;

  // Activities
  activities: Activity[];
  addActivity: (a: Activity) => void;
  updateActivity: (id: string, data: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;

  // Notes
  notes: Note[];
  addNote: (n: Note) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Quotes
  quotes: Quote[];
  addQuote: (q: Quote) => void;
  updateQuote: (id: string, data: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;

  // Purchase Requests
  purchaseRequests: PurchaseRequest[];
  addPurchaseRequest: (pr: PurchaseRequest) => void;
  updatePurchaseRequest: (id: string, data: Partial<PurchaseRequest>) => void;
  deletePurchaseRequest: (id: string) => void;

  // Purchase Orders
  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: PurchaseOrder) => void;
  updatePurchaseOrder: (id: string, data: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (id: string) => void;

  // Work Orders
  workOrders: WorkOrder[];
  addWorkOrder: (wo: WorkOrder) => void;
  updateWorkOrder: (id: string, data: Partial<WorkOrder>) => void;

  // Invoices
  invoices: Invoice[];
  addInvoice: (inv: Invoice) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  // Payments
  payments: Payment[];
  addPayment: (p: Payment) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (e: Expense) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Inventory
  inventoryItems: InventoryItem[];
  addInventoryItem: (i: InventoryItem) => void;
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  stockTransactions: StockTransaction[];
  addStockTransaction: (t: StockTransaction) => void;

  // Snags
  snags: Snag[];
  addSnag: (s: Snag) => void;
  updateSnag: (id: string, data: Partial<Snag>) => void;
  deleteSnag: (id: string) => void;

  // Timesheets
  timesheets: Timesheet[];
  addTimesheet: (t: Timesheet) => void;
  updateTimesheet: (id: string, data: Partial<Timesheet>) => void;
  deleteTimesheet: (id: string) => void;

  // Checklists
  checklists: Checklist[];
  addChecklist: (c: Checklist) => void;
  updateChecklist: (id: string, data: Partial<Checklist>) => void;
  deleteChecklist: (id: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Quick Updates
  quickUpdates: QuickUpdate[];
  addQuickUpdate: (u: QuickUpdate) => void;
  deleteQuickUpdate: (id: string) => void;

  // Automations
  automationRules: AutomationRule[];
  addAutomationRule: (r: AutomationRule) => void;
  updateAutomationRule: (id: string, data: Partial<AutomationRule>) => void;
  deleteAutomationRule: (id: string) => void;

  // SOPs
  sops: SOP[];
  addSOP: (s: SOP) => void;
  updateSOP: (id: string, data: Partial<SOP>) => void;

  // Moodboard
  moodboardItems: MoodboardItem[];
  addMoodboardItem: (m: MoodboardItem) => void;
  updateMoodboardItem: (id: string, data: Partial<MoodboardItem>) => void;
  deleteMoodboardItem: (id: string) => void;

  // Files
  projectFiles: ProjectFile[];
  addProjectFile: (f: ProjectFile) => void;
  deleteProjectFile: (id: string) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      // Settings
      settings: seed.settings,
      updateSettings: (s) => set((state) => ({ settings: { ...state.settings, ...s } })),

      // Current user
      currentUserId: 'u1',
      setCurrentUser: (id) => set({ currentUserId: id }),

      // Users (read-only seed)
      users: seed.users,

      // Employees
      employees: [],
      addEmployee: (e) => set((state) => ({ employees: [...state.employees, e] })),
      updateEmployee: (id, data) => set((state) => ({ employees: state.employees.map((e) => e.id === id ? { ...e, ...data } : e) })),

      // Projects
      projects: [],
      addProject: (p) => set((state) => ({ projects: [...state.projects, p] })),
      updateProject: (id, data) => set((state) => ({ projects: state.projects.map((p) => p.id === id ? { ...p, ...data } : p) })),
      deleteProject: (id) => set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),

      // Clients
      clients: [],
      addClient: (c) => set((state) => ({ clients: [...state.clients, c] })),
      updateClient: (id, data) => set((state) => ({ clients: state.clients.map((c) => c.id === id ? { ...c, ...data } : c) })),
      deleteClient: (id) => set((state) => ({ clients: state.clients.filter((c) => c.id !== id) })),

      // Leads
      leads: [],
      addLead: (l) => set((state) => ({ leads: [...state.leads, l] })),
      updateLead: (id, data) => set((state) => ({ leads: state.leads.map((l) => l.id === id ? { ...l, ...data } : l) })),
      deleteLead: (id) => set((state) => ({ leads: state.leads.filter((l) => l.id !== id) })),

      // Tasks
      tasks: [],
      addTask: (t) => set((state) => ({ tasks: [...state.tasks, t] })),
      updateTask: (id, data) => set((state) => ({ tasks: state.tasks.map((t) => t.id === id ? { ...t, ...data } : t) })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      // Milestones
      milestones: [],
      addMilestone: (m) => set((state) => ({ milestones: [...state.milestones, m] })),
      updateMilestone: (id, data) => set((state) => ({ milestones: state.milestones.map((m) => m.id === id ? { ...m, ...data } : m) })),
      deleteMilestone: (id) => set((state) => ({ milestones: state.milestones.filter((m) => m.id !== id) })),

      // Activities
      activities: [],
      addActivity: (a) => set((state) => ({ activities: [...state.activities, a] })),
      updateActivity: (id, data) => set((state) => ({ activities: state.activities.map((a) => a.id === id ? { ...a, ...data } : a) })),
      deleteActivity: (id) => set((state) => ({ activities: state.activities.filter((a) => a.id !== id) })),

      // Notes
      notes: [],
      addNote: (n) => set((state) => ({ notes: [...state.notes, n] })),
      updateNote: (id, data) => set((state) => ({ notes: state.notes.map((n) => n.id === id ? { ...n, ...data } : n) })),
      deleteNote: (id) => set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),

      // Quotes
      quotes: [],
      addQuote: (q) => set((state) => ({ quotes: [...state.quotes, q] })),
      updateQuote: (id, data) => set((state) => ({ quotes: state.quotes.map((q) => q.id === id ? { ...q, ...data } : q) })),
      deleteQuote: (id) => set((state) => ({ quotes: state.quotes.filter((q) => q.id !== id) })),

      // Purchase Requests
      purchaseRequests: [],
      addPurchaseRequest: (pr) => set((state) => ({ purchaseRequests: [...state.purchaseRequests, pr] })),
      updatePurchaseRequest: (id, data) => set((state) => ({ purchaseRequests: state.purchaseRequests.map((pr) => pr.id === id ? { ...pr, ...data } : pr) })),
      deletePurchaseRequest: (id) => set((state) => ({ purchaseRequests: state.purchaseRequests.filter((pr) => pr.id !== id) })),

      // Purchase Orders
      purchaseOrders: [],
      addPurchaseOrder: (po) => set((state) => ({ purchaseOrders: [...state.purchaseOrders, po] })),
      updatePurchaseOrder: (id, data) => set((state) => ({ purchaseOrders: state.purchaseOrders.map((po) => po.id === id ? { ...po, ...data } : po) })),
      deletePurchaseOrder: (id) => set((state) => ({ purchaseOrders: state.purchaseOrders.filter((po) => po.id !== id) })),

      // Work Orders
      workOrders: [],
      addWorkOrder: (wo) => set((state) => ({ workOrders: [...state.workOrders, wo] })),
      updateWorkOrder: (id, data) => set((state) => ({ workOrders: state.workOrders.map((wo) => wo.id === id ? { ...wo, ...data } : wo) })),

      // Invoices
      invoices: [],
      addInvoice: (inv) => set((state) => ({ invoices: [...state.invoices, inv] })),
      updateInvoice: (id, data) => set((state) => ({ invoices: state.invoices.map((inv) => inv.id === id ? { ...inv, ...data } : inv) })),
      deleteInvoice: (id) => set((state) => ({ invoices: state.invoices.filter((inv) => inv.id !== id) })),

      // Payments
      payments: [],
      addPayment: (p) => set((state) => ({ payments: [...state.payments, p] })),

      // Expenses
      expenses: [],
      addExpense: (e) => set((state) => ({ expenses: [...state.expenses, e] })),
      updateExpense: (id, data) => set((state) => ({ expenses: state.expenses.map((e) => e.id === id ? { ...e, ...data } : e) })),
      deleteExpense: (id) => set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),

      // Inventory
      inventoryItems: [],
      addInventoryItem: (i) => set((state) => ({ inventoryItems: [...state.inventoryItems, i] })),
      updateInventoryItem: (id, data) => set((state) => ({ inventoryItems: state.inventoryItems.map((i) => i.id === id ? { ...i, ...data } : i) })),
      deleteInventoryItem: (id) => set((state) => ({ inventoryItems: state.inventoryItems.filter((i) => i.id !== id) })),

      stockTransactions: [],
      addStockTransaction: (t) => set((state) => ({ stockTransactions: [...state.stockTransactions, t] })),

      // Snags
      snags: [],
      addSnag: (s) => set((state) => ({ snags: [...state.snags, s] })),
      updateSnag: (id, data) => set((state) => ({ snags: state.snags.map((s) => s.id === id ? { ...s, ...data } : s) })),
      deleteSnag: (id) => set((state) => ({ snags: state.snags.filter((s) => s.id !== id) })),

      // Timesheets
      timesheets: [],
      addTimesheet: (t) => set((state) => ({ timesheets: [...state.timesheets, t] })),
      updateTimesheet: (id, data) => set((state) => ({ timesheets: state.timesheets.map((t) => t.id === id ? { ...t, ...data } : t) })),
      deleteTimesheet: (id) => set((state) => ({ timesheets: state.timesheets.filter((t) => t.id !== id) })),

      // Checklists
      checklists: [],
      addChecklist: (c) => set((state) => ({ checklists: [...state.checklists, c] })),
      updateChecklist: (id, data) => set((state) => ({ checklists: state.checklists.map((c) => c.id === id ? { ...c, ...data } : c) })),
      deleteChecklist: (id) => set((state) => ({ checklists: state.checklists.filter((c) => c.id !== id) })),

      // Notifications
      notifications: [],
      addNotification: (n) => set((state) => ({ notifications: [n, ...state.notifications] })),
      markNotificationRead: (id) => set((state) => ({ notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
      markAllNotificationsRead: () => set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })),

      // Quick Updates
      quickUpdates: [],
      addQuickUpdate: (u) => set((state) => ({ quickUpdates: [u, ...state.quickUpdates] })),
      deleteQuickUpdate: (id) => set((state) => ({ quickUpdates: state.quickUpdates.filter((u) => u.id !== id) })),

      // Automations
      automationRules: [],
      addAutomationRule: (r) => set((state) => ({ automationRules: [...state.automationRules, r] })),
      updateAutomationRule: (id, data) => set((state) => ({ automationRules: state.automationRules.map((r) => r.id === id ? { ...r, ...data } : r) })),
      deleteAutomationRule: (id) => set((state) => ({ automationRules: state.automationRules.filter((r) => r.id !== id) })),

      // SOPs
      sops: [],
      addSOP: (s) => set((state) => ({ sops: [...state.sops, s] })),
      updateSOP: (id, data) => set((state) => ({ sops: state.sops.map((s) => s.id === id ? { ...s, ...data } : s) })),

      // Moodboard
      moodboardItems: [],
      addMoodboardItem: (m) => set((state) => ({ moodboardItems: [...state.moodboardItems, m] })),
      updateMoodboardItem: (id, data) => set((state) => ({ moodboardItems: state.moodboardItems.map((m) => m.id === id ? { ...m, ...data } : m) })),
      deleteMoodboardItem: (id) => set((state) => ({ moodboardItems: state.moodboardItems.filter((m) => m.id !== id) })),

      // Files
      projectFiles: [],
      addProjectFile: (f) => set((state) => ({ projectFiles: [...state.projectFiles, f] })),
      deleteProjectFile: (id) => set((state) => ({ projectFiles: state.projectFiles.filter((f) => f.id !== id) })),
    }),
    { name: 'studioforma-store', version: 2 }
  )
);
