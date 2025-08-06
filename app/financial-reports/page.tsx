'use client';

import { useState } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { FinancialReport } from '@/types';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  Calendar,
  Download,
  FileText,
  Calculator,
  Target,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function FinancialReportsPage() {
  const { financialReports, generateFinancialReport } = useRestaurantStore();
  
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  // Get current report based on selected period
  const currentReport = financialReports.find(report => 
    report.period === selectedPeriod && 
    report.year === selectedYear && 
    (selectedPeriod === 'yearly' || report.month === selectedMonth)
  );

  // Get previous period for comparison
  const getPreviousReport = () => {
    if (selectedPeriod === 'monthly') {
      const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
      const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
      return financialReports.find(report => 
        report.period === 'monthly' && 
        report.year === prevYear && 
        report.month === prevMonth
      );
    } else {
      return financialReports.find(report => 
        report.period === 'yearly' && 
        report.year === selectedYear - 1
      );
    }
  };

  const previousReport = getPreviousReport();

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4" />;
    if (change < 0) return <ArrowDown className="w-4 h-4" />;
    return null;
  };

  const handleGenerateReport = () => {
    generateFinancialReport(selectedPeriod as 'monthly' | 'yearly', selectedYear, selectedMonth);
  };

  const exportReport = () => {
    if (!currentReport) return;
    
    const reportData = {
      period: currentReport.period,
      year: currentReport.year,
      month: currentReport.month,
      revenue: currentReport.revenue,
      expenses: currentReport.expenses,
      profit: currentReport.profit,
      profitMargin: currentReport.profitMargin,
      revenueByCategory: currentReport.revenueByCategory,
      expensesByCategory: currentReport.expensesByCategory,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${currentReport.period}-${currentReport.year}${currentReport.month ? `-${currentReport.month}` : ''}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Reports</h1>
              <p className="text-gray-600">Comprehensive financial analysis and reporting</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateReport}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Generate Report
              </button>
              {currentReport && (
                <button
                  onClick={exportReport}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Report Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            {selectedPeriod === 'monthly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {!currentReport ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Report Available</h3>
            <p className="text-gray-600 mb-6">
              Generate a financial report for the selected period to view detailed analytics.
            </p>
            <button
              onClick={handleGenerateReport}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Calculator className="w-5 h-5" />
              Generate Report
            </button>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentReport.revenue)}</p>
                    {previousReport && (
                      <div className={`flex items-center gap-1 text-sm ${getChangeColor(calculateChange(currentReport.revenue, previousReport.revenue))}`}>
                        {getChangeIcon(calculateChange(currentReport.revenue, previousReport.revenue))}
                        {formatPercentage(calculateChange(currentReport.revenue, previousReport.revenue))}
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentReport.expenses)}</p>
                    {previousReport && (
                      <div className={`flex items-center gap-1 text-sm ${getChangeColor(calculateChange(currentReport.expenses, previousReport.expenses))}`}>
                        {getChangeIcon(calculateChange(currentReport.expenses, previousReport.expenses))}
                        {formatPercentage(calculateChange(currentReport.expenses, previousReport.expenses))}
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Profit</p>
                    <p className={`text-2xl font-bold ${currentReport.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(currentReport.profit)}
                    </p>
                    {previousReport && (
                      <div className={`flex items-center gap-1 text-sm ${getChangeColor(calculateChange(currentReport.profit, previousReport.profit))}`}>
                        {getChangeIcon(calculateChange(currentReport.profit, previousReport.profit))}
                        {formatPercentage(calculateChange(currentReport.profit, previousReport.profit))}
                      </div>
                    )}
                  </div>
                  <div className={`p-2 rounded-lg ${currentReport.profit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <DollarSign className={`w-6 h-6 ${currentReport.profit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                    <p className={`text-2xl font-bold ${currentReport.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {currentReport.profitMargin.toFixed(1)}%
                    </p>
                    {previousReport && (
                      <div className={`flex items-center gap-1 text-sm ${getChangeColor(currentReport.profitMargin - previousReport.profitMargin)}`}>
                        {getChangeIcon(currentReport.profitMargin - previousReport.profitMargin)}
                        {formatPercentage(currentReport.profitMargin - previousReport.profitMargin)}
                      </div>
                    )}
                  </div>
                  <div className={`p-2 rounded-lg ${currentReport.profitMargin >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
                    <Target className={`w-6 h-6 ${currentReport.profitMargin >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue and Expense Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Revenue by Category
                </h3>
                <div className="space-y-3">
                  {Object.entries(currentReport.revenueByCategory).map(([category, amount]) => {
                    const percentage = currentReport.revenue > 0 ? (amount / currentReport.revenue) * 100 : 0;
                    return (
                      <div key={category} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium">{category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(amount)}</div>
                          <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Expenses by Category
                </h3>
                <div className="space-y-3">
                  {Object.entries(currentReport.expensesByCategory).map(([category, amount]) => {
                    const percentage = currentReport.expenses > 0 ? (amount / currentReport.expenses) * 100 : 0;
                    return (
                      <div key={category} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium">{category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(amount)}</div>
                          <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Financial Health Indicators */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                    currentReport.profitMargin >= 15 ? 'bg-green-100' : 
                    currentReport.profitMargin >= 5 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {currentReport.profitMargin >= 15 ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertCircle className={`w-8 h-8 ${currentReport.profitMargin >= 5 ? 'text-yellow-600' : 'text-red-600'}`} />
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900">Profitability</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentReport.profitMargin >= 15 ? 'Excellent' : 
                     currentReport.profitMargin >= 5 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>

                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                    currentReport.revenue >= 50000 ? 'bg-green-100' : 
                    currentReport.revenue >= 25000 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {currentReport.revenue >= 50000 ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertCircle className={`w-8 h-8 ${currentReport.revenue >= 25000 ? 'text-yellow-600' : 'text-red-600'}`} />
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900">Revenue Growth</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentReport.revenue >= 50000 ? 'Strong' : 
                     currentReport.revenue >= 25000 ? 'Moderate' : 'Weak'}
                  </p>
                </div>

                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                    (currentReport.expenses / currentReport.revenue) <= 0.7 ? 'bg-green-100' : 
                    (currentReport.expenses / currentReport.revenue) <= 0.85 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {(currentReport.expenses / currentReport.revenue) <= 0.7 ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertCircle className={`w-8 h-8 ${(currentReport.expenses / currentReport.revenue) <= 0.85 ? 'text-yellow-600' : 'text-red-600'}`} />
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900">Cost Control</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {(currentReport.expenses / currentReport.revenue) <= 0.7 ? 'Excellent' : 
                     (currentReport.expenses / currentReport.revenue) <= 0.85 ? 'Good' : 'Poor'}
                  </p>
                </div>
              </div>
            </div>

            {/* Report Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Summary</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  This {selectedPeriod} financial report for {selectedPeriod === 'monthly' ? 
                    `${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} ${selectedYear}` : 
                    selectedYear} shows:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Total revenue of {formatCurrency(currentReport.revenue)}
                    {previousReport && (
                      <span className={getChangeColor(calculateChange(currentReport.revenue, previousReport.revenue))}>
                        {' '}({formatPercentage(calculateChange(currentReport.revenue, previousReport.revenue))} vs previous period)
                      </span>
                    )}
                  </li>
                  <li>
                    Total expenses of {formatCurrency(currentReport.expenses)}
                    {previousReport && (
                      <span className={getChangeColor(calculateChange(currentReport.expenses, previousReport.expenses))}>
                        {' '}({formatPercentage(calculateChange(currentReport.expenses, previousReport.expenses))} vs previous period)
                      </span>
                    )}
                  </li>
                  <li>
                    Net profit of {formatCurrency(currentReport.profit)} with a {currentReport.profitMargin.toFixed(1)}% profit margin
                  </li>
                  <li>
                    Highest revenue category: {Object.entries(currentReport.revenueByCategory)
                      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                  </li>
                  <li>
                    Highest expense category: {Object.entries(currentReport.expensesByCategory)
                      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}