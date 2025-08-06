'use client'

import React, { useState, useEffect } from 'react'
import { QrCode, Smartphone, Utensils, Clock, CheckCircle, Star, Plus, Minus, ShoppingCart, CreditCard, User, Phone, MapPin } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  allergens?: string[]
  spicyLevel?: number
  isVegetarian?: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
  preparationTime?: number
  rating?: number
  reviews?: number
}

interface CartItem extends MenuItem {
  quantity: number
  specialInstructions?: string
}

interface TableInfo {
  id: string
  number: number
  section: string
  capacity: number
}

export default function TableSideOrderingPage() {
  const [tableInfo, setTableInfo] = useState<TableInfo>({ id: '1', number: 12, section: 'Main Dining', capacity: 4 })
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' })
  const [orderStep, setOrderStep] = useState<'menu' | 'cart' | 'checkout' | 'confirmation'>('menu')
  const [orderNumber, setOrderNumber] = useState<string>('')

  // Sample menu data
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with lemon herb butter, served with roasted vegetables',
      price: 28.99,
      category: 'main',
      isGlutenFree: true,
      preparationTime: 20,
      rating: 4.8,
      reviews: 124
    },
    {
      id: '2',
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
      price: 18.99,
      category: 'main',
      isVegetarian: true,
      preparationTime: 15,
      rating: 4.6,
      reviews: 89
    },
    {
      id: '3',
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with parmesan, croutons, and Caesar dressing',
      price: 14.99,
      category: 'appetizer',
      isVegetarian: true,
      preparationTime: 10,
      rating: 4.4,
      reviews: 67
    },
    {
      id: '4',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
      price: 9.99,
      category: 'dessert',
      isVegetarian: true,
      preparationTime: 12,
      rating: 4.9,
      reviews: 156
    },
    {
      id: '5',
      name: 'Craft Beer',
      description: 'Local IPA with citrus notes',
      price: 6.99,
      category: 'beverage',
      preparationTime: 2,
      rating: 4.3,
      reviews: 45
    },
    {
      id: '6',
      name: 'Ribeye Steak',
      description: '12oz prime ribeye with garlic mashed potatoes and seasonal vegetables',
      price: 42.99,
      category: 'main',
      isGlutenFree: true,
      preparationTime: 25,
      rating: 4.9,
      reviews: 203
    }
  ]

  const categories = [
    { id: 'all', name: 'All Items', icon: Utensils },
    { id: 'appetizer', name: 'Appetizers', icon: Utensils },
    { id: 'main', name: 'Main Courses', icon: Utensils },
    { id: 'dessert', name: 'Desserts', icon: Utensils },
    { id: 'beverage', name: 'Beverages', icon: Utensils }
  ]

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.id !== id))
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const submitOrder = () => {
    const newOrderNumber = `ORD-${Date.now().toString().slice(-6)}`
    setOrderNumber(newOrderNumber)
    setOrderStep('confirmation')
    // Here you would typically send the order to your backend
    console.log('Order submitted:', {
      orderNumber: newOrderNumber,
      table: tableInfo,
      items: cart,
      customer: customerInfo,
      total: getTotalPrice()
    })
  }

  const startNewOrder = () => {
    setCart([])
    setCustomerInfo({ name: '', phone: '', email: '' })
    setOrderStep('menu')
    setOrderNumber('')
    setShowCart(false)
  }

  if (orderStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 dark:text-gray-300">Thank you for your order</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Order Number</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{orderNumber}</p>
          </div>
          
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Table:</span>
              <span className="font-medium text-gray-900 dark:text-white">{tableInfo.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Items:</span>
              <span className="font-medium text-gray-900 dark:text-white">{getTotalItems()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Total:</span>
              <span className="font-bold text-gray-900 dark:text-white">${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-blue-800 dark:text-blue-300 font-medium">Estimated Time</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">15-20 minutes</p>
          </div>
          
          <button
            onClick={startNewOrder}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Place Another Order
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <QrCode className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Table {tableInfo.number}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">{tableInfo.section} • {tableInfo.capacity} seats</p>
              </div>
            </div>
            
            {cart.length > 0 && (
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search and Categories */}
        <div className="mb-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid gap-4 mb-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-2">{item.name}</h3>
                    {item.isVegetarian && <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">Vegetarian</span>}
                    {item.isVegan && <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded ml-1">Vegan</span>}
                    {item.isGlutenFree && <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded ml-1">Gluten Free</span>}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{item.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {item.preparationTime} min
                    </div>
                    {item.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        {item.rating} ({item.reviews})
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end ml-4">
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-3">${item.price}</p>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Sidebar */}
        {showCart && cart.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowCart(false)}>
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Order</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b dark:border-gray-700">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total: ${getTotalPrice().toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setOrderStep('checkout')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {orderStep === 'checkout' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Details</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name (Optional)</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Order Summary</h3>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">{item.quantity}x {item.name}</span>
                    <span className="text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-gray-900 dark:text-white">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setOrderStep('menu')}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Back
                </button>
                <button
                  onClick={submitOrder}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}