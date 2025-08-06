'use client'

import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Globe, 
  Smartphone, 
  Monitor, 
  Activity, 
  Users, 
  FileText, 
  Settings, 
  Zap, 
  Database, 
  Cloud, 
  Wifi, 
  UserCheck, 
  Ban, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react'

export default function SecurityPage() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [showPassword, setShowPassword] = useState(false)

  // Mock security data
  const securityMetrics = {
    threatLevel: 'Low',
    activeThreats: 2,
    blockedAttempts: 156,
    secureConnections: 99.8,
    lastScan: '2024-01-15 14:30',
    vulnerabilities: 0
  }

  const loginAttempts = [
    {
      id: 1,
      user: 'admin@restaurant.com',
      ip: '192.168.1.100',
      location: 'New York, US',
      device: 'Chrome on Windows',
      status: 'success',
      timestamp: '2024-01-15 14:32:15',
      riskLevel: 'low'
    },
    {
      id: 2,
      user: 'manager@restaurant.com',
      ip: '10.0.0.50',
      location: 'New York, US',
      device: 'Safari on iPhone',
      status: 'success',
      timestamp: '2024-01-15 13:45:22',
      riskLevel: 'low'
    },
    {
      id: 3,
      user: 'unknown',
      ip: '185.220.101.42',
      location: 'Unknown',
      device: 'Unknown',
      status: 'blocked',
      timestamp: '2024-01-15 12:18:33',
      riskLevel: 'high'
    },
    {
      id: 4,
      user: 'waiter@restaurant.com',
      ip: '192.168.1.105',
      location: 'New York, US',
      device: 'Chrome on Android',
      status: 'failed',
      timestamp: '2024-01-15 11:22:10',
      riskLevel: 'medium'
    }
  ]

  const securityPolicies = [
    {
      id: 1,
      name: 'Password Policy',
      description: 'Minimum 8 characters, uppercase, lowercase, numbers, and symbols',
      status: 'active',
      lastUpdated: '2024-01-10',
      compliance: 95
    },
    {
      id: 2,
      name: 'Two-Factor Authentication',
      description: 'Required for all admin and manager accounts',
      status: 'active',
      lastUpdated: '2024-01-08',
      compliance: 87
    },
    {
      id: 3,
      name: 'Session Timeout',
      description: 'Automatic logout after 30 minutes of inactivity',
      status: 'active',
      lastUpdated: '2024-01-05',
      compliance: 100
    },
    {
      id: 4,
      name: 'IP Whitelist',
      description: 'Restrict access to approved IP addresses only',
      status: 'inactive',
      lastUpdated: '2024-01-01',
      compliance: 0
    }
  ]

  const securityAlerts = [
    {
      id: 1,
      type: 'suspicious_login',
      severity: 'high',
      title: 'Suspicious Login Attempt',
      description: 'Multiple failed login attempts from unknown IP address',
      timestamp: '2024-01-15 12:18:33',
      status: 'active',
      ip: '185.220.101.42'
    },
    {
      id: 2,
      type: 'weak_password',
      severity: 'medium',
      title: 'Weak Password Detected',
      description: 'User account has a weak password that should be updated',
      timestamp: '2024-01-15 09:45:12',
      status: 'resolved',
      user: 'waiter3@restaurant.com'
    },
    {
      id: 3,
      type: 'unusual_activity',
      severity: 'low',
      title: 'Unusual Activity Pattern',
      description: 'User logged in from a new device',
      timestamp: '2024-01-14 16:22:45',
      status: 'acknowledged',
      user: 'manager@restaurant.com'
    }
  ]

  const auditLogs = [
    {
      id: 1,
      action: 'User Login',
      user: 'admin@restaurant.com',
      ip: '192.168.1.100',
      timestamp: '2024-01-15 14:32:15',
      details: 'Successful login from trusted device'
    },
    {
      id: 2,
      action: 'Password Changed',
      user: 'manager@restaurant.com',
      ip: '192.168.1.102',
      timestamp: '2024-01-15 13:20:30',
      details: 'Password updated successfully'
    },
    {
      id: 3,
      action: 'Failed Login',
      user: 'unknown',
      ip: '185.220.101.42',
      timestamp: '2024-01-15 12:18:33',
      details: 'Multiple failed attempts - IP blocked'
    },
    {
      id: 4,
      action: 'Permission Changed',
      user: 'admin@restaurant.com',
      ip: '192.168.1.100',
      timestamp: '2024-01-15 11:45:22',
      details: 'Updated user role permissions'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'blocked': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'resolved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Security Overview', icon: Shield },
    { id: 'authentication', label: 'Authentication', icon: Lock },
    { id: 'monitoring', label: 'Activity Monitoring', icon: Activity },
    { id: 'policies', label: 'Security Policies', icon: FileText },
    { id: 'alerts', label: 'Security Alerts', icon: AlertTriangle },
    { id: 'audit', label: 'Audit Logs', icon: Database }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enhanced Security</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive security management & monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                securityMetrics.threatLevel === 'Low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                securityMetrics.threatLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                Threat Level: {securityMetrics.threatLevel}
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Security Scan
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Threats</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{securityMetrics.activeThreats}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Ban className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Blocked Attempts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{securityMetrics.blockedAttempts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Lock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Secure Connections</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{securityMetrics.secureConnections}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vulnerabilities</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{securityMetrics.vulnerabilities}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Scan</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{securityMetrics.lastScan}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Security Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">92/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                {/* Security Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Firewall Status</h3>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">All ports secured and monitored</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Protection Level</span>
                        <span className="font-medium text-gray-900 dark:text-white">High</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">SSL Certificate</h3>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Valid until March 2025</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Encryption</span>
                        <span className="font-medium text-gray-900 dark:text-white">TLS 1.3</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Data Backup</h3>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last backup: 2 hours ago</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Frequency</span>
                        <span className="font-medium text-gray-900 dark:text-white">Every 6 hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Security Events */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Security Events</h3>
                  <div className="space-y-3">
                    {securityAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            alert.severity === 'high' ? 'bg-red-400' :
                            alert.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{alert.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'authentication' && (
              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Two-Factor Authentication</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Current Status</h4>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Enabled for admin accounts</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">3 users without 2FA</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Supported Methods</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• SMS verification</li>
                        <li>• Authenticator apps (Google, Authy)</li>
                        <li>• Email verification</li>
                        <li>• Hardware tokens</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Password Policy */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Password Policy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Minimum length: 8 characters</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Require uppercase letters</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Require numbers</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Require special characters</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Password expiry: 90 days</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Session Management */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Session Management</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Session Timeout</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">30 minutes</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Concurrent Sessions</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">3 per user</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Remember Me Duration</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">7 days</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'monitoring' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Login Activity</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-100 dark:bg-gray-600">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">IP Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Device</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Risk</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {loginAttempts.map((attempt) => (
                        <tr key={attempt.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {attempt.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {attempt.ip}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {attempt.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Monitor className="h-4 w-4 mr-1" />
                              {attempt.device}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(attempt.status)}`}>
                              {attempt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(attempt.riskLevel)}`}>
                              {attempt.riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {attempt.timestamp}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === 'policies' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Security Policies</h3>
                <div className="space-y-4">
                  {securityPolicies.map((policy) => (
                    <div key={policy.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">{policy.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{policy.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(policy.status)}`}>
                            {policy.status}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Compliance Rate</p>
                          <div className="flex items-center mt-1">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${policy.compliance}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{policy.compliance}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{policy.lastUpdated}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                            <Edit className="h-3 w-3 mr-1 inline" />
                            Edit
                          </button>
                          <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                            <Eye className="h-3 w-3 mr-1 inline" />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'alerts' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Security Alerts</h3>
                <div className="space-y-4">
                  {securityAlerts.map((alert) => (
                    <div key={alert.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className={`h-6 w-6 ${
                            alert.severity === 'high' ? 'text-red-600' :
                            alert.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`} />
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">{alert.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{alert.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(alert.status)}`}>
                            {alert.status}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Timestamp</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{alert.timestamp}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {alert.ip ? 'IP Address' : 'User'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{alert.ip || alert.user}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                            Investigate
                          </button>
                          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                            Resolve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'audit' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Audit Logs</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-100 dark:bg-gray-600">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">IP Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {log.action}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {log.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {log.ip}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {log.timestamp}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {log.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
                  </button>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Showing 1-10 of 247 entries</span>
                    <button className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                      Previous
                    </button>
                    <button className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}