import type {
  User, Project, Client, Lead, Task, Milestone, Activity, Note, Quote,
  PurchaseRequest, PurchaseOrder, Invoice, Payment, Expense, InventoryItem,
  StockTransaction, Snag, Timesheet, Checklist, Notification, QuickUpdate,
  AutomationRule, SOP, Employee, WorkOrder, AppSettings, MoodboardItem,
  ProjectFile
} from '../types';

const now = new Date();
const d = (offset: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() + offset);
  return date.toISOString();
};

// ============================================================
// SETTINGS
// ============================================================
export const settings: AppSettings = {
  companyName: 'Studio Forma Interiors',
  primaryColor: '#3B4CCA',
  secondaryColor: '#F5F5F5',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
};

// ============================================================
// USERS
// ============================================================
export const users: User[] = [
  { id: 'u1', name: 'Arjun Sharma', email: 'arjun@studioforma.in', role: 'admin', department: 'Management', phone: '+91 98100 12345', status: 'active', joiningDate: '2020-01-15' },
  { id: 'u2', name: 'Priya Mehta', email: 'priya@studioforma.in', role: 'project_manager', department: 'Projects', phone: '+91 98200 23456', status: 'active', joiningDate: '2021-03-10' },
  { id: 'u3', name: 'Kavya Reddy', email: 'kavya@studioforma.in', role: 'designer', department: 'Design', phone: '+91 98300 34567', status: 'active', joiningDate: '2021-07-20' },
  { id: 'u4', name: 'Rahul Gupta', email: 'rahul@studioforma.in', role: 'procurement', department: 'Procurement', phone: '+91 98400 45678', status: 'active', joiningDate: '2022-01-05' },
  { id: 'u5', name: 'Sneha Iyer', email: 'sneha@studioforma.in', role: 'finance', department: 'Finance', phone: '+91 98500 56789', status: 'active', joiningDate: '2022-04-15' },
  { id: 'u6', name: 'Vikram Singh', email: 'vikram@studioforma.in', role: 'site_supervisor', department: 'Operations', phone: '+91 98600 67890', status: 'active', joiningDate: '2021-11-01' },
  { id: 'u7', name: 'Meera Nair', email: 'meera@studioforma.in', role: 'designer', department: 'Design', phone: '+91 98700 78901', status: 'active', joiningDate: '2023-02-14' },
  { id: 'u8', name: 'Amit Joshi', email: 'amit@studioforma.in', role: 'hr', department: 'HR', phone: '+91 98800 89012', status: 'active', joiningDate: '2020-06-01' },
];

// ============================================================
// EMPLOYEES
// ============================================================
export const employees: Employee[] = [
  { id: 'e1', userId: 'u1', name: 'Arjun Sharma', role: 'Director', department: 'Management', email: 'arjun@studioforma.in', phone: '+91 98100 12345', joiningDate: '2020-01-15', status: 'active' },
  { id: 'e2', userId: 'u2', name: 'Priya Mehta', role: 'Senior Project Manager', department: 'Projects', email: 'priya@studioforma.in', phone: '+91 98200 23456', joiningDate: '2021-03-10', status: 'active', managerId: 'e1' },
  { id: 'e3', userId: 'u3', name: 'Kavya Reddy', role: 'Lead Designer', department: 'Design', email: 'kavya@studioforma.in', phone: '+91 98300 34567', joiningDate: '2021-07-20', status: 'active', managerId: 'e2' },
  { id: 'e4', userId: 'u4', name: 'Rahul Gupta', role: 'Procurement Manager', department: 'Procurement', email: 'rahul@studioforma.in', phone: '+91 98400 45678', joiningDate: '2022-01-05', status: 'active', managerId: 'e1' },
  { id: 'e5', userId: 'u5', name: 'Sneha Iyer', role: 'Finance Manager', department: 'Finance', email: 'sneha@studioforma.in', phone: '+91 98500 56789', joiningDate: '2022-04-15', status: 'active', managerId: 'e1' },
  { id: 'e6', userId: 'u6', name: 'Vikram Singh', role: 'Site Supervisor', department: 'Operations', email: 'vikram@studioforma.in', phone: '+91 98600 67890', joiningDate: '2021-11-01', status: 'active', managerId: 'e2' },
  { id: 'e7', userId: 'u7', name: 'Meera Nair', role: 'Interior Designer', department: 'Design', email: 'meera@studioforma.in', phone: '+91 98700 78901', joiningDate: '2023-02-14', status: 'active', managerId: 'e3' },
  { id: 'e8', userId: 'u8', name: 'Amit Joshi', role: 'HR Manager', department: 'HR', email: 'amit@studioforma.in', phone: '+91 98800 89012', joiningDate: '2020-06-01', status: 'active', managerId: 'e1' },
];

// ============================================================
// CLIENTS
// ============================================================
export const clients: Client[] = [
  { id: 'c1', name: 'Rajiv Malhotra', email: 'rajiv.malhotra@email.com', phone: '+91 99100 11111', company: 'Malhotra Group', address: 'B-24 DLF Phase 2', city: 'Gurugram', createdAt: d(-180), projectIds: ['p1', 'p2'] },
  { id: 'c2', name: 'Sunita Kapoor', email: 'sunita.kapoor@email.com', phone: '+91 99200 22222', address: 'Villa 27, Omega Green', city: 'Greater Noida', createdAt: d(-120), projectIds: ['p3'] },
  { id: 'c3', name: 'Deepak Verma', email: 'deepak.verma@email.com', phone: '+91 99300 33333', company: 'Verma Constructions', address: 'Office 14, M3M Broadway', city: 'Noida', createdAt: d(-90), projectIds: ['p4'] },
  { id: 'c4', name: 'Anjali Patel', email: 'anjali.patel@email.com', phone: '+91 99400 44444', address: 'Flat 8B, Godrej Garden City', city: 'Ahmedabad', createdAt: d(-60), projectIds: ['p5'] },
  { id: 'c5', name: 'Vikas Sharma', email: 'vikas.sharma@email.com', phone: '+91 99500 55555', company: 'Sharma Hospitality', address: '34 Commercial Avenue', city: 'Mumbai', createdAt: d(-45), projectIds: [] },
];

// ============================================================
// LEADS
// ============================================================
export const leads: Lead[] = [
  { id: 'l1', name: 'Mohan Agarwal', email: 'mohan.a@email.com', phone: '+91 88100 11111', source: 'Website', stage: 'qualified', budget: 4500000, projectType: 'Residential Villa', location: 'Gurgaon', followUpDate: d(3), notes: 'Looking for complete turnkey solution for 4BHK villa', assignedTo: 'u2', createdAt: d(-15), updatedAt: d(-2), activities: [] },
  { id: 'l2', name: 'Ritu Bhatia', email: 'ritu.b@email.com', phone: '+91 88200 22222', source: 'Referral', stage: 'proposal', budget: 2800000, projectType: 'Apartment', location: 'Noida', followUpDate: d(1), notes: '3BHK apartment, interested in modern minimalist style', assignedTo: 'u2', createdAt: d(-22), updatedAt: d(-1), activities: [] },
  { id: 'l3', name: 'Suresh Tiwari', email: 'suresh.t@email.com', phone: '+91 88300 33333', source: 'Instagram', stage: 'negotiation', budget: 8000000, projectType: 'Commercial Office', location: 'Mumbai', followUpDate: d(-1), notes: 'Office for tech startup, 5000 sqft, open plan design preferred', assignedTo: 'u2', createdAt: d(-30), updatedAt: d(-3), activities: [] },
  { id: 'l4', name: 'Neeta Khanna', email: 'neetha.k@email.com', phone: '+91 88400 44444', source: 'Houzz', stage: 'contacted', budget: 1500000, projectType: 'Studio Apartment', location: 'Delhi', followUpDate: d(5), notes: 'Studio apartment, very specific about storage solutions', assignedTo: 'u3', createdAt: d(-8), updatedAt: d(-8), activities: [] },
  { id: 'l5', name: 'Harish Menon', email: 'harish.m@email.com', phone: '+91 88500 55555', source: 'Word of Mouth', stage: 'new', budget: 6000000, projectType: 'Duplex', location: 'Bangalore', createdAt: d(-3), updatedAt: d(-3), activities: [] },
  { id: 'l6', name: 'Pooja Desai', email: 'pooja.d@email.com', phone: '+91 88600 66666', source: 'Google', stage: 'won', budget: 3200000, projectType: 'Penthouse', location: 'Pune', notes: 'Converted — see Client #c5', convertedToClientId: 'c5', assignedTo: 'u2', createdAt: d(-45), updatedAt: d(-45), activities: [] },
  { id: 'l7', name: 'Arun Saxena', email: 'arun.s@email.com', phone: '+91 88700 77777', source: 'LinkedIn', stage: 'lost', budget: 5000000, projectType: 'Boutique Hotel', location: 'Jaipur', notes: 'Went with competitor due to timeline constraints', createdAt: d(-60), updatedAt: d(-60), activities: [] },
];

