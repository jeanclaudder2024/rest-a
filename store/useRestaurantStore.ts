import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  User, 
  Order, 
  MenuItem, 
  InventoryItem, 
  Table, 
  Recipe, 
  Notification, 
  Reservation,
  AppState,
  CustomerFeedback,
  LoyaltyProgram,
  LoyaltyReward,
  QRCode,
  Supplier,
  PurchaseOrder,
  WasteTracking,
  StaffSchedule,
  TimeClockEntry,
  Promotion,
  CustomerProfile,
  ExpenseTracking,
  FinancialReport,
  EnhancedAppState,
  WaitlistEntry,
  RecipeCostCalculation,
  Location,
  MultiLocationReport,
  EmailCampaign,
  EmailTemplate,
  CustomerSegment,
  MarketingAutomation
} from '@/types';

interface RestaurantStore extends EnhancedAppState {
  // User actions
  setUser: (user: User | null) => void;
  
  // Order actions
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  deleteOrder: (orderId: string) => void;
  claimOrder: (orderId: string, waiterId: string) => void;
  markOrderDelivered: (orderId: string, waiterId: string) => void;
  
  // Menu actions
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (itemId: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (itemId: string) => void;
  
  // Inventory actions
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (itemId: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (itemId: string) => void;
  updateStock: (itemId: string, quantity: number) => void;
  
  // Table actions
  updateTable: (tableId: string, updates: Partial<Table>) => void;
  
  // Recipe actions
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipeId: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (recipeId: string) => void;
  
  // Notification actions
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // Reservation actions
  addReservation: (reservation: Reservation) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;

  // Enhanced Features Actions
  
  // Customer Feedback actions
  addCustomerFeedback: (feedback: CustomerFeedback) => void;
  updateCustomerFeedback: (id: string, updates: Partial<CustomerFeedback>) => void;
  deleteCustomerFeedback: (id: string) => void;
  
  // Loyalty Program actions
  addLoyaltyProgram: (program: LoyaltyProgram) => void;
  updateLoyaltyProgram: (id: string, updates: Partial<LoyaltyProgram>) => void;
  addLoyaltyPoints: (customerId: string, points: number) => void;
  redeemLoyaltyReward: (customerId: string, rewardId: string) => void;
  
  // QR Code actions
  generateQRCode: (tableNumber: number) => void;
  updateQRCodeUsage: (qrCodeId: string) => void;
  
  // Supplier actions
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  // Purchase Order actions
  addPurchaseOrder: (order: PurchaseOrder) => void;
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (id: string) => void;
  
  // Waste Tracking actions
  addWasteTracking: (waste: WasteTracking) => void;
  updateWasteTracking: (id: string, updates: Partial<WasteTracking>) => void;
  deleteWasteTracking: (id: string) => void;
  
  // Staff Schedule actions
  addStaffSchedule: (schedule: StaffSchedule) => void;
  updateStaffSchedule: (id: string, updates: Partial<StaffSchedule>) => void;
  deleteStaffSchedule: (id: string) => void;
  
  // Time Clock actions
  clockIn: (userId: string) => void;
  clockOut: (userId: string) => void;
  startBreak: (userId: string) => void;
  endBreak: (userId: string) => void;
  
  // Promotion actions
  addPromotion: (promotion: Promotion) => void;
  updatePromotion: (id: string, updates: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  applyPromotion: (promotionId: string) => void;
  
  // Customer Profile actions
  addCustomerProfile: (profile: CustomerProfile) => void;
  updateCustomerProfile: (id: string, updates: Partial<CustomerProfile>) => void;
  deleteCustomerProfile: (id: string) => void;
  
  // Expense Tracking actions
  addExpenseTracking: (expense: ExpenseTracking) => void;
  updateExpenseTracking: (id: string, updates: Partial<ExpenseTracking>) => void;
  deleteExpenseTracking: (id: string) => void;
  
  // Financial Report actions
  generateFinancialReport: (period: 'daily' | 'weekly' | 'monthly' | 'yearly', startDate: Date, endDate: Date) => void;
  
  // Advanced Features Actions
  
  // Waitlist Management actions
  addWaitlistEntry: (entry: WaitlistEntry) => void;
  updateWaitlistEntry: (id: string, updates: Partial<WaitlistEntry>) => void;
  removeWaitlistEntry: (id: string) => void;
  notifyWaitlistCustomer: (id: string) => void;
  seatWaitlistCustomer: (id: string, tableId: string) => void;
  
  // Recipe Cost Calculator actions
  calculateRecipeCost: (recipeId: string) => void;
  updateRecipeCostCalculation: (id: string, updates: Partial<RecipeCostCalculation>) => void;
  
  // Multi-Location Management actions
  addLocation: (location: Location) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  generateMultiLocationReport: (reportType: 'sales' | 'inventory' | 'staff' | 'customer_satisfaction', period: 'daily' | 'weekly' | 'monthly' | 'quarterly') => void;
  
  // Email Marketing actions
  createEmailCampaign: (campaign: EmailCampaign) => void;
  updateEmailCampaign: (id: string, updates: Partial<EmailCampaign>) => void;
  sendEmailCampaign: (id: string) => void;
  deleteEmailCampaign: (id: string) => void;
  
  // Email Template actions
  addEmailTemplate: (template: EmailTemplate) => void;
  updateEmailTemplate: (id: string, updates: Partial<EmailTemplate>) => void;
  deleteEmailTemplate: (id: string) => void;
  
  // Customer Segmentation actions
  createCustomerSegment: (segment: CustomerSegment) => void;
  updateCustomerSegment: (id: string, updates: Partial<CustomerSegment>) => void;
  deleteCustomerSegment: (id: string) => void;
  refreshSegmentData: (id: string) => void;
  
  // Marketing Automation actions
  createMarketingAutomation: (automation: MarketingAutomation) => void;
  updateMarketingAutomation: (id: string, updates: Partial<MarketingAutomation>) => void;
  deleteMarketingAutomation: (id: string) => void;
  toggleMarketingAutomation: (id: string) => void;
  
  // Utility actions
  initializeStore: () => void;
}

export const useRestaurantStore = create<RestaurantStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        users: [],
        orders: [],
        menuItems: [],
        inventory: [],
        tables: [],
        recipes: [],
        notifications: [],
        reservations: [],
        currentShift: null,
        
        // Enhanced Features Initial State
        customerFeedbacks: [],
        loyaltyPrograms: [],
        loyaltyRewards: [],
        qrCodes: [],
        suppliers: [],
        purchaseOrders: [],
        wasteTrackings: [],
        staffSchedules: [],
        timeClockEntries: [],
        promotions: [],
        customerProfiles: [],
        expenseTrackings: [],
        financialReports: [],

        // AI-Powered Features Initial State
        aiInsights: [],
        smartMenuOptimizations: [],
        predictiveAnalytics: [],
        customerJourneys: [],
        smartInventoryAlerts: [],
        dynamicPricing: [],
        voiceOrders: [],
        arMenuVisualizations: [],
        socialMediaIntegrations: [],
        smartTableManagement: null,
        kitchenAI: [],
        competitorAnalysis: [],
        sustainabilityTracking: [],

        // Advanced Features Initial State
        waitlistEntries: [],
        recipeCostCalculations: [],
        locations: [],
        multiLocationReports: [],
        emailCampaigns: [],
        emailTemplates: [],
        customerSegments: [],
        marketingAutomations: [],

        // User actions
        setUser: (user) => set({ user }),

        // Order actions
        addOrder: (order) => set((state) => ({ 
          orders: [...state.orders, order] 
        })),
        
        claimOrder: (orderId, waiterId) => set((state) => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, waiterId, claimedAt: new Date() }
              : order
          )
        })),
        
        markOrderDelivered: (orderId, waiterId) => set((state) => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, deliveredBy: waiterId, deliveredAt: new Date() }
              : order
          )
        })),
        
        updateOrder: (orderId, updates) => set((state) => ({
          orders: state.orders.map(order => 
            order.id === orderId ? { ...order, ...updates } : order
          )
        })),
        
        deleteOrder: (orderId) => set((state) => ({
          orders: state.orders.filter(order => order.id !== orderId)
        })),

        // Menu actions
        addMenuItem: (item) => set((state) => ({ 
          menuItems: [...state.menuItems, item] 
        })),
        
        updateMenuItem: (itemId, updates) => set((state) => ({
          menuItems: state.menuItems.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          )
        })),
        
        deleteMenuItem: (itemId) => set((state) => ({
          menuItems: state.menuItems.filter(item => item.id !== itemId)
        })),

        // Inventory actions
        addInventoryItem: (item) => set((state) => ({ 
          inventory: [...state.inventory, item] 
        })),
        
        updateInventoryItem: (itemId, updates) => set((state) => ({
          inventory: state.inventory.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          )
        })),
        
        deleteInventoryItem: (itemId) => set((state) => ({
          inventory: state.inventory.filter(item => item.id !== itemId)
        })),
        
        updateStock: (itemId, quantity) => set((state) => ({
          inventory: state.inventory.map(item => 
            item.id === itemId 
              ? { ...item, currentStock: item.currentStock + quantity }
              : item
          )
        })),

        // Table actions
        updateTable: (tableId, updates) => set((state) => ({
          tables: state.tables.map(table => 
            table.id === tableId ? { ...table, ...updates } : table
          )
        })),

        // Recipe actions
        addRecipe: (recipe) => set((state) => ({ 
          recipes: [...state.recipes, recipe] 
        })),
        
        updateRecipe: (recipeId, updates) => set((state) => ({
          recipes: state.recipes.map(recipe => 
            recipe.id === recipeId ? { ...recipe, ...updates } : recipe
          )
        })),
        
        deleteRecipe: (recipeId) => set((state) => ({
          recipes: state.recipes.filter(recipe => recipe.id !== recipeId)
        })),

        // Notification actions
        addNotification: (notification) => set((state) => ({ 
          notifications: [notification, ...state.notifications] 
        })),
        
        markNotificationAsRead: (notificationId) => set((state) => ({
          notifications: state.notifications.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true } 
              : notification
          )
        })),
        
        clearNotifications: () => set({ notifications: [] }),

        // Reservation actions
        addReservation: (reservation) => set((state) => ({ 
          reservations: [...state.reservations, reservation] 
        })),
        
        updateReservation: (id, updates) => set((state) => ({
          reservations: state.reservations.map(reservation => 
            reservation.id === id ? { ...reservation, ...updates } : reservation
          )
        })),
        
        deleteReservation: (id) => set((state) => ({
          reservations: state.reservations.filter(reservation => reservation.id !== id)
        })),

        // Enhanced Features Actions
        
        // Customer Feedback actions
        addCustomerFeedback: (feedback) => set((state) => ({
          customerFeedbacks: [...state.customerFeedbacks, feedback]
        })),
        
        updateCustomerFeedback: (id, updates) => set((state) => ({
          customerFeedbacks: state.customerFeedbacks.map(feedback =>
            feedback.id === id ? { ...feedback, ...updates } : feedback
          )
        })),
        
        deleteCustomerFeedback: (id) => set((state) => ({
          customerFeedbacks: state.customerFeedbacks.filter(feedback => feedback.id !== id)
        })),
        
        // Loyalty Program actions
        addLoyaltyProgram: (program) => set((state) => ({
          loyaltyPrograms: [...state.loyaltyPrograms, program]
        })),
        
        updateLoyaltyProgram: (id, updates) => set((state) => ({
          loyaltyPrograms: state.loyaltyPrograms.map(program =>
            program.id === id ? { ...program, ...updates } : program
          )
        })),
        
        addLoyaltyPoints: (customerId, points) => set((state) => ({
          loyaltyPrograms: state.loyaltyPrograms.map(program =>
            program.customerId === customerId 
              ? { ...program, points: program.points + points, lastVisit: new Date() }
              : program
          )
        })),
        
        redeemLoyaltyReward: (customerId, rewardId) => set((state) => {
          const program = state.loyaltyPrograms.find(p => p.customerId === customerId);
          const reward = state.loyaltyRewards.find(r => r.id === rewardId);
          if (program && reward && program.points >= reward.pointsCost) {
            return {
              loyaltyPrograms: state.loyaltyPrograms.map(p =>
                p.customerId === customerId 
                  ? { ...p, points: p.points - reward.pointsCost }
                  : p
              )
            };
          }
          return state;
        }),
        
        // QR Code actions
        generateQRCode: (tableNumber) => set((state) => {
          const qrCode: QRCode = {
            id: `qr-${Date.now()}`,
            tableNumber,
            qrCodeData: `${window.location.origin}/menu?table=${tableNumber}`,
            isActive: true,
            createdAt: new Date(),
            usageCount: 0
          };
          return {
            qrCodes: [...state.qrCodes, qrCode]
          };
        }),
        
        updateQRCodeUsage: (qrCodeId) => set((state) => ({
          qrCodes: state.qrCodes.map(qr =>
            qr.id === qrCodeId 
              ? { ...qr, lastUsed: new Date(), usageCount: qr.usageCount + 1 }
              : qr
          )
        })),
        
        // Supplier actions
        addSupplier: (supplier) => set((state) => ({
          suppliers: [...state.suppliers, supplier]
        })),
        
        updateSupplier: (id, updates) => set((state) => ({
          suppliers: state.suppliers.map(supplier =>
            supplier.id === id ? { ...supplier, ...updates } : supplier
          )
        })),
        
        deleteSupplier: (id) => set((state) => ({
          suppliers: state.suppliers.filter(supplier => supplier.id !== id)
        })),
        
        // Purchase Order actions
        addPurchaseOrder: (order) => set((state) => ({
          purchaseOrders: [...state.purchaseOrders, order]
        })),
        
        updatePurchaseOrder: (id, updates) => set((state) => ({
          purchaseOrders: state.purchaseOrders.map(order =>
            order.id === id ? { ...order, ...updates } : order
          )
        })),
        
        deletePurchaseOrder: (id) => set((state) => ({
          purchaseOrders: state.purchaseOrders.filter(order => order.id !== id)
        })),
        
        // Waste Tracking actions
        addWasteTracking: (waste) => set((state) => ({
          wasteTrackings: [...state.wasteTrackings, waste]
        })),
        
        updateWasteTracking: (id, updates) => set((state) => ({
          wasteTrackings: state.wasteTrackings.map(waste =>
            waste.id === id ? { ...waste, ...updates } : waste
          )
        })),
        
        deleteWasteTracking: (id) => set((state) => ({
          wasteTrackings: state.wasteTrackings.filter(waste => waste.id !== id)
        })),
        
        // Staff Schedule actions
        addStaffSchedule: (schedule) => set((state) => ({
          staffSchedules: [...state.staffSchedules, schedule]
        })),
        
        updateStaffSchedule: (id, updates) => set((state) => ({
          staffSchedules: state.staffSchedules.map(schedule =>
            schedule.id === id ? { ...schedule, ...updates } : schedule
          )
        })),
        
        deleteStaffSchedule: (id) => set((state) => ({
          staffSchedules: state.staffSchedules.filter(schedule => schedule.id !== id)
        })),
        
        // Time Clock actions
        clockIn: (userId) => set((state) => {
          const entry: TimeClockEntry = {
            id: `clock-${Date.now()}`,
            userId,
            user: state.users.find(u => u.id === userId)!,
            clockIn: new Date(),
            date: new Date()
          };
          return {
            timeClockEntries: [...state.timeClockEntries, entry]
          };
        }),
        
        clockOut: (userId) => set((state) => ({
          timeClockEntries: state.timeClockEntries.map(entry => {
            if (entry.userId === userId && !entry.clockOut) {
              const clockOut = new Date();
              const totalHours = (clockOut.getTime() - entry.clockIn.getTime()) / (1000 * 60 * 60);
              return { ...entry, clockOut, totalHours };
            }
            return entry;
          })
        })),
        
        startBreak: (userId) => set((state) => ({
          timeClockEntries: state.timeClockEntries.map(entry =>
            entry.userId === userId && !entry.clockOut && !entry.breakStart
              ? { ...entry, breakStart: new Date() }
              : entry
          )
        })),
        
        endBreak: (userId) => set((state) => ({
          timeClockEntries: state.timeClockEntries.map(entry =>
            entry.userId === userId && entry.breakStart && !entry.breakEnd
              ? { ...entry, breakEnd: new Date() }
              : entry
          )
        })),
        
        // Promotion actions
        addPromotion: (promotion) => set((state) => ({
          promotions: [...state.promotions, promotion]
        })),
        
        updatePromotion: (id, updates) => set((state) => ({
          promotions: state.promotions.map(promotion =>
            promotion.id === id ? { ...promotion, ...updates } : promotion
          )
        })),
        
        deletePromotion: (id) => set((state) => ({
          promotions: state.promotions.filter(promotion => promotion.id !== id)
        })),
        
        applyPromotion: (promotionId) => set((state) => ({
          promotions: state.promotions.map(promotion =>
            promotion.id === promotionId
              ? { ...promotion, usageCount: promotion.usageCount + 1 }
              : promotion
          )
        })),
        
        // Customer Profile actions
        addCustomerProfile: (profile) => set((state) => ({
          customerProfiles: [...state.customerProfiles, profile]
        })),
        
        updateCustomerProfile: (id, updates) => set((state) => ({
          customerProfiles: state.customerProfiles.map(profile =>
            profile.id === id ? { ...profile, ...updates } : profile
          )
        })),
        
        deleteCustomerProfile: (id) => set((state) => ({
          customerProfiles: state.customerProfiles.filter(profile => profile.id !== id)
        })),
        
        // Expense Tracking actions
        addExpenseTracking: (expense) => set((state) => ({
          expenseTrackings: [...state.expenseTrackings, expense]
        })),
        
        updateExpenseTracking: (id, updates) => set((state) => ({
          expenseTrackings: state.expenseTrackings.map(expense =>
            expense.id === id ? { ...expense, ...updates } : expense
          )
        })),
        
        deleteExpenseTracking: (id) => set((state) => ({
          expenseTrackings: state.expenseTrackings.filter(expense => expense.id !== id)
        })),
        
        // Financial Report actions
        generateFinancialReport: (period, startDate, endDate) => set((state) => {
          const ordersInPeriod = state.orders.filter(order => {
            const orderDate = new Date(order.orderTime);
            return orderDate >= startDate && orderDate <= endDate;
          });
          
          const expensesInPeriod = state.expenseTrackings.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= endDate;
          });
          
          const revenue = ordersInPeriod.reduce((sum, order) => sum + order.finalAmount, 0);
          const expenses = expensesInPeriod.reduce((sum, expense) => sum + expense.amount, 0);
          const profit = revenue - expenses;
          const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
          
          const report: FinancialReport = {
            id: `report-${Date.now()}`,
            period,
            startDate,
            endDate,
            revenue,
            expenses,
            profit,
            profitMargin,
            topExpenseCategories: [],
            revenueByCategory: []
          };
          
          return {
            financialReports: [...state.financialReports, report]
          };
        }),

        // Advanced Features Actions
        
        // Waitlist Management actions
        addWaitlistEntry: (entry) => set((state) => ({
          waitlistEntries: [...state.waitlistEntries, entry]
        })),
        
        updateWaitlistEntry: (id, updates) => set((state) => ({
          waitlistEntries: state.waitlistEntries.map(entry =>
            entry.id === id ? { ...entry, ...updates } : entry
          )
        })),
        
        removeWaitlistEntry: (id) => set((state) => ({
          waitlistEntries: state.waitlistEntries.filter(entry => entry.id !== id)
        })),
        
        notifyWaitlistCustomer: (id) => set((state) => ({
          waitlistEntries: state.waitlistEntries.map(entry =>
            entry.id === id ? { ...entry, status: 'notified', notifiedAt: new Date() } : entry
          )
        })),
        
        seatWaitlistCustomer: (id, tableId) => set((state) => ({
          waitlistEntries: state.waitlistEntries.map(entry =>
            entry.id === id ? { ...entry, status: 'seated', seatedAt: new Date(), tableAssigned: tableId } : entry
          )
        })),
        
        // Recipe Cost Calculator actions
        calculateRecipeCost: (recipeId) => set((state) => {
          const recipe = state.recipes.find(r => r.id === recipeId);
          if (!recipe) return state;
          
          const menuItem = state.menuItems.find(m => m.id === recipe.menuItemId);
          if (!menuItem) return state;
          
          let totalCost = 0;
          const ingredients = recipe.ingredients.map(ingredient => {
            const inventoryItem = state.inventory.find(i => i.id === ingredient.inventoryItemId);
            if (!inventoryItem) return { ...ingredient, totalCost: 0 };
            
            const cost = ingredient.quantity * inventoryItem.costPerUnit;
            totalCost += cost;
            
            return {
              inventoryItemId: ingredient.inventoryItemId,
              inventoryItem: inventoryItem,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              costPerUnit: inventoryItem.costPerUnit,
              totalCost: cost
            };
          });
          
          const laborCost = 5.00; // Base labor cost
          const overheadCost = totalCost * 0.15; // 15% overhead
          const finalTotalCost = totalCost + laborCost + overheadCost;
          const profitMargin = menuItem.price - finalTotalCost;
          const profitPercentage = menuItem.price > 0 ? (profitMargin / menuItem.price) * 100 : 0;
          
          const calculation: RecipeCostCalculation = {
            id: `calc-${Date.now()}`,
            recipeId,
            menuItemId: recipe.menuItemId,
            menuItem,
            ingredients,
            laborCost,
            overheadCost,
            totalCost: finalTotalCost,
            sellingPrice: menuItem.price,
            profitMargin,
            profitPercentage,
            lastCalculated: new Date(),
            costTrends: []
          };
          
          return {
            recipeCostCalculations: [...state.recipeCostCalculations, calculation]
          };
        }),
        
        updateRecipeCostCalculation: (id, updates) => set((state) => ({
          recipeCostCalculations: state.recipeCostCalculations.map(calc =>
            calc.id === id ? { ...calc, ...updates } : calc
          )
        })),
        
        // Multi-Location Management actions
        addLocation: (location) => set((state) => ({
          locations: [...state.locations, location]
        })),
        
        updateLocation: (id, updates) => set((state) => ({
          locations: state.locations.map(location =>
            location.id === id ? { ...location, ...updates } : location
          )
        })),
        
        deleteLocation: (id) => set((state) => ({
          locations: state.locations.filter(location => location.id !== id)
        })),
        
        generateMultiLocationReport: (reportType, period) => set((state) => {
          const startDate = new Date();
          const endDate = new Date();
          
          // Calculate date range based on period
          switch (period) {
            case 'daily':
              startDate.setHours(0, 0, 0, 0);
              break;
            case 'weekly':
              startDate.setDate(startDate.getDate() - 7);
              break;
            case 'monthly':
              startDate.setMonth(startDate.getMonth() - 1);
              break;
            case 'quarterly':
              startDate.setMonth(startDate.getMonth() - 3);
              break;
          }
          
          const locationMetrics = state.locations.map((location, index) => ({
            locationId: location.id,
            location,
            metrics: {
              revenue: location.monthlyRevenue,
              orders: Math.floor(Math.random() * 100) + 50,
              averageTicket: location.averageTicket,
              customerCount: Math.floor(Math.random() * 200) + 100,
              profitMargin: Math.random() * 20 + 10
            },
            ranking: index + 1,
            performanceVsPrevious: (Math.random() - 0.5) * 20
          }));
          
          const totalRevenue = locationMetrics.reduce((sum, loc) => sum + loc.metrics.revenue, 0);
          const bestPerforming = locationMetrics.reduce((best, current) => 
            current.metrics.revenue > best.metrics.revenue ? current : best
          ).locationId;
          const worstPerforming = locationMetrics.reduce((worst, current) => 
            current.metrics.revenue < worst.metrics.revenue ? current : worst
          ).locationId;
          
          const report: MultiLocationReport = {
            id: `mlr-${Date.now()}`,
            reportType,
            period,
            startDate,
            endDate,
            locations: locationMetrics,
            totalRevenue,
            bestPerforming,
            worstPerforming,
            insights: [
              'Peak hours are between 7-9 PM across all locations',
              'Weekend performance is 25% higher than weekdays',
              'Customer satisfaction correlates with wait times'
            ],
            generatedAt: new Date()
          };
          
          return {
            multiLocationReports: [...state.multiLocationReports, report]
          };
        }),
        
        // Email Marketing actions
        createEmailCampaign: (campaign) => set((state) => ({
          emailCampaigns: [...state.emailCampaigns, campaign]
        })),
        
        updateEmailCampaign: (id, updates) => set((state) => ({
          emailCampaigns: state.emailCampaigns.map(campaign =>
            campaign.id === id ? { ...campaign, ...updates } : campaign
          )
        })),
        
        sendEmailCampaign: (id) => set((state) => ({
          emailCampaigns: state.emailCampaigns.map(campaign =>
            campaign.id === id ? { 
              ...campaign, 
              status: 'sent', 
              sentDate: new Date(),
              metrics: {
                ...campaign.metrics,
                sent: Math.floor(Math.random() * 1000) + 500,
                delivered: Math.floor(Math.random() * 950) + 450,
                opened: Math.floor(Math.random() * 400) + 200,
                clicked: Math.floor(Math.random() * 100) + 50
              }
            } : campaign
          )
        })),
        
        deleteEmailCampaign: (id) => set((state) => ({
          emailCampaigns: state.emailCampaigns.filter(campaign => campaign.id !== id)
        })),
        
        // Email Template actions
        addEmailTemplate: (template) => set((state) => ({
          emailTemplates: [...state.emailTemplates, template]
        })),
        
        updateEmailTemplate: (id, updates) => set((state) => ({
          emailTemplates: state.emailTemplates.map(template =>
            template.id === id ? { ...template, ...updates } : template
          )
        })),
        
        deleteEmailTemplate: (id) => set((state) => ({
          emailTemplates: state.emailTemplates.filter(template => template.id !== id)
        })),
        
        // Customer Segmentation actions
        createCustomerSegment: (segment) => set((state) => ({
          customerSegments: [...state.customerSegments, segment]
        })),
        
        updateCustomerSegment: (id, updates) => set((state) => ({
          customerSegments: state.customerSegments.map(segment =>
            segment.id === id ? { ...segment, ...updates } : segment
          )
        })),
        
        deleteCustomerSegment: (id) => set((state) => ({
          customerSegments: state.customerSegments.filter(segment => segment.id !== id)
        })),
        
        refreshSegmentData: (id) => set((state) => ({
          customerSegments: state.customerSegments.map(segment =>
            segment.id === id ? { 
              ...segment, 
              customerCount: Math.floor(Math.random() * 500) + 100,
              averageValue: Math.random() * 100 + 50,
              engagementRate: Math.random() * 100,
              churnRisk: Math.random() * 50,
              lastUpdated: new Date()
            } : segment
          )
        })),
        
        // Marketing Automation actions
        createMarketingAutomation: (automation) => set((state) => ({
          marketingAutomations: [...state.marketingAutomations, automation]
        })),
        
        updateMarketingAutomation: (id, updates) => set((state) => ({
          marketingAutomations: state.marketingAutomations.map(automation =>
            automation.id === id ? { ...automation, ...updates } : automation
          )
        })),
        
        deleteMarketingAutomation: (id) => set((state) => ({
          marketingAutomations: state.marketingAutomations.filter(automation => automation.id !== id)
        })),
        
        toggleMarketingAutomation: (id) => set((state) => ({
          marketingAutomations: state.marketingAutomations.map(automation =>
            automation.id === id ? { ...automation, isActive: !automation.isActive } : automation
          )
        })),

        // Initialize store with sample data
        initializeStore: () => {
          const sampleData = generateSampleData();
          set(sampleData);
        },
      }),
      {
        name: 'restaurant-store',
        partialize: (state) => ({
          user: state.user,
          menuItems: state.menuItems,
          inventory: state.inventory,
          tables: state.tables,
          recipes: state.recipes,
          reservations: state.reservations,
        }),
      }
    )
  )
);

