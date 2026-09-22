import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Tasks } from './pages/Tasks';
import { CRM } from './pages/CRM';
import { Milestones } from './pages/Milestones';
import { Quotes } from './pages/Quotes';
import { PurchaseRequests } from './pages/PurchaseRequests';
import { PurchaseOrders } from './pages/PurchaseOrders';
import { WorkOrders } from './pages/WorkOrders';
import { Invoices } from './pages/Invoices';
import { Payments } from './pages/Payments';
import { Expenses } from './pages/Expenses';
import { Finances } from './pages/Finances';
import { Inventory } from './pages/Inventory';
import { Snags } from './pages/Snags';
import { Timesheets } from './pages/Timesheets';
import { Checklists } from './pages/Checklists';
import { Notes } from './pages/Notes';
import { QuickUpdates } from './pages/QuickUpdates';
import { Files } from './pages/Files';
import { Moodboard } from './pages/Moodboard';
import { Schedule } from './pages/Schedule';
import { HRMS } from './pages/HRMS';
import { Attendance } from './pages/Attendance';
import { AIAssistant } from './pages/AIAssistant';
import { Automations } from './pages/Automations';
import { SOPs } from './pages/SOPs';
import { Roles } from './pages/Roles';
import { Integrations } from './pages/Integrations';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/milestones" element={<Milestones />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/purchase-requests" element={<PurchaseRequests />} />
        <Route path="/purchase-orders" element={<PurchaseOrders />} />
        <Route path="/work-orders" element={<WorkOrders />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/finances" element={<Finances />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/snags" element={<Snags />} />
        <Route path="/timesheets" element={<Timesheets />} />
        <Route path="/checklists" element={<Checklists />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/quick-updates" element={<QuickUpdates />} />
        <Route path="/files" element={<Files />} />
        <Route path="/moodboard" element={<Moodboard />} />
        <Route path="/hrms" element={<HRMS />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/sops" element={<SOPs />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
