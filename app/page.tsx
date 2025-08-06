'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import Link from 'next/link';
import { 
  ChefHat, 
  CreditCard, 
  Package, 
  Users, 
  BarChart3, 
  Calendar,
  Monitor,
  Menu as MenuIcon,
  Settings,
  LogOut,
  Shield,
  Bell,
  MessageSquare,
  Gift,
  QrCode,
  Truck,
  ShoppingCart,
  Trash2,
  Clock,
  Tag,
  User,
  Receipt,
  FileText,
  Brain,
  Mic,
  Eye,
  Share2,
  Leaf,
  Mail,
  Crown,
  UserCheck,
  Utensils,
  Coffee,
  Smartphone
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, initializeStore } = useRestaurantStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    initializeStore();
    
    // For demo purposes, set a default user
    if (!user) {
      useRestaurantStore.getState().setUser({
        id: '1',
        name: 'Admin User',
        email: 'admin@restaurant.com',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
      });
    }
  }, [user, initializeStore]);

  // Define role categories
  const roleCategories = [
    {
      id: 'all',
      name: 'All Features',
      icon: Monitor,
      color: 'bg-gray-500',
      description: 'View all available features'
    },
    {
      id: 'owner',
      name: 'Owner/Admin',
      icon: Crown,
      color: 'bg-purple-600',
      description: 'Business management & analytics'
    },
    {
      id: 'manager',
      name: 'Manager',
      icon: Shield,
      color: 'bg-blue-600',
      description: 'Operations & staff management'
    },
    {
      id: 'waiter',
      name: 'Waiter/Server',
      icon: UserCheck,
      color: 'bg-green-600',
      description: 'Table service & customer management'
    },
    {
      id: 'kitchen',
      name: 'Kitchen Staff',
      icon: ChefHat,
      color: 'bg-orange-600',
      description: 'Food preparation & kitchen operations'
    },
    {
      id: 'cashier',
      name: 'Cashier/POS',
      icon: CreditCard,
      color: 'bg-indigo-600',
      description: 'Payment processing & transactions'
    },
    {
      id: 'customer',
      name: 'Customer',
      icon: Coffee,
      color: 'bg-pink-600',
      description: 'Customer-facing features'
    }
  ];

  // Define modules organized by categories
  const modulesByCategory = {
    owner: [
      {
        title: 'Business Intelligence',
        description: 'Advanced analytics & AI insights',
        icon: Brain,
        href: '/business-intelligence',
        color: 'bg-purple-500',
      },
      {
        title: 'Enhanced Analytics',
        description: 'Advanced metrics & performance insights',
        icon: BarChart3,
        href: '/enhanced-analytics',
        color: 'bg-indigo-500',
      },
      {
        title: 'Financial Reports',
        description: 'Revenue, expenses & profit analysis',
        icon: FileText,
        href: '/financial-reports',
        color: 'bg-green-500',
      },
      {
        title: 'Multi-Location Management',
        description: 'Manage multiple restaurant locations',
        icon: BarChart3,
        href: '/multi-location',
        color: 'bg-blue-500',
      },
      {
        title: 'Analytics & Reports',
        description: 'Sales reports & business insights',
        icon: BarChart3,
        href: '/analytics',
        color: 'bg-pink-500',
      },
      {
        title: 'Expense Tracking',
        description: 'Monitor business expenses',
        icon: Receipt,
        href: '/expense-tracking',
        color: 'bg-red-500',
      },
      {
        title: 'Email Marketing',
        description: 'Customer campaigns & automation',
        icon: Mail,
        href: '/email-marketing',
        color: 'bg-orange-500',
      },
      {
        title: 'User Authentication',
        description: 'User management & role-based access',
        icon: Shield,
        href: '/authentication',
        color: 'bg-gray-600',
      },
      {
        title: 'API Integration Hub',
        description: 'Manage third-party integrations and API connections',
        icon: Share2,
        href: '/api-integration',
        color: 'bg-cyan-500',
      },
      {
        title: 'Enhanced Security',
        description: 'Comprehensive security monitoring and threat protection',
        icon: Shield,
        href: '/enhanced-security',
        color: 'bg-red-500',
      }
    ],
    manager: [
      {
        title: 'Manager Dashboard',
        description: 'Monitor staff performance & operations',
        icon: Shield,
        href: '/manager',
        color: 'bg-gray-600',
      },
      {
        title: 'Staff Schedule',
        description: 'Employee scheduling & time tracking',
        icon: Clock,
        href: '/staff-schedule',
        color: 'bg-indigo-500',
      },
      {
        title: 'Inventory Management',
        description: 'Stock levels & supplier management',
        icon: Package,
        href: '/inventory',
        color: 'bg-red-500',
      },
      {
        title: 'Suppliers',
        description: 'Vendor management & relationships',
        icon: Truck,
        href: '/suppliers',
        color: 'bg-teal-500',
      },
      {
        title: 'Purchase Orders',
        description: 'Procurement & ordering',
        icon: ShoppingCart,
        href: '/purchase-orders',
        color: 'bg-amber-500',
      },
      {
        title: 'Waste Tracking',
        description: 'Monitor food waste & losses',
        icon: Trash2,
        href: '/waste-tracking',
        color: 'bg-red-500',
      },
      {
        title: 'Promotions',
        description: 'Marketing campaigns & discounts',
        icon: Tag,
        href: '/promotions',
        color: 'bg-emerald-500',
      },
      {
        title: 'Customer Feedback',
        description: 'Reviews & customer satisfaction',
        icon: MessageSquare,
        href: '/feedback',
        color: 'bg-purple-500',
      }
    ],
    waiter: [
      {
        title: 'Waiter Interface',
        description: 'Take orders & manage table service',
        icon: Users,
        href: '/waiter',
        color: 'bg-green-500',
      },
      {
        title: 'Table Management',
        description: 'Monitor table status & reservations',
        icon: Calendar,
        href: '/tables',
        color: 'bg-indigo-500',
      },
      {
        title: 'Reservations',
        description: 'Booking management & scheduling',
        icon: Calendar,
        href: '/reservations',
        color: 'bg-blue-500',
      },
      {
        title: 'Waitlist Management',
        description: 'Customer queue & wait times',
        icon: Users,
        href: '/waitlist',
        color: 'bg-blue-500',
      },
      {
        title: 'Customer Profiles',
        description: 'Customer information & preferences',
        icon: User,
        href: '/customer-profiles',
        color: 'bg-violet-500',
      },
      {
        title: 'Loyalty Program',
        description: 'Points & rewards management',
        icon: Gift,
        href: '/loyalty',
        color: 'bg-pink-500',
      }
    ],
    kitchen: [
      {
        title: 'Kitchen Display',
        description: 'View & manage incoming orders',
        icon: ChefHat,
        href: '/kitchen',
        color: 'bg-orange-500',
      },
      {
        title: 'Recipe Management',
        description: 'Manage recipes & ingredients',
        icon: ChefHat,
        href: '/recipes',
        color: 'bg-yellow-500',
      },
      {
        title: 'Recipe Cost Calculator',
        description: 'Calculate ingredient costs & margins',
        icon: Receipt,
        href: '/recipe-costs',
        color: 'bg-green-500',
      },
      {
        title: 'Smart Kitchen AI',
        description: 'AI-powered cooking optimization',
        icon: Brain,
        href: '/smart-kitchen',
        color: 'bg-orange-500',
      },
      {
        title: 'Inventory Alerts',
        description: 'Low stock notifications',
        icon: Bell,
        href: '/notifications',
        color: 'bg-yellow-500',
      }
    ],
    cashier: [
      {
        title: 'Cashier / POS',
        description: 'Process orders & payments',
        icon: CreditCard,
        href: '/cashier',
        color: 'bg-blue-500',
      },
      {
        title: 'Advanced Payments',
        description: 'Multiple payment methods & processing',
        icon: CreditCard,
        href: '/advanced-payments',
        color: 'bg-emerald-500',
      },
      {
        title: 'QR Code Management',
        description: 'Digital menu QR codes',
        icon: QrCode,
        href: '/qr-codes',
        color: 'bg-cyan-500',
      },
      {
        title: 'Display Screen',
        description: 'Customer order status display',
        icon: Monitor,
        href: '/display',
        color: 'bg-teal-500',
      }
    ],
    customer: [
      {
        title: 'Customer Menu',
        description: 'Browse menu & place orders',
        icon: MenuIcon,
        href: '/menu',
        color: 'bg-purple-500',
      },
      {
        title: 'Table-side QR Ordering',
        description: 'Scan & order directly from table',
        icon: QrCode,
        href: '/table-ordering',
        color: 'bg-blue-500',
      },
      {
        title: 'Mobile App & PWA',
        description: 'Progressive Web App with mobile features and offline support',
        icon: Smartphone,
        href: '/mobile-app',
        color: 'bg-indigo-500'
      },
      {
        title: 'Real-time Notifications',
        description: 'Live notifications system for orders, alerts, and updates',
        icon: Bell,
        href: '/notifications-system',
        color: 'bg-yellow-500'
      },
      {
        title: 'Advanced Customer Features',
        description: 'Customer profiles, loyalty programs, and personalization',
        icon: Users,
        href: '/advanced-customer',
        color: 'bg-pink-500'
      },
      {
        title: 'AR Menu Visualization',
        description: 'Interactive 3D menu experience',
        icon: Eye,
        href: '/ar-menu',
        color: 'bg-green-500',
      },
      {
        title: 'Voice Ordering',
        description: 'AI-powered voice commands',
        icon: Mic,
        href: '/voice-ordering',
        color: 'bg-purple-500',
      },
      {
        title: 'Social Media Integration',
        description: 'Share experiences & reviews',
        icon: Share2,
        href: '/social-media',
        color: 'bg-pink-500',
      }
    ]
  };

  // Get modules for selected category
  const getModulesForCategory = () => {
    if (selectedCategory === 'all') {
      return Object.values(modulesByCategory).flat();
    }
    return modulesByCategory[selectedCategory] || [];
  };

  // Filter modules based on user role
  const getFilteredModules = () => {
    const modules = getModulesForCategory();
    if (user?.role === 'admin') return modules;
    
    // Role-based filtering
    const roleAccess = {
      manager: ['owner', 'manager', 'waiter', 'kitchen', 'cashier'],
      waiter: ['waiter', 'customer'],
      chef: ['kitchen', 'manager'],
      cashier: ['cashier', 'customer']
    };
    
    const allowedCategories = roleAccess[user?.role] || [selectedCategory];
    
    if (selectedCategory === 'all') {
      return Object.entries(modulesByCategory)
        .filter(([category]) => allowedCategories.includes(category))
        .map(([, modules]) => modules)
        .flat();
    }
    
    return allowedCategories.includes(selectedCategory) ? modules : [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                Restaurant Management System
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user?.name}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h2>
          <p className="text-gray-600">
            Choose your role category to access relevant features and tools.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold text-gray-900">$2,847</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reservations</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Categories */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Select Your Role</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {roleCategories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-lg ${category.color} text-white mb-2`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className={`font-semibold text-sm ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {category.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {category.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Category Modules */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {selectedCategory === 'all' 
                ? 'All Available Features' 
                : `${roleCategories.find(c => c.id === selectedCategory)?.name} Features`
              }
            </h3>
            <span className="text-sm text-gray-500">
              {getFilteredModules().length} features available
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredModules().map((module, index) => {
              const Icon = module.icon;
              return (
                <Link
                  key={`${module.href}-${index}`}
                  href={module.href}
                  className="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-lg ${module.color} text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="ml-4 text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {module.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                  <div className="px-6 py-3 bg-gray-50 border-t">
                    <span className="text-sm text-primary-600 font-medium group-hover:text-primary-700">
                      Open Module &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* AI & Advanced Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🤖 AI & Advanced Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/ai-insights" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">AI Insights</h3>
                    <p className="text-gray-600 text-sm">Predictive analytics & recommendations</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/sustainability" className="group">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 p-3 rounded-lg">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Sustainability</h3>
                    <p className="text-gray-600 text-sm">Environmental impact tracking</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/notifications" className="group">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500 p-3 rounded-lg">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Notifications</h3>
                    <p className="text-gray-600 text-sm">Real-time alerts & updates</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}