'use client';

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Lightbulb,
  Rocket,
  Eye,
  Star,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';

export default function AIInsightsPage() {
  const { aiInsights, predictiveAnalytics, smartMenuOptimizations } = useRestaurantStore();
  const [selectedInsightType, setSelectedInsightType] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');

  // Mock AI insights data (in real app, this would come from AI service)
  const mockAIInsights = [
    {
      id: 'ai-1',
      type: 'demand_prediction' as const,
      title: '🔥 Peak Hour Demand Surge Predicted',
      description: 'AI predicts 40% increase in orders between 7-8 PM today. Recommend increasing staff by 2 servers.',
      confidence: 94,
      impact: 'high' as const,
      recommendation: 'Schedule additional staff and pre-prepare popular items',
      expectedROI: 850,
      generatedAt: new Date(),
      status: 'new' as const,
      data: { predictedOrders: 120, currentCapacity: 85 }
    },
    {
      id: 'ai-2',
      type: 'price_optimization' as const,
      title: '💰 Dynamic Pricing Opportunity',
      description: 'Increase Margherita Pizza price by $2 during weekend evenings for 15% revenue boost.',
      confidence: 87,
      impact: 'medium' as const,
      recommendation: 'Implement dynamic pricing for premium items',
      expectedROI: 1200,
      generatedAt: new Date(),
      status: 'new' as const,
      data: { currentPrice: 14, suggestedPrice: 16 }
    },
    {
      id: 'ai-3',
      type: 'customer_behavior' as const,
      title: '🎯 Customer Churn Risk Alert',
      description: '12 high-value customers showing signs of churn. Immediate retention campaign recommended.',
      confidence: 91,
      impact: 'critical' as const,
      recommendation: 'Send personalized offers to at-risk customers',
      expectedROI: 2400,
      generatedAt: new Date(),
      status: 'new' as const,
      data: { atRiskCustomers: 12, averageValue: 200 }
    },
    {
      id: 'ai-4',
      type: 'inventory_optimization' as const,
      title: '📦 Smart Inventory Reorder',
      description: 'Tomatoes will run out in 2 days. Auto-reorder from Supplier A for best price.',
      confidence: 96,
      impact: 'medium' as const,
      recommendation: 'Enable auto-reordering for critical ingredients',
      expectedROI: 300,
      generatedAt: new Date(),
      status: 'reviewed' as const,
      data: { currentStock: 15, dailyUsage: 8 }
    },
    {
      id: 'ai-5',
      type: 'staff_optimization' as const,
      title: '👥 Optimal Staff Scheduling',
      description: 'Reduce Monday morning staff by 1 server, add 1 chef on Friday nights for efficiency.',
      confidence: 89,
      impact: 'medium' as const,
      recommendation: 'Adjust weekly schedule based on historical patterns',
      expectedROI: 600,
      generatedAt: new Date(),
      status: 'implemented' as const,
      data: { costSaving: 120, efficiencyGain: 15 }
    }
  ];

  const mockPredictions = [
    {
      id: 'pred-1',
      type: 'sales_forecast' as const,
      period: 'daily' as const,
      predictions: [
        { date: new Date(), value: 2850, confidence: 92, factors: ['Weather: Sunny', 'Event: Local Festival'] },
        { date: new Date(Date.now() + 86400000), value: 3200, confidence: 88, factors: ['Weekend', 'Promotion Active'] }
      ],
      accuracy: 94,
      lastUpdated: new Date()
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'demand_prediction': return <TrendingUp className="h-5 w-5" />;
      case 'price_optimization': return <DollarSign className="h-5 w-5" />;
      case 'customer_behavior': return <Users className="h-5 w-5" />;
      case 'inventory_optimization': return <Target className="h-5 w-5" />;
      case 'staff_optimization': return <Clock className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Zap className="h-4 w-4 text-blue-500" />;
      case 'reviewed': return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'implemented': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'dismissed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredInsights = mockAIInsights.filter(insight => {
    const typeMatch = selectedInsightType === 'all' || insight.type === selectedInsightType;
    const impactMatch = selectedImpact === 'all' || insight.impact === selectedImpact;
    return typeMatch && impactMatch;
  });

  const totalROI = mockAIInsights.reduce((sum, insight) => sum + insight.expectedROI, 0);
  const averageConfidence = mockAIInsights.reduce((sum, insight) => sum + insight.confidence, 0) / mockAIInsights.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🤖 AI-Powered Insights
              </h1>
              <p className="text-gray-600">Revolutionary AI recommendations to optimize your restaurant</p>
            </div>
          </div>
        </div>

        {/* AI Performance Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expected ROI</p>
                <p className="text-2xl font-bold text-green-600">${totalROI.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+24% this week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Confidence</p>
                <p className="text-2xl font-bold text-blue-600">{averageConfidence.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Activity className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600">High accuracy</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Insights</p>
                <p className="text-2xl font-bold text-orange-600">{mockAIInsights.length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Lightbulb className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Rocket className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-sm text-orange-600">3 critical</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Implemented</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {mockAIInsights.filter(i => i.status === 'implemented').length}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Star className="h-4 w-4 text-indigo-500 mr-1" />
              <span className="text-sm text-indigo-600">20% success rate</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Insight Type</label>
              <select
                value={selectedInsightType}
                onChange={(e) => setSelectedInsightType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="demand_prediction">🔮 Demand Prediction</option>
                <option value="price_optimization">💰 Price Optimization</option>
                <option value="customer_behavior">👥 Customer Behavior</option>
                <option value="inventory_optimization">📦 Inventory Optimization</option>
                <option value="staff_optimization">⏰ Staff Optimization</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Impact Level</label>
              <select
                value={selectedImpact}
                onChange={(e) => setSelectedImpact(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Impacts</option>
                <option value="critical">🔴 Critical</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredInsights.map((insight) => (
            <div key={insight.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(insight.status)}
                        <span className="text-sm text-gray-500 capitalize">{insight.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                      {insight.impact.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{insight.description}</p>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">🎯 AI Recommendation:</h4>
                  <p className="text-sm text-gray-700">{insight.recommendation}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Confidence</p>
                      <p className="font-semibold text-blue-600">{insight.confidence}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Expected ROI</p>
                      <p className="font-semibold text-green-600">${insight.expectedROI}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors text-sm">
                      Implement
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Predictive Analytics Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">🔮 Predictive Analytics</h2>
              <p className="text-gray-600">AI-powered forecasts and predictions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">📈 Sales Forecast</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Today</span>
                  <span className="font-semibold text-green-600">$2,850 (92% confidence)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tomorrow</span>
                  <span className="font-semibold text-green-600">$3,200 (88% confidence)</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Factors: Weather, Local Events, Promotions
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">👥 Customer Flow</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Peak Hour</span>
                  <span className="font-semibold text-blue-600">7:00-8:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Expected Customers</span>
                  <span className="font-semibold text-blue-600">120 (+40%)</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Recommendation: Add 2 servers, prep popular items
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}