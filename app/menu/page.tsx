'use client';

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { MenuItem, OrderItem } from '@/types';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Plus, 
  Minus,
  Clock,
  Star,
  ChefHat,
  Utensils,
  Coffee,
  Cake,
  Receipt,
  CheckCircle,
  AlertCircle,
  Truck,
  Gamepad2,
  Shuffle,
  Target,
  Zap,
  Trophy,
  RotateCcw,
  Grid3X3,
  Hash,
  Palette,
  Calculator,
  Brain,
  Dice1
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CustomerMenuPage() {
  const { menuItems, addOrder, tables, orders } = useRestaurantStore();
  const searchParams = useSearchParams();
  const urlTableNumber = searchParams.get('table');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [gameData, setGameData] = useState<any>({});
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualTableNumber, setManualTableNumber] = useState<string>(urlTableNumber || '');
  const [showTableInput, setShowTableInput] = useState(!urlTableNumber);

  // Get the current table number (from URL or manual input)
  const currentTableNumber = urlTableNumber || manualTableNumber;

  // Get customer's orders for their table
  const customerOrders = orders.filter(order => 
    order.tableNumber === parseInt(currentTableNumber || '0') && 
    order.orderType === 'dine-in'
  ).sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime());

  // Games data
  const games = [
    {
      id: 'memory',
      name: 'Memory Match',
      description: 'Match pairs of food items',
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      id: 'trivia',
      name: 'Food Trivia',
      description: 'Test your culinary knowledge',
      icon: Zap,
      color: 'bg-green-500'
    },
    {
      id: 'word',
      name: 'Word Scramble',
      description: 'Unscramble food-related words',
      icon: Shuffle,
      color: 'bg-purple-500'
    },
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      description: 'Classic strategy game',
      icon: Grid3X3,
      color: 'bg-red-500'
    },
    {
      id: 'puzzle',
      name: 'Number Puzzle',
      description: 'Slide numbers to order',
      icon: Hash,
      color: 'bg-orange-500'
    },
    {
      id: 'colors',
      name: 'Color Match',
      description: 'Match the color names',
      icon: Palette,
      color: 'bg-pink-500'
    },
    {
      id: 'math',
      name: 'Quick Math',
      description: 'Solve math problems fast',
      icon: Calculator,
      color: 'bg-indigo-500'
    },
    {
      id: 'quiz',
      name: 'Food Quiz',
      description: 'Advanced culinary challenge',
      icon: Brain,
      color: 'bg-teal-500'
    },
    {
      id: 'dice',
      name: 'Dice Roll',
      description: 'Lucky number game',
      icon: Dice1,
      color: 'bg-yellow-500'
    }
  ];

  // Game logic functions
  const initializeGame = (gameId: string) => {
    setCurrentGame(gameId);
    setGameScore(0);
    setGameLevel(1);
    
    switch (gameId) {
      case 'memory':
        initializeMemoryGame();
        break;
      case 'trivia':
        initializeTriviaGame();
        break;
      case 'word':
        initializeWordGame();
        break;
      case 'tictactoe':
        initializeTicTacToeGame();
        break;
      case 'puzzle':
        initializePuzzleGame();
        break;
      case 'colors':
        initializeColorGame();
        break;
      case 'math':
        initializeMathGame();
        break;
      case 'quiz':
        initializeFoodQuizGame();
        break;
      case 'dice':
        initializeDiceGame();
        break;
    }
  };

  const initializeMemoryGame = () => {
    const foodItems = ['🍕', '🍔', '🍟', '🌮', '🍝', '🥗', '🍰', '🍦'];
    const cards = [...foodItems, ...foodItems].sort(() => Math.random() - 0.5);
    setGameData({
      cards,
      flipped: [],
      matched: [],
      moves: 0
    });
  };

  const initializeTriviaGame = () => {
    const questions = [
      {
        question: "Which spice is derived from the Crocus flower?",
        options: ["Turmeric", "Saffron", "Paprika", "Cumin"],
        correct: 1
      },
      {
        question: "What is the main ingredient in guacamole?",
        options: ["Tomato", "Avocado", "Lime", "Onion"],
        correct: 1
      },
      {
        question: "Which country is famous for inventing pizza?",
        options: ["France", "Spain", "Italy", "Greece"],
        correct: 2
      },
      {
        question: "What type of pastry is used to make profiteroles?",
        options: ["Puff pastry", "Shortcrust", "Choux pastry", "Filo"],
        correct: 2
      }
    ];
    setGameData({
      questions,
      currentQuestion: 0,
      selectedAnswer: null,
      showResult: false
    });
  };

  const initializeWordGame = () => {
    const words = [
      { word: 'RESTAURANT', scrambled: 'TNARUTSERA', hint: 'Place where you eat' },
      { word: 'DELICIOUS', scrambled: 'SIUOICLED', hint: 'Tastes great' },
      { word: 'KITCHEN', scrambled: 'NEHCTIK', hint: 'Where food is prepared' },
      { word: 'WAITER', scrambled: 'RETAIW', hint: 'Serves your food' },
      { word: 'MENU', scrambled: 'UNEM', hint: 'List of food items' }
    ];
    const currentWord = words[Math.floor(Math.random() * words.length)];
    setGameData({
      ...currentWord,
      userAnswer: '',
      showHint: false
    });
  };

  const initializeTicTacToeGame = () => {
    setGameData({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      gameOver: false
    });
  };

  const initializePuzzleGame = () => {
    const numbers = Array.from({ length: 8 }, (_, i) => i + 1);
    numbers.push(null); // Empty space
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    setGameData({
      board: shuffled,
      moves: 0,
      solved: false
    });
  };

  const initializeColorGame = () => {
    const colors = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'];
    const colorStyles = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500', 'text-orange-500'];
    const currentColor = colors[Math.floor(Math.random() * colors.length)];
    const displayStyle = colorStyles[Math.floor(Math.random() * colorStyles.length)];
    setGameData({
      targetColor: currentColor,
      displayColor: colors[Math.floor(Math.random() * colors.length)],
      displayStyle,
      streak: 0,
      timeLeft: 30
    });
  };

  const initializeMathGame = () => {
    const generateProblem = () => {
      const operations = ['+', '-', '*'];
      const operation = operations[Math.floor(Math.random() * operations.length)];
      let num1, num2, answer;
      
      switch (operation) {
        case '+':
          num1 = Math.floor(Math.random() * 50) + 1;
          num2 = Math.floor(Math.random() * 50) + 1;
          answer = num1 + num2;
          break;
        case '-':
          num1 = Math.floor(Math.random() * 50) + 25;
          num2 = Math.floor(Math.random() * 25) + 1;
          answer = num1 - num2;
          break;
        case '*':
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          answer = num1 * num2;
          break;
        default:
          num1 = 1; num2 = 1; answer = 2;
      }
      
      return { num1, num2, operation, answer };
    };

    setGameData({
      ...generateProblem(),
      userAnswer: '',
      streak: 0,
      timeLeft: 60
    });
  };

  const initializeFoodQuizGame = () => {
    const questions = [
      {
        question: "Which cooking technique involves cooking food slowly in fat at low temperature?",
        options: ["Braising", "Confit", "Poaching", "Steaming"],
        correct: 1
      },
      {
        question: "What is the mother sauce that forms the base for Hollandaise?",
        options: ["Béchamel", "Velouté", "Espagnole", "None - it's an emulsion"],
        correct: 3
      },
      {
        question: "Which knife cut produces 1/8 inch × 1/8 inch × 2 inch strips?",
        options: ["Julienne", "Brunoise", "Chiffonade", "Batonnet"],
        correct: 0
      },
      {
        question: "What temperature should beef reach for medium-rare doneness?",
        options: ["120°F", "130°F", "140°F", "150°F"],
        correct: 1
      },
      {
        question: "Which spice is known as 'black gold' and is the most expensive by weight?",
        options: ["Vanilla", "Cardamom", "Saffron", "Star Anise"],
        correct: 2
      }
    ];
    setGameData({
      questions,
      currentQuestion: 0,
      selectedAnswer: null,
      showResult: false,
      timeLeft: 15
    });
  };

  const initializeDiceGame = () => {
    setGameData({
      playerRoll: null,
      computerRoll: null,
      playerScore: 0,
      computerScore: 0,
      round: 1,
      gameOver: false,
      rolling: false
    });
  };

  const categories = [
    { id: 'all', name: 'All', icon: Utensils },
    { id: 'appetizers', name: 'Appetizers', icon: ChefHat },
    { id: 'mains', name: 'Main Courses', icon: Utensils },
    { id: 'desserts', name: 'Desserts', icon: Cake },
    { id: 'beverages', name: 'Beverages', icon: Coffee },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.isAvailable;
  });

  const addToCart = (menuItem: MenuItem) => {
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
    toast.success(`${menuItem.name} added to cart!`);
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

  const removeFromCart = (itemId: string) => {
    setCart(items => items.filter(item => item.id !== itemId));
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    return { subtotal, tax, total: subtotal + tax };
  };

  const submitOrder = async () => {
    if (!currentTableNumber) {
      toast.error('Please select a table number first');
      return;
    }

    if (cart.length === 0) {
      toast.error('Please add items to your order');
      return;
    }

    setIsSubmitting(true);

    try {
      const { subtotal, tax, total } = getCartTotal();

      const newOrder = {
        id: `order-${Date.now()}`,
        tableNumber: parseInt(currentTableNumber),
        customerName: customerInfo.name || undefined,
        customerPhone: customerInfo.phone || undefined,
        items: cart,
        status: 'pending' as const,
        orderType: 'dine-in' as const,
        totalAmount: total,
        tax,
        finalAmount: total,
        paymentStatus: 'pending' as const,
        orderTime: new Date(),
        estimatedTime: new Date(Date.now() + 30 * 60 * 1000),
        notes: customerInfo.notes || undefined,
      };

      addOrder(newOrder);

      // Reset form
      setCart([]);
      setCustomerInfo({ name: '', phone: '', notes: '' });
      setShowCart(false);
      
      // Hide table input after successful order
      if (!urlTableNumber) {
        setShowTableInput(false);
      }

      toast.success('Order submitted successfully! A waiter will be with you shortly.');
    } catch (error) {
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : Utensils;
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return AlertCircle;
      case 'confirmed':
        return Clock;
      case 'preparing':
        return ChefHat;
      case 'ready':
        return CheckCircle;
      case 'served':
        return Truck;
      default:
        return Receipt;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'preparing':
        return 'text-orange-600 bg-orange-100';
      case 'ready':
        return 'text-green-600 bg-green-100';
      case 'served':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Received';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Being Prepared';
      case 'ready':
        return 'Ready to Serve';
      case 'served':
        return 'Served';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Utensils className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Restaurant Menu</h1>
                {currentTableNumber && (
                  <p className="text-sm text-gray-600">Table {currentTableNumber}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Table Number Input/Display */}
              {showTableInput ? (
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Table:</label>
                  <select
                    value={manualTableNumber}
                    onChange={(e) => setManualTableNumber(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Table</option>
                    {tables.filter(table => table.status === 'available' || table.status === 'occupied').map((table) => (
                      <option key={table.id} value={table.number}>
                        Table {table.number} ({table.seats} seats)
                      </option>
                    ))}
                  </select>
                </div>
              ) : currentTableNumber && (
                <button
                  onClick={() => setShowTableInput(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 underline"
                >
                  Change Table
                </button>
              )}
              
              {/* Games Button */}
              {currentTableNumber && (
                <button
                  onClick={() => setShowGames(true)}
                  className="relative btn-secondary flex items-center"
                >
                  <Gamepad2 className="h-5 w-5 mr-2" />
                  Games
                </button>
              )}
              
              {/* Order Tracking Button */}
              {currentTableNumber && customerOrders.length > 0 && (
                <button
                  onClick={() => setShowOrders(true)}
                  className="relative btn-secondary flex items-center"
                >
                  <Receipt className="h-5 w-5 mr-2" />
                  My Orders
                  {customerOrders.filter(order => order.status !== 'served').length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {customerOrders.filter(order => order.status !== 'served').length}
                    </span>
                  )}
                </button>
              )}
              
              <button
                onClick={() => setShowCart(true)}
                className="relative btn-primary flex items-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Table Number Required Notice */}
        {!currentTableNumber && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Utensils className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-yellow-800">Table Number Required</h3>
                <p className="text-yellow-700 mt-1">
                  Please select your table number from the dropdown above to start ordering.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  disabled={!currentTableNumber}
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  disabled={!currentTableNumber}
                  className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } ${!currentTableNumber ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        {currentTableNumber ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                {/* Item Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <ChefHat className="h-16 w-16 text-primary-400" />
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-xl font-bold text-primary-600">${item.price}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {item.preparationTime} min
                    </div>
                    
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.5</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
                      {item.category}
                    </span>
                    
                    <button
                      onClick={() => addToCart(item)}
                      className="btn-primary flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select Your Table</h3>
            <p className="text-gray-600">Choose your table number from the dropdown above to view our menu and start ordering.</p>
          </div>
        )}

        {filteredMenuItems.length === 0 && currentTableNumber && (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Your Order</h3>
                  {currentTableNumber && (
                    <p className="text-sm text-gray-600">Table {currentTableNumber}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.menuItem.name}</h4>
                        <p className="text-sm text-gray-600">${item.price} each</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 border rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 border rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t">
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Your name (optional)"
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
                  <textarea
                    placeholder="Special requests or notes (optional)"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={2}
                  />
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${getCartTotal().subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${getCartTotal().tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${getCartTotal().total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={submitOrder}
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      {showOrders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">My Orders</h3>
                  <p className="text-sm text-gray-600">Table {currentTableNumber}</p>
                </div>
                <button
                  onClick={() => setShowOrders(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {customerOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No orders found for this table</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {customerOrders.map((order) => {
                    const StatusIcon = getOrderStatusIcon(order.status);
                    return (
                      <div key={order.id} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Order #{order.id.slice(-6)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(order.orderTime).toLocaleString()}
                            </p>
                          </div>
                          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                            <StatusIcon className="h-4 w-4 mr-2" />
                            {getOrderStatusText(order.status)}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">
                                {item.quantity}x {item.menuItem.name}
                              </span>
                              <span className="text-gray-600">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                          <div className="text-sm text-gray-600">
                            {order.estimatedTime && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Est. {new Date(order.estimatedTime).toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            Total: ${order.totalAmount.toFixed(2)}
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              <strong>Notes:</strong> {order.notes}
                            </p>
                          </div>
                        )}

                        {/* Order Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span>Order Received</span>
                            <span>Preparing</span>
                            <span>Ready</span>
                            <span>Served</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                order.status === 'pending' ? 'w-1/4 bg-yellow-500' :
                                order.status === 'confirmed' || order.status === 'preparing' ? 'w-2/4 bg-orange-500' :
                                order.status === 'ready' ? 'w-3/4 bg-green-500' :
                                order.status === 'served' ? 'w-full bg-gray-500' :
                                'w-1/4 bg-yellow-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="text-center text-sm text-gray-600">
                <p>Orders are updated in real-time. Your waiter will notify you when your order is ready!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Games Modal */}
      {showGames && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Gamepad2 className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {currentGame ? games.find(g => g.id === currentGame)?.name : 'Fun Games'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentGame ? `Score: ${gameScore} | Level: ${gameLevel}` : 'Play while you wait for your order!'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {currentGame && (
                    <button
                      onClick={() => setCurrentGame(null)}
                      className="btn-secondary text-sm flex items-center"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Back
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowGames(false);
                      setCurrentGame(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {!currentGame ? (
                // Game Selection Screen
                <div>
                  <div className="text-center mb-8">
                    <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Choose Your Game</h4>
                    <p className="text-gray-600">Have fun while waiting for your delicious order!</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {games.map((game) => {
                      const IconComponent = game.icon;
                      return (
                        <div
                          key={game.id}
                          onClick={() => initializeGame(game.id)}
                          className="bg-white border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-primary-300 hover:shadow-md transition-all"
                        >
                          <div className={`w-16 h-16 ${game.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <h5 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            {game.name}
                          </h5>
                          <p className="text-sm text-gray-600 text-center">
                            {game.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : currentGame === 'memory' ? (
                // Memory Game
                <div>
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Memory Match</h4>
                    <p className="text-gray-600 mb-4">Find matching pairs of food items!</p>
                    <div className="flex justify-center space-x-4 text-sm">
                      <span>Moves: {gameData.moves || 0}</span>
                      <span>Matched: {gameData.matched?.length || 0}/8</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                    {gameData.cards?.map((card: string, index: number) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (gameData.flipped?.length < 2 && !gameData.flipped?.includes(index) && !gameData.matched?.includes(index)) {
                            const newFlipped = [...(gameData.flipped || []), index];
                            setGameData(prev => ({ ...prev, flipped: newFlipped }));
                            
                            if (newFlipped.length === 2) {
                              setTimeout(() => {
                                const [first, second] = newFlipped;
                                if (gameData.cards[first] === gameData.cards[second]) {
                                  setGameData(prev => ({
                                    ...prev,
                                    matched: [...(prev.matched || []), first, second],
                                    flipped: [],
                                    moves: (prev.moves || 0) + 1
                                  }));
                                  setGameScore(prev => prev + 10);
                                } else {
                                  setGameData(prev => ({
                                    ...prev,
                                    flipped: [],
                                    moves: (prev.moves || 0) + 1
                                  }));
                                }
                              }, 1000);
                            }
                          }
                        }}
                        className={`aspect-square bg-primary-100 rounded-lg flex items-center justify-center text-2xl cursor-pointer hover:bg-primary-200 transition-colors ${
                          gameData.flipped?.includes(index) || gameData.matched?.includes(index) ? 'bg-white border-2 border-primary-300' : ''
                        }`}
                      >
                        {gameData.flipped?.includes(index) || gameData.matched?.includes(index) ? card : '?'}
                      </div>
                    ))}
                  </div>
                  
                  {gameData.matched?.length === 16 && (
                    <div className="text-center mt-6">
                      <h5 className="text-lg font-bold text-green-600 mb-2">Congratulations! 🎉</h5>
                      <p className="text-gray-600">You completed the game in {gameData.moves} moves!</p>
                      <button
                        onClick={() => initializeMemoryGame()}
                        className="btn-primary mt-4"
                      >
                        Play Again
                      </button>
                    </div>
                  )}
                </div>
              ) : currentGame === 'trivia' ? (
                // Trivia Game
                <div>
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Food Trivia</h4>
                    <p className="text-gray-600 mb-4">Test your culinary knowledge!</p>
                    <div className="text-sm text-gray-500">
                      Question {(gameData.currentQuestion || 0) + 1} of {gameData.questions?.length || 0}
                    </div>
                  </div>
                  
                  {gameData.questions && gameData.currentQuestion < gameData.questions.length ? (
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h5 className="text-lg font-semibold text-gray-900 mb-4">
                          {gameData.questions[gameData.currentQuestion].question}
                        </h5>
                        
                        <div className="space-y-3">
                          {gameData.questions[gameData.currentQuestion].options.map((option: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => {
                                setGameData(prev => ({ ...prev, selectedAnswer: index, showResult: true }));
                                if (index === gameData.questions[gameData.currentQuestion].correct) {
                                  setGameScore(prev => prev + 20);
                                }
                                setTimeout(() => {
                                  if (gameData.currentQuestion + 1 < gameData.questions.length) {
                                    setGameData(prev => ({
                                      ...prev,
                                      currentQuestion: prev.currentQuestion + 1,
                                      selectedAnswer: null,
                                      showResult: false
                                    }));
                                  }
                                }, 2000);
                              }}
                              disabled={gameData.showResult}
                              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                                gameData.showResult
                                  ? index === gameData.questions[gameData.currentQuestion].correct
                                    ? 'bg-green-100 border-green-300 text-green-800'
                                    : index === gameData.selectedAnswer
                                    ? 'bg-red-100 border-red-300 text-red-800'
                                    : 'bg-gray-100 border-gray-300'
                                  : 'bg-white border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h5 className="text-lg font-bold text-green-600 mb-2">Quiz Complete! 🎉</h5>
                      <p className="text-gray-600 mb-4">Final Score: {gameScore} points</p>
                      <button
                        onClick={() => initializeTriviaGame()}
                        className="btn-primary"
                      >
                        Play Again
                      </button>
                    </div>
                  )}
                </div>
              ) : currentGame === 'word' ? (
                // Word Scramble Game
                <div>
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Word Scramble</h4>
                    <p className="text-gray-600 mb-4">Unscramble the food-related word!</p>
                  </div>
                  
                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-4 tracking-wider">
                        {gameData.scrambled}
                      </div>
                      
                      <input
                        type="text"
                        value={gameData.userAnswer || ''}
                        onChange={(e) => setGameData(prev => ({ ...prev, userAnswer: e.target.value.toUpperCase() }))}
                        placeholder="Enter your answer..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-semibold uppercase focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      
                      <div className="flex justify-center space-x-3 mt-4">
                        <button
                          onClick={() => {
                            if (gameData.userAnswer === gameData.word) {
                              setGameScore(prev => prev + 15);
                              toast.success('Correct! 🎉');
                              setTimeout(() => initializeWordGame(), 1500);
                            } else {
                              toast.error('Try again!');
                            }
                          }}
                          className="btn-primary"
                        >
                          Submit
                        </button>
                        
                        <button
                          onClick={() => setGameData(prev => ({ ...prev, showHint: !prev.showHint }))}
                          className="btn-secondary"
                        >
                          {gameData.showHint ? 'Hide' : 'Show'} Hint
                        </button>
                        
                        <button
                          onClick={() => initializeWordGame()}
                          className="btn-secondary"
                        >
                          New Word
                        </button>
                      </div>
                      
                      {gameData.showHint && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Hint:</strong> {gameData.hint}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : currentGame === 'tictactoe' ? (
                // Tic Tac Toe Game
                <div>
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Tic Tac Toe</h4>
                    <p className="text-gray-600 mb-4">Classic strategy game - Get 3 in a row!</p>
                    <p className="text-sm text-gray-500">Current Player: {gameData.currentPlayer}</p>
                  </div>
                  
                  <div className="max-w-xs mx-auto">
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {gameData.board?.map((cell: string | null, index: number) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (!cell && !gameData.gameOver) {
                              const newBoard = [...gameData.board];
                              newBoard[index] = gameData.currentPlayer;
                              
                              // Check for winner
                              const checkWinner = (board: (string | null)[]) => {
                                const lines = [
                                  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                                  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                                  [0, 4, 8], [2, 4, 6] // diagonals
                                ];
                                for (let line of lines) {
                                  const [a, b, c] = line;
                                  if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                                    return board[a];
                                  }
                                }
                                return null;
                              };
                              
                              const winner = checkWinner(newBoard);
                              const isDraw = newBoard.every(cell => cell !== null);
                              
                              setGameData(prev => ({
                                ...prev,
                                board: newBoard,
                                currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X',
                                winner,
                                gameOver: winner || isDraw
                              }));
                              
                              if (winner === 'X') {
                                setGameScore(prev => prev + 30);
                                toast.success('You won! 🎉');
                              } else if (winner === 'O') {
                                toast.error('Computer won! Try again!');
                              } else if (isDraw) {
                                toast.info('It\'s a draw!');
                              }
                              
                              // Computer move
                              if (!winner && !isDraw && gameData.currentPlayer === 'X') {
                                setTimeout(() => {
                                  const emptyCells = newBoard.map((cell, i) => cell === null ? i : null).filter(i => i !== null);
                                  if (emptyCells.length > 0) {
                                    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                                    newBoard[randomIndex] = 'O';
                                    const computerWinner = checkWinner(newBoard);
                                    const computerDraw = newBoard.every(cell => cell !== null);
                                    
                                    setGameData(prev => ({
                                      ...prev,
                                      board: newBoard,
                                      currentPlayer: 'X',
                                      winner: computerWinner,
                                      gameOver: computerWinner || computerDraw
                                    }));
                                    
                                    if (computerWinner === 'O') {
                                      toast.error('Computer won! Try again!');
                                    } else if (computerDraw) {
                                      toast.info('It\'s a draw!');
                                    }
                                  }
                                }, 500);
                              }
                            }
                          }}
                          className={`aspect-square bg-white border-2 border-gray-300 rounded-lg text-3xl font-bold flex items-center justify-center hover:bg-gray-50 transition-colors ${
                            cell === 'X' ? 'text-blue-600' : cell === 'O' ? 'text-red-600' : ''
                          }`}
                          disabled={!!cell || gameData.gameOver}
                        >
                          {cell}
                        </button>
                      ))}
                    </div>
                    
                    {gameData.gameOver && (
                      <div className="text-center">
                        <button
                          onClick={() => initializeTicTacToeGame()}
                          className="btn-primary"
                        >
                          Play Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : currentGame === 'puzzle' ? (
                // Number Puzzle Game
                <div>
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Number Puzzle</h4>
                    <p className="text-gray-600 mb-4">Slide numbers to arrange 1-8 in order!</p>
                    <p className="text-sm text-gray-500">Moves: {gameData.moves}</p>
                  </div>
                  
                  <div className="max-w-xs mx-auto">
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {gameData.board?.map((number: number | null, index: number) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (number === null) return;
                            
                            const emptyIndex = gameData.board.indexOf(null);
                            const canMove = [
                              emptyIndex - 1, emptyIndex + 1, // horizontal
                              emptyIndex - 3, emptyIndex + 3  // vertical
                            ].includes(index) && 
                            !(emptyIndex % 3 === 0 && index === emptyIndex - 1) && 
                            !(emptyIndex % 3 === 2 && index === emptyIndex + 1);
                            
                            if (canMove) {
                              const newBoard = [...gameData.board];
                              [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
                              
                              const solved = newBoard.slice(0, 8).every((num, i) => num === i + 1);
                              
                              setGameData(prev => ({
                                ...prev,
                                board: newBoard,
                                moves: prev.moves + 1,
                                solved
                              }));
                              
                              if (solved) {
                                setGameScore(prev => prev + 50);
                                toast.success('Puzzle solved! 🎉');
                              }
                            }
                          }}
                          className={`aspect-square ${number ? 'bg-primary-500 text-white' : 'bg-gray-100'} rounded-lg text-2xl font-bold flex items-center justify-center hover:bg-primary-600 transition-colors`}
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                    
                    {gameData.solved && (
                      <div className="text-center">
                        <h5 className="text-lg font-bold text-green-600 mb-2">Congratulations! 🎉</h5>
                        <p className="text-gray-600 mb-4">Solved in {gameData.moves} moves!</p>
                        <button
                          onClick={() => initializePuzzleGame()}
                          className="btn-primary"
                        >
                          Play Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : currentGame === 'colors' ? (
                // Color Match Game
                <div>
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Color Match</h4>
                    <p className="text-gray-600 mb-4">Click if the word matches the color!</p>
                    <div className="text-sm text-gray-500">
                      Streak: {gameData.streak} | Time: {gameData.timeLeft}s
                    </div>
                  </div>
                  
                  <div className="max-w-md mx-auto text-center">
                    <div className="bg-gray-50 rounded-lg p-8 mb-6">
                      <div className="mb-6">
                        <p className="text-lg text-gray-600 mb-4">Does this word match its color?</p>
                        <div className={`text-6xl font-bold ${gameData.displayStyle}`}>
                          {gameData.displayColor}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Target: {gameData.targetColor}</p>
                      </div>
                      
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => {
                            const correct = gameData.displayColor === gameData.targetColor;
                            if (correct) {
                              setGameData(prev => ({ ...prev, streak: prev.streak + 1 }));
                              setGameScore(prev => prev + 10);
                              toast.success('Correct! 🎉');
                            } else {
                              setGameData(prev => ({ ...prev, streak: 0 }));
                              toast.error('Wrong! Try again!');
                            }
                            setTimeout(() => initializeColorGame(), 1000);
                          }}
                          className="btn-primary px-8"
                        >
                          YES
                        </button>
                        <button
                          onClick={() => {
                            const correct = gameData.displayColor !== gameData.targetColor;
                            if (correct) {
                              setGameData(prev => ({ ...prev, streak: prev.streak + 1 }));
                              setGameScore(prev => prev + 10);
                              toast.success('Correct! 🎉');
                            } else {
                              setGameData(prev => ({ ...prev, streak: 0 }));
                              toast.error('Wrong! Try again!');
                            }
                            setTimeout(() => initializeColorGame(), 1000);
                          }}
                          className="btn-secondary px-8"
                        >
                          NO
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : currentGame === 'math' ? (
                // Quick Math Game
                <div>
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Quick Math</h4>
                    <p className="text-gray-600 mb-4">Solve math problems as fast as you can!</p>
                    <div className="text-sm text-gray-500">
                      Streak: {gameData.streak} | Time: {gameData.timeLeft}s
                    </div>
                  </div>
                  
                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
                      <div className="text-4xl font-bold text-primary-600 mb-4">
                        {gameData.num1} {gameData.operation} {gameData.num2} = ?
                      </div>
                      
                      <input
                        type="number"
                        value={gameData.userAnswer || ''}
                        onChange={(e) => setGameData(prev => ({ ...prev, userAnswer: e.target.value }))}
                        placeholder="Your answer..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl font-semibold focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      
                      <button
                        onClick={() => {
                          if (parseInt(gameData.userAnswer) === gameData.answer) {
                            setGameData(prev => ({ ...prev, streak: prev.streak + 1 }));
                            setGameScore(prev => prev + 15);
                            toast.success('Correct! 🎉');
                            setTimeout(() => initializeMathGame(), 1000);
                          } else {
                            setGameData(prev => ({ ...prev, streak: 0 }));
                            toast.error(`Wrong! Answer was ${gameData.answer}`);
                            setTimeout(() => initializeMathGame(), 2000);
                          }
                        }}
                        className="btn-primary mt-4 w-full"
                      >
                        Submit Answer
                      </button>
                    </div>
                  </div>
                </div>
              ) : currentGame === 'quiz' ? (
                // Advanced Food Quiz Game
                <div>
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Advanced Food Quiz</h4>
                    <p className="text-gray-600 mb-4">Professional culinary knowledge test!</p>
                    <div className="text-sm text-gray-500">
                      Question {(gameData.currentQuestion || 0) + 1} of {gameData.questions?.length || 0} | Time: {gameData.timeLeft}s
                    </div>
                  </div>
                  
                  {gameData.questions && gameData.currentQuestion < gameData.questions.length ? (
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h5 className="text-lg font-semibold text-gray-900 mb-4">
                          {gameData.questions[gameData.currentQuestion].question}
                        </h5>
                        
                        <div className="space-y-3">
                          {gameData.questions[gameData.currentQuestion].options.map((option: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => {
                                setGameData(prev => ({ ...prev, selectedAnswer: index, showResult: true }));
                                if (index === gameData.questions[gameData.currentQuestion].correct) {
                                  setGameScore(prev => prev + 25);
                                }
                                setTimeout(() => {
                                  if (gameData.currentQuestion + 1 < gameData.questions.length) {
                                    setGameData(prev => ({
                                      ...prev,
                                      currentQuestion: prev.currentQuestion + 1,
                                      selectedAnswer: null,
                                      showResult: false,
                                      timeLeft: 15
                                    }));
                                  }
                                }, 2000);
                              }}
                              disabled={gameData.showResult}
                              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                                gameData.showResult
                                  ? index === gameData.questions[gameData.currentQuestion].correct
                                    ? 'bg-green-100 border-green-300 text-green-800'
                                    : index === gameData.selectedAnswer
                                    ? 'bg-red-100 border-red-300 text-red-800'
                                    : 'bg-gray-100 border-gray-300'
                                  : 'bg-white border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h5 className="text-lg font-bold text-green-600 mb-2">Quiz Complete! 🎉</h5>
                      <p className="text-gray-600 mb-4">Final Score: {gameScore} points</p>
                      <button
                        onClick={() => initializeFoodQuizGame()}
                        className="btn-primary"
                      >
                        Play Again
                      </button>
                    </div>
                  )}
                </div>
              ) : currentGame === 'dice' ? (
                // Dice Roll Game
                <div>
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Dice Roll Challenge</h4>
                    <p className="text-gray-600 mb-4">Roll higher than the computer to win!</p>
                    <div className="text-sm text-gray-500">
                      Round {gameData.round} | You: {gameData.playerScore} | Computer: {gameData.computerScore}
                    </div>
                  </div>
                  
                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <div className="flex justify-around items-center mb-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Your Roll</p>
                          <div className="w-20 h-20 bg-blue-500 rounded-lg flex items-center justify-center text-3xl font-bold text-white">
                            {gameData.playerRoll || '?'}
                          </div>
                        </div>
                        
                        <div className="text-2xl font-bold text-gray-400">VS</div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Computer Roll</p>
                          <div className="w-20 h-20 bg-red-500 rounded-lg flex items-center justify-center text-3xl font-bold text-white">
                            {gameData.computerRoll || '?'}
                          </div>
                        </div>
                      </div>
                      
                      {!gameData.gameOver && (
                        <button
                          onClick={() => {
                            setGameData(prev => ({ ...prev, rolling: true }));
                            
                            setTimeout(() => {
                              const playerRoll = Math.floor(Math.random() * 6) + 1;
                              const computerRoll = Math.floor(Math.random() * 6) + 1;
                              
                              let newPlayerScore = gameData.playerScore;
                              let newComputerScore = gameData.computerScore;
                              
                              if (playerRoll > computerRoll) {
                                newPlayerScore++;
                                setGameScore(prev => prev + 20);
                                toast.success(`You won this round! ${playerRoll} vs ${computerRoll}`);
                              } else if (computerRoll > playerRoll) {
                                newComputerScore++;
                                toast.error(`Computer won this round! ${computerRoll} vs ${playerRoll}`);
                              } else {
                                toast.info(`It's a tie! ${playerRoll} vs ${computerRoll}`);
                              }
                              
                              const gameOver = gameData.round >= 5;
                              
                              setGameData(prev => ({
                                ...prev,
                                playerRoll,
                                computerRoll,
                                playerScore: newPlayerScore,
                                computerScore: newComputerScore,
                                round: prev.round + 1,
                                rolling: false,
                                gameOver
                              }));
                              
                              if (gameOver) {
                                if (newPlayerScore > newComputerScore) {
                                  setGameScore(prev => prev + 50);
                                  toast.success('You won the game! 🎉');
                                } else if (newComputerScore > newPlayerScore) {
                                  toast.error('Computer won the game!');
                                } else {
                                  toast.info('It\'s a tie game!');
                                }
                              }
                            }, 1000);
                          }}
                          disabled={gameData.rolling}
                          className="btn-primary w-full"
                        >
                          {gameData.rolling ? 'Rolling...' : 'Roll Dice!'}
                        </button>
                      )}
                      
                      {gameData.gameOver && (
                        <div className="text-center mt-4">
                          <h5 className="text-lg font-bold mb-2">
                            {gameData.playerScore > gameData.computerScore ? 'You Won! 🎉' : 
                             gameData.computerScore > gameData.playerScore ? 'Computer Won!' : 'Tie Game!'}
                          </h5>
                          <p className="text-gray-600 mb-4">
                            Final Score: You {gameData.playerScore} - {gameData.computerScore} Computer
                          </p>
                          <button
                            onClick={() => initializeDiceGame()}
                            className="btn-primary"
                          >
                            Play Again
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="text-center text-sm text-gray-600">
                <p>🎮 Enjoy playing while your delicious order is being prepared! 🍽️</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}