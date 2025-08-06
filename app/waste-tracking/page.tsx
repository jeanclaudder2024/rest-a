'use client';

import { useState } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { WasteTracking } from '@/types';
import { 
  Trash2, 
  Plus, 
  Search, 
  Calendar, 
  DollarSign,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  PieChart,
  Target,
  Leaf
} from 'lucide-react';

export default function WasteTrackingPage() {
  const { 
    wasteTracking, 
    addWasteTracking, 
    updateWasteTracking, 
    deleteWasteTracking 
  } = useRestaurantStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterReason, setFilterReason] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWaste, setNewWaste] = useState<Partial<WasteTracking>>({
    itemName: '',
    category: 'Food',
    quantity: 0,
    unit: 'kg',
    reason: 'Expired',
    cost: 0,
    notes: ''
  });

  const filteredWaste = wasteTracking.filter(waste => {
    const matchesSearch = waste.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || waste.category === filterCategory;
    const matchesReason = filterReason === 'all' || waste.reason === filterReason;
    return matchesSearch && matchesCategory && matchesReason;
  });

  const totalWasteValue = wasteTracking.reduce((sum, waste) => sum + waste.cost, 0);
  const totalWasteQuantity = wasteTracking.reduce((sum, waste) => sum + waste.quantity, 0);
  const wasteByCategory = wasteTracking.reduce((acc, waste) => {
    acc[waste.category] = (acc[waste.category] || 0) + waste.cost;
    return acc;
  }, {} as Record<string, number>);
  const wasteByReason = wasteTracking.reduce((acc, waste) => {
    acc[waste.reason] = (acc[waste.reason] || 0) + waste.cost;
    return acc;
  }, {} as Record<string, number>);

  const handleAddWaste = () => {
    if (newWaste.itemName && newWaste.quantity && newWaste.cost) {
      const waste: WasteTracking = {
        id: `waste-${Date.now()}`,
        itemName: newWaste.itemName,
        category: newWaste.category || 'Food',
        quantity: newWaste.quantity,
        unit: newWaste.unit || 'kg',
        reason: newWaste.reason || 'Expired',
        cost: newWaste.cost,
        date: new Date().toISOString(),
        notes: newWaste.notes || ''
      };
      
      addWasteTracking(waste);
      setNewWaste({
        itemName: '',
        category: 'Food',
        quantity: 0,
        unit: 'kg',
        reason: 'Expired',
        cost: 0,
        notes: ''
      });
      setShowAddForm(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Food': return 'bg-green-100 text-green-800';
      case 'Beverage': return 'bg-blue-100 text-blue-800';
      case 'Packaging': return 'bg-yellow-100 text-yellow-800';
      case 'Other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Spoiled': return 'bg-orange-100 text-orange-800';
      case 'Overproduction': return 'bg-purple-100 text-purple-800';
      case 'Customer Return': return 'bg-blue-100 text-blue-800';
      case 'Damaged': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Waste Tracking</h1>
              <p className="text-gray-600">Monitor and reduce food waste to improve sustainability and profitability</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Record Waste
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Waste Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalWasteValue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Quantity</p>
                <p className="text-2xl font-bold text-gray-900">{totalWasteQuantity.toFixed(1)} kg</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Waste Entries</p>
                <p className="text-2xl font-bold text-gray-900">{wasteTracking.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Daily Waste</p>
                <p className="text-2xl font-bold text-gray-900">${(totalWasteValue / 30).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Waste by Category
            </h3>
            <div className="space-y-3">
              {Object.entries(wasteByCategory).map(([category, value]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                    {category}
                  </span>
                  <span className="font-semibold">${value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Waste by Reason
            </h3>
            <div className="space-y-3">
              {Object.entries(wasteByReason).map(([reason, value]) => (
                <div key={reason} className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReasonColor(reason)}`}>
                    {reason}
                  </span>
                  <span className="font-semibold">${value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search waste items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Food">Food</option>
              <option value="Beverage">Beverage</option>
              <option value="Packaging">Packaging</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Reasons</option>
              <option value="Expired">Expired</option>
              <option value="Spoiled">Spoiled</option>
              <option value="Overproduction">Overproduction</option>
              <option value="Customer Return">Customer Return</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>
        </div>

        {/* Add Waste Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Record Waste</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={newWaste.itemName || ''}
                  onChange={(e) => setNewWaste({ ...newWaste, itemName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter item name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newWaste.category || 'Food'}
                  onChange={(e) => setNewWaste({ ...newWaste, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Food">Food</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newWaste.quantity || ''}
                  onChange={(e) => setNewWaste({ ...newWaste, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter quantity"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={newWaste.unit || 'kg'}
                  onChange={(e) => setNewWaste({ ...newWaste, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                  <option value="pieces">pieces</option>
                  <option value="liters">liters</option>
                  <option value="portions">portions</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <select
                  value={newWaste.reason || 'Expired'}
                  onChange={(e) => setNewWaste({ ...newWaste, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Expired">Expired</option>
                  <option value="Spoiled">Spoiled</option>
                  <option value="Overproduction">Overproduction</option>
                  <option value="Customer Return">Customer Return</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Value *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newWaste.cost || ''}
                  onChange={(e) => setNewWaste({ ...newWaste, cost: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter cost value"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newWaste.notes || ''}
                  onChange={(e) => setNewWaste({ ...newWaste, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional notes about the waste"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWaste}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Record Waste
              </button>
            </div>
          </div>
        )}

        {/* Waste List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Waste Records</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredWaste.length === 0 ? (
              <div className="p-8 text-center">
                <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No waste records found. Great job on reducing waste!</p>
              </div>
            ) : (
              filteredWaste.map((waste) => (
                <div key={waste.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{waste.itemName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(waste.category)}`}>
                          {waste.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReasonColor(waste.reason)}`}>
                          {waste.reason}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          <span>{waste.quantity} {waste.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>${waste.cost.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(waste.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-4 h-4" />
                          <span>${(waste.cost / waste.quantity).toFixed(2)} per {waste.unit}</span>
                        </div>
                      </div>
                      
                      {waste.notes && (
                        <p className="text-sm text-gray-600 mt-2">{waste.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => deleteWasteTracking(waste.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}