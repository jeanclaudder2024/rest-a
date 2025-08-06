'use client';

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { 
  ChefHat, 
  Clock, 
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Timer,
  TrendingUp,
  Users,
  Utensils,
  Flame,
  Snowflake,
  Zap,
  Brain,
  Target,
  BarChart3,
  Activity,
  Bell,
  Camera,
  Cpu,
  Eye,
  Gauge,
  Heart,
  Lightbulb,
  Monitor,
  Sparkles,
  Wifi
} from 'lucide-react';

export default function SmartKitchenPage() {
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('today');

  // Mock smart kitchen data
  const kitchenStations = [
    {
      id: 'grill-1',
      name: 'Grill Station',
      type: 'grill',
      status: 'active',
      temperature: 425,
      targetTemp: 450,
      efficiency: 94,
      currentOrders: 3,
      avgCookTime: 12,
      aiOptimizations: ['Temperature adjusted for optimal searing', 'Cook sequence optimized for efficiency'],
      alerts: []
    },
    {
      id: 'fryer-1',
      name: 'Deep Fryer',
      type: 'fryer',
      status: 'active',
      temperature: 375,
      targetTemp: 375,
      efficiency: 98,
      currentOrders: 2,
      avgCookTime: 8,
      aiOptimizations: ['Oil quality optimal', 'Batch cooking sequence optimized'],
      alerts: []
    },
    {
      id: 'oven-1',
      name: 'Pizza Oven',
      type: 'oven',
      status: 'warning',
      temperature: 485,
      targetTemp: 500,
      efficiency: 87,
      currentOrders: 4,
      avgCookTime: 15,
      aiOptimizations: ['Preheating schedule optimized', 'Stone rotation recommended'],
      alerts: ['Temperature slightly below optimal']
    },
    {
      id: 'prep-1',
      name: 'Prep Station',
      type: 'prep',
      status: 'active',
      temperature: 68,
      targetTemp: 65,
      efficiency: 91,
      currentOrders: 6,
      avgCookTime: 5,
      aiOptimizations: ['Ingredient prep sequence optimized', 'Cross-contamination prevention active'],
      alerts: []
    }
  ];

  const [stations, setStations] = useState(kitchenStations);

  const aiInsights = [
    {
      id: 'insight-1',
      type: 'efficiency',
      title: 'Peak Hour Optimization',
      description: 'AI detected 15% efficiency improvement possible during 7-9 PM by adjusting grill temperature preemptively',
      impact: 'high',
      recommendation: 'Increase grill temperature to 475°F at 6:45 PM',
      estimatedSavings: '$45/day'
    },
    {
      id: 'insight-2',
      type: 'quality',
      title: 'Food Quality Enhancement',
      description: 'Computer vision detected optimal browning patterns. Adjusting cook times for consistency',
      impact: 'medium',
      recommendation: 'Reduce pizza cook time by 30 seconds for current dough batch',
      estimatedSavings: 'Quality improvement'
    },
    {
      id: 'insight-3',
      type: 'safety',
      title: 'Safety Protocol Alert',
      description: 'Temperature fluctuation detected in cold storage. Immediate attention required',
      impact: 'critical',
      recommendation: 'Check refrigeration unit #2 immediately',
      estimatedSavings: 'Food safety compliance'
    },
    {
      id: 'insight-4',
      type: 'waste',
      title: 'Waste Reduction Opportunity',
      description: 'AI predicts 20% reduction in food waste by adjusting portion preparation timing',
      impact: 'medium',
      recommendation: 'Delay prep of perishable garnishes by 30 minutes',
      estimatedSavings: '$28/day'
    }
  ];

  const cookingQueue = [
    {
      id: 'order-1',
      orderNumber: '#1247',
      items: ['Margherita Pizza', 'Caesar Salad'],
      station: 'oven-1',
      estimatedTime: 8,
      priority: 'high',
      aiOptimized: true,
      status: 'cooking'
    },
    {
      id: 'order-2',
      orderNumber: '#1248',
      items: ['Grilled Salmon', 'Roasted Vegetables'],
      station: 'grill-1',
      estimatedTime: 12,
      priority: 'medium',
      aiOptimized: true,
      status: 'cooking'
    },
    {
      id: 'order-3',
      orderNumber: '#1249',
      items: ['Fish & Chips', 'Onion Rings'],
      station: 'fryer-1',
      estimatedTime: 6,
      priority: 'medium',
      aiOptimized: false,
      status: 'queued'
    },
    {
      id: 'order-4',
      orderNumber: '#1250',
      items: ['Chicken Parmesan', 'Garlic Bread'],
      station: 'oven-1',
      estimatedTime: 18,
      priority: 'low',
      aiOptimized: true,
      status: 'queued'
    }
  ];

  const getStationIcon = (type: string) => {
    switch (type) {
      case 'grill': return <Flame className="h-5 w-5" />;
      case 'fryer': return <Zap className="h-5 w-5" />;
      case 'oven': return <Thermometer className="h-5 w-5" />;
      case 'prep': return <Utensils className="h-5 w-5" />;
      default: return <ChefHat className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'idle': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredStations = stations.filter(station => {
    return selectedStation === 'all' || station.type === selectedStation;
  });

  const totalOrders = stations.reduce((sum, station) => sum + station.currentOrders, 0);
  const avgEfficiency = stations.reduce((sum, station) => sum + station.efficiency, 0) / stations.length;
  const activeStations = stations.filter(station => station.status === 'active').length;
  const criticalAlerts = aiInsights.filter(insight => insight.impact === 'critical').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                🤖 Smart Kitchen AI
              </h1>
              <p className="text-gray-600">AI-powered kitchen management and optimization</p>
            </div>
          </div>
        </div>

        {/* Kitchen Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-orange-600">{totalOrders}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Utensils className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+3 from last hour</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
                <p className="text-2xl font-bold text-red-600">{avgEfficiency.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Gauge className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+2.3% improvement</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Stations</p>
                <p className="text-2xl font-bold text-pink-600">{activeStations}/{stations.length}</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-lg">
                <Monitor className="h-6 w-6 text-pink-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">All operational</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-purple-600">{criticalAlerts}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-red-600">Requires attention</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Station Type</label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Stations</option>
                <option value="grill">🔥 Grill</option>
                <option value="fryer">⚡ Fryer</option>
                <option value="oven">🌡️ Oven</option>
                <option value="prep">🍽️ Prep</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Run AI Analysis
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kitchen Stations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Station Monitoring */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Monitor className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">🏭 Station Monitoring</h2>
                  <p className="text-gray-600">Real-time kitchen equipment status</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStations.map((station) => (
                  <div key={station.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    {/* Station Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          {getStationIcon(station.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{station.name}</h3>
                          <p className="text-sm text-gray-500">ID: {station.id}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(station.status)}`}>
                        {station.status}
                      </span>
                    </div>

                    {/* Temperature & Efficiency */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <span className="text-lg font-bold text-gray-900">{station.temperature}°F</span>
                        </div>
                        <p className="text-xs text-gray-500">Target: {station.targetTemp}°F</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Gauge className="h-4 w-4 text-green-500" />
                          <span className="text-lg font-bold text-gray-900">{station.efficiency}%</span>
                        </div>
                        <p className="text-xs text-gray-500">Efficiency</p>
                      </div>
                    </div>

                    {/* Current Orders & Cook Time */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Utensils className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900">{station.currentOrders}</span>
                        </div>
                        <p className="text-xs text-gray-500">Active Orders</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium text-gray-900">{station.avgCookTime}m</span>
                        </div>
                        <p className="text-xs text-gray-500">Avg Cook Time</p>
                      </div>
                    </div>

                    {/* AI Optimizations */}
                    {station.aiOptimizations.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <Brain className="h-4 w-4" />
                          AI Optimizations
                        </h4>
                        <div className="space-y-1">
                          {station.aiOptimizations.map((optimization, index) => (
                            <div key={index} className="text-xs text-green-700 bg-green-50 p-2 rounded">
                              ✓ {optimization}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Alerts */}
                    {station.alerts.length > 0 && (
                      <div className="space-y-1">
                        {station.alerts.map((alert, index) => (
                          <div key={index} className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {alert}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cooking Queue */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Timer className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">⏱️ Cooking Queue</h2>
                  <p className="text-gray-600">AI-optimized order sequence</p>
                </div>
              </div>

              <div className="space-y-4">
                {cookingQueue.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-gray-900">{order.orderNumber}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                          {order.priority} priority
                        </span>
                        {order.aiOptimized && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
                            <Brain className="h-3 w-3" />
                            AI Optimized
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{order.estimatedTime}m</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {order.items.map((item, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Station: {order.station}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'cooking' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">🧠 AI Insights</h3>
              </div>

              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className={`border rounded-lg p-4 ${getImpactColor(insight.impact)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                      <span className="text-xs font-medium px-2 py-1 rounded">
                        {insight.impact}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mb-3">{insight.description}</p>
                    <div className="bg-white bg-opacity-50 rounded p-2 mb-2">
                      <p className="text-xs font-medium text-gray-800">Recommendation:</p>
                      <p className="text-xs text-gray-700">{insight.recommendation}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Impact: {insight.estimatedSavings}</span>
                      <button className="text-xs bg-white px-2 py-1 rounded hover:bg-gray-50">
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">⚡ Quick Controls</h3>
              </div>

              <div className="space-y-3">
                <button className="w-full p-3 bg-gradient-to-r from-orange-100 to-red-100 text-gray-800 rounded-lg hover:from-orange-200 hover:to-red-200 transition-colors flex items-center gap-2">
                  <Thermometer className="h-4 w-4" />
                  Adjust All Temperatures
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 rounded-lg hover:from-blue-200 hover:to-purple-200 transition-colors flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Optimize Cook Times
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-green-100 to-teal-100 text-gray-800 rounded-lg hover:from-green-200 hover:to-teal-200 transition-colors flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Run Full AI Analysis
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-yellow-100 to-orange-100 text-gray-800 rounded-lg hover:from-yellow-200 hover:to-orange-200 transition-colors flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Alert Settings
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">📊 System Status</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI Processing</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Temperature Sensors</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">4/4 Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Computer Vision</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Monitoring</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Predictive Analytics</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-600">Learning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Features Overview */}
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-bold text-gray-900">🤖 AI-Powered Kitchen Features</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🌡️ Smart Temperature Control</h4>
              <p className="text-sm text-gray-600">AI automatically adjusts equipment temperatures for optimal cooking</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">👁️ Computer Vision Quality Control</h4>
              <p className="text-sm text-gray-600">Visual AI monitors food quality and cooking progress in real-time</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">⏱️ Predictive Cook Times</h4>
              <p className="text-sm text-gray-600">Machine learning predicts optimal cooking times based on conditions</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🔄 Workflow Optimization</h4>
              <p className="text-sm text-gray-600">AI optimizes kitchen workflow and order sequencing for efficiency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}