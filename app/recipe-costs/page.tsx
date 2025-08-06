'use client';

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { RecipeCostCalculation, Recipe } from '@/types';
import { Calculator, DollarSign, TrendingUp, Plus, Edit, Trash2, Save } from 'lucide-react';

export default function RecipeCostPage() {
  const { 
    recipeCostCalculations, 
    recipes,
    addRecipeCostCalculation, 
    updateRecipeCostCalculation, 
    removeRecipeCostCalculation 
  } = useRestaurantStore();
  
  const [showCalculator, setShowCalculator] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCalculation, setNewCalculation] = useState({
    recipeId: '',
    recipeName: '',
    ingredients: [{ name: '', quantity: 0, unit: '', costPerUnit: 0, totalCost: 0 }],
    laborCost: 0,
    overheadCost: 0,
    sellingPrice: 0
  });

  const calculateTotals = (ingredients: any[], laborCost: number, overheadCost: number, sellingPrice: number) => {
    const totalIngredientCost = ingredients.reduce((sum, ing) => sum + ing.totalCost, 0);
    const totalCost = totalIngredientCost + laborCost + overheadCost;
    const profitMargin = sellingPrice > 0 ? ((sellingPrice - totalCost) / sellingPrice) * 100 : 0;
    
    return {
      totalIngredientCost,
      totalCost,
      profitMargin
    };
  };

  const handleIngredientChange = (index: number, field: string, value: any) => {
    const updatedIngredients = [...newCalculation.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    
    if (field === 'quantity' || field === 'costPerUnit') {
      updatedIngredients[index].totalCost = updatedIngredients[index].quantity * updatedIngredients[index].costPerUnit;
    }
    
    setNewCalculation({ ...newCalculation, ingredients: updatedIngredients });
  };

  const addIngredient = () => {
    setNewCalculation({
      ...newCalculation,
      ingredients: [...newCalculation.ingredients, { name: '', quantity: 0, unit: '', costPerUnit: 0, totalCost: 0 }]
    });
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = newCalculation.ingredients.filter((_, i) => i !== index);
    setNewCalculation({ ...newCalculation, ingredients: updatedIngredients });
  };

  const handleSaveCalculation = () => {
    const totals = calculateTotals(
      newCalculation.ingredients,
      newCalculation.laborCost,
      newCalculation.overheadCost,
      newCalculation.sellingPrice
    );

    const calculation: Omit<RecipeCostCalculation, 'id'> = {
      ...newCalculation,
      ...totals,
      calculatedAt: new Date()
    };

    if (editingId) {
      updateRecipeCostCalculation(editingId, calculation);
      setEditingId(null);
    } else {
      addRecipeCostCalculation(calculation);
    }

    setNewCalculation({
      recipeId: '',
      recipeName: '',
      ingredients: [{ name: '', quantity: 0, unit: '', costPerUnit: 0, totalCost: 0 }],
      laborCost: 0,
      overheadCost: 0,
      sellingPrice: 0
    });
    setShowCalculator(false);
  };

  const handleEditCalculation = (calculation: RecipeCostCalculation) => {
    setNewCalculation({
      recipeId: calculation.recipeId,
      recipeName: calculation.recipeName,
      ingredients: calculation.ingredients,
      laborCost: calculation.laborCost,
      overheadCost: calculation.overheadCost,
      sellingPrice: calculation.sellingPrice
    });
    setEditingId(calculation.id);
    setShowCalculator(true);
  };

  const averageProfitMargin = recipeCostCalculations.length > 0 
    ? recipeCostCalculations.reduce((sum, calc) => sum + calc.profitMargin, 0) / recipeCostCalculations.length 
    : 0;

  const totalRecipes = recipeCostCalculations.length;
  const highMarginRecipes = recipeCostCalculations.filter(calc => calc.profitMargin > 40).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recipe Cost Calculator</h1>
          <p className="text-gray-600 mt-2">Calculate ingredient costs and profit margins for your recipes</p>
        </div>
        <button
          onClick={() => setShowCalculator(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Calculation
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Recipes</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecipes}</p>
            </div>
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900">{averageProfitMargin.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Margin (>40%)</p>
              <p className="text-2xl font-bold text-gray-900">{highMarginRecipes}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue Potential</p>
              <p className="text-2xl font-bold text-gray-900">
                ${recipeCostCalculations.reduce((sum, calc) => sum + calc.sellingPrice, 0).toFixed(0)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recipe Cost Calculations */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recipe Cost Analysis</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingredient Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recipeCostCalculations.map((calculation) => (
                <tr key={calculation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{calculation.recipeName}</div>
                    <div className="text-sm text-gray-500">
                      {calculation.ingredients.length} ingredients
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${calculation.totalIngredientCost.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${calculation.totalCost.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      Labor: ${calculation.laborCost.toFixed(2)} | Overhead: ${calculation.overheadCost.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${calculation.sellingPrice.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      calculation.profitMargin > 40 
                        ? 'text-green-800 bg-green-100'
                        : calculation.profitMargin > 20
                        ? 'text-yellow-800 bg-yellow-100'
                        : 'text-red-800 bg-red-100'
                    }`}>
                      {calculation.profitMargin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCalculation(calculation)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeRecipeCostCalculation(calculation.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Recipe Cost' : 'Calculate Recipe Cost'}
            </h3>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipe Name *
                  </label>
                  <input
                    type="text"
                    value={newCalculation.recipeName}
                    onChange={(e) => setNewCalculation({ ...newCalculation, recipeName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCalculation.sellingPrice}
                    onChange={(e) => setNewCalculation({ ...newCalculation, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-medium text-gray-900">Ingredients</h4>
                  <button
                    onClick={addIngredient}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Ingredient
                  </button>
                </div>
                <div className="space-y-3">
                  {newCalculation.ingredients.map((ingredient, index) => (
                    <div key={index} className="grid grid-cols-6 gap-3 items-end">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={ingredient.name}
                          onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          step="0.01"
                          value={ingredient.quantity}
                          onChange={(e) => handleIngredientChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
                        <input
                          type="text"
                          value={ingredient.unit}
                          onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Cost/Unit</label>
                        <input
                          type="number"
                          step="0.001"
                          value={ingredient.costPerUnit}
                          onChange={(e) => handleIngredientChange(index, 'costPerUnit', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Total</label>
                        <input
                          type="text"
                          value={`$${ingredient.totalCost.toFixed(2)}`}
                          readOnly
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                        />
                      </div>
                      <div>
                        <button
                          onClick={() => removeIngredient(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Labor and Overhead */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Labor Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCalculation.laborCost}
                    onChange={(e) => setNewCalculation({ ...newCalculation, laborCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overhead Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCalculation.overheadCost}
                    onChange={(e) => setNewCalculation({ ...newCalculation, overheadCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-3">Cost Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex justify-between">
                      <span>Ingredient Cost:</span>
                      <span>${calculateTotals(newCalculation.ingredients, newCalculation.laborCost, newCalculation.overheadCost, newCalculation.sellingPrice).totalIngredientCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor Cost:</span>
                      <span>${newCalculation.laborCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overhead Cost:</span>
                      <span>${newCalculation.overheadCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Cost:</span>
                      <span>${calculateTotals(newCalculation.ingredients, newCalculation.laborCost, newCalculation.overheadCost, newCalculation.sellingPrice).totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>Selling Price:</span>
                      <span>${newCalculation.sellingPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profit:</span>
                      <span>${(newCalculation.sellingPrice - calculateTotals(newCalculation.ingredients, newCalculation.laborCost, newCalculation.overheadCost, newCalculation.sellingPrice).totalCost).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Profit Margin:</span>
                      <span className={calculateTotals(newCalculation.ingredients, newCalculation.laborCost, newCalculation.overheadCost, newCalculation.sellingPrice).profitMargin > 40 ? 'text-green-600' : calculateTotals(newCalculation.ingredients, newCalculation.laborCost, newCalculation.overheadCost, newCalculation.sellingPrice).profitMargin > 20 ? 'text-yellow-600' : 'text-red-600'}>
                        {calculateTotals(newCalculation.ingredients, newCalculation.laborCost, newCalculation.overheadCost, newCalculation.sellingPrice).profitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCalculator(false);
                  setEditingId(null);
                  setNewCalculation({
                    recipeId: '',
                    recipeName: '',
                    ingredients: [{ name: '', quantity: 0, unit: '', costPerUnit: 0, totalCost: 0 }],
                    laborCost: 0,
                    overheadCost: 0,
                    sellingPrice: 0
                  });
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCalculation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update' : 'Save'} Calculation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}