// ============================================================
// PROJECTS
// ============================================================
export const projects: Project[] = [
  {
    id: 'p1',
    name: 'Malhotra Residence — DLF Phase 2',
    clientId: 'c1',
    projectType: 'Residential',
    location: 'DLF Phase 2, Gurugram',
    startDate: d(-90),
    targetCompletion: d(60),
    projectManagerId: 'u2',
    budget: 8500000,
    status: 'execution',
    progress: 68,
    priority: 'high',
    description: '5BHK luxury residence with full interior design and execution. Covers living, dining, kitchen, 5 bedrooms, home theatre, and landscaping.',
    area: 4200,
    teamIds: ['u2', 'u3', 'u4', 'u6'],
    createdAt: d(-95),
    updatedAt: d(-1),
    tags: ['luxury', 'residential', 'flagship'],
  },
  {
    id: 'p2',
    name: 'Malhotra Corporate Office',
    clientId: 'c1',
    projectType: 'Commercial',
    location: 'Cyber Hub, Gurugram',
    startDate: d(-30),
    targetCompletion: d(90),
    projectManagerId: 'u2',
    budget: 4200000,
    status: 'design',
    progress: 32,
    priority: 'medium',
    description: 'Corporate office fitout — 3500 sqft. Open workspace with 60 seats, 4 cabins, 2 conference rooms, reception, and lounge.',
    area: 3500,
    teamIds: ['u2', 'u3', 'u7'],
    createdAt: d(-35),
    updatedAt: d(-2),
    tags: ['commercial', 'corporate'],
  },
  {
    id: 'p3',
    name: 'Villa 27 — Greater Noida',
    clientId: 'c2',
    projectType: 'Residential',
    location: 'Omega Green, Greater Noida',
    startDate: d(-60),
    targetCompletion: d(30),
    projectManagerId: 'u2',
    budget: 6200000,
    status: 'procurement',
    progress: 55,
    priority: 'critical',
    description: 'Complete interior design and fitout for 4BHK villa including basement, ground floor, and first floor.',
    area: 3800,
    teamIds: ['u2', 'u3', 'u4', 'u6', 'u7'],
    createdAt: d(-65),
    updatedAt: d(-1),
    tags: ['villa', 'premium', 'noida'],
  },
  {
    id: 'p4',
    name: 'Verma Tech Office',
    clientId: 'c3',
    projectType: 'Commercial',
    location: 'M3M Broadway, Noida',
    startDate: d(-15),
    targetCompletion: d(75),
    projectManagerId: 'u2',
    budget: 3100000,
    status: 'planning',
    progress: 18,
    priority: 'medium',
    description: 'Modern tech office for 40-person team. Agile workspace with standing desks, breakout zones, and modern pantry.',
    area: 2800,
    teamIds: ['u2', 'u7'],
    createdAt: d(-20),
    updatedAt: d(-5),
    tags: ['office', 'tech', 'modern'],
  },
  {
    id: 'p5',
    name: 'Kapoor Apartment Renovation',
    clientId: 'c4',
    projectType: 'Residential',
    location: 'Godrej Garden City, Ahmedabad',
    startDate: d(-120),
    targetCompletion: d(-15),
    projectManagerId: 'u2',
    budget: 2400000,
    status: 'handover',
    progress: 94,
    priority: 'high',
    description: '3BHK apartment renovation with modular kitchen, wardrobes, and complete interior styling.',
    area: 1800,
    teamIds: ['u2', 'u3', 'u6'],
    createdAt: d(-125),
    updatedAt: d(-1),
    tags: ['apartment', 'renovation'],
  },
];

// ============================================================
// TASKS
// ============================================================
export const tasks: Task[] = [
  // Project p1 Tasks
  { id: 't1', title: 'Final design drawings — Living & Dining', projectId: 'p1', milestoneId: 'm2', assigneeId: 'u3', status: 'done', priority: 'high', dueDate: d(-20), completedAt: d(-22), subtasks: [{id: 'st1', title: 'Living room layout', status: 'done'}, {id: 'st2', title: 'Dining area layout', status: 'done'}, {id: 'st3', title: 'Ceiling design', status: 'done'}], comments: [], estimatedHours: 24, actualHours: 22, createdAt: d(-80), updatedAt: d(-22) },
  { id: 't2', title: 'Procure Italian marble — Foyer', projectId: 'p1', milestoneId: 'm3', assigneeId: 'u4', status: 'in_progress', priority: 'high', dueDate: d(5), subtasks: [{id: 'st4', title: 'Vendor finalization', status: 'done'}, {id: 'st5', title: 'Sample approval', status: 'done'}, {id: 'st6', title: 'Order placement', status: 'done'}, {id: 'st7', title: 'Delivery tracking', status: 'todo'}], comments: [], createdAt: d(-30), updatedAt: d(-2) },
  { id: 't3', title: 'Install modular kitchen cabinetry', projectId: 'p1', milestoneId: 'm4', assigneeId: 'u6', status: 'in_progress', priority: 'high', dueDate: d(12), subtasks: [{id: 'st8', title: 'Base cabinet installation', status: 'done'}, {id: 'st9', title: 'Wall unit installation', status: 'todo'}, {id: 'st10', title: 'Counter top fitting', status: 'todo'}], comments: [], estimatedHours: 32, createdAt: d(-15), updatedAt: d(-1) },
  { id: 't4', title: 'Electrical rough work — Master Bedroom', projectId: 'p1', assigneeId: 'u6', status: 'done', priority: 'medium', dueDate: d(-10), completedAt: d(-8), subtasks: [], comments: [], createdAt: d(-40), updatedAt: d(-8) },
  { id: 't5', title: 'False ceiling installation — Living room', projectId: 'p1', assigneeId: 'u6', status: 'review', priority: 'high', dueDate: d(3), subtasks: [{id: 'st11', title: 'Framework setup', status: 'done'}, {id: 'st12', title: 'Gypsum board', status: 'done'}, {id: 'st13', title: 'Cove lighting', status: 'todo'}], comments: [], createdAt: d(-20), updatedAt: d(-1) },
  { id: 't6', title: 'Client review — Bedroom designs', projectId: 'p1', milestoneId: 'm2', assigneeId: 'u3', status: 'blocked', priority: 'high', dueDate: d(-5), subtasks: [], comments: [{id: 'tc1', taskId: 't6', authorId: 'u2', content: 'Waiting for client to confirm availability for site visit', createdAt: d(-3)}], createdAt: d(-25), updatedAt: d(-3) },
  { id: 't7', title: 'Flooring work — Ground floor', projectId: 'p1', assigneeId: 'u6', status: 'todo', priority: 'medium', dueDate: d(18), subtasks: [], comments: [], createdAt: d(-10), updatedAt: d(-10) },
  { id: 't8', title: 'Bathroom fittings — Master bath', projectId: 'p1', assigneeId: 'u6', status: 'todo', priority: 'medium', dueDate: d(22), subtasks: [], comments: [], createdAt: d(-10), updatedAt: d(-10) },

  // Project p3 Tasks
  { id: 't9', title: 'Design concept presentation', projectId: 'p3', milestoneId: 'm6', assigneeId: 'u3', status: 'done', priority: 'high', dueDate: d(-40), completedAt: d(-42), subtasks: [{id: 'st14', title: 'Mood board', status: 'done'}, {id: 'st15', title: '3D renders', status: 'done'}], comments: [], createdAt: d(-60), updatedAt: d(-42) },
  { id: 't10', title: 'BOQ finalization', projectId: 'p3', milestoneId: 'm7', assigneeId: 'u4', status: 'done', priority: 'high', dueDate: d(-30), completedAt: d(-28), subtasks: [], comments: [], createdAt: d(-55), updatedAt: d(-28) },
  { id: 't11', title: 'Procure teak wood furniture', projectId: 'p3', assigneeId: 'u4', status: 'in_progress', priority: 'high', dueDate: d(8), subtasks: [{id: 'st16', title: 'Vendor shortlist', status: 'done'}, {id: 'st17', title: 'PO issued', status: 'done'}, {id: 'st18', title: 'Delivery pending', status: 'todo'}], comments: [], createdAt: d(-25), updatedAt: d(-2) },
  { id: 't12', title: 'Site measurement verification', projectId: 'p3', assigneeId: 'u6', status: 'done', priority: 'medium', dueDate: d(-50), completedAt: d(-50), subtasks: [], comments: [], createdAt: d(-60), updatedAt: d(-50) },
  { id: 't13', title: 'Civil work — Partition walls', projectId: 'p3', assigneeId: 'u6', status: 'in_progress', priority: 'high', dueDate: d(6), subtasks: [], comments: [], createdAt: d(-20), updatedAt: d(-1) },
  { id: 't14', title: 'Order kitchen appliances', projectId: 'p3', assigneeId: 'u4', status: 'todo', priority: 'medium', dueDate: d(15), subtasks: [], comments: [], createdAt: d(-5), updatedAt: d(-5) },

  // Project p2 Tasks
  { id: 't15', title: 'Space planning — all floors', projectId: 'p2', assigneeId: 'u3', status: 'done', priority: 'high', dueDate: d(-15), completedAt: d(-14), subtasks: [], comments: [], createdAt: d(-30), updatedAt: d(-14) },
  { id: 't16', title: 'Furniture design for cabins', projectId: 'p2', assigneeId: 'u7', status: 'in_progress', priority: 'medium', dueDate: d(10), subtasks: [], comments: [], createdAt: d(-20), updatedAt: d(-3) },
  { id: 't17', title: 'Client approval — design concept', projectId: 'p2', assigneeId: 'u2', status: 'todo', priority: 'high', dueDate: d(5), subtasks: [], comments: [], createdAt: d(-10), updatedAt: d(-10) },

  // Project p4 Tasks
  { id: 't18', title: 'Initial site visit and measurement', projectId: 'p4', assigneeId: 'u6', status: 'done', priority: 'high', dueDate: d(-10), completedAt: d(-9), subtasks: [], comments: [], createdAt: d(-15), updatedAt: d(-9) },
  { id: 't19', title: 'Design brief preparation', projectId: 'p4', assigneeId: 'u7', status: 'in_progress', priority: 'medium', dueDate: d(5), subtasks: [], comments: [], createdAt: d(-10), updatedAt: d(-5) },

  // Project p5 Tasks
  { id: 't20', title: 'Final punch list items', projectId: 'p5', assigneeId: 'u6', status: 'in_progress', priority: 'urgent', dueDate: d(2), subtasks: [{id: 'st19', title: 'Touch-up painting', status: 'todo'}, {id: 'st20', title: 'Accessory placement', status: 'todo'}], comments: [], createdAt: d(-5), updatedAt: d(-1) },
  { id: 't21', title: 'Prepare handover documents', projectId: 'p5', assigneeId: 'u2', status: 'todo', priority: 'high', dueDate: d(3), subtasks: [], comments: [], createdAt: d(-3), updatedAt: d(-3) },
  { id: 't22', title: 'Final client walkthrough', projectId: 'p5', assigneeId: 'u2', status: 'todo', priority: 'high', dueDate: d(5), subtasks: [], comments: [], createdAt: d(-3), updatedAt: d(-3) },
];

