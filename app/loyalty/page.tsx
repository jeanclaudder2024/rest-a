'use client';

import { useState } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { LoyaltyProgram, LoyaltyReward } from '@/types';
import { 
  Gift, 
  Star, 
  Users, 
  TrendingUp, 
  Award, 
  Plus,
  Search,
  Calendar,
  Crown,
  Coins
} from 'lucide-react';

export default function LoyaltyPage() {
  const { 
    loyaltyPrograms, 
    loyaltyRewards, 
    addLoyaltyPoints, 
    redeemLoyaltyReward,
    updateLoyaltyProgram 
  } = useRestaurantStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [showAddPoints, setShowAddPoints] = useState<string | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);

  const filteredPrograms = loyaltyPrograms.filter(program => {
    const matchesSearch = program.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'all' || program.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const totalMembers = loyaltyPrograms.length;
  const totalPoints = loyaltyPrograms.reduce((sum, program) => sum + program.points, 0);
  const averagePoints = totalMembers > 0 ? totalPoints / totalMembers : 0;

  const tierCounts = {
    Bronze: loyaltyPrograms.filter(p => p.tier === 'Bronze').length,
    Silver: loyaltyPrograms.filter(p => p.tier === 'Silver').length,
    Gold: loyaltyPrograms.filter(p => p.tier === 'Gold').length,
    Platinum: loyaltyPrograms.filter(p => p.tier === 'Platinum').length,
  };

  const handleAddPoints = (customerId: string) => {
    if (pointsToAdd > 0) {
      addLoyaltyPoints(customerId, pointsToAdd);
      setShowAddPoints(null);
      setPointsToAdd(0);
    }
  };

  const handleRedeemReward = (customerId: string, rewardId: string) => {
    redeemLoyaltyReward(customerId, rewardId);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze': return <Award className="w-5 h-5" />;
      case 'Silver': return <Star className="w-5 h-5" />;
      case 'Gold': return <Crown className="w-5 h-5" />;
      case 'Platinum': return <Crown className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loyalty Program</h1>
          <p className="text-gray-600">Manage customer loyalty programs and rewards</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Coins className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{totalPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Points</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(averagePoints)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Rewards</p>
                <p className="text-2xl font-bold text-gray-900">{loyaltyRewards.filter(r => r.isActive).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tier Distribution */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tier Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(tierCounts).map(([tier, count]) => (
              <div key={tier} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-2 ${getTierColor(tier)}`}>
                  {getTierIcon(tier)}
                </div>
                <p className="font-semibold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600">{tier}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Available Rewards */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loyaltyRewards.filter(reward => reward.isActive).map((reward) => (
              <div key={reward.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                    {reward.pointsCost} pts
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{reward.description}</p>
                <p className="text-xs text-gray-500">
                  Valid until: {reward.validUntil.toLocaleDateString()}
                </p>
              </div>
            ))}
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
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tiers</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Loyalty Members</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredPrograms.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No members found matching your criteria.</p>
              </div>
            ) : (
              filteredPrograms.map((program) => (
                <div key={program.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTierColor(program.tier)}`}>
                          {getTierIcon(program.tier)}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{program.customerName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(program.tier)}`}>
                            {program.tier}
                          </span>
                          <span>{program.points} points</span>
                          <span>Joined: {program.joinDate.toLocaleDateString()}</span>
                          <span>Last visit: {program.lastVisit.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {showAddPoints === program.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={pointsToAdd}
                            onChange={(e) => setPointsToAdd(Number(e.target.value))}
                            placeholder="Points"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <button
                            onClick={() => handleAddPoints(program.customerId)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setShowAddPoints(null)}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddPoints(program.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Points
                        </button>
                      )}
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