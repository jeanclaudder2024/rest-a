'use client';

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { WaitlistEntry } from '@/types';
import { Clock, Users, Phone, Mail, AlertCircle, CheckCircle, X, Plus } from 'lucide-react';

export default function WaitlistPage() {
  const { 
    waitlistEntries, 
    addWaitlistEntry, 
    updateWaitlistEntry, 
    removeWaitlistEntry 
  } = useRestaurantStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    partySize: 1,
    preferredTime: '',
    specialRequests: '',
    priority: 'normal' as 'normal' | 'high' | 'low'
  });

  const handleAddEntry = () => {
    if (newEntry.customerName && newEntry.customerPhone) {
      const entry: Omit<WaitlistEntry, 'id'> = {
        ...newEntry,
        preferredTime: new Date(newEntry.preferredTime),
        status: 'waiting',
        estimatedWaitTime: 30,
        notificationsSent: 0,
        joinedAt: new Date()
      };
      addWaitlistEntry(entry);
      setNewEntry({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        partySize: 1,
        preferredTime: '',
        specialRequests: '',
        priority: 'normal'
      });
      setShowAddForm(false);
    }
  };

  const handleStatusUpdate = (id: string, status: WaitlistEntry['status']) => {
    updateWaitlistEntry(id, { status });
  };

  const handleNotifyCustomer = (id: string) => {
    const entry = waitlistEntries.find(e => e.id === id);
    if (entry) {
      updateWaitlistEntry(id, { 
        notificationsSent: entry.notificationsSent + 1 
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'seated': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'no_show': return 'text-gray-600 bg-gray-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Waitlist Management</h1>
          <p className="text-gray-600 mt-2">Manage customer waitlist and table assignments</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add to Waitlist
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Waiting</p>
              <p className="text-2xl font-bold text-gray-900">
                {waitlistEntries.filter(e => e.status === 'waiting').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Wait</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  waitlistEntries
                    .filter(e => e.status === 'waiting')
                    .reduce((acc, e) => acc + e.estimatedWaitTime, 0) /
                  Math.max(waitlistEntries.filter(e => e.status === 'waiting').length, 1)
                )} min
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {waitlistEntries.filter(e => e.priority === 'high' && e.status === 'waiting').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Seated Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {waitlistEntries.filter(e => e.status === 'seated').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Waitlist Entries */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Current Waitlist</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Party Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wait Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {waitlistEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entry.customerName}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {entry.customerPhone}
                      </div>
                      {entry.customerEmail && (
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {entry.customerEmail}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{entry.partySize}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.estimatedWaitTime} min</div>
                    <div className="text-xs text-gray-500">
                      Joined: {entry.joinedAt.toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(entry.priority)}`}>
                      {entry.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {entry.status === 'waiting' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(entry.id, 'seated')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Seat
                          </button>
                          <button
                            onClick={() => handleNotifyCustomer(entry.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Notify
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(entry.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => removeWaitlistEntry(entry.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add to Waitlist</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={newEntry.customerName}
                  onChange={(e) => setNewEntry({ ...newEntry, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={newEntry.customerPhone}
                  onChange={(e) => setNewEntry({ ...newEntry, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newEntry.customerEmail}
                  onChange={(e) => setNewEntry({ ...newEntry, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Party Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newEntry.partySize}
                    onChange={(e) => setNewEntry({ ...newEntry, partySize: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newEntry.priority}
                    onChange={(e) => setNewEntry({ ...newEntry, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time
                </label>
                <input
                  type="datetime-local"
                  value={newEntry.preferredTime}
                  onChange={(e) => setNewEntry({ ...newEntry, preferredTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests
                </label>
                <textarea
                  value={newEntry.specialRequests}
                  onChange={(e) => setNewEntry({ ...newEntry, specialRequests: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEntry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add to Waitlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}