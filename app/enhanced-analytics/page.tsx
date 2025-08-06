'use client'

import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Clock, Star, Calendar, Filter, Download, RefreshCw } from 'lucide-react'

interface AnalyticsData {
  revenue: {
    today: number
    yesterday: number
    thisWeek: number
    lastWeek: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  orders: {
    total: number
    completed: number
    pending: number
    cancelled: number
    averageValue: number
    growth: number
  }
  customers: {
    total: number
    new: number
    returning: number
    satisfaction: number
    growth: number
  }
  performance: {
    averageWaitTime: number
    tableUtilization: number
    staffEfficiency: number
    kitchenPerformance: number
  }
  topItems: Array<{
    name: string
    orders: number
    revenue: number
    growth: number
  }>
  hourlyData: Array<{
    hour: string
    orders: number
    revenue: number
  }>
  weeklyData: Array<{
    day: string
    orders: number
    revenue: number
  }>
}

export default function EnhancedAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('today')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    revenue: {
      today: 2847.50,
      yesterday: 2654.30,
      thisWeek: 18420.75,
      lastWeek: 17235.40,
      thisMonth: 78945.20,
      lastMonth: 72340.15,
      growth: 7.3
    },
    orders: {
      total: 156,
      completed: 142,
      pending: 8,
      cancelled: 6,
      averageValue: 18.25,
      growth: 12.5
    },
    customers: {
      total: 1247,
      new: 89,
      returning: 1158,
      satisfaction: 4.6,
      growth: 8.2
    },
    performance: {
      averageWaitTime: 12.5,
      tableUtilization: 78.5,
      staffEfficiency: 92.3,
      kitchenPerformance: 88.7
    },
    topItems: [
      { name: 'Margherita Pizza', orders: 45, revenue: 675.00, growth: 15.2 },
      { name: 'Caesar Salad', orders: 38, revenue: 456.00, growth: 8.7 },
      { name: 'Grilled Salmon', orders: 32, revenue: 896.00, growth: -2.1 },
      { name: 'Pasta Carbonara', orders: 29, revenue: 435.00, growth: 22.3 },
      { name: 'Chocolate Cake', orders: 24, revenue: 192.00, growth: 5.8 }
    ],
    hourlyData: [
      { hour: '9 AM', orders: 8, revenue: 156.50 },
      { hour: '10 AM', orders: 12, revenue: 234.75 },
      { hour: '11 AM', orders: 18, revenue: 342.25 },
      { hour: '12 PM', orders: 25, revenue: 487.50 },
      { hour: '1 PM', orders: 32, revenue: 624.75 },
      { hour: '2 PM', orders: 28, revenue: 546.25 },
      { hour: '3 PM', orders: 15, revenue: 287.50 },
      { hour: '4 PM', orders: 10, revenue: 195.75 },
      { hour: '5 PM', orders: 22, revenue: 428.50 },
      { hour: '6 PM', orders: 35, revenue: 682.75 },
      { hour: '7 PM', orders: 42, revenue: 819.50 },
      { hour: '8 PM', orders: 38, revenue: 741.25 }
    ],
    weeklyData: [
      { day: 'Mon', orders: 145, revenue: 2847.50 },
      { day: 'Tue', orders: 132, revenue: 2654.30 },
      { day: 'Wed', orders: 158, revenue: 3124.75 },
      { day: 'Thu', orders: 167, revenue: 3287.25 },
      { day: 'Fri', orders: 189, revenue: 3745.50 },
      { day: 'Sat', orders: 203, revenue: 4012.75 },
      { day: 'Sun', orders: 176, revenue: 3468.25 }
    ]
  })

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const exportData = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const StatCard = ({ title, value, change, icon: Icon, prefix = '', suffix = '', trend }: {
    title: string
    value: string | number
    change: number
    icon: React.ComponentType<any>
    prefix?: string
    suffix?: string
    trend?: 'up' | 'down'
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <div className="flex items-center mt-4">
        {change >= 0 ? (
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">vs last period</span>
      </div>
    </div>
  )

  const PerformanceCard = ({ title, value, suffix = '', color = 'blue' }: {
    title: string
    value: number
    suffix?: string
    color?: 'blue' | 'green' | 'yellow' | 'red'
  }) => {
    const getColorClasses = () => {
      switch (color) {
        case 'green':
          return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
        case 'yellow':
          return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
        case 'red':
          return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
        default:
          return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
      }
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{title}</h3>
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}{suffix}</span>
          <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getColorClasses()}`}>
            {value >= 80 ? 'Excellent' : value >= 60 ? 'Good' : value >= 40 ? 'Fair' : 'Poor'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enhanced Analytics</h1>
                <p className="text-gray-600 dark:text-gray-300">Real-time insights and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={exportData}
                className="flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={analyticsData.revenue.today}
            change={analyticsData.revenue.growth}
            icon={DollarSign}
            prefix="$"
          />
          <StatCard
            title="Total Orders"
            value={analyticsData.orders.total}
            change={analyticsData.orders.growth}
            icon={ShoppingCart}
          />
          <StatCard
            title="Active Customers"
            value={analyticsData.customers.total}
            change={analyticsData.customers.growth}
            icon={Users}
          />
          <StatCard
            title="Avg. Order Value"
            value={analyticsData.orders.averageValue}
            change={5.2}
            icon={TrendingUp}
            prefix="$"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hourly Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hourly Performance</h2>
            <div className="space-y-3">
              {analyticsData.hourlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-16">{data.hour}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(data.orders / 45) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-16 text-right">
                    {data.orders} orders
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-20 text-right">
                    ${data.revenue.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Weekly Performance</h2>
            <div className="space-y-3">
              {analyticsData.weeklyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-12">{data.day}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{ width: `${(data.revenue / 4500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-16 text-right">
                    {data.orders}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-24 text-right">
                    ${data.revenue.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <PerformanceCard
            title="Avg. Wait Time"
            value={analyticsData.performance.averageWaitTime}
            suffix=" min"
            color="green"
          />
          <PerformanceCard
            title="Table Utilization"
            value={analyticsData.performance.tableUtilization}
            suffix="%"
            color="blue"
          />
          <PerformanceCard
            title="Staff Efficiency"
            value={analyticsData.performance.staffEfficiency}
            suffix="%"
            color="green"
          />
          <PerformanceCard
            title="Kitchen Performance"
            value={analyticsData.performance.kitchenPerformance}
            suffix="%"
            color="yellow"
          />
        </div>

        {/* Top Items and Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Selling Items */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Selling Items</h2>
            <div className="space-y-4">
              {analyticsData.topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">${item.revenue.toFixed(2)}</p>
                    <p className={`text-sm ${item.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {item.growth >= 0 ? '+' : ''}{item.growth.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-medium text-gray-900 dark:text-white">Completed</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{analyticsData.orders.completed}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="font-medium text-gray-900 dark:text-white">Pending</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{analyticsData.orders.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="font-medium text-gray-900 dark:text-white">Cancelled</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{analyticsData.orders.cancelled}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Customer Satisfaction</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-bold text-gray-900 dark:text-white">{analyticsData.customers.satisfaction}</span>
                </div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(analyticsData.customers.satisfaction / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}