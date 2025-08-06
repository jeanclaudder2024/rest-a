'use client';

import { useState } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { StaffSchedule, TimeClockEntry } from '@/types';
import { 
  Calendar, 
  Plus, 
  Search, 
  Clock, 
  Users,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2,
  CalendarDays,
  Timer,
  UserCheck,
  Coffee
} from 'lucide-react';

export default function StaffSchedulePage() {
  const { 
    staffSchedules, 
    timeClockEntries,
    users,
    addStaffSchedule, 
    updateStaffSchedule, 
    deleteStaffSchedule,
    addTimeClockEntry
  } = useRestaurantStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<StaffSchedule>>({
    userId: '',
    date: new Date().toISOString().split('T')[0],
    shift: 'morning',
    startTime: '09:00',
    endTime: '17:00',
    position: 'Server',
    notes: ''
  });

  const staff = users.filter(user => user.role === 'staff');
  
  const filteredSchedules = staffSchedules.filter(schedule => {
    const user = users.find(u => u.id === schedule.userId);
    const matchesSearch = user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShift = filterShift === 'all' || schedule.shift === filterShift;
    const matchesDate = schedule.date === selectedDate;
    return matchesSearch && matchesShift && matchesDate;
  });

  const totalScheduledHours = filteredSchedules.reduce((sum, schedule) => {
    const start = new Date(`2000-01-01T${schedule.startTime}`);
    const end = new Date(`2000-01-01T${schedule.endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  const scheduledStaff = filteredSchedules.length;
  const totalStaff = staff.length;
  const coveragePercentage = totalStaff > 0 ? (scheduledStaff / totalStaff) * 100 : 0;

  const todaysClockEntries = timeClockEntries.filter(entry => 
    entry.date === new Date().toISOString().split('T')[0]
  );
  const clockedInStaff = todaysClockEntries.filter(entry => entry.clockIn && !entry.clockOut).length;

  const handleAddSchedule = () => {
    if (newSchedule.userId && newSchedule.date && newSchedule.startTime && newSchedule.endTime) {
      const schedule: StaffSchedule = {
        id: `schedule-${Date.now()}`,
        userId: newSchedule.userId,
        date: newSchedule.date,
        shift: newSchedule.shift || 'morning',
        startTime: newSchedule.startTime,
        endTime: newSchedule.endTime,
        position: newSchedule.position || 'Server',
        notes: newSchedule.notes || ''
      };
      
      addStaffSchedule(schedule);
      setNewSchedule({
        userId: '',
        date: new Date().toISOString().split('T')[0],
        shift: 'morning',
        startTime: '09:00',
        endTime: '17:00',
        position: 'Server',
        notes: ''
      });
      setShowAddForm(false);
    }
  };

  const handleClockIn = (userId: string) => {
    const entry: TimeClockEntry = {
      id: `clock-${Date.now()}`,
      userId,
      date: new Date().toISOString().split('T')[0],
      clockIn: new Date().toTimeString().slice(0, 5),
      clockOut: undefined,
      totalHours: 0,
      notes: ''
    };
    addTimeClockEntry(entry);
  };

  const handleClockOut = (userId: string) => {
    const existingEntry = todaysClockEntries.find(entry => 
      entry.userId === userId && entry.clockIn && !entry.clockOut
    );
    
    if (existingEntry) {
      const clockOut = new Date().toTimeString().slice(0, 5);
      const start = new Date(`2000-01-01T${existingEntry.clockIn}`);
      const end = new Date(`2000-01-01T${clockOut}`);
      const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      // Update the existing entry (in a real app, you'd have an update function)
      const updatedEntry = {
        ...existingEntry,
        clockOut,
        totalHours
      };
      // For now, we'll add a new entry since we don't have an update function
      addTimeClockEntry(updatedEntry);
    }
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'morning': return 'bg-yellow-100 text-yellow-800';
      case 'afternoon': return 'bg-blue-100 text-blue-800';
      case 'evening': return 'bg-purple-100 text-purple-800';
      case 'night': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Server': return 'bg-green-100 text-green-800';
      case 'Chef': return 'bg-red-100 text-red-800';
      case 'Bartender': return 'bg-blue-100 text-blue-800';
      case 'Host': return 'bg-purple-100 text-purple-800';
      case 'Manager': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isStaffClockedIn = (userId: string) => {
    return todaysClockEntries.some(entry => 
      entry.userId === userId && entry.clockIn && !entry.clockOut
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Schedule</h1>
              <p className="text-gray-600">Manage staff schedules and track working hours</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Schedule
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scheduled Today</p>
                <p className="text-2xl font-bold text-gray-900">{scheduledStaff}/{totalStaff}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clocked In</p>
                <p className="text-2xl font-bold text-gray-900">{clockedInStaff}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{totalScheduledHours.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Coverage</p>
                <p className="text-2xl font-bold text-gray-900">{coveragePercentage.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Shifts</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>
        </div>

        {/* Add Schedule Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Member *
                </label>
                <select
                  value={newSchedule.userId || ''}
                  onChange={(e) => setNewSchedule({ ...newSchedule, userId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select staff member</option>
                  {staff.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={newSchedule.date || ''}
                  onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift
                </label>
                <select
                  value={newSchedule.shift || 'morning'}
                  onChange={(e) => setNewSchedule({ ...newSchedule, shift: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select
                  value={newSchedule.position || 'Server'}
                  onChange={(e) => setNewSchedule({ ...newSchedule, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Server">Server</option>
                  <option value="Chef">Chef</option>
                  <option value="Bartender">Bartender</option>
                  <option value="Host">Host</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={newSchedule.startTime || ''}
                  onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  value={newSchedule.endTime || ''}
                  onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newSchedule.notes || ''}
                  onChange={(e) => setNewSchedule({ ...newSchedule, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional notes"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSchedule}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Schedule
              </button>
            </div>
          </div>
        )}

        {/* Schedule List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Schedule for {new Date(selectedDate).toLocaleDateString()}
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredSchedules.length === 0 ? (
              <div className="p-8 text-center">
                <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No schedules found for the selected date.</p>
              </div>
            ) : (
              filteredSchedules.map((schedule) => {
                const user = users.find(u => u.id === schedule.userId);
                const isClockedIn = isStaffClockedIn(schedule.userId);
                const start = new Date(`2000-01-01T${schedule.startTime}`);
                const end = new Date(`2000-01-01T${schedule.endTime}`);
                const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                
                return (
                  <div key={schedule.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getShiftColor(schedule.shift)}`}>
                            {schedule.shift}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(schedule.position)}`}>
                            {schedule.position}
                          </span>
                          {isClockedIn && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              Clocked In
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{schedule.startTime} - {schedule.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4" />
                            <span>{hours.toFixed(1)} hours</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(schedule.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{user?.email}</span>
                          </div>
                        </div>
                        
                        {schedule.notes && (
                          <p className="text-sm text-gray-600 mt-2">{schedule.notes}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {selectedDate === new Date().toISOString().split('T')[0] && (
                          <>
                            {!isClockedIn ? (
                              <button
                                onClick={() => handleClockIn(schedule.userId)}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm flex items-center gap-1"
                              >
                                <Coffee className="w-3 h-3" />
                                Clock In
                              </button>
                            ) : (
                              <button
                                onClick={() => handleClockOut(schedule.userId)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm flex items-center gap-1"
                              >
                                <Timer className="w-3 h-3" />
                                Clock Out
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => deleteStaffSchedule(schedule.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}