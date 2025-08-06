'use client';

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { EmailCampaign, EmailTemplate, CustomerSegment, MarketingAutomation } from '@/types';
import { Mail, Users, TrendingUp, Clock, Plus, Edit, Trash2, Send, Eye, BarChart3 } from 'lucide-react';

export default function EmailMarketingPage() {
  const { 
    emailCampaigns,
    emailTemplates,
    customerSegments,
    marketingAutomations,
    addEmailCampaign,
    updateEmailCampaign,
    removeEmailCampaign,
    addEmailTemplate,
    updateEmailTemplate,
    removeEmailTemplate,
    addCustomerSegment,
    updateCustomerSegment,
    removeCustomerSegment,
    addMarketingAutomation,
    updateMarketingAutomation,
    removeMarketingAutomation
  } = useRestaurantStore();
  
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'campaign' | 'template' | 'segment' | 'automation'>('campaign');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    templateId: '',
    segmentId: '',
    scheduledAt: ''
  });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'general' as 'welcome' | 'birthday' | 'promotion' | 'general'
  });

  const [newSegment, setNewSegment] = useState({
    name: '',
    description: '',
    criteria: {
      minOrderValue: 0,
      minVisits: 0,
      timeframe: 'monthly' as 'weekly' | 'monthly' | 'yearly'
    }
  });

  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    trigger: 'customer_birthday' as 'customer_birthday' | 'customer_inactive' | 'first_order' | 'order_milestone',
    templateId: '',
    conditions: {
      daysBeforeBirthday: 3,
      inactiveDays: 30,
      customerSegment: 'all'
    }
  });

  const handleSaveCampaign = () => {
    if (newCampaign.name && newCampaign.subject && newCampaign.templateId && newCampaign.segmentId) {
      const campaign: Omit<EmailCampaign, 'id'> = {
        ...newCampaign,
        scheduledAt: new Date(newCampaign.scheduledAt),
        status: 'scheduled',
        recipientCount: customerSegments.find(s => s.id === newCampaign.segmentId)?.customerCount || 0,
        createdAt: new Date()
      };

      if (editingId) {
        updateEmailCampaign(editingId, campaign);
      } else {
        addEmailCampaign(campaign);
      }
      resetForm();
    }
  };

  const handleSaveTemplate = () => {
    if (newTemplate.name && newTemplate.subject && newTemplate.content) {
      const template: Omit<EmailTemplate, 'id'> = {
        ...newTemplate,
        isActive: true,
        createdAt: new Date()
      };

      if (editingId) {
        updateEmailTemplate(editingId, template);
      } else {
        addEmailTemplate(template);
      }
      resetForm();
    }
  };

  const handleSaveSegment = () => {
    if (newSegment.name && newSegment.description) {
      const segment: Omit<CustomerSegment, 'id'> = {
        ...newSegment,
        customerCount: Math.floor(Math.random() * 200) + 50, // Simulated count
        createdAt: new Date()
      };

      if (editingId) {
        updateCustomerSegment(editingId, segment);
      } else {
        addCustomerSegment(segment);
      }
      resetForm();
    }
  };

  const handleSaveAutomation = () => {
    if (newAutomation.name && newAutomation.description && newAutomation.templateId) {
      const automation: Omit<MarketingAutomation, 'id'> = {
        ...newAutomation,
        isActive: true,
        metrics: {
          triggered: 0,
          sent: 0,
          opened: 0,
          clicked: 0,
          converted: 0
        },
        createdAt: new Date()
      };

      if (editingId) {
        updateMarketingAutomation(editingId, automation);
      } else {
        addMarketingAutomation(automation);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setNewCampaign({
      name: '',
      subject: '',
      templateId: '',
      segmentId: '',
      scheduledAt: ''
    });
    setNewTemplate({
      name: '',
      subject: '',
      content: '',
      type: 'general'
    });
    setNewSegment({
      name: '',
      description: '',
      criteria: {
        minOrderValue: 0,
        minVisits: 0,
        timeframe: 'monthly'
      }
    });
    setNewAutomation({
      name: '',
      description: '',
      trigger: 'customer_birthday',
      templateId: '',
      conditions: {
        daysBeforeBirthday: 3,
        inactiveDays: 30,
        customerSegment: 'all'
      }
    });
    setEditingId(null);
    setShowModal(false);
  };

  const openModal = (type: typeof modalType, item?: any) => {
    setModalType(type);
    if (item) {
      setEditingId(item.id);
      switch (type) {
        case 'campaign':
          setNewCampaign({
            name: item.name,
            subject: item.subject,
            templateId: item.templateId,
            segmentId: item.segmentId,
            scheduledAt: item.scheduledAt.toISOString().slice(0, 16)
          });
          break;
        case 'template':
          setNewTemplate({
            name: item.name,
            subject: item.subject,
            content: item.content,
            type: item.type
          });
          break;
        case 'segment':
          setNewSegment({
            name: item.name,
            description: item.description,
            criteria: item.criteria
          });
          break;
        case 'automation':
          setNewAutomation({
            name: item.name,
            description: item.description,
            trigger: item.trigger,
            templateId: item.templateId,
            conditions: item.conditions
          });
          break;
      }
    }
    setShowModal(true);
  };

  // Calculate statistics
  const totalCampaigns = emailCampaigns.length;
  const sentCampaigns = emailCampaigns.filter(c => c.status === 'sent').length;
  const avgOpenRate = sentCampaigns > 0 
    ? emailCampaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + (c.openRate || 0), 0) / sentCampaigns 
    : 0;
  const avgClickRate = sentCampaigns > 0 
    ? emailCampaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + (c.clickRate || 0), 0) / sentCampaigns 
    : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Marketing</h1>
          <p className="text-gray-600 mt-2">Manage email campaigns, templates, and customer segments</p>
        </div>
        <button
          onClick={() => openModal(activeTab as any)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{totalCampaigns}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
              <p className="text-2xl font-bold text-gray-900">{avgOpenRate.toFixed(1)}%</p>
            </div>
            <Eye className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Click Rate</p>
              <p className="text-2xl font-bold text-gray-900">{avgClickRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customer Segments</p>
              <p className="text-2xl font-bold text-gray-900">{customerSegments.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {['campaigns', 'templates', 'segments', 'automations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheduled
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emailCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500">{campaign.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          campaign.status === 'sent' 
                            ? 'text-green-800 bg-green-100'
                            : campaign.status === 'scheduled'
                            ? 'text-blue-800 bg-blue-100'
                            : 'text-gray-800 bg-gray-100'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{campaign.recipientCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {campaign.status === 'sent' && (
                          <div className="text-sm text-gray-900">
                            <div>Open: {campaign.openRate?.toFixed(1)}%</div>
                            <div>Click: {campaign.clickRate?.toFixed(1)}%</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {campaign.scheduledAt.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal('campaign', campaign)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeEmailCampaign(campaign.id)}
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
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emailTemplates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('template', template)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeEmailTemplate(template.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mb-3 line-clamp-3">
                    {template.content}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      template.isActive 
                        ? 'text-green-800 bg-green-100'
                        : 'text-red-800 bg-red-100'
                    }`}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{template.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Segments Tab */}
          {activeTab === 'segments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customerSegments.map((segment) => (
                <div key={segment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
                      <p className="text-sm text-gray-600">{segment.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('segment', segment)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeCustomerSegment(segment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Customers:</span>
                      <span className="font-medium">{segment.customerCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Order:</span>
                      <span>${segment.criteria.minOrderValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Visits:</span>
                      <span>{segment.criteria.minVisits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeframe:</span>
                      <span className="capitalize">{segment.criteria.timeframe}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Automations Tab */}
          {activeTab === 'automations' && (
            <div className="space-y-6">
              {marketingAutomations.map((automation) => (
                <div key={automation.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{automation.name}</h3>
                      <p className="text-sm text-gray-600">{automation.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        automation.isActive 
                          ? 'text-green-800 bg-green-100'
                          : 'text-red-800 bg-red-100'
                      }`}>
                        {automation.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => openModal('automation', automation)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeMarketingAutomation(automation.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{automation.metrics.triggered}</div>
                      <div className="text-gray-600">Triggered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{automation.metrics.sent}</div>
                      <div className="text-gray-600">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{automation.metrics.opened}</div>
                      <div className="text-gray-600">Opened</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{automation.metrics.clicked}</div>
                      <div className="text-gray-600">Clicked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{automation.metrics.converted}</div>
                      <div className="text-gray-600">Converted</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h3>
            
            {modalType === 'campaign' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
                  <input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template *</label>
                    <select
                      value={newCampaign.templateId}
                      onChange={(e) => setNewCampaign({ ...newCampaign, templateId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Template</option>
                      {emailTemplates.map((template) => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Segment *</label>
                    <select
                      value={newCampaign.segmentId}
                      onChange={(e) => setNewCampaign({ ...newCampaign, segmentId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Segment</option>
                      {customerSegments.map((segment) => (
                        <option key={segment.id} value={segment.id}>{segment.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date *</label>
                  <input
                    type="datetime-local"
                    value={newCampaign.scheduledAt}
                    onChange={(e) => setNewCampaign({ ...newCampaign, scheduledAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {modalType === 'template' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
                    <input
                      type="text"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newTemplate.type}
                      onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="welcome">Welcome</option>
                      <option value="birthday">Birthday</option>
                      <option value="promotion">Promotion</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                  <textarea
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                  />
                </div>
              </div>
            )}

            {modalType === 'segment' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segment Name *</label>
                  <input
                    type="text"
                    value={newSegment.name}
                    onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={newSegment.description}
                    onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Value</label>
                    <input
                      type="number"
                      value={newSegment.criteria.minOrderValue}
                      onChange={(e) => setNewSegment({
                        ...newSegment,
                        criteria: { ...newSegment.criteria, minOrderValue: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Visits</label>
                    <input
                      type="number"
                      value={newSegment.criteria.minVisits}
                      onChange={(e) => setNewSegment({
                        ...newSegment,
                        criteria: { ...newSegment.criteria, minVisits: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                    <select
                      value={newSegment.criteria.timeframe}
                      onChange={(e) => setNewSegment({
                        ...newSegment,
                        criteria: { ...newSegment.criteria, timeframe: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {modalType === 'automation' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Automation Name *</label>
                  <input
                    type="text"
                    value={newAutomation.name}
                    onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={newAutomation.description}
                    onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trigger *</label>
                    <select
                      value={newAutomation.trigger}
                      onChange={(e) => setNewAutomation({ ...newAutomation, trigger: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="customer_birthday">Customer Birthday</option>
                      <option value="customer_inactive">Customer Inactive</option>
                      <option value="first_order">First Order</option>
                      <option value="order_milestone">Order Milestone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template *</label>
                    <select
                      value={newAutomation.templateId}
                      onChange={(e) => setNewAutomation({ ...newAutomation, templateId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Template</option>
                      {emailTemplates.map((template) => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  switch (modalType) {
                    case 'campaign': handleSaveCampaign(); break;
                    case 'template': handleSaveTemplate(); break;
                    case 'segment': handleSaveSegment(); break;
                    case 'automation': handleSaveAutomation(); break;
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}