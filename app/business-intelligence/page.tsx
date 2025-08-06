'use client';

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Clock,
  Brain,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  Star,
  Globe,
  Leaf,
  ChefHat
} from 'lucide-react';

export default function BusinessIntelligencePage() {
  const { 
    orders, 
    menuItems, 
    customerProfiles, 
    financialReports,
    aiInsights,
    predictiveAnalytics,
    sustainabilityTracking
  } = useRestaurantStore();

  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    currentRevenue: 2847.50,
    ordersToday: 47,
    avgOrderValue: 60.59,
    customerSatisfaction: 4.7,
    kitchenEfficiency: 92,
    staffProductivity: 88,
    energyEfficiency: 85,
    wasteReduction: 15
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        ...prev,
        currentRevenue: prev.currentRevenue + Math.random() * 50,
        ordersToday: prev.ordersToday + (Math.random() > 0.7 ? 1 : 0),
        kitchenEfficiency: Math.min(100, prev.kitchenEfficiency + (Math.random() - 0.5) * 2),
        staffProductivity: Math.min(100, prev.staffProductivity + (Math.random() - 0.5) * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const kpiCards = [
    {
      title: 'Real-time Revenue',
      value: `$${realTimeMetrics.currentRevenue.toFixed(2)}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Orders Today',
      value: realTimeMetrics.ordersToday.toString(),
      change: '+8.3%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Avg Order Value',
      value: `$${realTimeMetrics.avgOrderValue.toFixed(2)}`,
      change: '+5.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Customer Satisfaction',
      value: realTimeMetrics.customerSatisfaction.toFixed(1),
      change: '+0.3',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const operationalMetrics = [
    {
      title: 'Kitchen Efficiency',
      value: realTimeMetrics.kitchenEfficiency,
      target: 90,
      icon: ChefHat,
      color: 'text-orange-600'
    },
    {
      title: 'Staff Productivity',
      value: realTimeMetrics.staffProductivity,
      target: 85,
      icon: Users,
      color: 'text-indigo-600'
    },
    {
      title: 'Energy Efficiency',
      value: realTimeMetrics.energyEfficiency,
      target: 80,
      icon: Zap,
      color: 'text-green-600'
    },
    {
      title: 'Waste Reduction',
      value: realTimeMetrics.wasteReduction,
      target: 10,
      icon: Leaf,
      color: 'text-emerald-600'
    }
  ];

  const aiRecommendations = [
    {
      id: 1,
      type: 'pricing',
      title: 'Dynamic Pricing Opportunity',
      description: 'Increase Margherita Pizza price by $1.50 during peak hours (7-9 PM)',
      impact: '+$180 daily revenue',
      confidence: 94,
      priority: 'high'
    },
    {
      id: 2,
      type: 'inventory',
      title: 'Smart Inventory Alert',
      description: 'Order salmon 2 days earlier based on weather forecast and booking trends',
      impact: 'Prevent 15% waste',
      confidence: 89,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'staffing',
      title: 'Optimal Staffing',
      description: 'Add 1 kitchen staff member for tomorrow lunch rush',
      impact: 'Reduce wait time by 8 min',
      confidence: 91,
      priority: 'high'
    },
    {
      id: 4,
      type: 'marketing',
      title: 'Social Media Boost',
      description: 'Post Caesar Salad content at 11 AM for maximum engagement',
      impact: '+25% social reach',
      confidence: 87,
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Intelligence Dashboard</h1>
              <p className="text-gray-600">Real-time insights powered by AI and advanced analytics</p>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-2">
            {['today', 'week', 'month', 'quarter'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
                <p className="text-gray-600 text-sm">{kpi.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Operational Metrics */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Operational Metrics
              </h2>
              <div className="space-y-6">
                {operationalMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <metric.icon className={`w-4 h-4 ${metric.color}`} />
                        <span className="text-sm font-medium text-gray-700">{metric.title}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.value >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(100, metric.value)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Target: {metric.target}%</span>
                      <span className={metric.value >= metric.target ? 'text-green-600' : 'text-yellow-600'}>
                        {metric.value >= metric.target ? 'On Track' : 'Needs Attention'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Alerts */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Live Alerts
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Low Stock Alert</p>
                    <p className="text-xs text-red-600">Salmon inventory below minimum</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Peak Hour Approaching</p>
                    <p className="text-xs text-yellow-600">Dinner rush starts in 30 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-800">All Systems Optimal</p>
                    <p className="text-xs text-green-600">Kitchen efficiency at 92%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                AI-Powered Recommendations
              </h2>
              <div className="space-y-4">
                {aiRecommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority.toUpperCase()}
                        </div>
                        <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-600">{rec.confidence}% confidence</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">{rec.impact}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors">
                          Apply
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Predictive Analytics Chart */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Predictive Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$18,500</div>
                  <div className="text-sm text-gray-600">Predicted Weekly Revenue</div>
                  <div className="text-xs text-green-600 mt-1">+15% vs last week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">245</div>
                  <div className="text-sm text-gray-600">Expected Orders</div>
                  <div className="text-xs text-green-600 mt-1">+8% vs last week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">$75.50</div>
                  <div className="text-sm text-gray-600">Avg Order Value</div>
                  <div className="text-xs text-green-600 mt-1">+5% vs last week</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Sustainability & Global Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-500" />
              Sustainability Impact
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">-15%</div>
                <div className="text-sm text-gray-600">Food Waste Reduction</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">-8.5%</div>
                <div className="text-sm text-gray-600">Energy Consumption</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">92%</div>
                <div className="text-sm text-gray-600">Local Sourcing</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">A+</div>
                <div className="text-sm text-gray-600">Sustainability Score</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-500" />
              Market Intelligence
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Local Market Position</span>
                <span className="text-sm font-bold text-green-600">#2 in area</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Customer Retention</span>
                <span className="text-sm font-bold text-blue-600">87%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Competitor Price Index</span>
                <span className="text-sm font-bold text-purple-600">+5% premium</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Market Growth</span>
                <span className="text-sm font-bold text-orange-600">+12% YoY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}