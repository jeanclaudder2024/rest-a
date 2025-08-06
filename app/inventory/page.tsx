'use client';

import { useState } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { InventoryItem } from '@/types';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Search,
  Filter,
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format, isAfter, addDays } from 'date-fns';

export default function InventoryPage() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, updateStock } = useRestaurantStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [stockUpdateItem, setStockUpdateItem] = useState<InventoryItem | null>(null);
  const [stockChange, setStockChange] = useState<number>(0);

  const categories = ['all', ...Array.from(new Set(inventory.map(item => item.category)))];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get low stock items
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  
  // Get expiring items (within 3 days)
  const expiringItems = inventory.filter(item => 
    item.expiryDate && isAfter(addDays(new Date(), 3), item.expiryDate)
  );

  const handleAddItem = (formData: FormData) => {
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      currentStock: Number(formData.get('currentStock')),
      minStock: Number(formData.get('minStock')),
      maxStock: Number(formData.get('maxStock')),
      unit: formData.get('unit') as string,
      costPerUnit: Number(formData.get('costPerUnit')),
      supplier: formData.get('supplier') as string,
      expiryDate: formData.get('expiryDate') ? new Date(formData.get('expiryDate') as string) : undefined,
      lastRestocked: new Date(),
    };

    addInventoryItem(newItem);
    setShowAddForm(false);
    toast.success('Inventory item added successfully!');
  };

  const handleUpdateItem = (formData: FormData) => {
    if (!editingItem) return;

    const updates: Partial<InventoryItem> = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      currentStock: Number(formData.get('currentStock')),
      minStock: Number(formData.get('minStock')),
      maxStock: Number(formData.get('maxStock')),
      unit: formData.get('unit') as string,
      costPerUnit: Number(formData.get('costPerUnit')),
      supplier: formData.get('supplier') as string,
      expiryDate: formData.get('expiryDate') ? new Date(formData.get('expiryDate') as string) : undefined,
    };

    updateInventoryItem(editingItem.id, updates);
    setEditingItem(null);
    toast.success('Inventory item updated successfully!');
  };

  const handleStockUpdate = () => {
    if (!stockUpdateItem || stockChange === 0) return;

    updateStock(stockUpdateItem.id, stockChange);
    setStockUpdateItem(null);
    setStockChange(0);
    toast.success(`Stock ${stockChange > 0 ? 'added' : 'removed'} successfully!`);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      deleteInventoryItem(itemId);
      toast.success('Inventory item deleted successfully!');
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return 'critical';
    if (item.currentStock <= item.minStock * 1.5) return 'low';
    if (item.currentStock >= item.maxStock * 0.9) return 'high';
    return 'normal';
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'low': return 'text-orange-600 bg-orange-100';
      case 'high': return 'text-blue-600 bg-blue-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </Link>
              <Package className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Inventory Management</h1>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Alert Cards */}
        {(lowStockItems.length > 0 || expiringItems.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {lowStockItems.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="font-medium text-red-900">Low Stock Alert</h3>
                </div>
                <p className="text-red-700 text-sm mb-2">
                  {lowStockItems.length} item(s) are running low on stock
                </p>
                <div className="space-y-1">
                  {lowStockItems.slice(0, 3).map(item => (
                    <div key={item.id} className="text-sm text-red-600">
                      {item.name}: {item.currentStock} {item.unit} remaining
                    </div>
                  ))}
                  {lowStockItems.length > 3 && (
                    <div className="text-sm text-red-600">
                      +{lowStockItems.length - 3} more items
                    </div>
                  )}
                </div>
              </div>
            )}

            {expiringItems.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                  <h3 className="font-medium text-orange-900">Expiring Soon</h3>
                </div>
                <p className="text-orange-700 text-sm mb-2">
                  {expiringItems.length} item(s) expiring within 3 days
                </p>
                <div className="space-y-1">
                  {expiringItems.slice(0, 3).map(item => (
                    <div key={item.id} className="text-sm text-orange-600">
                      {item.name}: {item.expiryDate ? format(item.expiryDate, 'MMM dd') : 'No date'}
                    </div>
                  ))}
                  {expiringItems.length > 3 && (
                    <div className="text-sm text-orange-600">
                      +{expiringItems.length - 3} more items
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">{expiringItems.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inventory items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Item Name</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Current Stock</th>
                  <th className="table-header">Min/Max</th>
                  <th className="table-header">Unit</th>
                  <th className="table-header">Cost/Unit</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Expiry Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="table-cell">
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.supplier}</div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="font-medium">{item.currentStock} {item.unit}</div>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm">
                          <div>Min: {item.minStock}</div>
                          <div>Max: {item.maxStock}</div>
                        </div>
                      </td>
                      <td className="table-cell">{item.unit}</td>
                      <td className="table-cell">${item.costPerUnit.toFixed(2)}</td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusColor(status)}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td className="table-cell">
                        {item.expiryDate ? format(item.expiryDate, 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setStockUpdateItem(item)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Update Stock"
                          >
                            <TrendingUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingItem(item)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit Item"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </h3>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                editingItem ? handleUpdateItem(formData) : handleAddItem(formData);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  defaultValue={editingItem?.category}
                  required
                  className="input-field"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                  <input
                    type="number"
                    name="currentStock"
                    defaultValue={editingItem?.currentStock}
                    required
                    min="0"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                  <input
                    type="number"
                    name="minStock"
                    defaultValue={editingItem?.minStock}
                    required
                    min="0"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock</label>
                  <input
                    type="number"
                    name="maxStock"
                    defaultValue={editingItem?.maxStock}
                    required
                    min="0"
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    defaultValue={editingItem?.unit}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost per Unit</label>
                  <input
                    type="number"
                    name="costPerUnit"
                    defaultValue={editingItem?.costPerUnit}
                    required
                    min="0"
                    step="0.01"
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  defaultValue={editingItem?.supplier}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                <input
                  type="date"
                  name="expiryDate"
                  defaultValue={editingItem?.expiryDate ? format(editingItem.expiryDate, 'yyyy-MM-dd') : ''}
                  className="input-field"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Update Modal */}
      {stockUpdateItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Update Stock: {stockUpdateItem.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">
                  Current Stock: <span className="font-medium">{stockUpdateItem.currentStock} {stockUpdateItem.unit}</span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Change (+ to add, - to remove)
                </label>
                <input
                  type="number"
                  value={stockChange}
                  onChange={(e) => setStockChange(Number(e.target.value))}
                  className="input-field"
                  placeholder="Enter quantity change"
                />
              </div>
              
              {stockChange !== 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">
                    New Stock: <span className="font-medium">
                      {stockUpdateItem.currentStock + stockChange} {stockUpdateItem.unit}
                    </span>
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setStockUpdateItem(null);
                    setStockChange(0);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStockUpdate}
                  disabled={stockChange === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}