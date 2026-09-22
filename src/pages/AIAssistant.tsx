import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { formatCurrency, isOverdue, calcProjectHealth } from '../utils';
import type { Project, Task, Milestone, Expense, Snag, Invoice, InventoryItem, PurchaseRequest } from '../types';
import { Brain, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface StoreData {
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  expenses: Expense[];
  snags: Snag[];
  invoices: Invoice[];
  inventoryItems: InventoryItem[];
  purchaseRequests: PurchaseRequest[];
  clients: { id: string; name: string }[];
}

function generateAIResponse(query: string, data: StoreData): string {
  const q = query.toLowerCase();
  const { projects, tasks, milestones, expenses, snags, invoices, inventoryItems, purchaseRequests, clients } = data;

  if (q.includes('summar') || q.includes('overview')) {
    const activeProjects = projects.filter((p) => !['completed', 'on_hold', 'lead'].includes(p.status));
    const totalBudget = activeProjects.reduce((s, p) => s + p.budget, 0);
    const overdueTasks = tasks.filter((t) => t.status !== 'done' && isOverdue(t.dueDate)).length;
    const openSnags = snags.filter((s) => ['open', 'in_progress'].includes(s.status)).length;
    return `📊 **Studio Forma — Project Summary**\n\n` +
      `**Active Projects:** ${activeProjects.length} (Total Value: ${formatCurrency(totalBudget)})\n\n` +
      activeProjects.map((p) => {
        const health = calcProjectHealth(p.id, tasks, milestones, expenses, snags, p);
        return `• **${p.name.split(' — ')[0]}** — ${p.progress}% complete, Health: ${health.overall}/100`;
      }).join('\n') +
      `\n\n**Alerts:**\n• ${overdueTasks} overdue tasks\n• ${openSnags} open snags\n• ${purchaseRequests.filter((pr) => pr.status === 'pending_approval').length} PRs awaiting approval`;
  }

  if (q.includes('risk') || q.includes('attention') || q.includes('problem')) {
    const atRisk = projects.filter((p) => {
      const health = calcProjectHealth(p.id, tasks, milestones, expenses, snags, p);
      return health.overall < 60 && !['completed', 'on_hold'].includes(p.status);
    });
    const overdueInvoices = invoices.filter((i) => i.status !== 'paid' && isOverdue(i.dueDate));
    const criticalSnags = snags.filter((s) => s.severity === 'critical' && s.status !== 'verified');
    if (atRisk.length === 0 && overdueInvoices.length === 0 && criticalSnags.length === 0) {
      return '✅ **Good news!** No critical risks detected across active projects.';
    }
    let response = '⚠️ **Risk Analysis — Action Required**\n\n';
    if (atRisk.length > 0) {
      response += `**Projects At Risk (${atRisk.length}):**\n`;
      atRisk.forEach((p) => {
        const health = calcProjectHealth(p.id, tasks, milestones, expenses, snags, p);
        response += `• ${p.name.split(' — ')[0]} — Score: ${health.overall}/100\n`;
      });
      response += '\n';
    }
    if (overdueInvoices.length > 0) {
      const total = overdueInvoices.reduce((s, i) => s + i.total, 0);
      response += `**Payment Risk:** ${overdueInvoices.length} overdue invoices totaling ${formatCurrency(total)}\n\n`;
    }
    if (criticalSnags.length > 0) {
      response += `**Critical Snags:** ${criticalSnags.length} unresolved\n`;
      criticalSnags.forEach((s) => { response += `• ${s.title} — ${s.area}\n`; });
    }
    return response;
  }

  if (q.includes('overdue') || q.includes('delayed') || q.includes('late')) {
    const overdueTasks = tasks.filter((t) => t.status !== 'done' && isOverdue(t.dueDate));
    const overdueMilestones = milestones.filter((m) => m.status !== 'completed' && isOverdue(m.dueDate));
    const overdueInvoices = invoices.filter((i) => i.status !== 'paid' && isOverdue(i.dueDate));
    if (overdueTasks.length === 0 && overdueMilestones.length === 0 && overdueInvoices.length === 0) {
      return '✅ No overdue items detected. Everything is on track!';
    }
    let response = '⏰ **Overdue Items Detected**\n\n';
    if (overdueTasks.length > 0) {
      response += `**Tasks (${overdueTasks.length}):**\n`;
      overdueTasks.slice(0, 5).forEach((t) => {
        const p = projects.find((p) => p.id === t.projectId);
        response += `• ${t.title} — ${p?.name.split(' — ')[0] || 'N/A'}\n`;
      });
      if (overdueTasks.length > 5) response += `• ...and ${overdueTasks.length - 5} more\n`;
      response += '\n';
    }
    if (overdueMilestones.length > 0) {
      response += `**Milestones (${overdueMilestones.length}):**\n`;
      overdueMilestones.forEach((m) => {
        const p = projects.find((p) => p.id === m.projectId);
        response += `• ${m.title} — ${p?.name.split(' — ')[0]}\n`;
      });
    }
    return response;
  }

  if (q.includes('budget') || q.includes('finance') || q.includes('spend')) {
    const activeProjects = projects.filter((p) => !['completed', 'on_hold'].includes(p.status));
    let response = '💰 **Budget Analysis**\n\n';
    activeProjects.forEach((p) => {
      const spent = expenses.filter((e) => e.projectId === p.id).reduce((s, e) => s + e.amount, 0);
      const utilization = p.budget > 0 ? (spent / p.budget) * 100 : 0;
      const risk = utilization > 90 ? '🔴 CRITICAL' : utilization > 75 ? '🟡 WATCH' : '🟢 OK';
      response += `**${p.name.split(' — ')[0]}**\nBudget: ${formatCurrency(p.budget)} | Spent: ${formatCurrency(spent)} (${utilization.toFixed(0)}%) ${risk}\n\n`;
    });
    return response;
  }

  if (q.includes('procure') || q.includes('purchase') || q.includes('inventory')) {
    const pendingPRs = purchaseRequests.filter((pr) => ['draft', 'pending_approval'].includes(pr.status));
    const lowStock = inventoryItems.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock');
    let response = '📦 **Procurement & Inventory Report**\n\n';
    if (pendingPRs.length > 0) {
      response += `**Pending Purchase Requests (${pendingPRs.length}):**\n`;
      pendingPRs.forEach((pr) => {
        const p = projects.find((proj) => proj.id === pr.projectId);
        response += `• ${pr.prNumber} — ${p?.name.split(' — ')[0]} (${pr.priority} priority)\n`;
      });
      response += '\n';
    }
    if (lowStock.length > 0) {
      response += `**Stock Alerts (${lowStock.length} items):**\n`;
      lowStock.forEach((i) => { response += `• ${i.name}: ${i.quantity} ${i.unit} (${i.status.replace('_', ' ')})\n`; });
    }
    if (pendingPRs.length === 0 && lowStock.length === 0) response += 'All procurement is on track.';
    return response;
  }

  if (q.includes('client') || q.includes('update') || q.includes('report')) {
    const activeProjects = projects.filter((p) => !['completed', 'on_hold'].includes(p.status));
    let response = '📋 **Client Update Summary**\n\n';
    activeProjects.forEach((p) => {
      const client = clients.find((c) => c.id === p.clientId);
      const projectSnags = snags.filter((s) => s.projectId === p.id && s.status === 'open').length;
      const projectTasks = tasks.filter((t) => t.projectId === p.id);
      const done = projectTasks.filter((t) => t.status === 'done').length;
      response += `**${client?.name || 'Client'} — ${p.name.split(' — ')[0]}**\n`;
      response += `Progress: ${p.progress}% | Status: ${p.status.replace('_', ' ')}\n`;
      response += `Tasks: ${done}/${projectTasks.length} completed\n`;
      if (projectSnags > 0) response += `⚠️ ${projectSnags} open snags\n`;
      response += '\n';
    });
    return response;
  }

  return `I'm your **Project Intelligence Assistant** for Studio Forma Interiors.\n\nI can help you with:\n• Project summaries and health scores\n• Risk identification\n• Overdue tasks and milestones\n• Budget analysis\n• Procurement status\n• Client update summaries\n\nTry: "What's at risk?", "Summarize all projects", "Budget analysis"\n\n*Powered by your live project data — no external API required.*`;
}

export function AIAssistant() {
  const store = useStore();
  const { projects } = store;
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: `👋 Hello! I'm your Project Intelligence Assistant.\n\nI have full access to your project data. Ask me anything.\n\nTry: "What's at risk?" or "Summarize all projects"`, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [projectContext, setProjectContext] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() };
    setMessages((p) => [...p, userMsg]);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const filtered = projectContext ? store.projects.filter((p) => p.id === projectContext) : store.projects;
    const response = generateAIResponse(msg, { ...store, projects: filtered });
    setMessages((p) => [...p, { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() }]);
    setLoading(false);
  };

  const quickActions = ["What's at risk?", 'Summarize all projects', 'Show overdue items', 'Budget analysis', 'Procurement status', 'Client update'];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">AI Assistant</h1>
              <p className="text-xs text-gray-500">Project intelligence engine · No API required</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Intelligence Active
            </div>
            <Select options={[{ value: '', label: 'All Projects' }, ...projects.map((p) => ({ value: p.id, label: p.name.split(' — ')[0] }))]} value={projectContext} onChange={(e) => setProjectContext(e.target.value)} className="w-44 text-xs" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-3 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-100 text-gray-800'}`}>
              <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</pre>
              <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5">
                {[0, 150, 300].map((d) => <div key={d} className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-4 py-2 border-t border-gray-100 bg-white">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {quickActions.map((action) => (
            <button key={action} onClick={() => sendMessage(action)} className="whitespace-nowrap text-xs px-3 py-1.5 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-600 rounded-lg border border-gray-200 transition-colors shrink-0">
              {action}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4 pt-2 bg-white">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500">
          <Sparkles className="h-4 w-4 text-blue-400 shrink-0" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask about your projects…"
            className="flex-1 text-sm outline-none placeholder:text-gray-400"
          />
          <Button size="sm" className="shrink-0 h-7 w-7 p-0" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