// ============================================================
// MILESTONES
// ============================================================
export const milestones: Milestone[] = [
  // Project p1
  { id: 'm1', projectId: 'p1', title: 'Design Approval', dueDate: d(-80), completedAt: d(-78), status: 'completed', taskIds: [], order: 1, description: 'Client approves all design concepts and 3D renders' },
  { id: 'm2', projectId: 'p1', title: 'BOQ Finalized', dueDate: d(-50), completedAt: d(-48), status: 'completed', taskIds: ['t1'], order: 2, description: 'Bill of quantities approved by client and PM' },
  { id: 'm3', projectId: 'p1', title: 'Procurement Complete', dueDate: d(10), status: 'in_progress', taskIds: ['t2'], order: 3, description: 'All materials and furniture ordered and delivered' },
  { id: 'm4', projectId: 'p1', title: 'Civil & MEP Complete', dueDate: d(20), status: 'in_progress', taskIds: ['t3', 't5'], order: 4, description: 'All civil, electrical, plumbing work complete' },
  { id: 'm5', projectId: 'p1', title: 'Handover', dueDate: d(60), status: 'pending', taskIds: [], order: 5, description: 'Final handover to client with snag clearance' },

  // Project p3
  { id: 'm6', projectId: 'p3', title: 'Design Approval', dueDate: d(-40), completedAt: d(-42), status: 'completed', taskIds: ['t9'], order: 1 },
  { id: 'm7', projectId: 'p3', title: 'BOQ Finalized', dueDate: d(-28), completedAt: d(-28), status: 'completed', taskIds: ['t10'], order: 2 },
  { id: 'm8', projectId: 'p3', title: 'Procurement Complete', dueDate: d(15), status: 'in_progress', taskIds: ['t11'], order: 3 },
  { id: 'm9', projectId: 'p3', title: 'Site Execution Start', dueDate: d(-20), completedAt: d(-18), status: 'completed', taskIds: ['t12', 't13'], order: 4 },
  { id: 'm10', projectId: 'p3', title: 'Handover', dueDate: d(30), status: 'pending', taskIds: [], order: 5 },

  // Project p2
  { id: 'm11', projectId: 'p2', title: 'Design Concept Approval', dueDate: d(5), status: 'pending', taskIds: ['t15', 't17'], order: 1 },
  { id: 'm12', projectId: 'p2', title: 'Final Drawings', dueDate: d(25), status: 'pending', taskIds: ['t16'], order: 2 },

  // Project p5
  { id: 'm13', projectId: 'p5', title: 'Final Inspection', dueDate: d(2), status: 'in_progress', taskIds: ['t20'], order: 1 },
  { id: 'm14', projectId: 'p5', title: 'Client Handover', dueDate: d(5), status: 'pending', taskIds: ['t21', 't22'], order: 2 },
];

// ============================================================
// QUOTES
// ============================================================
export const quotes: Quote[] = [
  {
    id: 'q1', quoteNumber: 'QUO-2024-001', clientId: 'c1', projectId: 'p1',
    items: [
      { id: 'qi1', description: 'Interior Design Fee — Complete Residence', quantity: 1, unit: 'LS', unitPrice: 500000, taxRate: 18, discount: 0, total: 590000 },
      { id: 'qi2', description: 'Modular Kitchen — Imported finish', quantity: 1, unit: 'LS', unitPrice: 850000, taxRate: 18, discount: 5, total: 951950 },
      { id: 'qi3', description: 'Wardrobes — 5 Bedrooms', quantity: 5, unit: 'nos', unitPrice: 120000, taxRate: 18, discount: 0, total: 708000 },
      { id: 'qi4', description: 'False Ceiling — All areas', quantity: 420, unit: 'sqft', unitPrice: 850, taxRate: 18, discount: 0, total: 421260 },
      { id: 'qi5', description: 'Flooring — Italian Marble', quantity: 3800, unit: 'sqft', unitPrice: 450, taxRate: 18, discount: 0, total: 2016900 },
    ],
    subtotal: 7200000, taxTotal: 1296000, discountTotal: 0, total: 8500000,
    validUntil: d(30), status: 'approved', notes: 'Payment terms: 40% advance, 30% on site start, 30% on completion',
    createdAt: d(-95), updatedAt: d(-90),
  },
  {
    id: 'q2', quoteNumber: 'QUO-2024-002', clientId: 'c2', projectId: 'p3',
    items: [
      { id: 'qi6', description: 'Design & Consultancy', quantity: 1, unit: 'LS', unitPrice: 350000, taxRate: 18, discount: 0, total: 413000 },
      { id: 'qi7', description: 'Furniture Package — Premium Teak', quantity: 1, unit: 'LS', unitPrice: 1800000, taxRate: 18, discount: 0, total: 2124000 },
      { id: 'qi8', description: 'Electrical & Lighting', quantity: 1, unit: 'LS', unitPrice: 650000, taxRate: 18, discount: 0, total: 767000 },
      { id: 'qi9', description: 'Civil & Plastering Works', quantity: 1, unit: 'LS', unitPrice: 420000, taxRate: 18, discount: 0, total: 495600 },
    ],
    subtotal: 5254237, taxTotal: 945763, discountTotal: 0, total: 6200000,
    validUntil: d(-30), status: 'approved', notes: '',
    createdAt: d(-65), updatedAt: d(-60),
  },
  {
    id: 'q3', quoteNumber: 'QUO-2024-003', clientId: 'c3', projectId: 'p4',
    items: [
      { id: 'qi10', description: 'Design & Space Planning', quantity: 1, unit: 'LS', unitPrice: 200000, taxRate: 18, discount: 0, total: 236000 },
      { id: 'qi11', description: 'Furniture & Workstations', quantity: 40, unit: 'workstation', unitPrice: 35000, taxRate: 18, discount: 0, total: 1652000 },
      { id: 'qi12', description: 'Conference Room Fit-out', quantity: 2, unit: 'rooms', unitPrice: 350000, taxRate: 18, discount: 5, total: 785400 },
    ],
    subtotal: 2627119, taxTotal: 472881, discountTotal: 0, total: 3100000,
    validUntil: d(20), status: 'sent',
    createdAt: d(-18), updatedAt: d(-15),
  },
  {
    id: 'q4', quoteNumber: 'QUO-2024-004', clientId: 'c4', projectId: 'p5',
    items: [
      { id: 'qi13', description: 'Complete Interior Package', quantity: 1, unit: 'LS', unitPrice: 2033898, taxRate: 18, discount: 0, total: 2400000 },
    ],
    subtotal: 2033898, taxTotal: 366102, discountTotal: 0, total: 2400000,
    validUntil: d(-90), status: 'approved',
    createdAt: d(-125), updatedAt: d(-120),
  },
];

