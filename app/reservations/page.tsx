'use client';

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import { 
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReservationsPage() {
  const { reservations, tables, addReservation, updateReservation, deleteReservation } = useRestaurantStore();
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    partySize: 2,
    tableId: '',
    specialRequests: ''
  });

  // Filter reservations
  const filteredReservations = reservations.filter(reservation => {
    const matchesDate = format(reservation.date, 'yyyy-MM-dd') === selectedDate;
    const matchesSearch = reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesDate && matchesSearch && matchesStatus;
  });

  // Get available tables for a specific time
  const getAvailableTables = (date: string, time: string) => {
    const reservationDateTime = new Date(`${date}T${time}`);
    const conflictingReservations = reservations.filter(res => {
      const resDateTime = new Date(`${format(res.date, 'yyyy-MM-dd')}T${res.time}`);
      const timeDiff = Math.abs(resDateTime.getTime() - reservationDateTime.getTime()) / (1000 * 60);
      return timeDiff < 120 && res.status !== 'cancelled'; // 2-hour buffer
    });

    return tables.filter(table => 
      !conflictingReservations.some(res => res.tableId === table.id)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingReservation) {
      updateReservation(editingReservation.id, {
        ...formData,
        date: new Date(formData.date),
        partySize: Number(formData.partySize)
      });
      toast.success('Reservation updated successfully!');
      setEditingReservation(null);
    } else {
      const newReservation = {
        id: `res-${Date.now()}`,
        ...formData,
        date: new Date(formData.date),
        partySize: Number(formData.partySize),
        status: 'confirmed' as const,
        createdAt: new Date()
      };
      addReservation(newReservation);
      toast.success('Reservation created successfully!');
    }
    
    setShowForm(false);
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      partySize: 2,
      tableId: '',
      specialRequests: ''
    });
  };

  const handleEdit = (reservation: any) => {
    setEditingReservation(reservation);
    setFormData({
      customerName: reservation.customerName,
      customerPhone: reservation.customerPhone,
      customerEmail: reservation.customerEmail || '',
      date: format(reservation.date, 'yyyy-MM-dd'),
      time: reservation.time,
      partySize: reservation.partySize,
      tableId: reservation.tableId,
      specialRequests: reservation.specialRequests || ''
    });
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'seated': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDateLabel = (date: string) => {
    const selectedDateObj = new Date(date);
    if (isToday(selectedDateObj)) return 'Today';
    if (isTomorrow(selectedDateObj)) return 'Tomorrow';
    return format(selectedDateObj, 'EEEE, MMM d');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Table Reservations</h1>
          <p className="text-gray-600">Manage table bookings and customer reservations</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Date Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Customer name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="seated">Seated</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Reservation
            </button>
          </div>
        </div>

        {/* Quick Date Navigation */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 7 }, (_, i) => {
            const date = addDays(new Date(), i);
            const dateStr = format(date, 'yyyy-MM-dd');
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDate === dateStr
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                <div className="text-center">
                  <div>{format(date, 'EEE')}</div>
                  <div>{format(date, 'd')}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Reservations List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">
              Reservations for {getDateLabel(selectedDate)}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredReservations.length} reservations)
              </span>
            </h2>
          </div>

          <div className="divide-y">
            {filteredReservations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No reservations found for this date</p>
              </div>
            ) : (
              filteredReservations
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((reservation) => {
                  const table = tables.find(t => t.id === reservation.tableId);
                  return (
                    <div key={reservation.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{reservation.customerName}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {reservation.time}
                                </span>
                                <span className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {reservation.partySize} guests
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Table {table?.number || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {reservation.customerPhone}
                            </span>
                            {reservation.customerEmail && (
                              <span className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {reservation.customerEmail}
                              </span>
                            )}
                          </div>

                          {reservation.specialRequests && (
                            <div className="mt-2 text-sm text-gray-600">
                              <strong>Special Requests:</strong> {reservation.specialRequests}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                            {reservation.status}
                          </span>

                          <div className="flex gap-2">
                            {reservation.status === 'confirmed' && (
                              <button
                                onClick={() => updateReservation(reservation.id, { status: 'seated' })}
                                className="btn-success text-sm px-3 py-1"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Seat
                              </button>
                            )}

                            <button
                              onClick={() => handleEdit(reservation)}
                              className="text-blue-600 hover:text-blue-700 p-2"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this reservation?')) {
                                  deleteReservation(reservation.id);
                                  toast.success('Reservation deleted');
                                }
                              }}
                              className="text-red-600 hover:text-red-700 p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Reservation Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium">
                {editingReservation ? 'Edit Reservation' : 'New Reservation'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Party Size *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.partySize}
                    onChange={(e) => setFormData({ ...formData, partySize: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table
                  </label>
                  <select
                    value={formData.tableId}
                    onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Auto-assign</option>
                    {getAvailableTables(formData.date, formData.time).map(table => (
                      <option key={table.id} value={table.id}>
                        Table {table.number} ({table.capacity} seats)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Birthday celebration, dietary restrictions, etc."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingReservation(null);
                    setFormData({
                      customerName: '',
                      customerPhone: '',
                      customerEmail: '',
                      date: new Date().toISOString().split('T')[0],
                      time: '',
                      partySize: 2,
                      tableId: '',
                      specialRequests: ''
                    });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingReservation ? 'Update' : 'Create'} Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}