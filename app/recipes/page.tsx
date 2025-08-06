'use client';

import { useState } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { Recipe, RecipeIngredient, MenuItem, InventoryItem } from '@/types';
import { 
  ChefHat, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RecipePage() {
  const { 
    recipes, 
    menuItems, 
    inventoryItems, 
    orders,
    addRecipe, 
    updateRecipe, 
    deleteRecipe 
  } = useRestaurantStore();

  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedRecipeForAnalytics, setSelectedRecipeForAnalytics] = useState<Recipe | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructions: '',
    preparationTime: 0,
    cookingTime: 0,
    servings: 1,
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    category: '',
    ingredients: [] as RecipeIngredient[],
  });

  const categories = ['all', ...Array.from(new Set(recipes.map(recipe => recipe.category)))];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      instructions: '',
      preparationTime: 0,
      cookingTime: 0,
      servings: 1,
      difficulty: 'easy',
      category: '',
      ingredients: [],
    });
    setEditingRecipe(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.ingredients.length === 0) {
      toast.error('Please fill in all required fields and add at least one ingredient');
      return;
    }

    const recipeData = {
      ...formData,
      id: editingRecipe?.id || `recipe-${Date.now()}`,
      createdAt: editingRecipe?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (editingRecipe) {
      updateRecipe(editingRecipe.id, recipeData);
      toast.success('Recipe updated successfully!');
    } else {
      addRecipe(recipeData);
      toast.success('Recipe created successfully!');
    }

    resetForm();
    setShowForm(false);
  };

  const handleEdit = (recipe: Recipe) => {
    setFormData({
      name: recipe.name,
      description: recipe.description,
      instructions: recipe.instructions,
      preparationTime: recipe.preparationTime,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      category: recipe.category,
      ingredients: recipe.ingredients,
    });
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleDelete = (recipe: Recipe) => {
    if (confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      deleteRecipe(recipe.id);
      toast.success('Recipe deleted successfully!');
    }
  };

  const addIngredient = () => {
    const newIngredient: RecipeIngredient = {
      id: `ingredient-${Date.now()}`,
      inventoryItemId: '',
      quantity: 0,
      unit: 'g',
      notes: '',
    };
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient],
    }));
  };

  const updateIngredient = (index: number, field: keyof RecipeIngredient, value: any) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      ),
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const calculateRecipeCost = (recipe: Recipe) => {
    return recipe.ingredients.reduce((total, ingredient) => {
      const inventoryItem = inventoryItems.find(item => item.id === ingredient.inventoryItemId);
      if (inventoryItem) {
        const costPerUnit = inventoryItem.costPerUnit || 0;
        return total + (ingredient.quantity * costPerUnit);
      }
      return total;
    }, 0);
  };

  const getRecipeAnalytics = (recipe: Recipe) => {
    const menuItem = menuItems.find(item => item.name === recipe.name);
    if (!menuItem) return null;

    const orderItems = orders.flatMap(order => order.items)
      .filter(item => item.menuItemId === menuItem.id);
    
    const totalSold = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalRevenue = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const recipeCost = calculateRecipeCost(recipe);
    const profit = totalRevenue - (recipeCost * totalSold);
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    return {
      totalSold,
      totalRevenue,
      recipeCost,
      profit,
      profitMargin,
      menuItem,
    };
  };

  const checkIngredientAvailability = (recipe: Recipe) => {
    const unavailableIngredients = recipe.ingredients.filter(ingredient => {
      const inventoryItem = inventoryItems.find(item => item.id === ingredient.inventoryItemId);
      return !inventoryItem || inventoryItem.currentStock < ingredient.quantity;
    });
    
    return {
      isAvailable: unavailableIngredients.length === 0,
      unavailableIngredients,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </Link>
              <ChefHat className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Recipe Management</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="btn-secondary flex items-center"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Recipe
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ChefHat className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Recipes</p>
                <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Recipe Cost</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${recipes.length > 0 ? (recipes.reduce((sum, recipe) => sum + calculateRecipeCost(recipe), 0) / recipes.length).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Recipes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {recipes.filter(recipe => !checkIngredientAvailability(recipe).isAvailable).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => {
            const availability = checkIngredientAvailability(recipe);
            const analytics = getRecipeAnalytics(recipe);
            
            return (
              <div key={recipe.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{recipe.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedRecipeForAnalytics(recipe)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <TrendingUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(recipe)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(recipe)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {recipe.preparationTime + recipe.cookingTime} min
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {recipe.servings} servings
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      recipe.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {recipe.difficulty}
                    </span>
                    
                    <span className="text-sm font-medium text-gray-900">
                      Cost: ${calculateRecipeCost(recipe).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {recipe.category}
                    </span>
                    
                    <div className="flex items-center">
                      {!availability.isAvailable && (
                        <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" title="Low stock ingredients" />
                      )}
                      <span className="text-xs text-gray-500">
                        {recipe.ingredients.length} ingredients
                      </span>
                    </div>
                  </div>
                  
                  {analytics && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Sold:</span>
                          <span className="ml-1 font-medium">{analytics.totalSold}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Revenue:</span>
                          <span className="ml-1 font-medium">${analytics.totalRevenue.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Profit:</span>
                          <span className={`ml-1 font-medium ${analytics.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${analytics.profit.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Margin:</span>
                          <span className={`ml-1 font-medium ${analytics.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {analytics.profitMargin.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600">Create your first recipe to get started.</p>
          </div>
        )}
      </div>

      {/* Recipe Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingRecipe ? 'Edit Recipe' : 'New Recipe'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cook Time (min)
                  </label>
                  <input
                    type="number"
                    value={formData.cookingTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, cookingTime: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servings
                  </label>
                  <input
                    type="number"
                    value={formData.servings}
                    onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Ingredients *
                  </label>
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="btn-secondary text-sm flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Ingredient
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={ingredient.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4">
                        <select
                          value={ingredient.inventoryItemId}
                          onChange={(e) => updateIngredient(index, 'inventoryItemId', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select ingredient</option>
                          {inventoryItems.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={ingredient.quantity}
                          onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Qty"
                          step="0.1"
                          min="0"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={ingredient.unit}
                          onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                          <option value="ml">ml</option>
                          <option value="l">l</option>
                          <option value="pcs">pcs</option>
                          <option value="cups">cups</option>
                          <option value="tbsp">tbsp</option>
                          <option value="tsp">tsp</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={ingredient.notes || ''}
                          onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Notes"
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                  placeholder="Step-by-step cooking instructions..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  {editingRecipe ? 'Update Recipe' : 'Create Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recipe Analytics Modal */}
      {selectedRecipeForAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Recipe Analytics
              </h3>
              <button
                onClick={() => setSelectedRecipeForAnalytics(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedRecipeForAnalytics.name}</h4>
                <p className="text-sm text-gray-600">{selectedRecipeForAnalytics.description}</p>
              </div>

              {(() => {
                const analytics = getRecipeAnalytics(selectedRecipeForAnalytics);
                const availability = checkIngredientAvailability(selectedRecipeForAnalytics);
                
                return (
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Sales Performance</h5>
                      {analytics ? (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Total Sold:</span>
                            <span className="ml-2 font-medium">{analytics.totalSold}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Revenue:</span>
                            <span className="ml-2 font-medium">${analytics.totalRevenue.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Recipe Cost:</span>
                            <span className="ml-2 font-medium">${analytics.recipeCost.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Profit:</span>
                            <span className={`ml-2 font-medium ${analytics.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${analytics.profit.toFixed(2)}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600">Profit Margin:</span>
                            <span className={`ml-2 font-medium ${analytics.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {analytics.profitMargin.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No sales data available (not linked to menu item)</p>
                      )}
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Ingredient Availability</h5>
                      {availability.isAvailable ? (
                        <p className="text-sm text-green-600">All ingredients are available</p>
                      ) : (
                        <div>
                          <p className="text-sm text-orange-600 mb-2">Some ingredients are low in stock:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {availability.unavailableIngredients.map(ingredient => {
                              const inventoryItem = inventoryItems.find(item => item.id === ingredient.inventoryItemId);
                              return (
                                <li key={ingredient.id}>
                                  • {inventoryItem?.name} (need: {ingredient.quantity}{ingredient.unit}, have: {inventoryItem?.currentStock || 0})
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Recipe Details</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Preparation Time: {selectedRecipeForAnalytics.preparationTime} minutes</div>
                        <div>Cooking Time: {selectedRecipeForAnalytics.cookingTime} minutes</div>
                        <div>Servings: {selectedRecipeForAnalytics.servings}</div>
                        <div>Difficulty: {selectedRecipeForAnalytics.difficulty}</div>
                        <div>Ingredients: {selectedRecipeForAnalytics.ingredients.length}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}