// ============================================================
// PURCHASE REQUESTS
// ============================================================
export const purchaseRequests: PurchaseRequest[] = [
  {
    id: 'pr1', prNumber: 'PR-2024-001', projectId: 'p1', requestedById: 'u4',
    items: [{ id: 'pri1', description: 'Italian Carrara Marble — 4mm thick', quantity: 400, unit: 'sqft', estimatedRate: 450 }],
    priority: 'high', requiredBy: d(5), status: 'approved', approvedById: 'u1',
    notes: 'For foyer and living room', createdAt: d(-35), updatedAt: d(-30),
  },
  {
    id: 'pr2', prNumber: 'PR-2024-002', projectId: 'p1', requestedById: 'u4',
    items: [{ id: 'pri2', description: 'Modular Kitchen Unit — Premium Acrylic', quantity: 1, unit: 'set', estimatedRate: 850000 }],
    priority: 'urgent', requiredBy: d(-5), status: 'ordered', approvedById: 'u1',
    createdAt: d(-50), updatedAt: d(-45),
  },
  {
    id: 'pr3', prNumber: 'PR-2024-003', projectId: 'p3', requestedById: 'u4',
    items: [
      { id: 'pri3', description: 'Teak Wood — Grade A', quantity: 120, unit: 'sqft', estimatedRate: 1200 },
      { id: 'pri4', description: 'Upholstery Fabric — Belgian linen', quantity: 80, unit: 'meters', estimatedRate: 800 },
    ],
    priority: 'high', requiredBy: d(8), status: 'approved', approvedById: 'u1',
    createdAt: d(-25), updatedAt: d(-20),
  },
  {
    id: 'pr4', prNumber: 'PR-2024-004', projectId: 'p3', requestedById: 'u4',
    items: [{ id: 'pri5', description: 'Kitchen Appliances Package', quantity: 1, unit: 'set', estimatedRate: 380000 }],
    priority: 'medium', requiredBy: d(15), status: 'pending_approval',
    createdAt: d(-5), updatedAt: d(-5),
  },
  {
    id: 'pr5', prNumber: 'PR-2024-005', projectId: 'p2', requestedById: 'u4',
    items: [{ id: 'pri6', description: 'Ergonomic Office Chairs', quantity: 60, unit: 'nos', estimatedRate: 8500 }],
    priority: 'medium', requiredBy: d(25), status: 'draft',
    createdAt: d(-2), updatedAt: d(-2),
  },
];

// ============================================================
// PURCHASE ORDERS
// ============================================================
export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'po1', poNumber: 'PO-2024-001', vendorName: 'Marble World India', projectId: 'p1', prId: 'pr1',
    items: [{ id: 'poi1', description: 'Italian Carrara Marble 4mm', quantity: 420, unit: 'sqft', rate: 445, total: 186900 }],
    total: 186900, expectedDelivery: d(3), status: 'ordered',
    createdAt: d(-28), updatedAt: d(-25),
  },
  {
    id: 'po2', poNumber: 'PO-2024-002', vendorName: 'Sleek Modular Systems', projectId: 'p1', prId: 'pr2',
    items: [{ id: 'poi2', description: 'Modular Kitchen Unit Premium', quantity: 1, unit: 'set', rate: 865000, total: 865000 }],
    total: 865000, expectedDelivery: d(-8), status: 'received',
    createdAt: d(-45), updatedAt: d(-7),
  },
  {
    id: 'po3', poNumber: 'PO-2024-003', vendorName: 'Royal Teak Emporium', projectId: 'p3', prId: 'pr3',
    items: [
      { id: 'poi3', description: 'Teak Wood Grade A', quantity: 125, unit: 'sqft', rate: 1180, total: 147500 },
      { id: 'poi4', description: 'Belgian Linen Upholstery', quantity: 85, unit: 'meters', rate: 790, total: 67150 },
    ],
    total: 214650, expectedDelivery: d(6), status: 'approved',
    createdAt: d(-18), updatedAt: d(-15),
  },
];

// ============================================================
// WORK ORDERS
// ============================================================
export const workOrders: WorkOrder[] = [
  {
    id: 'wo1', woNumber: 'WO-2024-001', contractorName: 'Supreme Civil Works', projectId: 'p1',
    scope: 'False ceiling, partitions, gypsum work — entire residence', amount: 620000,
    startDate: d(-35), endDate: d(20), status: 'in_progress',
    createdAt: d(-40),
  },
  {
    id: 'wo2', woNumber: 'WO-2024-002', contractorName: 'Star Electricals', projectId: 'p1',
    scope: 'Complete electrical work including conduit, wiring, DB, fixtures', amount: 380000,
    startDate: d(-30), endDate: d(15), status: 'in_progress',
    createdAt: d(-35),
  },
  {
    id: 'wo3', woNumber: 'WO-2024-003', contractorName: 'Ace Plumbing & Sanitary', projectId: 'p3',
    scope: 'Plumbing and sanitary work — all bathrooms and kitchen', amount: 245000,
    startDate: d(-25), endDate: d(10), status: 'in_progress',
    createdAt: d(-30),
  },
];

// ============================================================
// INVOICES
// ============================================================
export const invoices: Invoice[] = [
  {
    id: 'inv1', invoiceNumber: 'INV-2024-001', clientId: 'c1', projectId: 'p1',
    items: [{ id: 'ii1', description: 'Advance Payment — 40%', quantity: 1, unit: 'LS', unitPrice: 3400000, taxRate: 0, total: 3400000 }],
    subtotal: 3400000, taxTotal: 0, total: 3400000, dueDate: d(-85), status: 'paid',
    createdAt: d(-92), updatedAt: d(-85),
  },
  {
    id: 'inv2', invoiceNumber: 'INV-2024-002', clientId: 'c1', projectId: 'p1',
    items: [{ id: 'ii2', description: 'Progress Payment — Site Commencement', quantity: 1, unit: 'LS', unitPrice: 2550000, taxRate: 0, total: 2550000 }],
    subtotal: 2550000, taxTotal: 0, total: 2550000, dueDate: d(-30), status: 'paid',
    createdAt: d(-50), updatedAt: d(-28),
  },
  {
    id: 'inv3', invoiceNumber: 'INV-2024-003', clientId: 'c1', projectId: 'p1',
    items: [{ id: 'ii3', description: 'Progress Payment — 75% Completion', quantity: 1, unit: 'LS', unitPrice: 1700000, taxRate: 0, total: 1700000 }],
    subtotal: 1700000, taxTotal: 0, total: 1700000, dueDate: d(15), status: 'sent',
    createdAt: d(-5), updatedAt: d(-5),
  },
  {
    id: 'inv4', invoiceNumber: 'INV-2024-004', clientId: 'c2', projectId: 'p3',
    items: [{ id: 'ii4', description: 'Advance Payment — 40%', quantity: 1, unit: 'LS', unitPrice: 2480000, taxRate: 0, total: 2480000 }],
    subtotal: 2480000, taxTotal: 0, total: 2480000, dueDate: d(-55), status: 'paid',
    createdAt: d(-63), updatedAt: d(-55),
  },
  {
    id: 'inv5', invoiceNumber: 'INV-2024-005', clientId: 'c2', projectId: 'p3',
    items: [{ id: 'ii5', description: 'Progress Payment — Procurement Milestone', quantity: 1, unit: 'LS', unitPrice: 1860000, taxRate: 0, total: 1860000 }],
    subtotal: 1860000, taxTotal: 0, total: 1860000, dueDate: d(-5), status: 'overdue',
    createdAt: d(-25), updatedAt: d(-25),
  },
  {
    id: 'inv6', invoiceNumber: 'INV-2024-006', clientId: 'c4', projectId: 'p5',
    items: [{ id: 'ii6', description: 'Final Payment', quantity: 1, unit: 'LS', unitPrice: 720000, taxRate: 0, total: 720000 }],
    subtotal: 720000, taxTotal: 0, total: 720000, dueDate: d(5), status: 'sent',
    createdAt: d(-3), updatedAt: d(-3),
  },
  {
    id: 'inv7', invoiceNumber: 'INV-2024-007', clientId: 'c4', projectId: 'p5',
    items: [{ id: 'ii7', description: 'Advance Payment', quantity: 1, unit: 'LS', unitPrice: 960000, taxRate: 0, total: 960000 }],
    subtotal: 960000, taxTotal: 0, total: 960000, dueDate: d(-115), status: 'paid',
    createdAt: d(-123), updatedAt: d(-115),
  },
  {
    id: 'inv8', invoiceNumber: 'INV-2024-008', clientId: 'c4', projectId: 'p5',
    items: [{ id: 'ii8', description: 'Progress Payment', quantity: 1, unit: 'LS', unitPrice: 720000, taxRate: 0, total: 720000 }],
    subtotal: 720000, taxTotal: 0, total: 720000, dueDate: d(-65), status: 'paid',
    createdAt: d(-80), updatedAt: d(-65),
  },
];

