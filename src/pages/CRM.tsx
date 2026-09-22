import { useState } from 'react';
import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Avatar } from '../components/ui/Avatar';
import { Textarea } from '../components/ui/Textarea';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { ConfirmDialog } from '../components/ui/Modal';
import { formatDate, formatCurrency, LEAD_STAGE_COLORS, generateId } from '../utils';
import { Users, Plus, Search, ArrowRight, Pencil, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import type { Lead, LeadStage, Client } from '../types';

const STAGES: LeadStage[] = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
const STAGE_LABELS: Record<LeadStage, string> = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified',
  proposal: 'Proposal', negotiation: 'Negotiation', won: 'Won', lost: 'Lost',
};

const TABS = ['Pipeline', 'Leads', 'Clients'];

export function CRM() {
  const toast = useToast();
  const { leads, clients, users, addLead, updateLead, deleteLead, addClient } = useStore();
  const [activeTab, setActiveTab] = useState('Pipeline');
  const [search, setSearch] = useState('');
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [_showClientModal, setShowClientModal] = useState(false);
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);
  const [convertLeadId, setConvertLeadId] = useState<string | null>(null);

  const filteredLeads = leads.filter((l) => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()));
  const filteredClients = clients.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  const handleSaveLead = (data: Partial<Lead>) => {
    if (editLead) {
      updateLead(editLead.id, { ...data, updatedAt: new Date().toISOString() });
      toast.success('Lead updated');
    } else {
      addLead({ ...data, id: generateId('l'), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), activities: [] } as Lead);
      toast.success('Lead created');
    }
    setShowLeadModal(false);
    setEditLead(null);
  };

  const handleConvertLead = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;
    const newClient: Client = {
      id: generateId('c'),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      city: lead.location,
      createdAt: new Date().toISOString(),
      projectIds: [],
      leadId: lead.id,
    };
    addClient(newClient);
    updateLead(leadId, { stage: 'won', convertedToClientId: newClient.id, updatedAt: new Date().toISOString() });
    toast.success('Lead converted to client!', `${lead.name} is now a client`);
    setConvertLeadId(null);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">CRM</h1>
          <p className="text-sm text-gray-500 mt-0.5">{leads.length} leads · {clients.length} clients</p>
        </div>
        <div className="flex gap-2">
          {activeTab !== 'Clients' && <Button leftIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => { setEditLead(null); setShowLeadModal(true); }}>Add Lead</Button>}
          {activeTab === 'Clients' && <Button leftIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowClientModal(true)}>Add Client</Button>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>{tab}</button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-3.5 w-3.5" />} className="w-64" />
      </div>

      {/* Pipeline View */}
      {activeTab === 'Pipeline' && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.filter((s) => s !== 'lost').map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage);
            const totalBudget = stageLeads.reduce((s, l) => s + (l.budget || 0), 0);
            return (
              <div key={stage} className="min-w-56 w-56 flex-shrink-0">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div>
                    <Badge className={LEAD_STAGE_COLORS[stage]}>{STAGE_LABELS[stage]}</Badge>
                  </div>
                  <span className="text-[10px] text-gray-400">{stageLeads.length} · {formatCurrency(totalBudget)}</span>
                </div>
                <div className="space-y-2">
                  {stageLeads.map((lead) => {
                    const assignee = users.find((u) => u.id === lead.assignedTo);
                    return (
                      <div key={lead.id} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow cursor-pointer group" onClick={() => { setEditLead(lead); setShowLeadModal(true); }}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-gray-900">{lead.name}</p>
                        </div>
                        {lead.company && <p className="text-[10px] text-gray-400 mt-0.5">{lead.company}</p>}
                        {lead.projectType && <p className="text-[10px] text-blue-600 mt-1">{lead.projectType}</p>}
                        {lead.budget && <p className="text-xs font-medium text-gray-700 mt-1">{formatCurrency(lead.budget)}</p>}
                        <div className="flex items-center justify-between mt-2">
                          {lead.followUpDate && <span className="text-[10px] text-gray-400">{formatDate(lead.followUpDate)}</span>}
                          {assignee && <Avatar name={assignee.name} size="xs" />}
                        </div>
                        {!lead.convertedToClientId && stage !== 'won' && (
                          <button
                            className="mt-2 w-full text-[10px] text-blue-600 hover:bg-blue-50 py-1 rounded border border-blue-100 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-1"
                            onClick={(e) => { e.stopPropagation(); setConvertLeadId(lead.id); }}
                          >
                            <ArrowRight className="h-3 w-3" /> Convert to Client
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <button
                    className="w-full py-1.5 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 border border-dashed border-gray-200 rounded-lg transition-colors"
                    onClick={() => { setEditLead({ stage } as Lead); setShowLeadModal(true); }}
                  >+ Add</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leads list */}
      {activeTab === 'Leads' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stage</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Budget</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Follow Up</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Source</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setEditLead(lead); setShowLeadModal(true); }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={lead.name} size="xs" />
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge className={LEAD_STAGE_COLORS[lead.stage]}>{STAGE_LABELS[lead.stage]}</Badge></td>
                    <td className="px-4 py-3 hidden md:table-cell">{lead.budget ? formatCurrency(lead.budget) : '-'}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{lead.followUpDate ? formatDate(lead.followUpDate) : '-'}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{lead.source}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {!lead.convertedToClientId && lead.stage !== 'lost' && (
                          <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={() => setConvertLeadId(lead.id)}>Convert</Button>
                        )}
                        <button className="p-1 hover:bg-gray-100 rounded" onClick={() => { setEditLead(lead); setShowLeadModal(true); }}><Pencil className="h-3.5 w-3.5 text-gray-400" /></button>
                        <button className="p-1 hover:bg-red-50 rounded" onClick={() => setDeleteLeadId(lead.id)}><Trash2 className="h-3.5 w-3.5 text-gray-300 hover:text-red-500" /></button>
                      </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && <EmptyState icon={<Users className="h-10 w-10" />} title="No leads found" action={<Button size="sm" onClick={() => setShowLeadModal(true)}>Add Lead</Button>} />}
        </div>
      )}

      {/* Clients list */}
      {activeTab === 'Clients' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div key={client.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="flex items-start gap-3 mb-3">
                <Avatar name={client.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                  {client.company && <p className="text-xs text-gray-500">{client.company}</p>}
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{client.projectIds.length} projects</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-500"><Mail className="h-3 w-3" />{client.email}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500"><Phone className="h-3 w-3" />{client.phone}</div>
                {client.city && <div className="flex items-center gap-2 text-xs text-gray-500"><MapPin className="h-3 w-3" />{client.city}</div>}
              </div>
            </div>
          ))}
          {filteredClients.length === 0 && (
            <div className="col-span-full">
              <EmptyState icon={<Users className="h-10 w-10" />} title="No clients yet" action={<Button size="sm" onClick={() => setShowClientModal(true)}>Add Client</Button>} />
            </div>
          )}
        </div>
      )}

      {/* Lead modal */}
      <LeadModal open={showLeadModal} onClose={() => { setShowLeadModal(false); setEditLead(null); }} lead={editLead} onSave={handleSaveLead} />

      {/* Convert confirm */}
      <ConfirmDialog open={!!convertLeadId} onClose={() => setConvertLeadId(null)} onConfirm={() => handleConvertLead(convertLeadId!)} title="Convert Lead to Client" message={`Convert ${leads.find((l) => l.id === convertLeadId)?.name} to a client? They will appear in the Clients section.`} confirmLabel="Convert" />

      {/* Delete confirm */}
      <ConfirmDialog open={!!deleteLeadId} onClose={() => setDeleteLeadId(null)} onConfirm={() => { deleteLead(deleteLeadId!); toast.success('Lead deleted'); }} title="Delete Lead" message="Delete this lead? This cannot be undone." confirmLabel="Delete" destructive />
    </div>
  );
}