// Generate sample data for development
function generateSampleData(): Partial<EnhancedAppState> {
  const users: User[] = [
    {
      id: 'waiter-1',
      name: 'Alice Johnson',
      email: 'alice@restaurant.com',
      role: 'waiter',
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: 'waiter-2',
      name: 'Bob Smith',
      email: 'bob@restaurant.com',
      role: 'waiter',
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: 'waiter-3',
      name: 'Carol Davis',
      email: 'carol@restaurant.com',
      role: 'waiter',
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: 'chef-1',
      name: 'David Wilson',
      email: 'david@restaurant.com',
      role: 'chef',
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: 'manager-1',
      name: 'Emma Brown',
      email: 'emma@restaurant.com',
      role: 'manager',
      isActive: true,
      createdAt: new Date(),
    },
  ];

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      price: 12.99,
      category: 'Pizza',
      isAvailable: true,
      preparationTime: 15,
      ingredients: ['Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'],
      allergens: ['Gluten', 'Dairy'],
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
      price: 8.99,
      category: 'Salads',
      isAvailable: true,
      preparationTime: 5,
      ingredients: ['Romaine Lettuce', 'Caesar Dressing', 'Croutons', 'Parmesan'],
      allergens: ['Dairy', 'Eggs'],
    },
    {
      id: '3',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with lemon herb seasoning',
      price: 18.99,
      category: 'Main Course',
      isAvailable: true,
      preparationTime: 20,
      ingredients: ['Salmon', 'Lemon', 'Herbs', 'Olive Oil'],
      allergens: ['Fish'],
    },
  ];

  const inventory: InventoryItem[] = [
    {
      id: '1',
      name: 'Tomato Sauce',
      category: 'Sauces',
      currentStock: 50,
      minStock: 10,
      maxStock: 100,
      unit: 'bottles',
      costPerUnit: 2.50,
      supplier: 'Fresh Foods Co.',
      lastRestocked: new Date(),
    },
    {
      id: '2',
      name: 'Mozzarella Cheese',
      category: 'Dairy',
      currentStock: 25,
      minStock: 5,
      maxStock: 50,
      unit: 'kg',
      costPerUnit: 8.00,
      supplier: 'Dairy Fresh Ltd.',
      lastRestocked: new Date(),
    },
    {
      id: '3',
      name: 'Salmon Fillet',
      category: 'Seafood',
      currentStock: 15,
      minStock: 3,
      maxStock: 30,
      unit: 'pieces',
      costPerUnit: 12.00,
      supplier: 'Ocean Fresh',
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      lastRestocked: new Date(),
    },
  ];

  const tables: Table[] = Array.from({ length: 12 }, (_, i) => ({
    id: `table-${i + 1}`,
    number: i + 1,
    capacity: i < 4 ? 2 : i < 8 ? 4 : 6,
    status: 'available' as const,
  }));

  // Enhanced Features Sample Data
  const customerFeedbacks: CustomerFeedback[] = [
    {
      id: 'feedback-1',
      customerId: 'customer-1',
      customerName: 'John Doe',
      orderId: 'order-1',
      rating: 5,
      comment: 'Excellent food and service! Will definitely come back.',
      category: 'service',
      date: new Date(),
      isResolved: false
    },
    {
      id: 'feedback-2',
      customerId: 'customer-2',
      customerName: 'Jane Smith',
      orderId: 'order-2',
      rating: 4,
      comment: 'Great pizza, but the wait time was a bit long.',
      category: 'food',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isResolved: true
    }
  ];

  const loyaltyPrograms: LoyaltyProgram[] = [
    {
      id: 'loyalty-1',
      customerId: 'customer-1',
      customerName: 'John Doe',
      points: 150,
      tier: 'Silver',
      joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastVisit: new Date()
    },
    {
      id: 'loyalty-2',
      customerId: 'customer-2',
      customerName: 'Jane Smith',
      points: 75,
      tier: 'Bronze',
      joinDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastVisit: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  const loyaltyRewards: LoyaltyReward[] = [
    {
      id: 'reward-1',
      name: 'Free Appetizer',
      description: 'Get any appetizer for free',
      pointsCost: 50,
      isActive: true,
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'reward-2',
      name: '10% Off Main Course',
      description: '10% discount on any main course',
      pointsCost: 100,
      isActive: true,
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    }
  ];

  const qrCodes: QRCode[] = [
    {
      id: 'qr-1',
      tableNumber: 1,
      qrCodeData: 'http://localhost:3000/menu?table=1',
      isActive: true,
      createdAt: new Date(),
      usageCount: 5,
      lastUsed: new Date()
    },
    {
      id: 'qr-2',
      tableNumber: 2,
      qrCodeData: 'http://localhost:3000/menu?table=2',
      isActive: true,
      createdAt: new Date(),
      usageCount: 3
    }
  ];

  const suppliers: Supplier[] = [
    {
      id: 'supplier-1',
      name: 'Fresh Foods Co.',
      contactPerson: 'Mike Johnson',
      email: 'mike@freshfoods.com',
      phone: '+1-555-0123',
      address: '123 Food Street, City, State 12345',
      category: 'Produce',
      isActive: true,
      rating: 4.5,
      paymentTerms: 'Net 30'
    },
    {
      id: 'supplier-2',
      name: 'Ocean Fresh Seafood',
      contactPerson: 'Sarah Wilson',
      email: 'sarah@oceanfresh.com',
      phone: '+1-555-0456',
      address: '456 Harbor Ave, Coastal City, State 67890',
      category: 'Seafood',
      isActive: true,
      rating: 4.8,
      paymentTerms: 'Net 15'
    }
  ];

  const purchaseOrders: PurchaseOrder[] = [
    {
      id: 'po-1',
      supplierId: 'supplier-1',
      supplier: suppliers[0],
      orderDate: new Date(),
      expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: 'pending',
      totalAmount: 250.00,
      items: [
        {
          id: 'poi-1',
          inventoryItemId: '1',
          inventoryItem: inventory[0],
          quantity: 20,
          unitPrice: 2.50,
          totalPrice: 50.00
        }
      ]
    }
  ];

  const wasteTrackings: WasteTracking[] = [
    {
      id: 'waste-1',
      itemName: 'Expired Lettuce',
      category: 'Produce',
      quantity: 2,
      unit: 'kg',
      reason: 'Expired',
      cost: 8.00,
      date: new Date(),
      reportedBy: 'chef-1'
    }
  ];

  const staffSchedules: StaffSchedule[] = [
    {
      id: 'schedule-1',
      userId: 'waiter-1',
      user: users[0],
      date: new Date(),
      startTime: '09:00',
      endTime: '17:00',
      position: 'Floor Service',
      isConfirmed: true
    },
    {
      id: 'schedule-2',
      userId: 'chef-1',
      user: users[3],
      date: new Date(),
      startTime: '10:00',
      endTime: '22:00',
      position: 'Kitchen',
      isConfirmed: true
    }
  ];

  const timeClockEntries: TimeClockEntry[] = [
    {
      id: 'clock-1',
      userId: 'waiter-1',
      user: users[0],
      date: new Date(),
      clockIn: new Date(Date.now() - 8 * 60 * 60 * 1000),
      clockOut: new Date(),
      totalHours: 8,
      breakStart: new Date(Date.now() - 4 * 60 * 60 * 1000),
      breakEnd: new Date(Date.now() - 3.5 * 60 * 60 * 1000)
    }
  ];

  const promotions: Promotion[] = [
    {
      id: 'promo-1',
      name: 'Happy Hour',
      description: '20% off all appetizers from 3-6 PM',
      type: 'percentage',
      value: 20,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      applicableItems: ['2'],
      usageCount: 15,
      maxUsage: 100
    }
  ];

  const customerProfiles: CustomerProfile[] = [
    {
      id: 'customer-1',
      name: 'John Doe',
      email: 'john@email.com',
      phone: '+1-555-1234',
      dateOfBirth: new Date('1985-06-15'),
      preferences: ['Vegetarian', 'No Spicy'],
      allergies: ['Nuts'],
      favoriteItems: ['2'],
      totalOrders: 12,
      totalSpent: 245.50,
      lastVisit: new Date(),
      joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    }
  ];

  const expenseTrackings: ExpenseTracking[] = [
    {
      id: 'expense-1',
      category: 'Utilities',
      description: 'Monthly electricity bill',
      amount: 450.00,
      date: new Date(),
      vendor: 'City Electric Company',
      paymentMethod: 'Bank Transfer',
      isRecurring: true,
      approvedBy: 'manager-1'
    },
    {
      id: 'expense-2',
      category: 'Supplies',
      description: 'Kitchen equipment maintenance',
      amount: 125.00,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      vendor: 'Kitchen Pro Services',
      paymentMethod: 'Credit Card',
      isRecurring: false,
      approvedBy: 'manager-1'
    }
  ];

  const financialReports: FinancialReport[] = [
    {
      id: 'report-1',
      period: 'monthly',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      revenue: 15750.00,
      expenses: 8200.00,
      profit: 7550.00,
      profitMargin: 47.9,
      topExpenseCategories: [
        { category: 'Food Costs', amount: 4500.00 },
        { category: 'Labor', amount: 2800.00 },
        { category: 'Utilities', amount: 900.00 }
      ],
      revenueByCategory: [
        { category: 'Pizza', amount: 6300.00 },
        { category: 'Main Course', amount: 5700.00 },
        { category: 'Salads', amount: 3750.00 }
      ]
    }
  ];

  // AI-Powered Features Sample Data
  const aiInsights = [
    {
      id: 'ai-1',
      type: 'demand_prediction',
      title: 'Peak Hour Prediction',
      description: 'Expected 40% increase in orders between 7-9 PM today',
      confidence: 0.92,
      impact: 'high',
      recommendation: 'Increase kitchen staff by 2 during peak hours',
      createdAt: new Date(),
      category: 'operations'
    },
    {
      id: 'ai-2',
      type: 'menu_optimization',
      title: 'Menu Item Performance',
      description: 'Caesar Salad showing 25% higher profit margin potential',
      confidence: 0.87,
      impact: 'medium',
      recommendation: 'Consider promoting Caesar Salad as daily special',
      createdAt: new Date(),
      category: 'menu'
    }
  ];

  const smartMenuOptimizations = [
    {
      id: 'opt-1',
      menuItemId: '2',
      menuItem: menuItems[1],
      currentPrice: 8.99,
      suggestedPrice: 9.49,
      expectedImpact: '+12% revenue',
      confidence: 0.89,
      reasoning: 'Market analysis shows 5% price increase acceptable for this category',
      createdAt: new Date()
    }
  ];

  const predictiveAnalytics = [
    {
      id: 'pred-1',
      type: 'sales_forecast',
      period: 'weekly',
      prediction: {
        revenue: 18500,
        orders: 245,
        avgOrderValue: 75.5
      },
      confidence: 0.91,
      factors: ['Historical data', 'Weather forecast', 'Local events'],
      createdAt: new Date()
    }
  ];

  const voiceOrders = [
    {
      id: 'voice-1',
      transcript: 'I would like one margherita pizza and a caesar salad please',
      processedOrder: {
        items: [
          { menuItemId: '1', quantity: 1 },
          { menuItemId: '2', quantity: 1 }
        ],
        total: 21.98
      },
      confidence: 0.95,
      status: 'processed',
      createdAt: new Date()
    }
  ];

  const socialMediaIntegrations = [
    {
      id: 'social-1',
      platform: 'instagram',
      metrics: {
        followers: 2450,
        engagement: 4.2,
        reach: 15600,
        impressions: 23400
      },
      recentPosts: [
        {
          id: 'post-1',
          content: 'Fresh salmon special tonight! 🐟',
          likes: 89,
          comments: 12,
          shares: 5
        }
      ],
      lastUpdated: new Date()
    }
  ];

  const sustainabilityTracking = [
    {
      id: 'sustain-1',
      category: 'waste_reduction',
      metric: 'food_waste',
      value: 12.5,
      unit: 'kg',
      target: 10,
      improvement: -15.2,
      period: 'weekly',
      date: new Date()
    },
    {
      id: 'sustain-2',
      category: 'energy_efficiency',
      metric: 'electricity_usage',
      value: 1250,
      unit: 'kWh',
      target: 1100,
      improvement: -8.5,
      period: 'monthly',
      date: new Date()
    }
  ];

  // Advanced Features Sample Data
  const waitlistEntries: WaitlistEntry[] = [
    {
      id: 'wait-1',
      customerName: 'John Smith',
      customerPhone: '+1-555-0123',
      customerEmail: 'john.smith@email.com',
      partySize: 4,
      preferredTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      specialRequests: 'Window table preferred',
      status: 'waiting',
      estimatedWaitTime: 45,
      notificationsSent: 0,
      joinedAt: new Date(),
      priority: 'normal'
    },
    {
      id: 'wait-2',
      customerName: 'Sarah Johnson',
      customerPhone: '+1-555-0456',
      customerEmail: 'sarah.j@email.com',
      partySize: 2,
      preferredTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      specialRequests: 'Anniversary dinner',
      status: 'waiting',
      estimatedWaitTime: 30,
      notificationsSent: 1,
      joinedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      priority: 'high'
    }
  ];

  const recipeCostCalculations: RecipeCostCalculation[] = [
    {
      id: 'recipe-cost-1',
      recipeId: '1',
      recipeName: 'Margherita Pizza',
      ingredients: [
        { name: 'Pizza Dough', quantity: 1, unit: 'piece', costPerUnit: 0.75, totalCost: 0.75 },
        { name: 'Tomato Sauce', quantity: 100, unit: 'ml', costPerUnit: 0.008, totalCost: 0.80 },
        { name: 'Mozzarella Cheese', quantity: 150, unit: 'g', costPerUnit: 0.012, totalCost: 1.80 },
        { name: 'Fresh Basil', quantity: 10, unit: 'g', costPerUnit: 0.05, totalCost: 0.50 }
      ],
      totalIngredientCost: 3.85,
      laborCost: 2.50,
      overheadCost: 1.25,
      totalCost: 7.60,
      sellingPrice: 12.99,
      profitMargin: 41.5,
      calculatedAt: new Date()
    },
    {
      id: 'recipe-cost-2',
      recipeId: '2',
      recipeName: 'Caesar Salad',
      ingredients: [
        { name: 'Romaine Lettuce', quantity: 200, unit: 'g', costPerUnit: 0.006, totalCost: 1.20 },
        { name: 'Parmesan Cheese', quantity: 50, unit: 'g', costPerUnit: 0.025, totalCost: 1.25 },
        { name: 'Caesar Dressing', quantity: 50, unit: 'ml', costPerUnit: 0.015, totalCost: 0.75 },
        { name: 'Croutons', quantity: 30, unit: 'g', costPerUnit: 0.008, totalCost: 0.24 }
      ],
      totalIngredientCost: 3.44,
      laborCost: 1.50,
      overheadCost: 0.75,
      totalCost: 5.69,
      sellingPrice: 8.99,
      profitMargin: 36.7,
      calculatedAt: new Date()
    }
  ];

  const locations: Location[] = [
    {
      id: 'loc-1',
      name: 'Downtown Branch',
      address: '123 Main Street, Downtown',
      phone: '+1-555-0100',
      email: 'downtown@restaurant.com',
      managerId: 'manager-1',
      isActive: true,
      openingHours: {
        monday: { open: '09:00', close: '22:00' },
        tuesday: { open: '09:00', close: '22:00' },
        wednesday: { open: '09:00', close: '22:00' },
        thursday: { open: '09:00', close: '22:00' },
        friday: { open: '09:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '21:00' }
      },
      capacity: 80,
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // 1 year ago
    },
    {
      id: 'loc-2',
      name: 'Mall Branch',
      address: '456 Shopping Center, Mall District',
      phone: '+1-555-0200',
      email: 'mall@restaurant.com',
      managerId: 'manager-2',
      isActive: true,
      openingHours: {
        monday: { open: '10:00', close: '21:00' },
        tuesday: { open: '10:00', close: '21:00' },
        wednesday: { open: '10:00', close: '21:00' },
        thursday: { open: '10:00', close: '21:00' },
        friday: { open: '10:00', close: '22:00' },
        saturday: { open: '10:00', close: '22:00' },
        sunday: { open: '11:00', close: '20:00' }
      },
      capacity: 60,
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) // 6 months ago
    }
  ];

  const multiLocationReports: MultiLocationReport[] = [
    {
      id: 'multi-report-1',
      period: 'monthly',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      locationData: [
        {
          locationId: 'loc-1',
          locationName: 'Downtown Branch',
          revenue: 25000,
          orders: 450,
          avgOrderValue: 55.56,
          expenses: 15000,
          profit: 10000,
          profitMargin: 40.0
        },
        {
          locationId: 'loc-2',
          locationName: 'Mall Branch',
          revenue: 18000,
          orders: 320,
          avgOrderValue: 56.25,
          expenses: 12000,
          profit: 6000,
          profitMargin: 33.3
        }
      ],
      totalRevenue: 43000,
      totalOrders: 770,
      totalProfit: 16000,
      avgProfitMargin: 37.2,
      topPerformingLocation: 'loc-1',
      generatedAt: new Date()
    }
  ];

  const emailTemplates: EmailTemplate[] = [
    {
      id: 'template-1',
      name: 'Welcome Email',
      subject: 'Welcome to Our Restaurant!',
      content: 'Thank you for joining us! Enjoy 10% off your first order.',
      type: 'welcome',
      isActive: true,
      createdAt: new Date()
    },
    {
      id: 'template-2',
      name: 'Birthday Special',
      subject: 'Happy Birthday! Special Offer Inside',
      content: 'Celebrate your birthday with us! Get a free dessert on your special day.',
      type: 'birthday',
      isActive: true,
      createdAt: new Date()
    }
  ];

  const customerSegments: CustomerSegment[] = [
    {
      id: 'segment-1',
      name: 'VIP Customers',
      description: 'High-value customers with frequent visits',
      criteria: {
        minOrderValue: 100,
        minVisits: 10,
        timeframe: 'monthly'
      },
      customerCount: 45,
      createdAt: new Date()
    },
    {
      id: 'segment-2',
      name: 'New Customers',
      description: 'Customers who joined in the last 30 days',
      criteria: {
        minOrderValue: 0,
        minVisits: 1,
        timeframe: 'monthly'
      },
      customerCount: 128,
      createdAt: new Date()
    }
  ];

  const emailCampaigns: EmailCampaign[] = [
    {
      id: 'campaign-1',
      name: 'Weekend Special Promotion',
      subject: 'Weekend Special: 20% Off All Pizzas!',
      templateId: 'template-1',
      segmentId: 'segment-1',
      status: 'sent',
      scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      recipientCount: 45,
      openRate: 68.9,
      clickRate: 24.4,
      conversionRate: 12.2,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'campaign-2',
      name: 'New Customer Welcome Series',
      subject: 'Welcome to Our Restaurant Family!',
      templateId: 'template-2',
      segmentId: 'segment-2',
      status: 'scheduled',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      recipientCount: 128,
      createdAt: new Date()
    }
  ];

  const marketingAutomations: MarketingAutomation[] = [
    {
      id: 'automation-1',
      name: 'Birthday Campaign',
      description: 'Automatically send birthday offers to customers',
      trigger: 'customer_birthday',
      templateId: 'template-2',
      isActive: true,
      conditions: {
        daysBeforeBirthday: 3,
        customerSegment: 'all'
      },
      metrics: {
        triggered: 15,
        sent: 14,
        opened: 9,
        clicked: 4,
        converted: 2
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'automation-2',
      name: 'Inactive Customer Re-engagement',
      description: 'Re-engage customers who haven\'t visited in 30 days',
      trigger: 'customer_inactive',
      templateId: 'template-1',
      isActive: true,
      conditions: {
        inactiveDays: 30,
        customerSegment: 'all'
      },
      metrics: {
        triggered: 25,
        sent: 23,
        opened: 12,
        clicked: 5,
        converted: 3
      },
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    }
  ];

  return {
    users,
    menuItems,
    inventory,
    tables,
    customerFeedbacks,
    loyaltyPrograms,
    loyaltyRewards,
    qrCodes,
    suppliers,
    purchaseOrders,
    wasteTrackings,
    staffSchedules,
    timeClockEntries,
    promotions,
    customerProfiles,
    expenseTrackings,
    financialReports,
    // AI-Powered Features
    aiInsights,
    smartMenuOptimizations,
    predictiveAnalytics,
    voiceOrders,
    socialMediaIntegrations,
    sustainabilityTracking,
    // Advanced Features
    waitlistEntries,
    recipeCostCalculations,
    locations,
    multiLocationReports,
    emailCampaigns,
    emailTemplates,
    customerSegments,
    marketingAutomations,
  };
}