// ============================================================
// PAYMENTS
// ============================================================
export const payments: Payment[] = [
  { id: 'pay1', invoiceId: 'inv1', projectId: 'p1', clientId: 'c1', amount: 3400000, method: 'bank_transfer', reference: 'UTR2024001001', date: d(-84), createdAt: d(-84) },
  { id: 'pay2', invoiceId: 'inv2', projectId: 'p1', clientId: 'c1', amount: 2550000, method: 'bank_transfer', reference: 'UTR2024001002', date: d(-27), createdAt: d(-27) },
  { id: 'pay3', invoiceId: 'inv4', projectId: 'p3', clientId: 'c2', amount: 2480000, method: 'cheque', reference: 'CHQ-456789', date: d(-53), createdAt: d(-53) },
  { id: 'pay4', invoiceId: 'inv7', projectId: 'p5', clientId: 'c4', amount: 960000, method: 'bank_transfer', reference: 'UTR2024005001', date: d(-113), createdAt: d(-113) },
  { id: 'pay5', invoiceId: 'inv8', projectId: 'p5', clientId: 'c4', amount: 720000, method: 'upi', reference: 'UPI-2024-8901', date: d(-63), createdAt: d(-63) },
];

// ============================================================
// EXPENSES
// ============================================================
export const expenses: Expense[] = [
  { id: 'exp1', projectId: 'p1', category: 'material', vendorName: 'Marble World India', amount: 186900, date: d(-15), description: 'Italian Carrara marble for foyer', submittedById: 'u4', approvedById: 'u1', status: 'approved', createdAt: d(-15) },
  { id: 'exp2', projectId: 'p1', category: 'labor', vendorName: 'Supreme Civil Works', amount: 210000, date: d(-20), description: 'Civil work advance — part 1', submittedById: 'u6', approvedById: 'u2', status: 'approved', createdAt: d(-20) },
  { id: 'exp3', projectId: 'p1', category: 'material', vendorName: 'Sleek Modular Systems', amount: 865000, date: d(-8), description: 'Modular kitchen full payment', submittedById: 'u4', approvedById: 'u1', status: 'approved', createdAt: d(-8) },
  { id: 'exp4', projectId: 'p1', category: 'transport', amount: 18500, date: d(-10), description: 'Material transportation — multiple trips', submittedById: 'u6', approvedById: 'u2', status: 'approved', createdAt: d(-10) },
  { id: 'exp5', projectId: 'p1', category: 'site', amount: 12000, date: d(-5), description: 'Site consumables and sundries', submittedById: 'u6', status: 'pending', createdAt: d(-5) },
  { id: 'exp6', projectId: 'p3', category: 'labor', vendorName: 'Ace Plumbing', amount: 85000, date: d(-18), description: 'Plumbing work advance', submittedById: 'u6', approvedById: 'u2', status: 'approved', createdAt: d(-18) },
  { id: 'exp7', projectId: 'p3', category: 'material', vendorName: 'Royal Teak', amount: 214650, date: d(-12), description: 'Teak wood and upholstery', submittedById: 'u4', approvedById: 'u1', status: 'approved', createdAt: d(-12) },
  { id: 'exp8', projectId: 'p3', category: 'design', amount: 45000, date: d(-40), description: '3D rendering and visualization', submittedById: 'u3', approvedById: 'u2', status: 'approved', createdAt: d(-40) },
  { id: 'exp9', projectId: 'p5', category: 'labor', amount: 95000, date: d(-30), description: 'Installation labor', submittedById: 'u6', approvedById: 'u2', status: 'approved', createdAt: d(-30) },
  { id: 'exp10', projectId: 'p5', category: 'material', amount: 245000, date: d(-45), description: 'Modular furniture packages', submittedById: 'u4', approvedById: 'u1', status: 'approved', createdAt: d(-45) },
  { id: 'exp11', projectId: 'p2', category: 'design', amount: 35000, date: d(-5), description: 'Design software and rendering', submittedById: 'u3', status: 'pending', createdAt: d(-5) },
  { id: 'exp12', projectId: 'p4', category: 'site', amount: 8500, date: d(-8), description: 'Site visit expenses', submittedById: 'u6', approvedById: 'u2', status: 'approved', createdAt: d(-8) },
];

// ============================================================
// INVENTORY
// ============================================================
export const inventoryItems: InventoryItem[] = [
  { id: 'inv_i1', sku: 'MAR-001', name: 'Italian Carrara Marble Tiles', category: 'Flooring', quantity: 420, unit: 'sqft', location: 'Warehouse A-1', minimumStock: 100, vendorName: 'Marble World India', cost: 445, status: 'in_stock', createdAt: d(-15), updatedAt: d(-15) },
  { id: 'inv_i2', sku: 'WOD-001', name: 'Teak Wood Grade A Planks', category: 'Wood', quantity: 45, unit: 'sqft', location: 'Warehouse A-2', minimumStock: 50, vendorName: 'Royal Teak Emporium', cost: 1180, status: 'low_stock', createdAt: d(-12), updatedAt: d(-12) },
  { id: 'inv_i3', sku: 'FAB-001', name: 'Belgian Linen Upholstery Fabric', category: 'Fabric', quantity: 85, unit: 'meters', location: 'Warehouse B-1', minimumStock: 20, vendorName: 'Textile House', cost: 790, status: 'in_stock', createdAt: d(-12), updatedAt: d(-12) },
  { id: 'inv_i4', sku: 'GYP-001', name: 'Gypsum Board 12mm', category: 'Civil Materials', quantity: 180, unit: 'sheets', location: 'Site Store', minimumStock: 50, vendorName: 'Saint-Gobain', cost: 420, status: 'in_stock', createdAt: d(-20), updatedAt: d(-20) },
  { id: 'inv_i5', sku: 'ELE-001', name: 'LED Downlights 6W', category: 'Electrical', quantity: 8, unit: 'nos', location: 'Warehouse B-2', minimumStock: 20, vendorName: 'Philips Lighting', cost: 350, status: 'low_stock', createdAt: d(-25), updatedAt: d(-5) },
  { id: 'inv_i6', sku: 'PAI-001', name: 'Asian Paints Royale Premium — White', category: 'Paints', quantity: 0, unit: 'liters', location: 'Site Store', minimumStock: 50, vendorName: 'Asian Paints', cost: 280, status: 'out_of_stock', createdAt: d(-30), updatedAt: d(-8) },
  { id: 'inv_i7', sku: 'HWD-001', name: 'Concealed Door Hinges', category: 'Hardware', quantity: 220, unit: 'nos', location: 'Warehouse C-1', minimumStock: 100, vendorName: 'Hafele India', cost: 85, status: 'in_stock', createdAt: d(-15), updatedAt: d(-15) },
  { id: 'inv_i8', sku: 'HWD-002', name: 'Soft Close Drawer Channels', category: 'Hardware', quantity: 65, unit: 'pairs', location: 'Warehouse C-1', minimumStock: 50, vendorName: 'Hafele India', cost: 250, status: 'in_stock', createdAt: d(-15), updatedAt: d(-15) },
  { id: 'inv_i9', sku: 'SAN-001', name: 'Vitrified Tiles 600x600', category: 'Flooring', quantity: 280, unit: 'sqft', location: 'Warehouse A-1', minimumStock: 100, vendorName: 'Kajaria Ceramics', cost: 75, status: 'in_stock', createdAt: d(-10), updatedAt: d(-10) },
  { id: 'inv_i10', sku: 'ELE-002', name: 'Modular Switch Plates', category: 'Electrical', quantity: 45, unit: 'nos', location: 'Warehouse B-2', minimumStock: 30, vendorName: 'Legrand', cost: 1200, status: 'in_stock', createdAt: d(-8), updatedAt: d(-8) },
  { id: 'inv_i11', sku: 'WAL-001', name: 'Wallpaper Rolls — Premium Textured', category: 'Wall Finishes', quantity: 12, unit: 'rolls', location: 'Warehouse B-1', minimumStock: 5, vendorName: 'Asian Paints', cost: 2200, status: 'in_stock', createdAt: d(-5), updatedAt: d(-5) },
  { id: 'inv_i12', sku: 'ACC-001', name: 'Shower Head Set — Chrome', category: 'Bathroom', quantity: 3, unit: 'sets', location: 'Warehouse D-1', minimumStock: 5, vendorName: 'Kohler', cost: 8500, status: 'low_stock', createdAt: d(-8), updatedAt: d(-8) },
];

