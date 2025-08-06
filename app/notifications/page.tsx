'use client';

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';
import { 
  Bell,
  BellRing,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  X,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import toast from 'react-hot-toast';

interface NotificationSettings {
  orderUpdates: boolean;
  inventoryAlerts: boolean;
  reservationReminders: boolean;
  staffNotifications: boolean;
  soundEnabled: boolean;
}

export default function NotificationsPage() {
  const { 
    notifications, 
    orders, 
    inventory, 
    reservations, 
    markNotificationAsRead, 
    clearAllNotifications,
    addNotification 
  } = useRestaurantStore();

  const [filter, setFilter] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    orderUpdates: true,
    inventoryAlerts: true,
    reservationReminders: true,
    staffNotifications: true,
    soundEnabled: true
  });

  // Auto-generate notifications based on system state
  useEffect(() => {
    const checkAndGenerateNotifications = () => {
      // Low inventory alerts
      if (settings.inventoryAlerts) {
        inventory.forEach(item => {
          if (item.quantity <= item.minQuantity) {
            const existingAlert = notifications.find(n => 
              n.type === 'inventory' && 
              n.message.includes(item.name) && 
              !n.isRead
            );
            
            if (!existingAlert) {
              addNotification({
                id: `inv-${item.id}-${Date.now()}`,
                type: 'inventory',
                title: 'Low Inventory Alert',
                message: `${item.name} is running low (${item.quantity} ${item.unit} remaining)`,
                priority: 'high',
                isRead: false,
                createdAt: new Date()
              });
            }
          }
        });
      }

      // Order status notifications
      if (settings.orderUpdates) {
        const recentOrders = orders.filter(order => {
          const orderTime = new Date(order.createdAt);
          const now = new Date();
          const diffMinutes = (now.getTime() - orderTime.getTime()) / (1000 * 60);
          return diffMinutes <= 30; // Orders from last 30 minutes
        });

        recentOrders.forEach(order => {
          if (order.status === 'ready') {
            const existingNotif = notifications.find(n => 
              n.message.includes(`Order #${order.id}`) && 
              n.message.includes('ready') && 
              !n.isRead
            );
            
            if (!existingNotif) {
              addNotification({
                id: `order-ready-${order.id}-${Date.now()}`,
                type: 'order',
                title: 'Order Ready',
                message: `Order #${order.id} for Table ${order.tableNumber} is ready for delivery`,
                priority: 'medium',
                isRead: false,
                createdAt: new Date()
              });
            }
          }
        });
      }

      // Reservation reminders
      if (settings.reservationReminders) {
        const upcomingReservations = reservations.filter(res => {
          const resTime = new Date(`${format(res.date, 'yyyy-MM-dd')}T${res.time}`);
          const now = new Date();
          const diffMinutes = (resTime.getTime() - now.getTime()) / (1000 * 60);
          return diffMinutes > 0 && diffMinutes <= 30 && res.status === 'confirmed';
        });

        upcomingReservations.forEach(reservation => {
          const existingReminder = notifications.find(n => 
            n.message.includes(reservation.customerName) && 
            n.message.includes('arriving soon') && 
            !n.isRead
          );
          
          if (!existingReminder) {
            addNotification({
              id: `res-reminder-${reservation.id}-${Date.now()}`,
              type: 'reservation',
              title: 'Upcoming Reservation',
              message: `${reservation.customerName} (party of ${reservation.partySize}) arriving soon at ${reservation.time}`,
              priority: 'medium',
              isRead: false,
              createdAt: new Date()
            });
          }
        });
      }
    };

    const interval = setInterval(checkAndGenerateNotifications, 60000); // Check every minute
    checkAndGenerateNotifications(); // Initial check

    return () => clearInterval(interval);
  }, [settings, inventory, orders, reservations, notifications, addNotification]);

  // Play notification sound
  useEffect(() => {
    if (settings.soundEnabled) {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      if (unreadNotifications.length > 0) {
        // In a real app, you'd play an actual sound file
        // For demo purposes, we'll just show a toast
        const latestNotification = unreadNotifications[unreadNotifications.length - 1];
        const notificationTime = new Date(latestNotification.createdAt);
        const now = new Date();
        const diffSeconds = (now.getTime() - notificationTime.getTime()) / 1000;
        
        if (diffSeconds < 5) { // Only for very recent notifications
          toast(latestNotification.message, {
            icon: getNotificationIcon(latestNotification.type),
            duration: 4000
          });
        }
      }
    }
  }, [notifications, settings.soundEnabled]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return '🍽️';
      case 'inventory': return '📦';
      case 'reservation': return '📅';
      case 'staff': return '👥';
      default: return '🔔';
    }
  };

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              Stay updated with real-time alerts and system notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="btn-secondary"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  clearAllNotifications();
                  toast.success('All notifications cleared');
                }}
                className="btn-danger"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'order', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
              { key: 'inventory', label: 'Inventory', count: notifications.filter(n => n.type === 'inventory').length },
              { key: 'reservation', label: 'Reservations', count: notifications.filter(n => n.type === 'reservation').length },
              { key: 'staff', label: 'Staff', count: notifications.filter(n => n.type === 'staff').length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
                {count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === key ? 'bg-white text-primary-600' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No notifications found</p>
            </div>
          ) : (
            filteredNotifications
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-sm border-l-4 p-4 transition-all hover:shadow-md ${
                    getNotificationColor(notification.priority)
                  } ${!notification.isRead ? 'ring-2 ring-blue-100' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getPriorityIcon(notification.priority)}
                        <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {format(notification.createdAt, 'MMM d, h:mm a')}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      
                      <p className={`text-sm ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          // In a real app, you'd have a delete notification function
                          toast.success('Notification dismissed');
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium">Notification Settings</h3>
            </div>

            <div className="p-6 space-y-4">
              {[
                { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified when orders are ready or status changes' },
                { key: 'inventoryAlerts', label: 'Inventory Alerts', desc: 'Alerts when items are running low' },
                { key: 'reservationReminders', label: 'Reservation Reminders', desc: 'Reminders for upcoming reservations' },
                { key: 'staffNotifications', label: 'Staff Notifications', desc: 'Updates about staff schedules and activities' },
                { key: 'soundEnabled', label: 'Sound Notifications', desc: 'Play sound for new notifications' }
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{label}</h4>
                      {key === 'soundEnabled' && (
                        settings[key as keyof NotificationSettings] ? 
                          <Volume2 className="w-4 h-4 text-green-500" /> : 
                          <VolumeX className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={settings[key as keyof NotificationSettings]}
                      onChange={(e) => setSettings({
                        ...settings,
                        [key]: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="p-6 border-t">
              <button
                onClick={() => {
                  setShowSettings(false);
                  toast.success('Settings saved');
                }}
                className="btn-primary w-full"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}