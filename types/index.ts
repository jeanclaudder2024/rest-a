// Core Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier' | 'waiter' | 'chef';
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  ingredients: string[];
  allergens: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  expiryDate?: Date;
  lastRestocked: Date;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrder?: string;
  waiter?: string;
  reservedBy?: string;
  reservedTime?: Date;
}

export interface Order {
  id: string;
  tableNumber?: number;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  totalAmount: number;
  discount?: number;
  tax: number;
  finalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'digital';
  waiterId?: string;
  chefId?: string;
  orderTime: Date;
  estimatedTime?: Date;
  completedTime?: Date;
  notes?: string;
  claimedAt?: Date; // When the order was claimed
  deliveredBy?: string; // Waiter who delivered the order
  deliveredAt?: Date; // When the order was delivered
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  price: number;
  specialInstructions?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

export interface Recipe {
  id: string;
  menuItemId: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  preparationTime: number;
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
}

export interface RecipeIngredient {
  inventoryItemId: string;
  inventoryItem: InventoryItem;
  quantity: number;
  unit: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'inventory' | 'system' | 'payment';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  userId?: string;
  createdAt: Date;
  actionUrl?: string;
}

export interface SalesReport {
  id: string;
  date: Date;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: {
    menuItemId: string;
    menuItem: MenuItem;
    quantitySold: number;
    revenue: number;
  }[];
  hourlyBreakdown: {
    hour: number;
    orders: number;
    revenue: number;
  }[];
  paymentMethodBreakdown: {
    method: string;
    count: number;
    amount: number;
  }[];
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  tableId: string;
  date: Date;
  time: string;
  partySize: number;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';
  specialRequests?: string;
  createdAt: Date;
}

// Store State Types
export interface AppState {
  user: User | null;
  users: User[]; // All users in the system
  orders: Order[];
  menuItems: MenuItem[];
  inventory: InventoryItem[];
  tables: Table[];
  recipes: Recipe[];
  notifications: Notification[];
  reservations: Reservation[];
  currentShift: {
    startTime: Date;
    endTime?: Date;
    cashierId: string;
    openingAmount: number;
    closingAmount?: number;
  } | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface MenuItemForm {
  name: string;
  description: string;
  price: number;
  category: string;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
}

// Revolutionary AI-Powered Features
export interface AIInsights {
  id: string;
  type: 'demand_prediction' | 'price_optimization' | 'customer_behavior' | 'inventory_optimization' | 'staff_optimization';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  expectedROI: number;
  generatedAt: Date;
  status: 'new' | 'reviewed' | 'implemented' | 'dismissed';
  data: any;
}

export interface SmartMenuOptimization {
  id: string;
  menuItemId: string;
  currentPrice: number;
  suggestedPrice: number;
  priceChangeReason: string;
  expectedDemandChange: number;
  expectedRevenueChange: number;
  competitorAnalysis: {
    averagePrice: number;
    pricePosition: 'below' | 'at' | 'above';
  };
  seasonalFactors: string[];
  implementationDate?: Date;
}

export interface PredictiveAnalytics {
  id: string;
  type: 'sales_forecast' | 'inventory_demand' | 'staff_requirement' | 'customer_flow';
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  predictions: {
    date: Date;
    value: number;
    confidence: number;
    factors: string[];
  }[];
  accuracy: number;
  lastUpdated: Date;
}

export interface CustomerJourney {
  id: string;
  customerId: string;
  touchpoints: {
    timestamp: Date;
    type: 'website_visit' | 'reservation' | 'order' | 'feedback' | 'loyalty_redemption';
    details: any;
    satisfaction: number;
  }[];
  totalValue: number;
  averageVisitFrequency: number;
  preferredItems: string[];
  churnRisk: number; // 0-100
  nextBestAction: string;
}

export interface SmartInventoryAlert {
  id: string;
  itemId: string;
  alertType: 'low_stock' | 'overstock' | 'expiring_soon' | 'demand_spike' | 'supplier_issue';
  severity: 'info' | 'warning' | 'critical' | 'urgent';
  message: string;
  suggestedAction: string;
  estimatedImpact: number;
  autoResolution?: {
    action: string;
    scheduledFor: Date;
  };
  createdAt: Date;
  resolvedAt?: Date;
}

export interface DynamicPricing {
  id: string;
  menuItemId: string;
  basePrice: number;
  currentPrice: number;
  factors: {
    timeOfDay: number;
    dayOfWeek: number;
    weather: number;
    demand: number;
    inventory: number;
    competition: number;
  };
  priceHistory: {
    timestamp: Date;
    price: number;
    reason: string;
  }[];
  isActive: boolean;
}

export interface VoiceOrdering {
  id: string;
  customerId?: string;
  tableNumber?: number;
  transcript: string;
  processedOrder: {
    items: {
      name: string;
      quantity: number;
      modifications?: string[];
    }[];
    confidence: number;
  };
  status: 'processing' | 'confirmed' | 'rejected' | 'completed';
  audioUrl?: string;
  createdAt: Date;
}

export interface ARMenuVisualization {
  id: string;
  menuItemId: string;
  modelUrl: string;
  thumbnailUrl: string;
  nutritionalOverlay: boolean;
  allergenHighlights: string[];
  viewCount: number;
  averageViewTime: number;
  conversionRate: number;
}

export interface SocialMediaIntegration {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'tiktok';
  postId: string;
  content: string;
  mediaUrls: string[];
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
  };
  menuItemsMentioned: string[];
  sentiment: number; // -1 to 1
  generatedLeads: number;
  postedAt: Date;
}

export interface SmartTableManagement {
  id: string;
  tableId: string;
  occupancyPrediction: {
    timeSlot: Date;
    probability: number;
    expectedDuration: number;
  }[];
  optimizationSuggestions: string[];
  revenueOptimization: {
    currentRevenue: number;
    potentialRevenue: number;
    suggestions: string[];
  };
}

export interface KitchenAI {
  id: string;
  type: 'cooking_time_optimization' | 'quality_control' | 'recipe_suggestion' | 'waste_reduction';
  recommendations: {
    title: string;
    description: string;
    expectedBenefit: string;
    implementation: string;
  }[];
  performanceMetrics: {
    averageCookTime: number;
    qualityScore: number;
    wasteReduction: number;
    customerSatisfaction: number;
  };
  alerts: {
    type: 'quality_issue' | 'timing_delay' | 'ingredient_shortage';
    message: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}

export interface CompetitorAnalysis {
  id: string;
  competitorName: string;
  location: string;
  menuComparison: {
    itemName: string;
    ourPrice: number;
    theirPrice: number;
    priceDifference: number;
    qualityScore: number;
  }[];
  overallRating: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  lastUpdated: Date;
}

export interface SustainabilityTracking {
  id: string;
  carbonFootprint: {
    daily: number;
    monthly: number;
    yearly: number;
    trend: 'improving' | 'stable' | 'worsening';
  };
  wasteReduction: {
    percentage: number;
    savedCost: number;
    environmentalImpact: string;
  };
  sustainableSuppliers: number;
  certifications: string[];
  goals: {
    target: string;
    deadline: Date;
    progress: number;
  }[];
}

// Advanced Features Types
export interface WaitlistEntry {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  estimatedWaitTime: number; // in minutes
  actualWaitTime?: number;
  priority: 'normal' | 'high' | 'vip';
  status: 'waiting' | 'notified' | 'seated' | 'cancelled' | 'no_show';
  joinedAt: Date;
  notifiedAt?: Date;
  seatedAt?: Date;
  tableAssigned?: string;
  specialRequests?: string;
  loyaltyTier?: string;
  previousVisits: number;
}

export interface RecipeCostCalculation {
  id: string;
  recipeId: string;
  menuItemId: string;
  menuItem: MenuItem;
  ingredients: {
    inventoryItemId: string;
    inventoryItem: InventoryItem;
    quantity: number;
    unit: string;
    costPerUnit: number;
    totalCost: number;
  }[];
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  sellingPrice: number;
  profitMargin: number;
  profitPercentage: number;
  lastCalculated: Date;
  costTrends: {
    date: Date;
    totalCost: number;
    profitMargin: number;
  }[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  managerId: string;
  manager: User;
  isActive: boolean;
  openingHours: {
    [key: string]: { // day of week
      open: string;
      close: string;
      isClosed: boolean;
    };
  };
  capacity: number;
  tableCount: number;
  averageTicket: number;
  monthlyRevenue: number;
  performanceMetrics: {
    customerSatisfaction: number;
    averageWaitTime: number;
    tableUtilization: number;
    staffEfficiency: number;
  };
  createdAt: Date;
}

export interface MultiLocationReport {
  id: string;
  reportType: 'sales' | 'inventory' | 'staff' | 'customer_satisfaction';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  startDate: Date;
  endDate: Date;
  locations: {
    locationId: string;
    location: Location;
    metrics: {
      revenue: number;
      orders: number;
      averageTicket: number;
      customerCount: number;
      profitMargin: number;
    };
    ranking: number;
    performanceVsPrevious: number; // percentage change
  }[];
  totalRevenue: number;
  bestPerforming: string; // location id
  worstPerforming: string; // location id
  insights: string[];
  generatedAt: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'promotional' | 'loyalty' | 'birthday' | 'feedback_request' | 'newsletter' | 'reactivation';
  targetAudience: {
    customerTiers?: string[];
    lastVisitDays?: number; // customers who visited within X days
    totalSpentMin?: number;
    totalSpentMax?: number;
    favoriteCategories?: string[];
    birthdayMonth?: number;
  };
  scheduledDate?: Date;
  sentDate?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
    bounced: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    revenue: number;
  };
  createdBy: string;
  createdAt: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: 'promotional' | 'loyalty' | 'birthday' | 'feedback_request' | 'newsletter' | 'reactivation';
  subject: string;
  content: string;
  variables: string[]; // placeholders like {customerName}, {points}, etc.
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    visitFrequency?: 'frequent' | 'occasional' | 'rare';
    totalSpentMin?: number;
    totalSpentMax?: number;
    lastVisitDays?: number;
    loyaltyTier?: string[];
    favoriteCategories?: string[];
    averageOrderValue?: { min: number; max: number };
    demographics?: {
      ageMin?: number;
      ageMax?: number;
      location?: string[];
    };
  };
  customerCount: number;
  averageValue: number;
  engagementRate: number;
  churnRisk: number;
  recommendedCampaigns: string[];
  lastUpdated: Date;
}

export interface MarketingAutomation {
  id: string;
  name: string;
  trigger: {
    type: 'birthday' | 'first_visit' | 'loyalty_milestone' | 'inactive_customer' | 'high_spender' | 'feedback_request';
    conditions: any;
  };
  actions: {
    type: 'send_email' | 'send_sms' | 'add_points' | 'create_promotion';
    templateId?: string;
    delay?: number; // hours
    content?: any;
  }[];
  isActive: boolean;
  executionCount: number;
  successRate: number;
  revenue: number;
  createdAt: Date;
  lastExecuted?: Date;
}

// Enhanced Features Types
export interface CustomerFeedback {
  id: string;
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  rating: number; // 1-5 stars
  comment?: string;
  serviceRating: number;
  foodRating: number;
  ambianceRating: number;
  speedRating: number;
  createdAt: Date;
  isAnonymous: boolean;
  wouldRecommend: boolean;
}

export interface LoyaltyProgram {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  points: number;
  totalSpent: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinDate: Date;
  lastVisit: Date;
  visitCount: number;
  rewards: LoyaltyReward[];
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_item' | 'upgrade';
  value: number; // percentage for discount, item id for free item
  isActive: boolean;
  expiryDate?: Date;
}

export interface QRCode {
  id: string;
  tableNumber: number;
  qrCodeData: string;
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  isActive: boolean;
  paymentTerms: string;
  deliveryDays: string[];
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplier: Supplier;
  items: PurchaseOrderItem[];
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled';
  totalAmount: number;
  orderDate: Date;
  expectedDelivery: Date;
  actualDelivery?: Date;
  notes?: string;
}

export interface PurchaseOrderItem {
  id: string;
  inventoryItemId: string;
  inventoryItem: InventoryItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface WasteTracking {
  id: string;
  inventoryItemId: string;
  inventoryItem: InventoryItem;
  quantity: number;
  reason: 'expired' | 'damaged' | 'overcooked' | 'customer_return' | 'other';
  cost: number;
  reportedBy: string;
  reportedAt: Date;
  notes?: string;
}

export interface StaffSchedule {
  id: string;
  userId: string;
  user: User;
  date: Date;
  startTime: string;
  endTime: string;
  position: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'absent' | 'late';
  breakTime?: number; // minutes
  notes?: string;
}

export interface TimeClockEntry {
  id: string;
  userId: string;
  user: User;
  clockIn: Date;
  clockOut?: Date;
  breakStart?: Date;
  breakEnd?: Date;
  totalHours?: number;
  overtimeHours?: number;
  date: Date;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'free_item';
  value: number;
  minOrderAmount?: number;
  applicableItems?: string[]; // menu item IDs
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  customerTiers?: string[]; // loyalty tiers eligible
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  preferences: {
    dietaryRestrictions: string[];
    favoriteItems: string[];
    allergies: string[];
    spiceLevel: 'mild' | 'medium' | 'hot' | 'extra_hot';
  };
  orderHistory: string[]; // order IDs
  totalSpent: number;
  averageOrderValue: number;
  lastVisit: Date;
  createdAt: Date;
}

export interface ExpenseTracking {
  id: string;
  category: 'utilities' | 'rent' | 'supplies' | 'marketing' | 'maintenance' | 'other';
  description: string;
  amount: number;
  date: Date;
  vendor?: string;
  receiptUrl?: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
}

export interface FinancialReport {
  id: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  topExpenseCategories: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  revenueByCategory: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

// Enhanced AppState
export interface EnhancedAppState extends AppState {
  customerFeedbacks: CustomerFeedback[];
  loyaltyPrograms: LoyaltyProgram[];
  loyaltyRewards: LoyaltyReward[];
  qrCodes: QRCode[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  wasteTrackings: WasteTracking[];
  staffSchedules: StaffSchedule[];
  timeClockEntries: TimeClockEntry[];
  promotions: Promotion[];
  customerProfiles: CustomerProfile[];
  expenseTrackings: ExpenseTracking[];
  financialReports: FinancialReport[];
  
  // Revolutionary AI-Powered Features
  aiInsights: AIInsights[];
  smartMenuOptimizations: SmartMenuOptimization[];
  predictiveAnalytics: PredictiveAnalytics[];
  customerJourneys: CustomerJourney[];
  smartInventoryAlerts: SmartInventoryAlert[];
  dynamicPricing: DynamicPricing[];
  voiceOrders: VoiceOrdering[];
  arMenuVisualizations: ARMenuVisualization[];
  socialMediaIntegrations: SocialMediaIntegration[];
  smartTableManagement: SmartTableManagement[];
  kitchenAI: KitchenAI[];
  competitorAnalysis: CompetitorAnalysis[];
  sustainabilityTracking: SustainabilityTracking[];
  
  // Advanced Features
  waitlistEntries: WaitlistEntry[];
  recipeCostCalculations: RecipeCostCalculation[];
  locations: Location[];
  multiLocationReports: MultiLocationReport[];
  emailCampaigns: EmailCampaign[];
  emailTemplates: EmailTemplate[];
  customerSegments: CustomerSegment[];
  marketingAutomations: MarketingAutomation[];
}

export interface InventoryForm {
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  expiryDate?: string;
}

export interface OrderForm {
  tableNumber?: number;
  customerName?: string;
  customerPhone?: string;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  items: {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }[];
  notes?: string;
}