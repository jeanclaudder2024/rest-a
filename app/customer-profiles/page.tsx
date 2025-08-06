'use client';

import { useState } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { CustomerProfile } from '@/types';
import { 
  User, 
  Plus, 
  Search, 
  Calendar, 
  Star,
  Heart,
  MapPin,
  Phone,
  Mail,
  Gift,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  Award
} from 'lucide-react';

export default function CustomerProfilePage() {
  const { 
    customerProfiles, 
    addCustomerProfile, 
    updateCustomerProfile, 
    deleteCustomerProfile 
  } = useRestaurantStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<CustomerProfile | null>(null);
  const [newProfile, setNewProfile] = useState<Partial<CustomerProfile>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    preferences: [],
    allergies: [],
    totalSpent: 0,
    visitCount: 0,
    lastVisit: new Date().toISOString().split('T')[0],
    loyaltyTier: 'Bronze',
    notes: ''
  });

  const filteredProfiles = customerProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.phone.includes(searchTerm);
    const matchesTier = filterTier === 'all' || profile.loyaltyTier === filterTier;
    return matchesSearch && matchesTier;
  });

  const totalCustomers = customerProfiles.length;
  const totalRevenue = customerProfiles.reduce((sum, profile) => sum + profile.totalSpent, 0);
  const averageSpent = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  const totalVisits = customerProfiles.reduce((sum, profile) => sum + profile.visitCount, 0);

  const tierCounts = customerProfiles.reduce((acc, profile) => {
    acc[profile.loyaltyTier] = (acc[profile.loyaltyTier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCustomers = [...customerProfiles]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const handleAddProfile = () => {
    if (newProfile.name && newProfile.email && newProfile.phone) {
      const profile: CustomerProfile = {
        id: `customer-${Date.now()}`,
        name: newProfile.name,
        email: newProfile.email,
        phone: newProfile.phone,
        address: newProfile.address || '',
        dateOfBirth: newProfile.dateOfBirth || '',
        preferences: newProfile.preferences || [],
        allergies: newProfile.allergies || [],
        totalSpent: newProfile.totalSpent || 0,
        visitCount: newProfile.visitCount || 0,
        lastVisit: newProfile.lastVisit || new Date().toISOString().split('T')[0],
        loyaltyTier: newProfile.loyaltyTier || 'Bronze',
        notes: newProfile.notes || ''
      };
      
      addCustomerProfile(profile);
      setNewProfile({
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        preferences: [],
        allergies: [],
        totalSpent: 0,
        visitCount: 0,
        lastVisit: new Date().toISOString().split('T')[0],
        loyaltyTier: 'Bronze',
        notes: ''
      });
      setShowAddForm(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'bg-amber-100 text-amber-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze': return <Award className="w-4 h-4" />;
      case 'Silver': return <Star className="w-4 h-4" />;
      case 'Gold': return <Gift className="w-4 h-4" />;
      case 'Platinum': return <Heart className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Profiles</h1>
              <p className="text-gray-600">Manage customer information and preferences</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Customer
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Spent</p>
                <p className="text-2xl font-bold text-gray-900">${averageSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Visits</p>
                <p className="text-2xl font-bold text-gray-900">{totalVisits}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Loyalty Tier Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(tierCounts).map(([tier, count]) => (
                <div key={tier} className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTierColor(tier)}`}>
                    {getTierIcon(tier)}
                    {tier}
                  </span>
                  <span className="font-semibold">{count} customers</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Top Customers
            </h3>
            <div className="space-y-3">
              {topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <span className="font-semibold text-green-600">${customer.totalSpent.toFixed(2)}</span>
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
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Tiers</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
        </div>

        {/* Add Customer Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Customer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newProfile.name || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter customer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newProfile.email || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={newProfile.phone || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={newProfile.dateOfBirth || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={newProfile.address || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loyalty Tier
                </label>
                <select
                  value={newProfile.loyaltyTier || 'Bronze'}
                  onChange={(e) => setNewProfile({ ...newProfile, loyaltyTier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newProfile.notes || ''}
                  onChange={(e) => setNewProfile({ ...newProfile, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional notes about the customer"
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
                onClick={handleAddProfile}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add Customer
              </button>
            </div>
          </div>
        )}

        {/* Customer Profiles List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Customer Profiles</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredProfiles.length === 0 ? (
              <div className="p-8 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No customers found matching your criteria.</p>
              </div>
            ) : (
              filteredProfiles.map((profile) => (
                <div key={profile.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTierColor(profile.loyaltyTier)}`}>
                          {getTierIcon(profile.loyaltyTier)}
                          {profile.loyaltyTier}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{profile.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>${profile.totalSpent.toFixed(2)} spent</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          <span>{profile.visitCount} visits</span>
                        </div>
                      </div>
                      
                      {profile.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.address}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4" />
                        <span>Last visit: {new Date(profile.lastVisit).toLocaleDateString()}</span>
                      </div>
                      
                      {profile.preferences.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Preferences: </span>
                          <span className="text-sm text-gray-600">{profile.preferences.join(', ')}</span>
                        </div>
                      )}
                      
                      {profile.allergies.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-red-700">Allergies: </span>
                          <span className="text-sm text-red-600">{profile.allergies.join(', ')}</span>
                        </div>
                      )}
                      
                      {profile.notes && (
                        <p className="text-sm text-gray-600 mt-2">{profile.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setSelectedProfile(profile)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => deleteCustomerProfile(profile.id)}
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