export const stockTransactions: StockTransaction[] = [
  { id: 'st1', itemId: 'inv_i1', type: 'receive', quantity: 420, projectId: 'p1', reference: 'PO-2024-001', notes: 'Received from Marble World India', performedById: 'u4', createdAt: d(-15) },
  { id: 'st2', itemId: 'inv_i2', type: 'receive', quantity: 125, projectId: 'p3', reference: 'PO-2024-003', notes: 'Received teak wood', performedById: 'u4', createdAt: d(-12) },
  { id: 'st3', itemId: 'inv_i2', type: 'issue', quantity: 80, projectId: 'p3', notes: 'Issued for furniture making', performedById: 'u4', createdAt: d(-5) },
  { id: 'st4', itemId: 'inv_i6', type: 'adjust', quantity: -50, projectId: 'p1', notes: 'Stock adjustment after site audit', performedById: 'u6', createdAt: d(-8) },
];

// ============================================================
// SNAGS
// ============================================================
export const snags: Snag[] = [
  { id: 'sn1', title: 'Uneven wall finish near entrance', projectId: 'p1', area: 'Foyer', description: 'Wall plastering near main entrance has visible undulations. Needs rework before final paint.', severity: 'medium', assignedToId: 'u6', dueDate: d(5), status: 'open', createdAt: d(-3), updatedAt: d(-3) },
  { id: 'sn2', title: 'Tile grout inconsistency — Master Bath', projectId: 'p1', area: 'Master Bathroom', description: 'Grout lines vary in width on feature wall. Rectify before fixture installation.', severity: 'low', assignedToId: 'u6', dueDate: d(7), status: 'in_progress', createdAt: d(-5), updatedAt: d(-2) },
  { id: 'sn3', title: 'False ceiling height mismatch — Dining', projectId: 'p1', area: 'Dining Room', description: 'Dining area false ceiling is 2 inches lower than drawing. Contractor needs to rectify.', severity: 'high', assignedToId: 'u6', dueDate: d(3), status: 'open', createdAt: d(-2), updatedAt: d(-2) },
  { id: 'sn4', title: 'Light switch misaligned — Bedroom 2', projectId: 'p1', area: 'Bedroom 2', description: 'Switch plate not flush with wall surface. Gap visible on right side.', severity: 'low', assignedToId: 'u6', dueDate: d(10), status: 'open', createdAt: d(-1), updatedAt: d(-1) },
  { id: 'sn5', title: 'Water seepage — Bathroom wall', projectId: 'p3', area: 'Guest Bathroom', description: 'Minor seepage visible on bathroom-bedroom shared wall. Waterproofing needs investigation.', severity: 'critical', assignedToId: 'u6', dueDate: d(2), status: 'in_progress', createdAt: d(-4), updatedAt: d(-1) },
  { id: 'sn6', title: 'Scratched glass panel — Study', projectId: 'p3', area: 'Study Room', description: 'Partition glass has surface scratches from construction. Needs replacement.', severity: 'medium', assignedToId: 'u6', dueDate: d(8), status: 'open', createdAt: d(-3), updatedAt: d(-3) },
  { id: 'sn7', title: 'Wardrobe door misalignment — Master', projectId: 'p5', area: 'Master Bedroom', description: 'Sliding wardrobe doors do not align properly. Gap at top of one door panel.', severity: 'medium', assignedToId: 'u6', dueDate: d(2), status: 'resolved', resolvedAt: d(-1), createdAt: d(-6), updatedAt: d(-1) },
  { id: 'sn8', title: 'Paint touch-up — Kids room', projectId: 'p5', area: 'Kids Bedroom', description: 'Paint damage on windowsill area from installation work. Touch-up required.', severity: 'low', assignedToId: 'u6', dueDate: d(3), status: 'in_progress', createdAt: d(-3), updatedAt: d(-1) },
  { id: 'sn9', title: 'Plumbing noise — Kitchen', projectId: 'p3', area: 'Kitchen', description: 'Water hammer noise from kitchen pipes under heavy flow. Plumber to investigate and fix.', severity: 'high', assignedToId: 'u6', dueDate: d(5), status: 'open', createdAt: d(-2), updatedAt: d(-2) },
  { id: 'sn10', title: 'Ceiling crack — Entrance lobby', projectId: 'p1', area: 'Entrance Lobby', description: 'Hairline crack visible on entrance lobby ceiling near the light fitting. Monitor and fix.', severity: 'medium', assignedToId: 'u6', dueDate: d(6), status: 'open', createdAt: d(-1), updatedAt: d(-1) },
];

// ============================================================
// TIMESHEETS
// ============================================================
export const timesheets: Timesheet[] = [
  { id: 'ts1', userId: 'u3', projectId: 'p1', taskId: 't1', date: d(-22), hours: 8, description: 'Final living & dining drawings', createdAt: d(-22) },
  { id: 'ts2', userId: 'u3', projectId: 'p1', date: d(-21), hours: 6, description: 'Bedroom design revisions', createdAt: d(-21) },
  { id: 'ts3', userId: 'u6', projectId: 'p1', taskId: 't5', date: d(-3), hours: 8, description: 'False ceiling framework installation', createdAt: d(-3) },
  { id: 'ts4', userId: 'u6', projectId: 'p1', date: d(-2), hours: 8, description: 'Gypsum board installation continues', createdAt: d(-2) },
  { id: 'ts5', userId: 'u4', projectId: 'p1', taskId: 't2', date: d(-5), hours: 4, description: 'Marble vendor coordination', createdAt: d(-5) },
  { id: 'ts6', userId: 'u2', projectId: 'p1', date: d(-1), hours: 3, description: 'Client update meeting prep', createdAt: d(-1) },
  { id: 'ts7', userId: 'u3', projectId: 'p3', taskId: 't9', date: d(-42), hours: 8, description: 'Design concept and renders', createdAt: d(-42) },
  { id: 'ts8', userId: 'u6', projectId: 'p3', taskId: 't13', date: d(-3), hours: 8, description: 'Partition wall work', createdAt: d(-3) },
  { id: 'ts9', userId: 'u7', projectId: 'p2', taskId: 't16', date: d(-3), hours: 6, description: 'Cabin furniture design', createdAt: d(-3) },
  { id: 'ts10', userId: 'u6', projectId: 'p5', taskId: 't20', date: d(-1), hours: 7, description: 'Punch list execution', createdAt: d(-1) },
];

// ============================================================
// NOTES
// ============================================================
export const notes: Note[] = [
  { id: 'n1', title: 'Client prefers warm tones in master bedroom', content: 'Sunita Kapoor specifically mentioned she wants warm beige/terracotta tones in the master bedroom. Avoid cool grays. She also wants a reading nook near the bay window.', authorId: 'u3', projectId: 'p3', clientId: 'c2', type: 'client', tags: ['design', 'client-preference'], createdAt: d(-55), updatedAt: d(-55) },
  { id: 'n2', title: 'Marble delivery delay — critical path risk', content: 'Called Marble World India today. They confirmed a 5-day delay due to import clearance at Chennai port. Need to adjust P1 schedule accordingly. Rajiv informed.', authorId: 'u4', projectId: 'p1', type: 'project', tags: ['procurement', 'delay', 'risk'], createdAt: d(-7), updatedAt: d(-7) },
  { id: 'n3', title: 'Villa 27 site visit observations', content: 'Visit date: 3 days ago. Civil work progressing well. Main concerns: (1) Plumbing rough-in for master bath needs verification — marks don\'t match drawing. (2) Electrical conduit in kitchen area running too close to gas line — flag to contractor immediately.', authorId: 'u6', projectId: 'p3', type: 'site', tags: ['site', 'risk', 'plumbing', 'electrical'], createdAt: d(-3), updatedAt: d(-3) },
  { id: 'n4', title: 'Q3 procurement planning', content: 'Key items to procure in next 3 weeks for P1 and P3: (1) Bedroom wardrobes — shortlist 2 vendors (2) Bathroom fittings — Kohler preferred by both clients (3) Living room sofas — client approval needed on fabric selection', authorId: 'u4', type: 'internal', tags: ['procurement', 'planning'], createdAt: d(-10), updatedAt: d(-10) },
  { id: 'n5', title: 'Malhotra Office — brief from client', content: 'Key requirements from Rajiv: (1) Must accommodate 60 people in open plan (2) 4 private cabins for CXOs (3) 2 large conference rooms with AV (4) Strong brand colors — navy and gold (5) Timeline is flexible but prefers completion within 3 months (6) Budget can go up to 45L if quality warrants', authorId: 'u2', projectId: 'p2', clientId: 'c1', type: 'client', tags: ['brief', 'requirements'], createdAt: d(-30), updatedAt: d(-30) },
];

