'use client';

import { useState } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { Promotion } from '@/types';
import { 
  Tag, 
  Plus, 
  Search, 
  Calendar, 
  Percent,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  Gift,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function PromotionsPage() {
  const { 
    promotions, 
    addPromotion, 
    updatePromotion, 
    deletePromotion 
  } = useRestaurantStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPromotion, setNewPromotion] = useState<Partial<Promotion>>({
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    usageLimit: 100,
    usageCount: 0,
    conditions: ''
  });

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || promotion.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && promotion.isActive) ||
                         (filterStatus === 'inactive' && !promotion.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPromotions = promotions.length;
  const activePromotions = promotions.filter(p => p.isActive).length;
  const totalUsage = promotions.reduce((sum, promo) => sum + promo.usageCount, 0);
  const averageUsage = totalPromotions > 0 ? totalUsage / totalPromotions : 0;

  const handleAddPromotion = () => {
    if (newPromotion.name && newPromotion.description && newPromotion.value) {
      const promotion: Promotion = {
        id: `promo-${Date.now()}`,
        name: newPromotion.name,
        description: newPromotion.description,
        type: newPromotion.type || 'percentage',
        value: newPromotion.value,
        startDate: newPromotion.startDate || new Date().toISOString().split('T')[0],
        endDate: newPromotion.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: newPromotion.isActive !== false,
        usageLimit: newPromotion.usageLimit || 100,
        usageCount: 0,
        conditions: newPromotion.conditions || ''
      };
      
      addPromotion(promotion);
      setNewPromotion({
        name: '',
        description: '',
        type: 'percentage',
        value: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true,
        usageLimit: 100,
        usageCount: 0,
        conditions: ''
      });
      setShowAddForm(false);
    }
  };

  const handleToggleActive = (promotionId: string, isActive: boolean) => {
    updatePromotion(promotionId, { isActive: !isActive });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'bg-green-100 text-green-800';
      case 'fixed': return 'bg-blue-100 text-blue-800';
      case 'bogo': return 'bg-purple-100 text-purple-800';
      case 'free_item': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="w-4 h-4" />;
      case 'fixed': return <DollarSign className="w-4 h-4" />;
      case 'bogo': return <Gift className="w-4 h-4" />;
      case 'free_item': return <Star className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  const isPromotionExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    return promotion.isActive && now >= start && now <= end;
  };

  const getPromotionStatus = (promotion: Promotion) => {
    if (!promotion.isActive) return { status: 'Inactive', color: 'bg-gray-100 text-gray-800', icon: <AlertTriangle className="w-4 h-4" /> };
    if (isPromotionExpired(promotion.endDate)) return { status: 'Expired', color: 'bg-red-100 text-red-800', icon: <Clock className="w-4 h-4" /> };
    if (isPromotionActive(promotion)) return { status: 'Active', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
    return { status: 'Scheduled', color: 'bg-blue-100 text-blue-800', icon: <Calendar className="w-4 h-4" /> };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Promotions & Offers</h1>
              <p className="text-gray-600">Create and manage promotional campaigns to boost sales</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Promotion
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Promotions</p>
                <p className="text-2xl font-bold text-gray-900">{totalPromotions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Promotions</p>
                <p className="text-2xl font-bold text-gray-900">{activePromotions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsage}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Usage</p>
                <p className="text-2xl font-bold text-gray-900">{averageUsage.toFixed(1)}</p>
              </div>
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
                  placeholder="Search promotions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="bogo">Buy One Get One</option>
              <option value="free_item">Free Item</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Add Promotion Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Promotion</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion Name *
                </label>
                <input
                  type="text"
                  value={newPromotion.name || ''}
                  onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter promotion name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newPromotion.type || 'percentage'}
                  onChange={(e) => setNewPromotion({ ...newPromotion, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage Discount</option>
                  <option value="fixed">Fixed Amount Discount</option>
                  <option value="bogo">Buy One Get One</option>
                  <option value="free_item">Free Item</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newPromotion.value || ''}
                  onChange={(e) => setNewPromotion({ ...newPromotion, value: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={newPromotion.type === 'percentage' ? 'Enter percentage (e.g., 20)' : 'Enter amount'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={newPromotion.usageLimit || ''}
                  onChange={(e) => setNewPromotion({ ...newPromotion, usageLimit: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter usage limit"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={newPromotion.startDate || ''}
                  onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={newPromotion.endDate || ''}
                  onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newPromotion.description || ''}
                  onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the promotion"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conditions
                </label>
                <textarea
                  value={newPromotion.conditions || ''}
                  onChange={(e) => setNewPromotion({ ...newPromotion, conditions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={2}
                  placeholder="Terms and conditions (optional)"
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
                onClick={handleAddPromotion}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Promotion
              </button>
            </div>
          </div>
        )}

        {/* Promotions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Promotions</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredPromotions.length === 0 ? (
              <div className="p-8 text-center">
                <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No promotions found matching your criteria.</p>
              </div>
            ) : (
              filteredPromotions.map((promotion) => {
                const status = getPromotionStatus(promotion);
                const usagePercentage = promotion.usageLimit > 0 
                  ? (promotion.usageCount / promotion.usageLimit) * 100 
                  : 0;
                
                return (
                  <div key={promotion.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{promotion.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTypeColor(promotion.type)}`}>
                            {getTypeIcon(promotion.type)}
                            {promotion.type.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                            {status.icon}
                            {status.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{promotion.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            {promotion.type === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                            <span>
                              {promotion.type === 'percentage' ? `${promotion.value}% off` : `$${promotion.value} off`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{promotion.usageCount}/{promotion.usageLimit} used</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            <span>{usagePercentage.toFixed(1)}% utilized</span>
                          </div>
                        </div>
                        
                        {promotion.conditions && (
                          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                            <strong>Conditions:</strong> {promotion.conditions}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleToggleActive(promotion.id, promotion.isActive)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            promotion.isActive 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {promotion.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deletePromotion(promotion.id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}