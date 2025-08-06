'use client';

import { useState } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { format } from 'date-fns';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Eye,
  User,
  Timer,
  Target,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManagerPage() {
  const { orders, users, tables } = useRestaurantStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWaiter, setSelectedWaiter] = useState<string>('all');

  // Filter orders by selected date
  const todayOrders = orders.filter(order => 
    format(order.createdAt, 'yyyy-MM-dd') === selectedDate
  );

  // Get waiters (users with waiter role)
  const waiters = users.filter(user => user.role === 'waiter');

  // Calculate waiter performance metrics
  const waiterStats = waiters.map(waiter => {
    const waiterOrders = todayOrders.filter(order => order.waiterId === waiter.id);
    const deliveredOrders = todayOrders.filter(order => order.deliveredBy === waiter.id);
    
    const avgClaimTime = waiterOrders.length > 0 
      ? waiterOrders.reduce((acc, order) => {
          if (order.claimedAt) {
            return acc + (order.claimedAt.getTime() - order.createdAt.getTime());
          }
          return acc;
        }, 0) / waiterOrders.length / 1000 / 60 // Convert to minutes
      : 0;

    const avgDeliveryTime = deliveredOrders.length > 0
      ? deliveredOrders.reduce((acc, order) => {
          if (order.deliveredAt && order.claimedAt) {
            return acc + (order.deliveredAt.getTime() - order.claimedAt.getTime());
          }
          return acc;
        }, 0) / deliveredOrders.length / 1000 / 60 // Convert to minutes
      : 0;

    return {
      waiter,
      ordersClaimed: waiterOrders.length,
      ordersDelivered: deliveredOrders.length,
      avgClaimTime: Math.round(avgClaimTime),
      avgDeliveryTime: Math.round(avgDeliveryTime),
      totalRevenue: deliveredOrders.reduce((acc, order) => acc + order.total, 0)
    };
  });

  // Get current active orders with waiter assignments
  const activeOrders = orders.filter(order => 
    ['pending', 'preparing', 'ready'].includes(order.status)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Dashboard</h1>
          <p className="text-gray-600">Monitor waiter performance and order assignments</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waiter</label>
              <select
                value={selectedWaiter}
                onChange={(e) => setSelectedWaiter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Waiters</option>
                {waiters.map(waiter => (
                  <option key={waiter.id} value={waiter.id}>{waiter.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Waiters</p>
                <p className="text-2xl font-bold text-gray-900">{waiters.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeOrders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ready Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeOrders.filter(o => o.status === 'ready').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${todayOrders.reduce((acc, order) => acc + order.total, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Waiter Performance */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Award className="mr-2 text-yellow-600" />
              Waiter Performance
            </h2>
            <div className="space-y-4">
              {waiterStats.map(stat => (
                <div key={stat.waiter.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <User className="w-8 h-8 text-gray-400 mr-3" />
                      <div>
                        <h3 className="font-semibold">{stat.waiter.name}</h3>
                        <p className="text-sm text-gray-600">{stat.waiter.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        ${stat.totalRevenue.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Orders Claimed</p>
                      <p className="font-semibold">{stat.ordersClaimed}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Orders Delivered</p>
                      <p className="font-semibold">{stat.ordersDelivered}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Claim Time</p>
                      <p className="font-semibold">{stat.avgClaimTime}m</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Delivery Time</p>
                      <p className="font-semibold">{stat.avgDeliveryTime}m</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Orders Tracking */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Eye className="mr-2 text-blue-600" />
              Active Orders Tracking
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activeOrders.map(order => {
                const assignedWaiter = users.find(u => u.id === order.waiterId);
                const deliveredBy = users.find(u => u.id === order.deliveredBy);
                
                return (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Order #{order.id.slice(-6)}</h3>
                        <p className="text-sm text-gray-600">
                          {order.type === 'dine-in' ? `Table ${order.tableId}` : order.type}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'ready' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          {format(order.createdAt, 'HH:mm')}
                        </p>
                      </div>
                    </div>

                    {/* Waiter Assignment Info */}
                    <div className="text-sm space-y-1">
                      {order.waiterId ? (
                        <div className="flex items-center text-blue-600">
                          <User className="w-4 h-4 mr-1" />
                          <span>Claimed by: {assignedWaiter?.name || 'Unknown'}</span>
                          {order.claimedAt && (
                            <span className="ml-2 text-gray-500">
                              ({format(order.claimedAt, 'HH:mm')})
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center text-orange-600">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          <span>Waiting for waiter assignment</span>
                        </div>
                      )}
                      
                      {order.deliveredBy && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span>Delivered by: {deliveredBy?.name || 'Unknown'}</span>
                          {order.deliveredAt && (
                            <span className="ml-2 text-gray-500">
                              ({format(order.deliveredAt, 'HH:mm')})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Time Tracking */}
                    <div className="mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Timer className="w-3 h-3 mr-1" />
                        <span>
                          Order age: {Math.round((new Date().getTime() - order.createdAt.getTime()) / 1000 / 60)}m
                        </span>
                        {order.claimedAt && (
                          <span className="ml-3">
                            Claim time: {Math.round((order.claimedAt.getTime() - order.createdAt.getTime()) / 1000 / 60)}m
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {activeOrders.length === 0 && (
                <p className="text-gray-500 text-center py-4">No active orders</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}