// ============================================================
// ACTIVITIES (Schedule)
// ============================================================
export const activities: Activity[] = [
  { id: 'act1', projectId: 'p1', title: 'Design Phase', startDate: d(-90), endDate: d(-60), status: 'completed', type: 'task', createdAt: d(-90) },
  { id: 'act2', projectId: 'p1', title: 'Procurement Phase', startDate: d(-55), endDate: d(10), status: 'in_progress', type: 'task', createdAt: d(-90) },
  { id: 'act3', projectId: 'p1', title: 'Civil & False Ceiling', startDate: d(-40), endDate: d(20), ownerId: 'u6', status: 'in_progress', type: 'task', createdAt: d(-90) },
  { id: 'act4', projectId: 'p1', title: 'Kitchen Installation', startDate: d(-8), endDate: d(12), ownerId: 'u6', status: 'in_progress', type: 'task', createdAt: d(-90) },
  { id: 'act5', projectId: 'p1', title: 'Final Finishing', startDate: d(15), endDate: d(55), ownerId: 'u6', status: 'pending', type: 'task', createdAt: d(-90) },
  { id: 'act6', projectId: 'p1', title: 'Client Walkthrough', startDate: d(58), endDate: d(60), ownerId: 'u2', status: 'pending', type: 'inspection', createdAt: d(-90) },
  { id: 'act7', projectId: 'p3', title: 'Design & BOQ', startDate: d(-60), endDate: d(-28), status: 'completed', type: 'task', createdAt: d(-65) },
  { id: 'act8', projectId: 'p3', title: 'Civil Work', startDate: d(-25), endDate: d(10), ownerId: 'u6', status: 'in_progress', type: 'task', createdAt: d(-65) },
  { id: 'act9', projectId: 'p3', title: 'Furniture & Procurement', startDate: d(-20), endDate: d(15), ownerId: 'u4', status: 'in_progress', type: 'task', createdAt: d(-65) },
  { id: 'act10', projectId: 'p3', title: 'Site Execution', startDate: d(10), endDate: d(28), ownerId: 'u6', status: 'pending', type: 'task', createdAt: d(-65) },
  { id: 'act11', projectId: 'p5', title: 'Punch List', startDate: d(-5), endDate: d(3), ownerId: 'u6', status: 'in_progress', type: 'inspection', createdAt: d(-5) },
  { id: 'act12', projectId: 'p5', title: 'Handover', startDate: d(4), endDate: d(5), ownerId: 'u2', status: 'pending', type: 'delivery', createdAt: d(-5) },
  { id: 'act13', projectId: 'p2', title: 'Design Phase', startDate: d(-30), endDate: d(25), ownerId: 'u3', status: 'in_progress', type: 'task', createdAt: d(-35) },
  { id: 'act14', projectId: 'p4', title: 'Briefing & Planning', startDate: d(-15), endDate: d(10), ownerId: 'u7', status: 'in_progress', type: 'task', createdAt: d(-20) },
];

// ============================================================
// QUICK UPDATES
// ============================================================
export const quickUpdates: QuickUpdate[] = [
  { id: 'qu1', projectId: 'p1', authorId: 'u6', category: 'progress', text: 'False ceiling framework complete in living room. Gypsum board work starts tomorrow. On schedule.', createdAt: d(-2) },
  { id: 'qu2', projectId: 'p3', authorId: 'u6', category: 'site', text: 'Partition walls for master bedroom completed today. Civil team moving to bathrooms next.', createdAt: d(-2) },
  { id: 'qu3', projectId: 'p3', authorId: 'u6', category: 'delay', text: '🚨 Water seepage issue found in guest bathroom wall. Waterproofing contractor called. May delay bathroom completion by 1 week.', createdAt: d(-1) },
  { id: 'qu4', projectId: 'p1', authorId: 'u4', category: 'procurement', text: 'Marble delivery confirmed for day 3. Warehouse team on standby for unloading. Quality check inspector scheduled.', createdAt: d(-1) },
  { id: 'qu5', projectId: 'p5', authorId: 'u6', category: 'progress', text: 'Touch-up painting in progress. Accessory placement starts tomorrow. Targeting handover this week.', createdAt: d(-1) },
  { id: 'qu6', projectId: 'p2', authorId: 'u3', category: 'approval', text: 'Design concept deck ready for client review. Sharing with Rajiv Malhotra this afternoon for office project.', createdAt: d(0) },
  { id: 'qu7', projectId: 'p1', authorId: 'u2', category: 'general', text: 'PM coordination call done with Rajiv. He is happy with progress. Marble selection confirmed. Moving forward on bedroom wardrobes.', createdAt: d(-3) },
  { id: 'qu8', authorId: 'u1', category: 'general', text: '📊 Monthly review: 4 active projects, 2 at risk. Finance team to follow up on overdue invoice INV-2024-005. Procurement backlog to clear this week.', createdAt: d(-5) },
];

// ============================================================
// NOTIFICATIONS
// ============================================================
export const notifications: Notification[] = [
  { id: 'notif1', type: 'invoice_overdue', title: 'Invoice Overdue', message: 'INV-2024-005 (₹18.6L) from Sunita Kapoor is 5 days overdue', entityId: 'inv5', entityType: 'invoice', read: false, createdAt: d(-5) },
  { id: 'notif2', type: 'inventory_low', title: 'Low Stock Alert', message: 'Teak Wood Grade A is below minimum stock (45 sqft remaining, min: 50)', entityId: 'inv_i2', entityType: 'inventory', read: false, createdAt: d(-2) },
  { id: 'notif3', type: 'inventory_low', title: 'Out of Stock', message: 'Asian Paints Royale Premium White is out of stock', entityId: 'inv_i6', entityType: 'inventory', read: false, createdAt: d(-8) },
  { id: 'notif4', type: 'milestone_due', title: 'Milestone Due Soon', message: 'Procurement Complete for Villa 27 is due in 15 days', entityId: 'm8', entityType: 'milestone', read: false, createdAt: d(-1) },
  { id: 'notif5', type: 'po_approval', title: 'PO Pending Approval', message: 'PR-2024-004 (Kitchen Appliances — ₹3.8L) awaiting your approval', entityId: 'pr4', entityType: 'purchase_request', read: false, createdAt: d(-5) },
  { id: 'notif6', type: 'task_overdue', title: 'Task Overdue', message: 'Client review — Bedroom designs is 5 days overdue (Project: Malhotra Residence)', entityId: 't6', entityType: 'task', read: true, createdAt: d(-5) },
  { id: 'notif7', type: 'snag_assigned', title: 'Critical Snag', message: 'Water seepage in Villa 27 — Guest Bathroom marked CRITICAL', entityId: 'sn5', entityType: 'snag', read: false, createdAt: d(-4) },
  { id: 'notif8', type: 'client_approval', title: 'Client Approval Needed', message: 'Verma Tech Office quote (₹31L) awaiting client approval', entityId: 'q3', entityType: 'quote', read: true, createdAt: d(-3) },
  { id: 'notif9', type: 'payment_received', title: 'Payment Received', message: '₹25.5L received from Rajiv Malhotra against INV-2024-002', entityId: 'pay2', entityType: 'payment', read: true, createdAt: d(-27) },
  { id: 'notif10', type: 'inventory_low', title: 'Low Stock Alert', message: 'LED Downlights 6W critically low (8 nos remaining, min: 20)', entityId: 'inv_i5', entityType: 'inventory', read: false, createdAt: d(-1) },
];

// ============================================================
// AUTOMATIONS
// ============================================================
export const automationRules: AutomationRule[] = [
  { id: 'auto1', name: 'Invoice Overdue Alert', trigger: 'Invoice due date passes without payment', action: 'Create notification for Finance team + Project Manager', enabled: true, createdAt: d(-60) },
  { id: 'auto2', name: 'Low Inventory Purchase Request', trigger: 'Inventory item falls below minimum stock', action: 'Create purchase request and notify Procurement team', enabled: true, createdAt: d(-60) },
  { id: 'auto3', name: 'Task Overdue Escalation', trigger: 'Task is 3+ days overdue', action: 'Notify Project Manager and create project alert', enabled: true, createdAt: d(-30) },
  { id: 'auto4', name: 'Milestone Approaching Reminder', trigger: 'Milestone due in 7 days', action: 'Notify Project Manager and assigned team members', enabled: true, createdAt: d(-30) },
  { id: 'auto5', name: 'Snag Critical Alert', trigger: 'Snag marked as Critical severity', action: 'Immediately notify Project Manager and Site Supervisor', enabled: true, createdAt: d(-15) },
];

