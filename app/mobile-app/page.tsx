'use client'

import React, { useState, useEffect } from 'react'
import { 
  Smartphone, 
  Download, 
  Wifi, 
  WifiOff, 
  Bell, 
  Camera, 
  MapPin, 
  Share2,
  Star,
  QrCode,
  CreditCard,
  Users,
  Settings,
  RefreshCw,
  Battery,
  Signal
} from 'lucide-react'

export default function MobileAppPage() {
  const [isOnline, setIsOnline] = useState(true)
  const [installPrompt, setInstallPrompt] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [syncStatus, setSyncStatus] = useState('synced')
  const [batteryLevel, setBatteryLevel] = useState(85)

  useEffect(() => {
    // Simulate PWA install prompt
    const timer = setTimeout(() => setInstallPrompt(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleInstallPWA = () => {
    setInstallPrompt(false)
    // Simulate PWA installation
    alert('App installed successfully! You can now access it from your home screen.')
  }

  const toggleOfflineMode = () => {
    setIsOnline(!isOnline)
    setSyncStatus(isOnline ? 'offline' : 'syncing')
    if (!isOnline) {
      setTimeout(() => setSyncStatus('synced'), 2000)
    }
  }

  const mobileFeatures = [
    {
      icon: QrCode,
      title: 'QR Code Scanner',
      description: 'Scan table QR codes for instant ordering',
      status: 'active'
    },
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Real-time order updates and promotions',
      status: 'active'
    },
    {
      icon: MapPin,
      title: 'Location Services',
      description: 'Find nearby restaurants and delivery tracking',
      status: 'active'
    },
    {
      icon: Camera,
      title: 'Photo Integration',
      description: 'Take photos of dishes for reviews',
      status: 'active'
    },
    {
      icon: CreditCard,
      title: 'Mobile Payments',
      description: 'Apple Pay, Google Pay, and digital wallets',
      status: 'active'
    },
    {
      icon: Share2,
      title: 'Social Sharing',
      description: 'Share experiences on social media',
      status: 'active'
    }
  ]

  const appStats = [
    { label: 'Downloads', value: '25,847', change: '+12%' },
    { label: 'Active Users', value: '18,392', change: '+8%' },
    { label: 'App Rating', value: '4.8', change: '+0.2' },
    { label: 'Retention Rate', value: '78%', change: '+5%' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Smartphone className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mobile App Integration</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">PWA & Native Mobile Features</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Battery className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{batteryLevel}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Signal className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">4G</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PWA Install Prompt */}
        {installPrompt && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Download className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">Install Restaurant App</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Add this app to your home screen for quick access and offline functionality.
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setInstallPrompt(false)}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  Later
                </button>
                <button
                  onClick={handleInstallPWA}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Install
                </button>
              </div>
            </div>
          </div>
        )}

        {/* App Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {appStats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mobile Features */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mobile Features</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mobileFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <IconComponent className="h-8 w-8 text-blue-600 mr-4" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                        {feature.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* App Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">App Controls</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Offline Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Offline Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enable offline functionality</p>
                </div>
                <button
                  onClick={toggleOfflineMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    !isOnline ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      !isOnline ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Notifications Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive order updates</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Sync Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Data Sync</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status: {syncStatus === 'synced' ? 'Up to date' : syncStatus === 'syncing' ? 'Syncing...' : 'Offline mode'}
                  </p>
                </div>
                <RefreshCw className={`h-5 w-5 ${syncStatus === 'syncing' ? 'animate-spin text-blue-600' : 'text-gray-400'}`} />
              </div>

              {/* App Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Download for iOS
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Download for Android
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Settings className="h-4 w-4 mr-2" />
                  App Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Device Compatibility */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Device Compatibility</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">iOS</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">iOS 12.0 or later</p>
                <div className="flex items-center justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">4.8</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">Android</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Android 8.0 or later</p>
                <div className="flex items-center justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">4.7</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">PWA</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">All modern browsers</p>
                <div className="flex items-center justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}