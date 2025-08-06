'use client';

import { useState, useRef, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { 
  Camera, 
  Eye, 
  Smartphone, 
  Zap, 
  Star,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Info,
  Heart,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  Scan,
  Layers
} from 'lucide-react';

export default function ARMenuPage() {
  const { menuItems } = useRestaurantStore();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isARActive, setIsARActive] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'nutrition' | 'ingredients'>('3d');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock AR menu data
  const arMenuItems = [
    {
      id: 'ar-1',
      menuItemId: 'menu-1',
      name: 'Margherita Pizza',
      modelUrl: '/models/pizza-margherita.glb',
      thumbnailUrl: '/images/pizza-thumb.jpg',
      nutritionalOverlay: true,
      allergenHighlights: ['gluten', 'dairy'],
      viewCount: 1247,
      averageViewTime: 45,
      conversionRate: 78,
      nutrition: {
        calories: 320,
        protein: 14,
        carbs: 35,
        fat: 12,
        fiber: 3,
        sodium: 680
      },
      ingredients: [
        'Fresh mozzarella cheese',
        'San Marzano tomatoes',
        'Fresh basil leaves',
        'Extra virgin olive oil',
        'Pizza dough (wheat flour)',
        'Sea salt'
      ],
      preparationTime: '12-15 minutes',
      chefRecommendation: 'Our signature pizza made with authentic Italian ingredients'
    },
    {
      id: 'ar-2',
      menuItemId: 'menu-2',
      name: 'Grilled Salmon',
      modelUrl: '/models/salmon-grilled.glb',
      thumbnailUrl: '/images/salmon-thumb.jpg',
      nutritionalOverlay: true,
      allergenHighlights: ['fish'],
      viewCount: 892,
      averageViewTime: 38,
      conversionRate: 85,
      nutrition: {
        calories: 280,
        protein: 35,
        carbs: 8,
        fat: 12,
        fiber: 2,
        sodium: 420
      },
      ingredients: [
        'Fresh Atlantic salmon fillet',
        'Lemon herb seasoning',
        'Grilled vegetables',
        'Quinoa pilaf',
        'Olive oil',
        'Fresh herbs'
      ],
      preparationTime: '18-20 minutes',
      chefRecommendation: 'Perfectly grilled salmon with our signature herb blend'
    },
    {
      id: 'ar-3',
      menuItemId: 'menu-3',
      name: 'Chocolate Lava Cake',
      modelUrl: '/models/lava-cake.glb',
      thumbnailUrl: '/images/cake-thumb.jpg',
      nutritionalOverlay: true,
      allergenHighlights: ['gluten', 'dairy', 'eggs'],
      viewCount: 2156,
      averageViewTime: 52,
      conversionRate: 92,
      nutrition: {
        calories: 450,
        protein: 8,
        carbs: 55,
        fat: 22,
        fiber: 4,
        sodium: 280
      },
      ingredients: [
        'Dark chocolate (70% cocoa)',
        'Butter',
        'Eggs',
        'Sugar',
        'Flour',
        'Vanilla ice cream',
        'Fresh berries'
      ],
      preparationTime: '8-10 minutes',
      chefRecommendation: 'Warm chocolate cake with molten center, served with vanilla ice cream'
    }
  ];

  const [arItems, setArItems] = useState(arMenuItems);

  const startARCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsARActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to demo mode
      setIsARActive(true);
    }
  };

  const stopARCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsARActive(false);
  };

  const getAllergenColor = (allergen: string) => {
    const colors: { [key: string]: string } = {
      'gluten': 'bg-red-100 text-red-800',
      'dairy': 'bg-yellow-100 text-yellow-800',
      'nuts': 'bg-orange-100 text-orange-800',
      'fish': 'bg-blue-100 text-blue-800',
      'eggs': 'bg-purple-100 text-purple-800',
      'soy': 'bg-green-100 text-green-800'
    };
    return colors[allergen] || 'bg-gray-100 text-gray-800';
  };

  const totalViews = arItems.reduce((sum, item) => sum + item.viewCount, 0);
  const averageConversion = arItems.reduce((sum, item) => sum + item.conversionRate, 0) / arItems.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                📱 AR Menu Visualization
              </h1>
              <p className="text-gray-600">Immersive 3D menu experience with nutritional insights</p>
            </div>
          </div>
        </div>

        {/* AR Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total AR Views</p>
                <p className="text-2xl font-bold text-cyan-600">{totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Eye className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+34% this week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-blue-600">{averageConversion.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+12% improvement</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. View Time</p>
                <p className="text-2xl font-bold text-indigo-600">45s</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+8s longer</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-purple-600">4.9/5</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">Excellent rating</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AR Camera Interface */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">📸 AR Camera View</h2>
                <p className="text-gray-600">Point camera at menu items for 3D visualization</p>
              </div>
            </div>

            {/* Camera/AR Interface */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
              {isARActive ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* AR Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg text-center">
                      <Scan className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                      <p className="text-sm">Point camera at menu items</p>
                      <p className="text-xs text-gray-300">AR models will appear automatically</p>
                    </div>
                  </div>

                  {/* AR Controls */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                      <Layers className="h-5 w-5 text-white" />
                    </button>
                    <button className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                      <RotateCcw className="h-5 w-5 text-white" />
                    </button>
                    <button className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                      <Maximize className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  {/* Scanning Animation */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-32 h-32 border-2 border-cyan-400 rounded-lg animate-pulse">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">AR Camera Inactive</p>
                    <p className="text-sm text-gray-400 mb-4">Start AR to view 3D menu items</p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="flex justify-center gap-4">
              {!isARActive ? (
                <button
                  onClick={startARCamera}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-colors flex items-center gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Start AR Camera
                </button>
              ) : (
                <button
                  onClick={stopARCamera}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Stop AR Camera
                </button>
              )}
            </div>

            {/* View Mode Selector */}
            {isARActive && (
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === '3d' 
                      ? 'bg-cyan-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  3D Model
                </button>
                <button
                  onClick={() => setViewMode('nutrition')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'nutrition' 
                      ? 'bg-cyan-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Nutrition
                </button>
                <button
                  onClick={() => setViewMode('ingredients')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'ingredients' 
                      ? 'bg-cyan-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Ingredients
                </button>
              </div>
            )}
          </div>

          {/* AR Menu Items */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">🍽️ AR-Enhanced Menu</h2>
                <p className="text-gray-600">Interactive 3D menu items</p>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {arItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedItem?.id === item.id ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.chefRecommendation}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{item.viewCount}</span>
                    </div>
                  </div>

                  {/* Allergen Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.allergenHighlights.map((allergen) => (
                      <span 
                        key={allergen}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getAllergenColor(allergen)}`}
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>

                  {/* AR Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Avg. View Time</p>
                      <p className="font-semibold text-gray-900">{item.averageViewTime}s</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Conversion</p>
                      <p className="font-semibold text-green-600">{item.conversionRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prep Time</p>
                      <p className="font-semibold text-gray-900">{item.preparationTime}</p>
                    </div>
                  </div>

                  {selectedItem?.id === item.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {viewMode === 'nutrition' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Calories</p>
                            <p className="font-semibold text-orange-600">{item.nutrition.calories}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Protein</p>
                            <p className="font-semibold text-blue-600">{item.nutrition.protein}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Carbs</p>
                            <p className="font-semibold text-green-600">{item.nutrition.carbs}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Fat</p>
                            <p className="font-semibold text-purple-600">{item.nutrition.fat}g</p>
                          </div>
                        </div>
                      )}

                      {viewMode === 'ingredients' && (
                        <div className="space-y-1">
                          {item.ingredients.map((ingredient, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">{ingredient}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {viewMode === '3d' && (
                        <div className="text-center">
                          <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg p-4">
                            <Layers className="h-8 w-8 mx-auto mb-2 text-cyan-600" />
                            <p className="text-sm text-gray-700">3D model would appear here</p>
                            <p className="text-xs text-gray-500">Interactive 360° view with zoom and rotation</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AR Features Info */}
        <div className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-6 w-6 text-cyan-600" />
            <h3 className="text-lg font-bold text-gray-900">🚀 AR Technology Features</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📱 Real-time AR</h4>
              <p className="text-sm text-gray-600">Live camera feed with 3D model overlay and tracking</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🥗 Nutrition Overlay</h4>
              <p className="text-sm text-gray-600">Interactive nutritional information and allergen highlights</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🎯 Smart Recognition</h4>
              <p className="text-sm text-gray-600">AI-powered menu item detection and identification</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📊 Analytics</h4>
              <p className="text-sm text-gray-600">Track engagement, conversion rates, and customer preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}