// ============================================================
// SOPs
// ============================================================
export const sops: SOP[] = [
  {
    id: 'sop1', title: 'Site Visit SOP', description: 'Standard procedure for conducting site visits and documentation', category: 'Site Operations', ownerId: 'u2', status: 'active', createdAt: d(-120),
    steps: [
      { id: 'ss1', order: 1, title: 'Pre-visit preparation', description: 'Review drawings and outstanding snag list', completed: true },
      { id: 'ss2', order: 2, title: 'Safety equipment check', description: 'Helmet, safety shoes, vest', completed: true },
      { id: 'ss3', order: 3, title: 'Progress photography', description: 'Systematic photo documentation of all areas', completed: false },
      { id: 'ss4', order: 4, title: 'Measurement verification', description: 'Spot check 3-5 critical dimensions against drawings', completed: false },
      { id: 'ss5', order: 5, title: 'Update site visit report', description: 'Log in system within 2 hours of visit', completed: false },
    ],
  },
  {
    id: 'sop2', title: 'Client Approval SOP', description: 'Process for obtaining and documenting client approvals on design', category: 'Design', ownerId: 'u3', status: 'active', createdAt: d(-90),
    steps: [
      { id: 'ss6', order: 1, title: 'Prepare approval package', description: 'Drawings, 3D renders, material samples', completed: false },
      { id: 'ss7', order: 2, title: 'Schedule client meeting', description: 'Give 48 hour notice minimum', completed: false },
      { id: 'ss8', order: 3, title: 'Present and discuss', description: 'Walk client through design intent', completed: false },
      { id: 'ss9', order: 4, title: 'Collect signed approval form', description: 'Physical or digital signature required', completed: false },
      { id: 'ss10', order: 5, title: 'Update project records', description: 'Upload signed approval to project files', completed: false },
    ],
  },
  {
    id: 'sop3', title: 'Procurement SOP', description: 'Standard procurement process from PR to delivery', category: 'Procurement', ownerId: 'u4', status: 'active', createdAt: d(-90),
    steps: [
      { id: 'ss11', order: 1, title: 'Raise Purchase Request', description: 'In system with complete specifications', completed: false },
      { id: 'ss12', order: 2, title: 'Get 3 vendor quotes', description: 'Minimum 3 competitive quotes required', completed: false },
      { id: 'ss13', order: 3, title: 'PM/Admin approval', description: 'For all POs above ₹50,000', completed: false },
      { id: 'ss14', order: 4, title: 'Issue PO to vendor', description: 'Send official PO with delivery date', completed: false },
      { id: 'ss15', order: 5, title: 'Receive and verify', description: 'Quality check, quantity verification', completed: false },
      { id: 'ss16', order: 6, title: 'Update inventory', description: 'Enter received items in warehouse system', completed: false },
    ],
  },
];

// ============================================================
// CHECKLISTS
// ============================================================
export const checklists: Checklist[] = [
  {
    id: 'cl1', title: 'Site Handover Checklist — Villa 27', projectId: 'p5', category: 'Handover', progress: 60,
    createdAt: d(-10), updatedAt: d(-1),
    items: [
      { id: 'cli1', title: 'All snags cleared and verified', assigneeId: 'u6', dueDate: d(2), status: 'in_progress' },
      { id: 'cli2', title: 'Cleaning of entire apartment', dueDate: d(4), status: 'pending' },
      { id: 'cli3', title: 'All keys and access cards handed over', assigneeId: 'u2', dueDate: d(5), status: 'pending' },
      { id: 'cli4', title: 'User manuals for appliances collected', assigneeId: 'u4', status: 'done' },
      { id: 'cli5', title: 'Warranty documents compiled', assigneeId: 'u4', status: 'done' },
      { id: 'cli6', title: 'As-built drawings finalized', assigneeId: 'u3', status: 'done' },
      { id: 'cli7', title: 'Client sign-off on completion certificate', assigneeId: 'u2', dueDate: d(5), status: 'pending' },
    ],
  },
  {
    id: 'cl2', title: 'Final Inspection Checklist — P1 Execution', projectId: 'p1', category: 'Site', progress: 35,
    createdAt: d(-5), updatedAt: d(-1),
    items: [
      { id: 'cli8', title: 'All false ceilings complete and painted', assigneeId: 'u6', dueDate: d(20), status: 'in_progress' },
      { id: 'cli9', title: 'Flooring complete — all areas', assigneeId: 'u6', dueDate: d(25), status: 'pending' },
      { id: 'cli10', title: 'Kitchen installation complete', assigneeId: 'u6', dueDate: d(12), status: 'in_progress' },
      { id: 'cli11', title: 'Bathroom fittings installed', assigneeId: 'u6', dueDate: d(30), status: 'pending' },
      { id: 'cli12', title: 'Electrical fixtures installed and tested', assigneeId: 'u6', dueDate: d(28), status: 'pending' },
      { id: 'cli13', title: 'All wardrobes installed and aligned', assigneeId: 'u6', dueDate: d(35), status: 'pending' },
    ],
  },
];

// ============================================================
// MOODBOARD
// ============================================================
export const moodboardItems: MoodboardItem[] = [
  { id: 'mb1', projectId: 'p1', type: 'text', title: 'Concept: Warm Luxury', content: 'Warm Luxury — Combining Italian marble and teak warmth with contemporary proportions', tags: ['concept'], createdAt: d(-80) },
  { id: 'mb2', projectId: 'p1', type: 'color', title: 'Palette', content: 'Primary', color: '#C8A882', tags: ['color'], createdAt: d(-80) },
  { id: 'mb3', projectId: 'p1', type: 'color', title: 'Accent', content: 'Accent', color: '#2C3E50', tags: ['color'], createdAt: d(-80) },
  { id: 'mb4', projectId: 'p1', type: 'pin', title: 'Carrara Marble', content: 'Italian Carrara for foyer floor and bathroom walls', pinCategory: 'material', tags: ['marble', 'flooring'], createdAt: d(-79) },
  { id: 'mb5', projectId: 'p1', type: 'pin', title: 'Teak Furniture', content: 'Grade A teak for bedroom furniture and dining table', pinCategory: 'furniture', tags: ['wood', 'furniture'], createdAt: d(-79) },
  { id: 'mb6', projectId: 'p3', type: 'text', title: 'Concept: Contemporary Natural', content: 'Contemporary Natural — Biophilic design with earthy tones, natural materials, and ample light', tags: ['concept'], createdAt: d(-60) },
  { id: 'mb7', projectId: 'p3', type: 'color', title: 'Warm White', content: 'Base color', color: '#F5F0E8', tags: ['color'], createdAt: d(-60) },
  { id: 'mb8', projectId: 'p3', type: 'color', title: 'Terracotta', content: 'Accent wall color', color: '#C4623A', tags: ['color'], createdAt: d(-60) },
];

// ============================================================
// FILES (PLACEHOLDER METADATA)
// ============================================================
export const projectFiles: ProjectFile[] = [
  { id: 'f1', name: 'P1_Living_Dining_DrawingSet_v3.pdf', projectId: 'p1', category: 'drawings', size: 4520000, mimeType: 'application/pdf', uploadedById: 'u3', createdAt: d(-22) },
  { id: 'f2', name: 'P1_BOQ_Approved_Final.xlsx', projectId: 'p1', category: 'contracts', size: 285000, mimeType: 'application/vnd.ms-excel', uploadedById: 'u4', createdAt: d(-48) },
  { id: 'f3', name: 'P1_Client_Approval_Signed.pdf', projectId: 'p1', category: 'contracts', size: 1240000, mimeType: 'application/pdf', uploadedById: 'u2', createdAt: d(-78) },
  { id: 'f4', name: 'Villa27_3D_Renders_v2.zip', projectId: 'p3', category: 'moodboards', size: 45200000, mimeType: 'application/zip', uploadedById: 'u3', createdAt: d(-42) },
  { id: 'f5', name: 'Villa27_BOQ_v1.xlsx', projectId: 'p3', category: 'contracts', size: 320000, mimeType: 'application/vnd.ms-excel', uploadedById: 'u4', createdAt: d(-28) },
  { id: 'f6', name: 'Office_SpacePlan_v1.dwg', projectId: 'p2', category: 'drawings', size: 8900000, mimeType: 'application/acad', uploadedById: 'u3', createdAt: d(-14) },
  { id: 'f7', name: 'Kapoor_HandoverDocs.pdf', projectId: 'p5', category: 'contracts', size: 2100000, mimeType: 'application/pdf', uploadedById: 'u2', createdAt: d(-2) },
];
