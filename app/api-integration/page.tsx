'use client'

import React, { useState, useEffect } from 'react'
import { 
  Globe, 
  Zap, 
  Shield, 
  Database, 
  Cloud, 
  Smartphone, 
  CreditCard, 
  Truck, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Key, 
  Link, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Activity, 
  Code, 
  FileText, 
  Download, 
  Upload, 
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy
} from 'lucide-react'

export default function APIIntegrationPage() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedAPI, setSelectedAPI] = useState(null)

  // Mock API integrations data
  const apiIntegrations = [
    {
      id: 1,
      name: 'Stripe Payment Gateway',
      category: 'Payment',
      status: 'connected',
      icon: CreditCard,
      description: 'Process payments securely with Stripe',
      lastSync: '2024-01-15 14:30',
      requests: 1247,
      uptime: 99.9,
      version: 'v2023-10-16',
      endpoints: [
        { name: 'Create Payment Intent', method: 'POST', url: '/api/stripe/payment-intent' },
        { name: 'Confirm Payment', method: 'POST', url: '/api/stripe/confirm' },
        { name: 'Refund Payment', method: 'POST', url: '/api/stripe/refund' }
      ]
    },
    {
      id: 2,
      name: 'Google Maps API',
      category: 'Location',
      status: 'connected',
      icon: Globe,
      description: 'Location services and mapping',
      lastSync: '2024-01-15 12:15',
      requests: 892,
      uptime: 99.8,
      version: 'v3',
      endpoints: [
        { name: 'Geocoding', method: 'GET', url: '/api/maps/geocode' },
        { name: 'Distance Matrix', method: 'GET', url: '/api/maps/distance' },
        { name: 'Places Search', method: 'GET', url: '/api/maps/places' }
      ]
    },
    {
      id: 3,
      name: 'Twilio SMS',
      category: 'Communication',
      status: 'connected',
      icon: MessageSquare,
      description: 'Send SMS notifications to customers',
      lastSync: '2024-01-15 16:45',
      requests: 456,
      uptime: 99.7,
      version: '2010-04-01',
      endpoints: [
        { name: 'Send SMS', method: 'POST', url: '/api/twilio/sms' },
        { name: 'Get Message Status', method: 'GET', url: '/api/twilio/status' }
      ]
    },
    {
      id: 4,
      name: 'DoorDash Drive',
      category: 'Delivery',
      status: 'pending',
      icon: Truck,
      description: 'Third-party delivery integration',
      lastSync: 'Never',
      requests: 0,
      uptime: 0,
      version: 'v1',
      endpoints: [
        { name: 'Create Delivery', method: 'POST', url: '/api/doordash/delivery' },
        { name: 'Track Delivery', method: 'GET', url: '/api/doordash/track' }
      ]
    },
    {
      id: 5,
      name: 'Firebase Analytics',
      category: 'Analytics',
      status: 'error',
      icon: BarChart3,
      description: 'Track user behavior and app performance',
      lastSync: '2024-01-14 09:20',
      requests: 2341,
      uptime: 95.2,
      version: 'v1',
      endpoints: [
        { name: 'Log Event', method: 'POST', url: '/api/firebase/event' },
        { name: 'Get Analytics', method: 'GET', url: '/api/firebase/analytics' }
      ]
    }
  ]

  const apiCategories = [
    { name: 'Payment', count: 3, icon: CreditCard, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { name: 'Location', count: 2, icon: Globe, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { name: 'Communication', count: 4, icon: MessageSquare, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    { name: 'Delivery', count: 2, icon: Truck, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    { name: 'Analytics', count: 3, icon: BarChart3, color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' }
  ]

  const webhookEvents = [
    {
      id: 1,
      event: 'payment.succeeded',
      source: 'Stripe',
      timestamp: '2024-01-15 14:32:15',
      status: 'success',
      data: { amount: 45.99, customer: 'cus_123456' }
    },
    {
      id: 2,
      event: 'order.delivered',
      source: 'DoorDash',
      timestamp: '2024-01-15 13:45:22',
      status: 'success',
      data: { orderId: 'ord_789', deliveryTime: '25 mins' }
    },
    {
      id: 3,
      event: 'sms.failed',
      source: 'Twilio',
      timestamp: '2024-01-15 12:18:33',
      status: 'error',
      data: { to: '+1234567890', error: 'Invalid number' }
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'error': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'integrations', label: 'API Integrations', icon: Link },
    { id: 'webhooks', label: 'Webhooks', icon: Zap },
    { id: 'documentation', label: 'API Docs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Integration Hub</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage all your third-party integrations</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            {selectedTab === 'overview' && (
              <div>
                {/* API Categories */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                  {apiCategories.map((category) => (
                    <div key={category.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <category.icon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                        <span className={`px-2 py-1 text-xs rounded-full ${category.color}`}>
                          {category.count}
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{category.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} integrations</p>
                    </div>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center">
                      <Activity className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active APIs</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center">
                      <Zap className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">API Calls Today</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">4,936</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center">
                      <Shield className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Uptime</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">99.2%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Errors Today</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent API Activity</h3>
                  <div className="space-y-3">
                    {webhookEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            event.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{event.event}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">from {event.source}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{event.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'integrations' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {apiIntegrations.map((api) => (
                    <div key={api.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <api.icon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{api.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{api.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full flex items-center ${getStatusColor(api.status)}`}>
                            {getStatusIcon(api.status)}
                            <span className="ml-1">{api.status}</span>
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{api.description}</p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Requests Today</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{api.requests}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Uptime</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{api.uptime}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Version</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{api.version}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Last Sync</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{api.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedAPI(api)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="h-3 w-3 mr-1 inline" />
                          View Details
                        </button>
                        <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                          <Settings className="h-3 w-3 mr-1 inline" />
                          Configure
                        </button>
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                          <RefreshCw className="h-3 w-3 mr-1 inline" />
                          Test
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* API Details Modal */}
                {selectedAPI && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{selectedAPI.name} - Endpoints</h3>
                        <button 
                          onClick={() => setSelectedAPI(null)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <XCircle className="h-6 w-6" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {selectedAPI.endpoints.map((endpoint, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    endpoint.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                  }`}>
                                    {endpoint.method}
                                  </span>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">{endpoint.name}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">{endpoint.url}</p>
                              </div>
                              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'webhooks' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Webhook Events</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-gray-100 dark:bg-gray-600">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Event</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Source</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {webhookEvents.map((event) => (
                          <tr key={event.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {event.event}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {event.source}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                                {event.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {event.timestamp}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'documentation' && (
              <div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">API Documentation</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Authentication</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">All API requests require authentication using API keys or OAuth tokens.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Rate Limiting</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">API calls are limited to 1000 requests per hour per integration.</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Error Handling</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">All errors return standard HTTP status codes with detailed error messages.</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Download Full Documentation
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'settings' && (
              <div>
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">API Keys Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Production API Key</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">pk_live_****************************</p>
                        </div>
                        <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                          Regenerate
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Test API Key</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">pk_test_****************************</p>
                        </div>
                        <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                          Regenerate
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Webhook Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Webhook URL
                        </label>
                        <input
                          type="url"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://your-domain.com/webhooks"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Webhook Secret
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter webhook secret"
                        />
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