function LeadModal({ open, onClose, lead, onSave }: { open: boolean; onClose: () => void; lead: Lead | null; onSave: (data: Partial<Lead>) => void }) {
  const { users } = useStore();
  const [form, setForm] = useState<Partial<Lead>>(lead || { name: '', email: '', phone: '', stage: 'new', source: 'Website' });
  const set = (k: keyof Lead, v: any) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title={lead?.id ? 'Edit Lead' : 'New Lead'} size="lg"
      footer={<><Button variant="outline" size="sm" onClick={onClose}>Cancel</Button><Button size="sm" onClick={() => { if (form.name?.trim()) onSave(form); }}>Save Lead</Button></>}
    >
      <div className="grid grid-cols-2 gap-3">
        <Input label="Name *" value={form.name || ''} onChange={(e) => set('name', e.target.value)} className="col-span-2" />
        <Input label="Email" value={form.email || ''} onChange={(e) => set('email', e.target.value)} />
        <Input label="Phone" value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} />
        <Input label="Company" value={form.company || ''} onChange={(e) => set('company', e.target.value)} />
        <Input label="Location" value={form.location || ''} onChange={(e) => set('location', e.target.value)} />
        <Select label="Stage" value={form.stage || 'new'} onChange={(e) => set('stage', e.target.value as LeadStage)} options={STAGES.map((s) => ({ value: s, label: STAGE_LABELS[s] }))} />
        <Input label="Source" value={form.source || ''} onChange={(e) => set('source', e.target.value)} />
        <Input label="Budget (₹)" type="number" value={form.budget || ''} onChange={(e) => set('budget', Number(e.target.value))} />
        <Input label="Project Type" value={form.projectType || ''} onChange={(e) => set('projectType', e.target.value)} />
        <Input label="Follow Up Date" type="date" value={form.followUpDate?.split('T')[0] || ''} onChange={(e) => set('followUpDate', e.target.value)} />
        <Select label="Assigned To" value={form.assignedTo || ''} onChange={(e) => set('assignedTo', e.target.value)} options={[{ value: '', label: 'Unassigned' }, ...users.map((u) => ({ value: u.id, label: u.name }))]} />
        <Textarea label="Notes" value={form.notes || ''} onChange={(e) => set('notes', e.target.value)} rows={2} className="col-span-2" />
      </div>
    </Modal>
  );
}
