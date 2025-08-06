'use client';

import { useState, useMemo } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { Order, OrderItem, SalesReport } from '@/types';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  ArrowLeft,
  Clock,
  Target,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, isWithinInterval } from 'date-fns';

export default function AnalyticsPage() {
  const { orders, menuItems, recipes, inventoryItems } = useRestaurantStore();
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'items'>('revenue');

  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'custom':
        return {
          start: customStartDate ? new Date(customStartDate) : startOfDay(now),
          end: customEndDate ? new Date(customEndDate) : endOfDay(now),
        };
      default:
        return { start: startOfDay(now), end: endOfDay(now) };
    }
  };

  const filteredOrders = useMemo(() => {
    const { start, end } = getDateRange();
    return orders.filter(order => 
      isWithinInterval(order.orderTime, { start, end }) &&
      order.status !== 'cancelled'
    );
  }, [orders, dateRange, customStartDate, customEndDate]);

  const analytics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.finalAmount, 0);
    const totalOrders = filteredOrders.length;
    const totalItems = filteredOrders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Previous period comparison
    const { start, end } = getDateRange();
    const periodLength = end.getTime() - start.getTime();
    const previousStart = new Date(start.getTime() - periodLength);
    const previousEnd = new Date(end.getTime() - periodLength);
    
    const previousOrders = orders.filter(order => 
      isWithinInterval(order.orderTime, { start: previousStart, end: previousEnd }) &&
      order.status !== 'cancelled'
    );
    
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.finalAmount, 0);
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    // Top selling items
    const itemSales = new Map<string, { item: OrderItem, quantity: number, revenue: number }>();
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const key = item.menuItemId;
        const existing = itemSales.get(key);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          itemSales.set(key, {
            item,
            quantity: item.quantity,
            revenue: item.price * item.quantity,
          });
        }
      });
    });

    const topItems = Array.from(itemSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Sales by hour
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const hourOrders = filteredOrders.filter(order => 
        order.orderTime.getHours() === hour
      );
      return {
        hour,
        orders: hourOrders.length,
        revenue: hourOrders.reduce((sum, order) => sum + order.finalAmount, 0),
      };
    });

    // Sales by day (last 7 days)
    const dailyData = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      const dayOrders = orders.filter(order => 
        isWithinInterval(order.orderTime, { start: dayStart, end: dayEnd }) &&
        order.status !== 'cancelled'
      );
      
      return {
        date: format(date, 'MMM dd'),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.finalAmount, 0),
        items: dayOrders.reduce((sum, order) => 
          sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
        ),
      };
    });

    // Order type distribution
    const orderTypes = filteredOrders.reduce((acc, order) => {
      acc[order.orderType] = (acc[order.orderType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Payment status
    const paymentStatus = filteredOrders.reduce((acc, order) => {
      acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      totalOrders,
      totalItems,
      averageOrderValue,
      revenueGrowth,
      topItems,
      hourlyData,
      dailyData,
      orderTypes,
      paymentStatus,
    };
  }, [filteredOrders, orders]);

  const exportReport = () => {
    const { start, end } = getDateRange();
    const report: SalesReport = {
      id: `report-${Date.now()}`,
      startDate: start,
      endDate: end,
      totalRevenue: analytics.totalRevenue,
      totalOrders: analytics.totalOrders,
      averageOrderValue: analytics.averageOrderValue,
      topSellingItems: analytics.topItems.map(item => ({
        itemId: item.item.menuItemId,
        itemName: item.item.menuItem.name,
        quantitySold: item.quantity,
        revenue: item.revenue,
      })),
      generatedAt: new Date(),
    };

    // In a real app, this would generate and download a PDF or CSV
    console.log('Sales Report:', report);
    alert('Report exported! (Check console for data)');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </Link>
              <TrendingUp className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Sales Analytics</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
              
              <button
                onClick={exportReport}
                className="btn-primary flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Custom Date Range */}
        {dateRange === 'custom' && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${analytics.totalRevenue.toFixed(2)}</p>
                <p className={`text-sm ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.revenueGrowth >= 0 ? '+' : ''}{analytics.revenueGrowth.toFixed(1)}% vs previous period
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
                <p className="text-sm text-gray-500">
                  {analytics.totalOrders > 0 ? `${(analytics.totalOrders / Math.max(1, analytics.dailyData.length)).toFixed(1)} avg/day` : 'No orders'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">${analytics.averageOrderValue.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Per order</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Items Sold</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalItems}</p>
                <p className="text-sm text-gray-500">Total quantity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Daily Sales (Last 7 Days)</h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="revenue">Revenue</option>
                <option value="orders">Orders</option>
                <option value="items">Items</option>
              </select>
            </div>
            
            <div className="h-64">
              <div className="flex items-end justify-between h-full space-x-2">
                {analytics.dailyData.map((day, index) => {
                  const value = day[selectedMetric];
                  const maxValue = Math.max(...analytics.dailyData.map(d => d[selectedMetric]));
                  const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col items-center">
                        <div
                          className="w-full bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600"
                          style={{ height: `${height}%`, minHeight: value > 0 ? '4px' : '0px' }}
                          title={`${day.date}: ${selectedMetric === 'revenue' ? '$' : ''}${value}${selectedMetric === 'revenue' ? '' : ` ${selectedMetric}`}`}
                        />
                        <div className="mt-2 text-xs text-gray-600 text-center">
                          {day.date}
                        </div>
                        <div className="text-xs font-medium text-gray-900">
                          {selectedMetric === 'revenue' ? `$${value.toFixed(0)}` : value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Type Distribution */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Type Distribution</h3>
            
            <div className="space-y-4">
              {Object.entries(analytics.orderTypes).map(([type, count]) => {
                const percentage = analytics.totalOrders > 0 ? (count / analytics.totalOrders) * 100 : 0;
                
                return (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">{type.replace('-', ' ')}</span>
                      <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Items</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.topItems.map((item, index) => (
                  <tr key={item.item.menuItemId} className={index < 3 ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 && (
                          <Award className={`h-4 w-4 mr-2 ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' :
                            'text-orange-600'
                          }`} />
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {item.item.menuItem.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.item.menuItem.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.revenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(item.revenue / item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Status</h3>
            
            <div className="space-y-3">
              {Object.entries(analytics.paymentStatus).map(([status, count]) => {
                const percentage = analytics.totalOrders > 0 ? (count / analytics.totalOrders) * 100 : 0;
                
                return (
                  <div key={status} className="flex justify-between items-center">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                      status === 'paid' ? 'bg-green-100 text-green-800' :
                      status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count}</span>
                      <span className="text-sm text-gray-500">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Peak Hour</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.hourlyData.reduce((peak, hour) => 
                    hour.orders > peak.orders ? hour : peak, { hour: 0, orders: 0 }
                  ).hour}:00
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Menu Items</span>
                <span className="text-sm font-medium text-gray-900">{menuItems.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Recipes</span>
                <span className="text-sm font-medium text-gray-900">{recipes.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inventory Items</span>
                <span className="text-sm font-medium text-gray-900">{inventoryItems.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Items per Order</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.totalOrders > 0 ? (analytics.totalItems / analytics.totalOrders).toFixed(1) : '0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}