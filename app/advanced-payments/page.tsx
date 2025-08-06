'use client'

import React, { useState } from 'react'
import { CreditCard, Smartphone, Wallet, Bitcoin, QrCode, CheckCircle, AlertCircle, Clock, Shield, Receipt, DollarSign } from 'lucide-react'

interface PaymentMethod {
  id: string
  name: string
  icon: React.ComponentType<any>
  description: string
  processingFee: number
  isEnabled: boolean
}

interface Transaction {
  id: string
  amount: number
  method: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  timestamp: Date
  orderId: string
  customerName?: string
  last4?: string
}

export default function AdvancedPaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)
  const [tipAmount, setTipAmount] = useState<number>(0)
  const [tipPercentage, setTipPercentage] = useState<number>(0)
  const [paymentStep, setPaymentStep] = useState<'amount' | 'method' | 'processing' | 'success' | 'failed'>('amount')
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [splitBill, setSplitBill] = useState<boolean>(false)
  const [splitCount, setSplitCount] = useState<number>(2)
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      amount: 45.67,
      method: 'Credit Card',
      status: 'completed',
      timestamp: new Date(Date.now() - 3600000),
      orderId: 'ORD-123456',
      customerName: 'John Doe',
      last4: '4242'
    },
    {
      id: 'TXN002',
      amount: 23.45,
      method: 'Apple Pay',
      status: 'completed',
      timestamp: new Date(Date.now() - 7200000),
      orderId: 'ORD-123457'
    },
    {
      id: 'TXN003',
      amount: 67.89,
      method: 'Bitcoin',
      status: 'pending',
      timestamp: new Date(Date.now() - 1800000),
      orderId: 'ORD-123458'
    }
  ])

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit-card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      processingFee: 2.9,
      isEnabled: true
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      icon: Smartphone,
      description: 'Quick and secure payment',
      processingFee: 2.5,
      isEnabled: true
    },
    {
      id: 'google-pay',
      name: 'Google Pay',
      icon: Smartphone,
      description: 'Pay with your Google account',
      processingFee: 2.5,
      isEnabled: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Wallet,
      description: 'Pay with your PayPal balance',
      processingFee: 3.5,
      isEnabled: true
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      icon: Bitcoin,
      description: 'Cryptocurrency payment',
      processingFee: 1.0,
      isEnabled: true
    },
    {
      id: 'qr-code',
      name: 'QR Code Payment',
      icon: QrCode,
      description: 'Scan to pay with mobile wallet',
      processingFee: 2.0,
      isEnabled: true
    }
  ]

  const tipPresets = [15, 18, 20, 25]

  const calculateTip = (percentage: number) => {
    const tip = (amount * percentage) / 100
    setTipAmount(tip)
    setTipPercentage(percentage)
  }

  const getTotalAmount = () => {
    return amount + tipAmount
  }

  const getSplitAmount = () => {
    return getTotalAmount() / splitCount
  }

  const processPayment = async () => {
    setPaymentStep('processing')
    
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.1 // 90% success rate
      if (success) {
        const newTransaction: Transaction = {
          id: `TXN${Date.now()}`,
          amount: getTotalAmount(),
          method: paymentMethods.find(m => m.id === selectedMethod)?.name || 'Unknown',
          status: 'completed',
          timestamp: new Date(),
          orderId: `ORD-${Date.now().toString().slice(-6)}`,
          customerName: cardDetails.name || undefined,
          last4: selectedMethod === 'credit-card' ? cardDetails.number.slice(-4) : undefined
        }
        setTransactions([newTransaction, ...transactions])
        setPaymentStep('success')
      } else {
        setPaymentStep('failed')
      }
    }, 3000)
  }

  const resetPayment = () => {
    setPaymentStep('amount')
    setSelectedMethod('')
    setAmount(0)
    setTipAmount(0)
    setTipPercentage(0)
    setCardDetails({ number: '', expiry: '', cvv: '', name: '' })
    setSplitBill(false)
    setSplitCount(2)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'refunded':
        return <AlertCircle className="h-5 w-5 text-gray-500" />
      default:
        return null
    }
  }

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Processing Payment</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we process your payment...</p>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Amount: <span className="font-bold">${getTotalAmount().toFixed(2)}</span></p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Method: <span className="font-bold">{paymentMethods.find(m => m.id === selectedMethod)?.name}</span></p>
          </div>
        </div>
      </div>
    )
  }

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center max-w-md w-full mx-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Your payment has been processed successfully.</p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Transaction Details</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                <span className="font-medium text-gray-900 dark:text-white">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Tip:</span>
                <span className="font-medium text-gray-900 dark:text-white">${tipAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t dark:border-gray-600 pt-1">
                <span className="text-gray-600 dark:text-gray-300">Total:</span>
                <span className="font-bold text-gray-900 dark:text-white">${getTotalAmount().toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={resetPayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Process Another Payment
          </button>
        </div>
      </div>
    )
  }

  if (paymentStep === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center max-w-md w-full mx-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Failed</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">There was an issue processing your payment. Please try again.</p>
          
          <div className="space-y-3">
            <button
              onClick={() => setPaymentStep('method')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={resetPayment}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Payment Processing</h1>
              <p className="text-gray-600 dark:text-gray-300">Multiple payment methods with secure processing</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            {/* Amount Entry */}
            {paymentStep === 'amount' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Enter Amount</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bill Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={amount || ''}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xl"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Tip Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add Tip</label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {tipPresets.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => calculateTip(preset)}
                        className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                          tipPercentage === preset
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {preset}%
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={tipAmount || ''}
                      onChange={(e) => {
                        const tip = parseFloat(e.target.value) || 0
                        setTipAmount(tip)
                        setTipPercentage(amount > 0 ? (tip / amount) * 100 : 0)
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Custom tip amount"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Split Bill Option */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={splitBill}
                      onChange={(e) => setSplitBill(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Split bill</span>
                  </label>
                  {splitBill && (
                    <div className="mt-2">
                      <input
                        type="number"
                        value={splitCount}
                        onChange={(e) => setSplitCount(parseInt(e.target.value) || 2)}
                        min="2"
                        max="10"
                        className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">people</span>
                    </div>
                  )}
                </div>

                {/* Total Display */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                      <span className="text-gray-900 dark:text-white">${amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Tip:</span>
                      <span className="text-gray-900 dark:text-white">${tipAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t dark:border-gray-600 pt-2">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-gray-900 dark:text-white">${getTotalAmount().toFixed(2)}</span>
                    </div>
                    {splitBill && (
                      <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
                        <span>Per person:</span>
                        <span>${getSplitAmount().toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setPaymentStep('method')}
                  disabled={amount <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Payment Method Selection */}
            {paymentStep === 'method' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Payment Method</h2>
                
                <div className="space-y-3 mb-6">
                  {paymentMethods.filter(method => method.isEnabled).map((method) => {
                    const Icon = method.icon
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full p-4 border-2 rounded-lg transition-all ${
                          selectedMethod === method.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="h-6 w-6 text-gray-600 dark:text-gray-300 mr-3" />
                          <div className="text-left flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">{method.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{method.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{method.processingFee}% fee</span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Card Details Form */}
                {selectedMethod === 'credit-card' && (
                  <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white">Card Details</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-6">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-sm text-green-800 dark:text-green-300">Your payment is secured with 256-bit SSL encryption</span>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setPaymentStep('amount')}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={processPayment}
                    disabled={!selectedMethod}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Pay ${getTotalAmount().toFixed(2)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
            
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    {getStatusIcon(transaction.status)}
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">${transaction.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{transaction.method}</p>
                      {transaction.last4 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">•••• {transaction.last4}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{transaction.status}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}