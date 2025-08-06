'use client';

import { useState } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { QRCode } from '@/types';
import { 
  QrCode, 
  Plus, 
  Download, 
  Eye, 
  BarChart3, 
  Calendar,
  Smartphone,
  Users,
  TrendingUp,
  Copy,
  Check
} from 'lucide-react';

export default function QRCodePage() {
  const { qrCodes, generateQRCode, updateQRCodeUsage, tables } = useRestaurantStore();
  const [selectedTable, setSelectedTable] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalQRCodes = qrCodes.length;
  const activeQRCodes = qrCodes.filter(qr => qr.isActive).length;
  const totalUsage = qrCodes.reduce((sum, qr) => sum + qr.usageCount, 0);
  const averageUsage = totalQRCodes > 0 ? totalUsage / totalQRCodes : 0;

  const handleGenerateQR = () => {
    generateQRCode(selectedTable);
  };

  const handleCopyQRData = async (qrData: string, qrId: string) => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopiedId(qrId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy QR data:', err);
    }
  };

  const handleDownloadQR = (qrCode: QRCode) => {
    // In a real implementation, this would generate and download a QR code image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 200;
      canvas.height = 200;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Table ${qrCode.tableNumber}`, 100, 100);
      ctx.fillText('QR Code', 100, 120);
      
      const link = document.createElement('a');
      link.download = `table-${qrCode.tableNumber}-qr.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage === 0) return 'text-gray-500';
    if (usage < 5) return 'text-yellow-600';
    if (usage < 10) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Management</h1>
          <p className="text-gray-600">Generate and manage QR codes for table ordering</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total QR Codes</p>
                <p className="text-2xl font-bold text-gray-900">{totalQRCodes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Codes</p>
                <p className="text-2xl font-bold text-gray-900">{activeQRCodes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsage}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Scans</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(averageUsage)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Generate New QR Code */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate New QR Code</h2>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Table
              </label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {tables.map((table) => (
                  <option key={table.id} value={table.number}>
                    Table {table.number}
                  </option>
                ))}
              </select>
            </div>
            <div className="pt-6">
              <button
                onClick={handleGenerateQR}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Generate QR Code
              </button>
            </div>
          </div>
        </div>

        {/* QR Codes List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">QR Codes</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {qrCodes.length === 0 ? (
              <div className="p-8 text-center">
                <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No QR codes generated yet.</p>
                <p className="text-gray-400 text-sm">Generate your first QR code above.</p>
              </div>
            ) : (
              qrCodes.map((qrCode) => (
                <div key={qrCode.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <QrCode className="w-8 h-8 text-gray-600" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Table {qrCode.tableNumber}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className={`flex items-center gap-1 ${qrCode.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            <div className={`w-2 h-2 rounded-full ${qrCode.isActive ? 'bg-green-600' : 'bg-red-600'}`}></div>
                            {qrCode.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className={`flex items-center gap-1 ${getUsageColor(qrCode.usageCount)}`}>
                            <BarChart3 className="w-4 h-4" />
                            {qrCode.usageCount} scans
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created: {qrCode.createdAt.toLocaleDateString()}
                          </span>
                          {qrCode.lastUsed && (
                            <span className="flex items-center gap-1">
                              <Smartphone className="w-4 h-4" />
                              Last used: {qrCode.lastUsed.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {qrCode.qrCodeData}
                            </code>
                            <button
                              onClick={() => handleCopyQRData(qrCode.qrCodeData, qrCode.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copy QR data"
                            >
                              {copiedId === qrCode.id ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownloadQR(qrCode)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      
                      <button
                        onClick={() => updateQRCodeUsage(qrCode.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Test Scan
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Usage Analytics */}
        {qrCodes.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Math.round((activeQRCodes / totalQRCodes) * 100)}%
                </div>
                <p className="text-gray-600">Active Rate</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {qrCodes.filter(qr => qr.usageCount > 0).length}
                </div>
                <p className="text-gray-600">Used QR Codes</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {qrCodes.filter(qr => qr.lastUsed && 
                    new Date().getTime() - qr.lastUsed.getTime() < 24 * 60 * 60 * 1000
                  ).length}
                </div>
                <p className="text-gray-600">Used Today</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}