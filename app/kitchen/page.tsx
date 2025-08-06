'use client';

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { Order, OrderItem } from '@/types';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Timer,
  Users,
  Utensils,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format, differenceInMinutes } from 'date-fns';

export default function KitchenPage() {
  const { orders, updateOrder, addNotification } = useRestaurantStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Filter orders for kitchen display
  const kitchenOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing'].includes(order.status)
  ).sort((a, b) => a.orderTime.getTime() - b.orderTime.getTime());

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    updateOrder(orderId, { status });
    
    const order = orders.find(o => o.id === orderId);
    if (order && status === 'ready') {
      // Notify waiter that order is ready
      addNotification({
        id: `notif-${Date.now()}`,
        type: 'order',
        title: 'Order Ready',
        message: `Order #${order.id.slice(-6)} for Table ${order.tableNumber} is ready for pickup`,
        priority: 'high',
        isRead: false,
        createdAt: new Date(),
        userId: order.waiterId,
      });
      
      toast.success(`Order #${order.id.slice(-6)} marked as ready!`);
    }
  };

  const updateItemStatus = (orderId: string, itemId: string, status: OrderItem['status']) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const updatedItems = order.items.map(item =>
        item.id === itemId ? { ...item, status } : item
      );
      updateOrder(orderId, { items: updatedItems });
    }
  };

  const getOrderPriority = (order: Order) => {
    const minutesWaiting = differenceInMinutes(currentTime, order.orderTime);
    const estimatedTime = order.estimatedTime ? differenceInMinutes(order.estimatedTime, order.orderTime) : 30;
    
    if (minutesWaiting > estimatedTime + 10) return 'urgent';
    if (minutesWaiting > estimatedTime) return 'high';
    if (minutesWaiting > estimatedTime - 5) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 border-red-500 text-red-900';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-900';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      default: return 'bg-green-100 border-green-500 text-green-900';
    }
  };

  const getTimeColor = (order: Order) => {
    const minutesWaiting = differenceInMinutes(currentTime, order.orderTime);
    const estimatedTime = order.estimatedTime ? differenceInMinutes(order.estimatedTime, order.orderTime) : 30;
    
    if (minutesWaiting > estimatedTime + 10) return 'text-red-600';
    if (minutesWaiting > estimatedTime) return 'text-orange-600';
    if (minutesWaiting > estimatedTime - 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-400 hover:text-white" />
              </Link>
              <Utensils className="h-8 w-8 text-orange-500 mr-3" />
              <h1 className="text-xl font-bold">Kitchen Display System</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-300">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg">
                  {format(currentTime, 'HH:mm:ss')}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>On Time</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Warning</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Urgent</span>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.reload()}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center">
              <Timer className="h-6 w-6 text-blue-400 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Pending Orders</p>
                <p className="text-2xl font-bold">{kitchenOrders.filter(o => o.status === 'pending').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center">
              <Utensils className="h-6 w-6 text-orange-400 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Preparing</p>
                <p className="text-2xl font-bold">{kitchenOrders.filter(o => o.status === 'preparing').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Ready Today</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'ready').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Urgent Orders</p>
                <p className="text-2xl font-bold">
                  {kitchenOrders.filter(o => getOrderPriority(o) === 'urgent').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {kitchenOrders.length === 0 ? (
          <div className="text-center py-12">
            <Utensils className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No Active Orders</h3>
            <p className="text-gray-500">All caught up! New orders will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kitchenOrders.map((order) => {
              const priority = getOrderPriority(order);
              const minutesWaiting = differenceInMinutes(currentTime, order.orderTime);
              
              return (
                <div
                  key={order.id}
                  className={`bg-gray-800 rounded-lg border-l-4 ${getPriorityColor(priority)} border-gray-700 overflow-hidden`}
                >
                  {/* Order Header */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">
                          Order #{order.id.slice(-6)}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          {order.tableNumber && (
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              Table {order.tableNumber}
                            </span>
                          )}
                          <span className="capitalize">{order.orderType}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getTimeColor(order)}`}>
                          {minutesWaiting}min
                        </div>
                        <div className="text-xs text-gray-400">
                          {format(order.orderTime, 'HH:mm')}
                        </div>
                      </div>
                    </div>

                    {order.customerName && (
                      <p className="text-sm text-gray-300">
                        Customer: {order.customerName}
                      </p>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-lg border ${
                            item.status === 'ready' 
                              ? 'bg-green-900 border-green-700' 
                              : item.status === 'preparing'
                              ? 'bg-orange-900 border-orange-700'
                              : 'bg-gray-700 border-gray-600'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{item.menuItem.name}</h4>
                              <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                            </div>
                            <div className="flex space-x-1">
                              {item.status === 'pending' && (
                                <button
                                  onClick={() => updateItemStatus(order.id, item.id, 'preparing')}
                                  className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors"
                                >
                                  Start
                                </button>
                              )}
                              {item.status === 'preparing' && (
                                <button
                                  onClick={() => updateItemStatus(order.id, item.id, 'ready')}
                                  className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                                >
                                  Ready
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {item.specialInstructions && (
                            <p className="text-xs text-yellow-300 bg-yellow-900 bg-opacity-30 p-2 rounded">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="mt-3 p-2 bg-blue-900 bg-opacity-30 rounded text-sm text-blue-300">
                        <strong>Order Notes:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="p-4 border-t border-gray-700 bg-gray-750">
                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                        >
                          Confirm Order
                        </button>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                        >
                          Start Preparing
                        </button>
                      )}
                      
                      {order.status === 'preparing' && order.items.every(item => item.status === 'ready') && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                        >
                          Order Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}