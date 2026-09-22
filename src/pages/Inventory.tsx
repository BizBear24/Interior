import { useState } from 'react';
import { useStore } from '../store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { formatCurrency, STOCK_STATUS_COLORS } from '../utils';
import { Plus, Search, Package, AlertTriangle } from 'lucide-react';
import type { InventoryItem, StockStatus } from '../types';

const STATUS_LABELS: Record<StockStatus, string> = { in_stock: 'In Stock', low_stock: 'Low Stock', out_of_stock: 'Out of Stock' };

export function Inventory() {
  const toast = useToast();
  const { inventoryItems, updateInventoryItem } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);

  const filtered = inventoryItems.filter((i) => {
    if (search && !i.name.toLowerCase().includes(search.toLowerCase()) && !i.sku.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && i.status !== statusFilter) return false;
    return true;
  });

  const totalValue = inventoryItems.reduce((s, i) => s + i.quantity * i.cost, 0);
  const lowStockCount = inventoryItems.filter((i) => i.status === 'low_stock').length;
  const outCount = inventoryItems.filter((i) => i.status === 'out_of_stock').length;

  const handleReceive = (item: InventoryItem, qty: number) => {
    const newQty = item.quantity + qty;
    const status: StockStatus = newQty <= 0 ? 'out_of_stock' : newQty <= item.minimumStock ? 'low_stock' : 'in_stock';
    updateInventoryItem(item.id, { quantity: newQty, status, updatedAt: new Date().toISOString() });
    toast.success('Stock updated');
    setAdjustItem(null);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-0.5">{inventoryItems.length} items · {formatCurrency(totalValue)} total value</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setShowModal(true)}>Add Item</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border p-4"><p className="text-xs text-gray-500">Inventory Value</p><p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(totalValue)}</p></div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4"><p className="text-xs text-yellow-700">Low Stock Items</p><p className="text-xl font-bold text-yellow-700 mt-1">{lowStockCount}</p></div>
        <div className="bg-red-50 rounded-xl border border-red-100 p-4"><p className="text-xs text-red-700">Out of Stock</p><p className="text-xl font-bold text-red-700 mt-1">{outCount}</p></div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input placeholder="Search items, SKU…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-3.5 w-3.5" />} className="w-56" />
        <Select options={[{ value: '', label: 'All Status' }, { value: 'in_stock', label: 'In Stock' }, { value: 'low_stock', label: 'Low Stock' }, { value: 'out_of_stock', label: 'Out of Stock' }]} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-36" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Item</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">SKU</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Location</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Value</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((item) => (
              <tr key={item.id} className={`hover:bg-gray-50 ${item.status === 'out_of_stock' ? 'bg-red-50/30' : item.status === 'low_stock' ? 'bg-yellow-50/30' : ''}`}>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.category}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-xs font-mono text-gray-500">{item.sku}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-semibold ${item.quantity <= item.minimumStock ? 'text-red-600' : 'text-gray-900'}`}>{item.quantity}</span>
                    <span className="text-xs text-gray-400">{item.unit}</span>
                    {item.quantity <= item.minimumStock && <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />}
                  </div>
                  <p className="text-[10px] text-gray-400">Min: {item.minimumStock}</p>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{item.location}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs font-medium text-gray-700">{formatCurrency(item.quantity * item.cost)}</td>
                <td className="px-4 py-3"><Badge className={STOCK_STATUS_COLORS[item.status]}>{STATUS_LABELS[item.status]}</Badge></td>
                <td className="px-4 py-3">
                  <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={() => { setAdjustItem(item); setAdjustQty(0); }}>Receive</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={<Package className="h-10 w-10" />} title="No inventory items" />}
      </div>

      {/* Adjust stock modal */}
      {adjustItem && (
        <Modal open={!!adjustItem} onClose={() => setAdjustItem(null)} title={`Receive Stock — ${adjustItem.name}`} size="sm"
          footer={<><Button variant="outline" size="sm" onClick={() => setAdjustItem(null)}>Cancel</Button><Button size="sm" onClick={() => handleReceive(adjustItem, adjustQty)}>Update Stock</Button></>}
        >
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Current quantity: <strong>{adjustItem.quantity} {adjustItem.unit}</strong></p>
            <Input label="Quantity to add" type="number" value={adjustQty} onChange={(e) => setAdjustQty(Number(e.target.value))} />
            <p className="text-xs text-gray-400">New quantity will be: {adjustItem.quantity + adjustQty} {adjustItem.unit}</p>
          </div>
        </Modal>
      )}

      {showModal && (
        <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Inventory Item" size="md"
          footer={<><Button variant="outline" size="sm" onClick={() => setShowModal(false)}>Cancel</Button><Button size="sm" onClick={() => { toast.success('Item added to inventory'); setShowModal(false); }}>Add Item</Button></>}
        >
          <p className="text-sm text-gray-500">New item form goes here.</p>
        </Modal>
      )}
    </div>
  );
}
