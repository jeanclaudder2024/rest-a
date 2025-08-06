'use client';

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { 
  Leaf, 
  Recycle, 
  Droplets,
  Zap,
  TreePine,
  Award,
  TrendingUp,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
  Truck,
  Factory,
  Wind,
  Sun,
  Globe,
  Heart,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Sparkles,
  Shield
} from 'lucide-react';

export default function SustainabilityPage() {
  const [selectedMetric, setSelectedMetric] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('month');

  // Mock sustainability data
  const sustainabilityMetrics = {
    carbonFootprint: {
      current: 2.4, // tons CO2
      target: 2.0,
      reduction: 15.2, // percentage
      trend: 'decreasing'
    },
    waterUsage: {
      current: 1250, // gallons
      target: 1100,
      reduction: 8.7,
      trend: 'decreasing'
    },
    energyConsumption: {
      current: 3200, // kWh
      target: 2800,
      reduction: 12.5,
      trend: 'decreasing'
    },
    wasteReduction: {
      current: 85, // percentage recycled
      target: 90,
      improvement: 5.3,
      trend: 'increasing'
    },
    localSourcing: {
      current: 78, // percentage local
      target: 85,
      improvement: 12.1,
      trend: 'increasing'
    }
  };

  const sustainabilityInitiatives = [
    {
      id: 'init-1',
      title: 'Solar Panel Installation',
      category: 'energy',
      status: 'active',
      impact: 'high',
      description: 'Installed 50kW solar panel system on restaurant roof',
      metrics: {
        energySaved: '1,200 kWh/month',
        co2Reduced: '0.8 tons/month',
        costSavings: '$180/month'
      },
      progress: 100,
      startDate: new Date('2024-01-15'),
      completionDate: new Date('2024-02-28')
    },
    {
      id: 'init-2',
      title: 'Composting Program',
      category: 'waste',
      status: 'active',
      impact: 'medium',
      description: 'Comprehensive food waste composting and organic waste reduction',
      metrics: {
        wasteReduced: '450 lbs/month',
        compostProduced: '200 lbs/month',
        costSavings: '$85/month'
      },
      progress: 100,
      startDate: new Date('2024-02-01'),
      completionDate: new Date('2024-02-15')
    },
    {
      id: 'init-3',
      title: 'Local Supplier Network',
      category: 'sourcing',
      status: 'in-progress',
      impact: 'high',
      description: 'Partnering with local farms and suppliers within 50-mile radius',
      metrics: {
        localPercentage: '78%',
        transportReduced: '2,400 miles/month',
        co2Reduced: '1.2 tons/month'
      },
      progress: 78,
      startDate: new Date('2024-01-01'),
      targetDate: new Date('2024-06-30')
    },
    {
      id: 'init-4',
      title: 'Water Conservation System',
      category: 'water',
      status: 'planning',
      impact: 'medium',
      description: 'Installing low-flow fixtures and greywater recycling system',
      metrics: {
        waterSaved: '300 gallons/month (projected)',
        costSavings: '$45/month (projected)',
        paybackPeriod: '18 months'
      },
      progress: 25,
      startDate: new Date('2024-04-01'),
      targetDate: new Date('2024-05-15')
    }
  ];

  const [initiatives, setInitiatives] = useState(sustainabilityInitiatives);

  const certifications = [
    {
      id: 'cert-1',
      name: 'Green Restaurant Certified',
      level: 'Gold',
      issuer: 'Green Restaurant Association',
      score: 92,
      validUntil: new Date('2025-03-15'),
      status: 'active'
    },
    {
      id: 'cert-2',
      name: 'ENERGY STAR Certified',
      level: 'Certified',
      issuer: 'EPA',
      score: 88,
      validUntil: new Date('2025-01-20'),
      status: 'active'
    },
    {
      id: 'cert-3',
      name: 'LEED Green Building',
      level: 'Silver',
      issuer: 'USGBC',
      score: 85,
      validUntil: new Date('2026-06-10'),
      status: 'active'
    },
    {
      id: 'cert-4',
      name: 'Sustainable Restaurant Certification',
      level: 'Platinum',
      issuer: 'Sustainable Restaurant Association',
      score: 95,
      validUntil: new Date('2024-12-31'),
      status: 'expiring-soon'
    }
  ];

  const supplierSustainability = [
    {
      id: 'supplier-1',
      name: 'Green Valley Farms',
      category: 'Produce',
      sustainabilityScore: 95,
      certifications: ['Organic', 'Carbon Neutral'],
      distance: 25, // miles
      co2Impact: 'Low',
      practices: ['Regenerative Agriculture', 'Solar Powered', 'Water Conservation']
    },
    {
      id: 'supplier-2',
      name: 'Ocean Fresh Seafood',
      category: 'Seafood',
      sustainabilityScore: 88,
      certifications: ['MSC Certified', 'Fair Trade'],
      distance: 45,
      co2Impact: 'Medium',
      practices: ['Sustainable Fishing', 'Plastic-Free Packaging', 'Local Processing']
    },
    {
      id: 'supplier-3',
      name: 'Heritage Meat Co.',
      category: 'Meat',
      sustainabilityScore: 82,
      certifications: ['Grass-Fed', 'Humane Certified'],
      distance: 35,
      co2Impact: 'Medium',
      practices: ['Pasture-Raised', 'No Antibiotics', 'Local Feed']
    },
    {
      id: 'supplier-4',
      name: 'Artisan Dairy Collective',
      category: 'Dairy',
      sustainabilityScore: 90,
      certifications: ['Organic', 'Animal Welfare Approved'],
      distance: 20,
      co2Impact: 'Low',
      practices: ['Grass-Fed Cows', 'Renewable Energy', 'Minimal Processing']
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'energy': return <Zap className="h-5 w-5" />;
      case 'waste': return <Recycle className="h-5 w-5" />;
      case 'water': return <Droplets className="h-5 w-5" />;
      case 'sourcing': return <Truck className="h-5 w-5" />;
      default: return <Leaf className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'planning': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCertificationColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 border-green-200';
      case 'expiring-soon': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'expired': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSustainabilityGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (score >= 85) return { grade: 'A', color: 'text-green-500' };
    if (score >= 80) return { grade: 'B+', color: 'text-yellow-600' };
    if (score >= 75) return { grade: 'B', color: 'text-yellow-500' };
    if (score >= 70) return { grade: 'C+', color: 'text-orange-600' };
    return { grade: 'C', color: 'text-red-600' };
  };

  const filteredInitiatives = initiatives.filter(initiative => {
    return selectedMetric === 'all' || initiative.category === selectedMetric;
  });

  const totalCO2Reduction = initiatives.reduce((sum, init) => {
    const co2Value = parseFloat(init.metrics.co2Reduced?.split(' ')[0] || '0');
    return sum + co2Value;
  }, 0);

  const totalCostSavings = initiatives.reduce((sum, init) => {
    const costValue = parseFloat(init.metrics.costSavings?.replace(/[$,]/g, '').split('/')[0] || '0');
    return sum + costValue;
  }, 0);

  const activeInitiatives = initiatives.filter(init => init.status === 'active').length;
  const avgSupplierScore = supplierSustainability.reduce((sum, supplier) => sum + supplier.sustainabilityScore, 0) / supplierSustainability.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                🌱 Sustainability Tracking
              </h1>
              <p className="text-gray-600">Monitor and improve your restaurant's environmental impact</p>
            </div>
          </div>
        </div>

        {/* Sustainability Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CO₂ Reduction</p>
                <p className="text-2xl font-bold text-green-600">{totalCO2Reduction.toFixed(1)} tons</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Wind className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">-15.2% this month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                <p className="text-2xl font-bold text-blue-600">${totalCostSavings}/mo</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+12% savings</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Initiatives</p>
                <p className="text-2xl font-bold text-purple-600">{activeInitiatives}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">2 new this month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-teal-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Supplier Score</p>
                <p className="text-2xl font-bold text-teal-600">{avgSupplierScore.toFixed(0)}/100</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <Award className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">Excellent rating</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="energy">⚡ Energy</option>
                <option value="waste">♻️ Waste</option>
                <option value="water">💧 Water</option>
                <option value="sourcing">🚚 Sourcing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sustainability Initiatives */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Initiatives */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">🎯 Sustainability Initiatives</h2>
                  <p className="text-gray-600">Active environmental improvement projects</p>
                </div>
              </div>

              <div className="space-y-6">
                {filteredInitiatives.map((initiative) => (
                  <div key={initiative.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    {/* Initiative Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          {getCategoryIcon(initiative.category)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{initiative.title}</h3>
                          <p className="text-sm text-gray-500 capitalize">{initiative.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(initiative.status)}`}>
                          {initiative.status.replace('-', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(initiative.impact)}`}>
                          {initiative.impact} impact
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4">{initiative.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-medium text-gray-900">{initiative.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${initiative.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      {Object.entries(initiative.metrics).map(([key, value], index) => (
                        <div key={index} className="text-center">
                          <p className="text-sm font-medium text-gray-900">{value}</p>
                          <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        </div>
                      ))}
                    </div>

                    {/* Dates */}
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Started: {initiative.startDate.toLocaleDateString()}</span>
                      </div>
                      {initiative.completionDate && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Completed: {initiative.completionDate.toLocaleDateString()}</span>
                        </div>
                      )}
                      {initiative.targetDate && !initiative.completionDate && (
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span>Target: {initiative.targetDate.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supplier Sustainability */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">🚚 Supplier Sustainability</h2>
                  <p className="text-gray-600">Environmental impact of supply chain</p>
                </div>
              </div>

              <div className="space-y-4">
                {supplierSustainability.map((supplier) => {
                  const gradeInfo = getSustainabilityGrade(supplier.sustainabilityScore);
                  return (
                    <div key={supplier.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                          <p className="text-sm text-gray-500">{supplier.category} • {supplier.distance} miles away</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</div>
                          <div className="text-sm text-gray-500">{supplier.sustainabilityScore}/100</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {supplier.certifications.map((cert, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            ✓ {cert}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-sm font-medium text-gray-900">{supplier.distance} mi</p>
                          <p className="text-xs text-gray-500">Distance</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-sm font-medium text-gray-900">{supplier.co2Impact}</p>
                          <p className="text-xs text-gray-500">CO₂ Impact</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-sm font-medium text-gray-900">{supplier.practices.length}</p>
                          <p className="text-xs text-gray-500">Green Practices</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-gray-600 mb-1">Sustainable Practices:</p>
                        <div className="flex flex-wrap gap-1">
                          {supplier.practices.map((practice, index) => (
                            <span key={index} className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
                              {practice}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Certifications */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">🏆 Certifications</h3>
              </div>

              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className={`border rounded-lg p-4 ${getCertificationColor(cert.status)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{cert.name}</h4>
                        <p className="text-xs text-gray-600">{cert.issuer}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{cert.score}</div>
                        <div className="text-xs text-gray-500">{cert.level}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      Valid until: {cert.validUntil.toLocaleDateString()}
                    </div>
                    {cert.status === 'expiring-soon' && (
                      <div className="mt-2 text-xs text-orange-700 bg-orange-50 p-2 rounded">
                        ⚠️ Renewal required soon
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Metrics */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">📊 Key Metrics</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Carbon Footprint</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{sustainabilityMetrics.carbonFootprint.current}t CO₂</p>
                    <p className="text-xs text-gray-500">Target: {sustainabilityMetrics.carbonFootprint.target}t</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Water Usage</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{sustainabilityMetrics.waterUsage.current} gal</p>
                    <p className="text-xs text-gray-500">Target: {sustainabilityMetrics.waterUsage.target} gal</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">Energy Usage</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-yellow-600">{sustainabilityMetrics.energyConsumption.current} kWh</p>
                    <p className="text-xs text-gray-500">Target: {sustainabilityMetrics.energyConsumption.target} kWh</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Recycle className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Waste Recycled</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-600">{sustainabilityMetrics.wasteReduction.current}%</p>
                    <p className="text-xs text-gray-500">Target: {sustainabilityMetrics.wasteReduction.target}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">💡 Quick Actions</h3>
              </div>

              <div className="space-y-3">
                <button className="w-full p-3 bg-gradient-to-r from-green-100 to-emerald-100 text-gray-800 rounded-lg hover:from-green-200 hover:to-emerald-200 transition-colors flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Set New Goal
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-blue-100 to-cyan-100 text-gray-800 rounded-lg hover:from-blue-200 hover:to-cyan-200 transition-colors flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Generate Report
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-purple-100 to-pink-100 text-gray-800 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-colors flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Apply for Certification
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-yellow-100 to-orange-100 text-gray-800 rounded-lg hover:from-yellow-200 hover:to-orange-200 transition-colors flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Find Green Suppliers
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sustainability Features */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">🌱 Advanced Sustainability Features</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🌍 Carbon Footprint Tracking</h4>
              <p className="text-sm text-gray-600">Real-time monitoring of CO₂ emissions across all operations</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">♻️ Waste Stream Analysis</h4>
              <p className="text-sm text-gray-600">AI-powered waste categorization and reduction recommendations</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🚚 Supply Chain Optimization</h4>
              <p className="text-sm text-gray-600">Local sourcing recommendations and transport impact analysis</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🏆 Certification Management</h4>
              <p className="text-sm text-gray-600">Track and maintain environmental certifications and compliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}