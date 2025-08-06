'use client';

import { useState, useRef, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Volume2, 
  CheckCircle, 
  XCircle,
  Clock,
  MessageSquare,
  Waveform,
  Brain,
  Sparkles,
  Users,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';

export default function VoiceOrderingPage() {
  const { menuItems, addOrder } = useRestaurantStore();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processedOrder, setProcessedOrder] = useState<any>(null);
  const [confidence, setConfidence] = useState(0);
  const [voiceOrders, setVoiceOrders] = useState<any[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Mock voice orders data
  const mockVoiceOrders = [
    {
      id: 'voice-1',
      customerId: 'customer-1',
      tableNumber: 5,
      transcript: "Hi, I'd like to order two Margherita pizzas, one Caesar salad, and three Cokes please",
      processedOrder: {
        items: [
          { name: 'Margherita Pizza', quantity: 2, modifications: [] },
          { name: 'Caesar Salad', quantity: 1, modifications: [] },
          { name: 'Coca Cola', quantity: 3, modifications: [] }
        ],
        confidence: 94
      },
      status: 'confirmed' as const,
      createdAt: new Date(Date.now() - 300000)
    },
    {
      id: 'voice-2',
      customerId: 'customer-2',
      tableNumber: 3,
      transcript: "Can I get a burger with no onions, extra cheese, and a side of fries?",
      processedOrder: {
        items: [
          { name: 'Classic Burger', quantity: 1, modifications: ['no onions', 'extra cheese'] },
          { name: 'French Fries', quantity: 1, modifications: [] }
        ],
        confidence: 89
      },
      status: 'processing' as const,
      createdAt: new Date(Date.now() - 120000)
    },
    {
      id: 'voice-3',
      customerId: 'customer-3',
      tableNumber: 8,
      transcript: "I want the chicken pasta, but can you make it spicy? And a glass of white wine",
      processedOrder: {
        items: [
          { name: 'Chicken Alfredo', quantity: 1, modifications: ['make it spicy'] },
          { name: 'White Wine', quantity: 1, modifications: [] }
        ],
        confidence: 87
      },
      status: 'confirmed' as const,
      createdAt: new Date(Date.now() - 600000)
    }
  ];

  useEffect(() => {
    setVoiceOrders(mockVoiceOrders);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        processVoiceOrder();
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processVoiceOrder = () => {
    // Simulate AI processing
    setTimeout(() => {
      const mockTranscript = "I'd like to order one Margherita pizza and two Cokes please";
      const mockProcessedOrder = {
        items: [
          { name: 'Margherita Pizza', quantity: 1, modifications: [] },
          { name: 'Coca Cola', quantity: 2, modifications: [] }
        ],
        confidence: 92
      };

      setTranscript(mockTranscript);
      setProcessedOrder(mockProcessedOrder);
      setConfidence(92);
      setIsProcessing(false);
    }, 2000);
  };

  const confirmOrder = () => {
    if (processedOrder) {
      const newOrder = {
        id: `order-${Date.now()}`,
        tableNumber: 1,
        items: processedOrder.items.map((item: any, index: number) => ({
          id: `item-${index}`,
          menuItemId: `menu-${index}`,
          name: item.name,
          quantity: item.quantity,
          price: 12.99,
          modifications: item.modifications || []
        })),
        status: 'pending' as const,
        total: processedOrder.items.length * 12.99,
        createdAt: new Date(),
        waiterId: null
      };

      addOrder(newOrder);
      
      // Add to voice orders list
      const newVoiceOrder = {
        id: `voice-${Date.now()}`,
        tableNumber: 1,
        transcript,
        processedOrder,
        status: 'confirmed' as const,
        createdAt: new Date()
      };
      
      setVoiceOrders(prev => [newVoiceOrder, ...prev]);
      
      // Reset form
      setTranscript('');
      setProcessedOrder(null);
      setConfidence(0);
    }
  };

  const rejectOrder = () => {
    setTranscript('');
    setProcessedOrder(null);
    setConfidence(0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <Mic className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                🎤 Voice Ordering System
              </h1>
              <p className="text-gray-600">AI-powered voice recognition for seamless ordering</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Voice Orders Today</p>
                <p className="text-2xl font-bold text-indigo-600">47</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+23% from yesterday</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recognition Accuracy</p>
                <p className="text-2xl font-bold text-purple-600">94.2%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+2.1% improvement</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Order Time</p>
                <p className="text-2xl font-bold text-pink-600">45s</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-lg">
                <Clock className="h-6 w-6 text-pink-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">-15s faster</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-teal-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-teal-600">4.8/5</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <Sparkles className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">Excellent rating</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Recording Interface */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">🎙️ New Voice Order</h2>
                <p className="text-gray-600">Speak naturally to place an order</p>
              </div>
            </div>

            {/* Recording Interface */}
            <div className="text-center mb-6">
              <div className={`relative inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 ${
                isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-100'
              }`}>
                {isRecording ? (
                  <div className="flex items-center justify-center">
                    <Waveform className="h-12 w-12 text-red-500 animate-bounce" />
                  </div>
                ) : (
                  <Mic className={`h-12 w-12 ${isProcessing ? 'text-yellow-500' : 'text-gray-400'}`} />
                )}
                {isRecording && (
                  <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
                )}
              </div>

              <div className="space-y-3">
                {!isRecording && !isProcessing && (
                  <button
                    onClick={startRecording}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Mic className="h-5 w-5" />
                    Start Recording
                  </button>
                )}

                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <MicOff className="h-5 w-5" />
                    Stop Recording
                  </button>
                )}

                {isProcessing && (
                  <div className="flex items-center justify-center gap-2 text-yellow-600">
                    <Brain className="h-5 w-5 animate-spin" />
                    <span>AI is processing your order...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Transcript and Processed Order */}
            {transcript && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">📝 Transcript:</h3>
                  <p className="text-gray-700 italic">"{transcript}"</p>
                </div>

                {processedOrder && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">🤖 AI Processed Order:</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {confidence}% confidence
                      </span>
                    </div>
                    <div className="space-y-2">
                      {processedOrder.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-700">
                            {item.quantity}x {item.name}
                            {item.modifications && item.modifications.length > 0 && (
                              <span className="text-sm text-gray-500 ml-2">
                                ({item.modifications.join(', ')})
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={confirmOrder}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Confirm Order
                      </button>
                      <button
                        onClick={rejectOrder}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Voice Orders */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                <Volume2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">🎧 Recent Voice Orders</h2>
                <p className="text-gray-600">Latest AI-processed orders</p>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {voiceOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Table {order.tableNumber}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <p className="text-sm text-gray-700 italic">"{order.transcript}"</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Processed Items:</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {order.processedOrder.confidence}% confidence
                      </span>
                    </div>
                    {order.processedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="text-sm text-gray-600 ml-6">
                        • {item.quantity}x {item.name}
                        {item.modifications && item.modifications.length > 0 && (
                          <span className="text-gray-500 ml-1">
                            ({item.modifications.join(', ')})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Features Info */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-6 w-6 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">🚀 AI-Powered Features</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🎯 Smart Recognition</h4>
              <p className="text-sm text-gray-600">Advanced NLP understands natural speech patterns and context</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🔄 Auto-Correction</h4>
              <p className="text-sm text-gray-600">AI automatically corrects misheard items based on menu context</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📊 Learning System</h4>
              <p className="text-sm text-gray-600">Continuously improves accuracy based on customer feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}