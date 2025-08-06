'use client';

import { useState } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { Table, Order, OrderItem, MenuItem } from '@/types';
import { 
  Users, 
  Plus, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Search,
  Filter,
  ShoppingCart,
  Eye,
  Edit,
  Bell,
  User
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function WaiterPage() {
  const { tables, orders, menuItems, users, updateTable, addOrder, updateOrder, claimOrder, markOrderDelivered } = useRestaurantStore();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  
  // In a real app, this would come from authentication
  const currentUser = users?.find(u => u.role === 'waiter') || { id: 'waiter-1', name: 'Current Waiter' };

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];
  
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.isAvailable;
  });

  const getTableOrders = (tableNumber: number) => {
    return orders.filter(order => 
      order.tableNumber === tableNumber && 
      !['completed', 'cancelled'].includes(order.status)
    );
  };

  const getTableStatus = (table: Table) => {
    const tableOrders = getTableOrders(table.number);
    if (tableOrders.length > 0) {
      const hasActiveOrders = tableOrders.some(order => 
        ['pending', 'confirmed', 'preparing'].includes(order.status)
      );
      if (hasActiveOrders) return 'occupied';
      return 'needs-attention';
    }
    return table.status;
  };

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-500 text-green-900';
      case 'occupied': return 'bg-blue-100 border-blue-500 text-blue-900';
      case 'needs-attention': return 'bg-orange-100 border-orange-500 text-orange-900';
      case 'reserved': return 'bg-purple-100 border-purple-500 text-purple-900';
      case 'cleaning': return 'bg-gray-100 border-gray-500 text-gray-900';
      default: return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  const addToOrder = (menuItem: MenuItem) => {
    const existingItem = cart.find(item => item.menuItemId === menuItem.id);
    
    if (existingItem) {
      setCart(items =>
        items.map(item =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem: OrderItem = {
        id: `item-${Date.now()}-${Math.random()}`,
        menuItemId: menuItem.id,
        menuItem,
        quantity: 1,
        price: menuItem.price,
        status: 'pending',
      };
      setCart(items => [...items, newItem]);
    }
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart(items =>
      items.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const submitOrder = () => {
    if (!selectedTable || cart.length === 0) {
      toast.error('Please select a table and add items to the order');
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tableNumber: selectedTable.number,
      customerName: customerInfo.name || undefined,
      customerPhone: customerInfo.phone || undefined,
      items: cart,
      status: 'pending',
      orderType: 'dine-in',
      totalAmount: total,
      tax,
      finalAmount: total,
      paymentStatus: 'pending',
      orderTime: new Date(),
      estimatedTime: new Date(Date.now() + 30 * 60 * 1000),
      waiterId: 'waiter-1', // In real app, this would be the current user's ID
    };

    addOrder(newOrder);
    updateTable(selectedTable.id, { 
      status: 'occupied', 
      currentOrder: newOrder.id 
    });

    // Reset form
    setCart([]);
    setCustomerInfo({ name: '', phone: '' });
    setShowOrderForm(false);
    setSelectedTable(null);

    toast.success(`Order created for Table ${selectedTable.number}!`);
  };

  const markTableAsAvailable = (table: Table) => {
    updateTable(table.id, { status: 'available', currentOrder: undefined });
    toast.success(`Table ${table.number} marked as available`);
  };

  const markTableForCleaning = (table: Table) => {
    updateTable(table.id, { status: 'cleaning' });
    toast.success(`Table ${table.number} marked for cleaning`);
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
              <Users className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Waiter Interface</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <Clock className="inline h-4 w-4 mr-1" />
                {format(new Date(), 'HH:mm')}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Tables</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tables.filter(t => getTableStatus(t) === 'available').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupied Tables</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tables.filter(t => getTableStatus(t) === 'occupied').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Need Attention</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tables.filter(t => getTableStatus(t) === 'needs-attention').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status)).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Grid */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Table Layout</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables.map((table) => {
              const status = getTableStatus(table);
              const tableOrders = getTableOrders(table.number);
              
              return (
                <div
                  key={table.id}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getTableStatusColor(status)}`}
                  onClick={() => setSelectedTable(table)}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold mb-1">Table {table.number}</div>
                    <div className="text-sm opacity-75">{table.capacity} seats</div>
                    <div className="text-xs mt-1 capitalize">{status.replace('-', ' ')}</div>
                    
                    {tableOrders.length > 0 && (
                      <div className="mt-2 text-xs">
                        {tableOrders.length} active order(s)
                      </div>
                    )}
                  </div>
                  
                  {status === 'needs-attention' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Table Actions */}
        {selectedTable && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Table {selectedTable.number} Actions
              </h3>
              <button
                onClick={() => setSelectedTable(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Table Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Capacity: {selectedTable.capacity} people</div>
                  <div>Status: <span className="capitalize">{getTableStatus(selectedTable).replace('-', ' ')}</span></div>
                  {getTableOrders(selectedTable.number).length > 0 && (
                    <div>Active Orders: {getTableOrders(selectedTable.number).length}</div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowOrderForm(true)}
                    className="w-full btn-primary text-sm flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Order
                  </button>
                  
                  {getTableStatus(selectedTable) === 'occupied' && (
                    <button
                      onClick={() => markTableForCleaning(selectedTable)}
                      className="w-full btn-secondary text-sm"
                    >
                      Mark for Cleaning
                    </button>
                  )}
                  
                  {getTableStatus(selectedTable) === 'cleaning' && (
                    <button
                      onClick={() => markTableAsAvailable(selectedTable)}
                      className="w-full btn-success text-sm"
                    >
                      Mark as Available
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Table Orders */}
            {getTableOrders(selectedTable.number).length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Current Orders</h4>
                <div className="space-y-2">
                  {getTableOrders(selectedTable.number).map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Order #{order.id.slice(-6)}</div>
                        <div className="text-sm text-gray-600">
                          {order.items.length} items • ${order.finalAmount.toFixed(2)} • {order.status}
                        </div>
                      </div>
                      <button
                        onClick={() => setViewingOrder(order)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ready Orders Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Bell className="mr-2 text-green-600" />
            Ready Orders
          </h3>
          <div className="space-y-4">
            {orders
              .filter(order => order.status === 'ready')
              .map(order => {
                const waiter = users?.find(u => u.id === order.waiterId);
                const deliveredBy = users?.find(u => u.id === order.deliveredBy);
                
                return (
                  <div key={order.id} className="border rounded-lg p-4 bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">Order #{order.id.slice(-6)}</h4>
                        <p className="text-sm text-gray-600">
                          {order.orderType === 'dine-in' ? `Table ${order.tableNumber}` : order.orderType}
                        </p>
                        {order.customerName && (
                          <p className="text-sm text-gray-600">Customer: {order.customerName}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${order.finalAmount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          {format(order.orderTime, 'HH:mm')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-1">Items:</h5>
                      <div className="text-sm text-gray-600">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.quantity}x {item.menuItem.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Waiter Assignment Status */}
                    <div className="mb-3 text-sm">
                      {order.waiterId ? (
                        <div className="flex items-center text-blue-600">
                          <User className="w-4 h-4 mr-1" />
                          <span>Claimed by: {waiter?.name || 'Unknown'}</span>
                          {order.claimedAt && (
                            <span className="ml-2 text-gray-500">
                              at {format(order.claimedAt, 'HH:mm')}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-orange-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Waiting for waiter to claim
                        </div>
                      )}
                      
                      {order.deliveredBy && (
                        <div className="flex items-center text-green-600 mt-1">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span>Delivered by: {deliveredBy?.name || 'Unknown'}</span>
                          {order.deliveredAt && (
                            <span className="ml-2 text-gray-500">
                              at {format(order.deliveredAt, 'HH:mm')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {!order.waiterId && (
                        <button
                          onClick={() => {
                            claimOrder(order.id, currentUser.id);
                            toast.success(`Order #${order.id.slice(-6)} claimed!`);
                          }}
                          className="btn-primary text-sm px-3 py-1"
                        >
                          <User className="w-4 h-4 mr-1" />
                          Claim Order
                        </button>
                      )}
                      
                      {order.waiterId === currentUser.id && !order.deliveredBy && (
                        <button
                          onClick={() => {
                            markOrderDelivered(order.id, currentUser.id);
                            updateOrder(order.id, { status: 'served' });
                            toast.success(`Order #${order.id.slice(-6)} delivered to table!`);
                          }}
                          className="btn-success text-sm px-3 py-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark as Delivered
                        </button>
                      )}
                      
                      {order.waiterId && order.waiterId !== currentUser.id && !order.deliveredBy && (
                        <span className="text-sm text-gray-500 px-3 py-1">
                          Assigned to another waiter
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            {orders.filter(order => order.status === 'ready').length === 0 && (
              <p className="text-gray-500 text-center py-4">No ready orders</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
          
          <div className="space-y-3">
            {orders
              .filter(order => order.orderType === 'dine-in')
              .slice(0, 5)
              .map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">
                      Order #{order.id.slice(-6)} - Table {order.tableNumber}
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(order.orderTime, 'HH:mm')} • {order.items.length} items • ${order.finalAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'ready' ? 'bg-green-100 text-green-800' :
                      order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => setViewingOrder(order)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  New Order - Table {selectedTable.number}
                </h3>
                <button
                  onClick={() => {
                    setShowOrderForm(false);
                    setCart([]);
                    setCustomerInfo({ name: '', phone: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex h-[calc(90vh-120px)]">
              {/* Menu Section */}
              <div className="flex-1 p-6 border-r overflow-y-auto">
                <div className="mb-4">
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search menu..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All' : category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredMenuItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => addToOrder(item)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                        <span className="text-primary-600 font-bold text-sm">${item.price}</span>
                      </div>
                      <p className="text-gray-600 text-xs mb-2">{item.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{item.category}</span>
                        <span>{item.preparationTime}min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="w-80 p-6 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-4">Order Summary</h4>
                
                <div className="space-y-2 mb-4">
                  <input
                    type="text"
                    placeholder="Customer name (optional)"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number (optional)"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{item.menuItem.name}</h5>
                        <p className="text-xs text-gray-600">${item.price} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {cart.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (10%):</span>
                        <span>${(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1).toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={submitOrder}
                      className="w-full btn-primary mt-4"
                    >
                      Submit Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Order #{viewingOrder.id.slice(-6)}
              </h3>
              <button
                onClick={() => setViewingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Table: {viewingOrder.tableNumber}</div>
                <div className="text-sm text-gray-600">Time: {format(viewingOrder.orderTime, 'HH:mm')}</div>
                <div className="text-sm text-gray-600">Status: <span className="capitalize">{viewingOrder.status}</span></div>
                {viewingOrder.customerName && (
                  <div className="text-sm text-gray-600">Customer: {viewingOrder.customerName}</div>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                <div className="space-y-2">
                  {viewingOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${viewingOrder.finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}