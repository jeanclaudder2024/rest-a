'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Star, 
  Heart, 
  Gift, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  ShoppingBag, 
  Clock, 
  TrendingUp,
  Award,
  Target,
  Zap,
  MessageSquare,
  Camera,
  Share2,
  Bell,
  Settings,
  Filter,
  Search,
  Plus,
  Edit,
  Eye,
  BarChart3
} from 'lucide-react'

export default function AdvancedCustomerPage() {
  const [selectedTab, setSelectedTab] = useState('profiles')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock customer data
  const customers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      avatar: '👩‍💼',
      status: 'vip',
      loyaltyPoints: 2450,
      totalSpent: 1250.75,
      visits: 28,
      lastVisit: '2024-01-15',
      favoriteItems: ['Margherita Pizza', 'Caesar Salad'],
      preferences: ['Vegetarian', 'No Nuts'],
      birthday: '1990-06-15',
      joinDate: '2023-03-10',
      rating: 4.8,
      reviews: 12
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 987-6543',
      avatar: '👨‍💻',
      status: 'regular',
      loyaltyPoints: 890,
      totalSpent: 445.20,
      visits: 15,
      lastVisit: '2024-01-12',
      favoriteItems: ['Beef Burger', 'Chocolate Cake'],
      preferences: ['Spicy Food'],
      birthday: '1985-11-22',
      joinDate: '2023-08-05',
      rating: 4.5,
      reviews: 7
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '+1 (555) 456-7890',
      avatar: '👩‍🎨',
      status: 'new',
      loyaltyPoints: 150,
      totalSpent: 75.50,
      visits: 3,
      lastVisit: '2024-01-10',
      favoriteItems: ['Avocado Toast'],
      preferences: ['Vegan', 'Gluten-Free'],
      birthday: '1995-03-08',
      joinDate: '2024-01-01',
      rating: 5.0,
      reviews: 2
    }
  ]

  const loyaltyPrograms = [
    {
      id: 1,
      name: 'Bronze Member',
      minSpent: 0,
      benefits: ['5% discount', 'Birthday treat'],
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
    },
    {
      id: 2,
      name: 'Silver Member',
      minSpent: 500,
      benefits: ['10% discount', 'Free appetizer monthly', 'Priority seating'],
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    },
    {
      id: 3,
      name: 'Gold Member',
      minSpent: 1000,
      benefits: ['15% discount', 'Free dessert weekly', 'VIP events'],
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
  ]

  const personalizedOffers = [
    {
      id: 1,
      customerId: 1,
      title: '20% Off Your Favorite Pizza',
      description: 'Special offer on Margherita Pizza - your most ordered item!',
      validUntil: '2024-02-15',
      used: false,
      type: 'personalized'
    },
    {
      id: 2,
      customerId: 2,
      title: 'Free Dessert with Burger',
      description: 'Get a free chocolate cake with any burger order',
      validUntil: '2024-02-10',
      used: false,
      type: 'combo'
    }
  ]

  const customerInsights = {
    totalCustomers: 1247,
    newThisMonth: 89,
    vipCustomers: 156,
    averageSpent: 42.50,
    retentionRate: 78,
    satisfactionScore: 4.6
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'vip': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'regular': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'new': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const tabs = [
    { id: 'profiles', label: 'Customer Profiles', icon: Users },
    { id: 'loyalty', label: 'Loyalty Program', icon: Gift },
    { id: 'personalization', label: 'Personalization', icon: Target },
    { id: 'insights', label: 'Customer Insights', icon: BarChart3 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Customer Features</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive customer management & personalization</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{customerInsights.totalCustomers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{customerInsights.newThisMonth}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VIP Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{customerInsights.vipCustomers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${customerInsights.averageSpent}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Retention Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{customerInsights.retentionRate}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{customerInsights.satisfactionScore}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'profiles' && (
              <div>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="vip">VIP</option>
                    <option value="regular">Regular</option>
                    <option value="new">New</option>
                  </select>
                </div>

                {/* Customer List */}
                <div className="space-y-4">
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{customer.avatar}</div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{customer.name}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(customer.status)}`}>
                                {customer.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{customer.rating} ({customer.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">${customer.totalSpent}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{customer.visits} visits</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{customer.loyaltyPoints} points</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Favorite Items</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{customer.favoriteItems.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferences</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{customer.preferences.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Visit</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{customer.lastVisit}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                          <Eye className="h-3 w-3 mr-1 inline" />
                          View Profile
                        </button>
                        <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                          <Edit className="h-3 w-3 mr-1 inline" />
                          Edit
                        </button>
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                          <Gift className="h-3 w-3 mr-1 inline" />
                          Send Offer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'loyalty' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Loyalty Program Tiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {loyaltyPrograms.map((program) => (
                    <div key={program.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">{program.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${program.color}`}>
                          ${program.minSpent}+ spent
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {program.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Star className="h-4 w-4 text-yellow-400 mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'personalization' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Personalized Offers</h3>
                <div className="space-y-4">
                  {personalizedOffers.map((offer) => (
                    <div key={offer.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">{offer.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{offer.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Valid until: {offer.validUntil}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            offer.used ? 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {offer.used ? 'Used' : 'Active'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'insights' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Customer Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Customer Segmentation</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">VIP Customers</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">12.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Regular Customers</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">65.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">New Customers</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">22.3%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Popular Preferences</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Vegetarian</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Spicy Food</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">28%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Gluten-Free</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">18%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}