'use client'

import React, { useState, createContext, useContext, useEffect } from 'react'
import { User, Lock, Eye, EyeOff, Shield, Users, Settings, LogOut, UserCheck, UserX, Crown, Star } from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'manager' | 'waiter' | 'kitchen' | 'cashier'
  firstName: string
  lastName: string
  avatar?: string
  isActive: boolean
  lastLogin?: Date
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@restaurant.com',
    role: 'admin',
    firstName: 'John',
    lastName: 'Admin',
    isActive: true,
    lastLogin: new Date(),
    permissions: ['all']
  },
  {
    id: '2',
    username: 'manager1',
    email: 'manager@restaurant.com',
    role: 'manager',
    firstName: 'Sarah',
    lastName: 'Manager',
    isActive: true,
    lastLogin: new Date(Date.now() - 3600000),
    permissions: ['view_reports', 'manage_staff', 'manage_inventory', 'view_analytics']
  },
  {
    id: '3',
    username: 'waiter1',
    email: 'waiter@restaurant.com',
    role: 'waiter',
    firstName: 'Mike',
    lastName: 'Waiter',
    isActive: true,
    lastLogin: new Date(Date.now() - 7200000),
    permissions: ['take_orders', 'view_menu', 'process_payments']
  },
  {
    id: '4',
    username: 'kitchen1',
    email: 'kitchen@restaurant.com',
    role: 'kitchen',
    firstName: 'Chef',
    lastName: 'Kitchen',
    isActive: true,
    lastLogin: new Date(Date.now() - 1800000),
    permissions: ['view_orders', 'update_order_status', 'manage_menu']
  },
  {
    id: '5',
    username: 'cashier1',
    email: 'cashier@restaurant.com',
    role: 'cashier',
    firstName: 'Lisa',
    lastName: 'Cashier',
    isActive: false,
    lastLogin: new Date(Date.now() - 86400000),
    permissions: ['process_payments', 'view_orders', 'generate_receipts']
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = mockUsers.find(u => u.username === username && u.isActive)
    if (foundUser && password === 'password123') { // Simple password for demo
      const updatedUser = { ...foundUser, lastLogin: new Date() }
      setUser(updatedUser)
      setIsAuthenticated(true)
      localStorage.setItem('auth_user', JSON.stringify(updatedUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('auth_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(username, password)
      if (!success) {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurant Login</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Demo Accounts:</h3>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <p><strong>Admin:</strong> admin / password123</p>
            <p><strong>Manager:</strong> manager1 / password123</p>
            <p><strong>Waiter:</strong> waiter1 / password123</p>
            <p><strong>Kitchen:</strong> kitchen1 / password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const { user: currentUser } = useAuth()

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 'manager':
        return <Star className="h-5 w-5 text-purple-500" />
      case 'waiter':
        return <Users className="h-5 w-5 text-blue-500" />
      case 'kitchen':
        return <Settings className="h-5 w-5 text-green-500" />
      case 'cashier':
        return <User className="h-5 w-5 text-orange-500" />
      default:
        return <User className="h-5 w-5 text-gray-500" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'manager':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      case 'waiter':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'kitchen':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'cashier':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
        <button
          onClick={() => setShowUserModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  {getRoleIcon(user.role)}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">@{user.username}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {user.isActive ? (
                  <UserCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <UserX className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Role:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Last Login:</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedUser(user)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                View Details
              </button>
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => toggleUserStatus(user.id)}
                  className={`flex-1 font-medium py-2 px-3 rounded-lg transition-colors text-sm ${
                    user.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30'
                      : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30'
                  }`}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">User Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-4">
                  {getRoleIcon(selectedUser.role)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Username:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{selectedUser.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Role:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedUser.role)}`}>
                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedUser.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  }`}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Permissions:</h5>
                <div className="flex flex-wrap gap-1">
                  {selectedUser.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                    >
                      {permission.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Dashboard() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Restaurant Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Welcome back, {user.firstName}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-2">
                  {getRoleIcon(user.role)}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 capitalize">{user.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {user.role === 'admin' && <UserManagement />}
        
        {user.role !== 'admin' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome to your {user.role} dashboard. Your role-specific features and permissions are displayed here.
            </p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.permissions.map((permission, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                    {permission.replace('_', ' ')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    You have access to this feature
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  function getRoleIcon(role: string) {
    switch (role) {
      case 'admin':
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 'manager':
        return <Star className="h-5 w-5 text-purple-500" />
      case 'waiter':
        return <Users className="h-5 w-5 text-blue-500" />
      case 'kitchen':
        return <Settings className="h-5 w-5 text-green-500" />
      case 'cashier':
        return <User className="h-5 w-5 text-orange-500" />
      default:
        return <User className="h-5 w-5 text-gray-500" />
    }
  }
}

export default function AuthenticationPage() {
  const { isAuthenticated } = useAuth()

  return (
    <AuthProvider>
      {isAuthenticated ? <Dashboard /> : <LoginForm />}
    </AuthProvider>
  )
}