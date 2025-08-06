'use client';

import { useState, useEffect } from 'react';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Heart, 
  Share2,
  MessageCircle,
  TrendingUp,
  Users,
  Eye,
  Star,
  Calendar,
  BarChart3,
  Zap,
  Target,
  Camera,
  Video,
  Hash,
  AtSign,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function SocialMediaPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('week');

  // Mock social media data
  const socialMediaPosts = [
    {
      id: 'social-1',
      platform: 'instagram' as const,
      postId: 'inst_001',
      content: 'Fresh Margherita Pizza straight from our wood-fired oven! 🍕✨ Made with authentic San Marzano tomatoes and fresh mozzarella. #PizzaPerfection #WoodFired #Authentic',
      mediaUrls: ['/images/pizza-post.jpg'],
      engagement: {
        likes: 1247,
        shares: 89,
        comments: 156,
        reach: 8934
      },
      menuItemsMentioned: ['Margherita Pizza'],
      sentiment: 0.89,
      generatedLeads: 23,
      postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'social-2',
      platform: 'facebook' as const,
      postId: 'fb_002',
      content: 'Weekend Special Alert! 🎉 Our signature Grilled Salmon with quinoa pilaf is now available with a 20% discount. Book your table now! #WeekendSpecial #HealthyEating #Salmon',
      mediaUrls: ['/images/salmon-post.jpg', '/images/restaurant-interior.jpg'],
      engagement: {
        likes: 892,
        shares: 234,
        comments: 67,
        reach: 12456
      },
      menuItemsMentioned: ['Grilled Salmon'],
      sentiment: 0.92,
      generatedLeads: 45,
      postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: 'social-3',
      platform: 'twitter' as const,
      postId: 'tw_003',
      content: 'Nothing beats our Chocolate Lava Cake for dessert! 🍫🔥 Warm, gooey center with vanilla ice cream. Perfect end to any meal! #DessertGoals #ChocolateLover',
      mediaUrls: ['/images/lava-cake-post.jpg'],
      engagement: {
        likes: 567,
        shares: 123,
        comments: 89,
        reach: 5678
      },
      menuItemsMentioned: ['Chocolate Lava Cake'],
      sentiment: 0.95,
      generatedLeads: 18,
      postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
      id: 'social-4',
      platform: 'instagram' as const,
      postId: 'inst_004',
      content: 'Behind the scenes in our kitchen! 👨‍🍳 Our chefs preparing fresh pasta daily. Quality ingredients, traditional techniques. #BehindTheScenes #FreshPasta #ChefLife',
      mediaUrls: ['/images/kitchen-video.mp4'],
      engagement: {
        likes: 2134,
        shares: 345,
        comments: 278,
        reach: 15678
      },
      menuItemsMentioned: ['Pasta'],
      sentiment: 0.87,
      generatedLeads: 67,
      postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  const [posts, setPosts] = useState(socialMediaPosts);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      default: return <Share2 className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'from-pink-500 to-purple-600';
      case 'facebook': return 'from-blue-600 to-blue-700';
      case 'twitter': return 'from-sky-400 to-sky-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.8) return 'text-green-600 bg-green-100';
    if (sentiment >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment >= 0.8) return 'Positive';
    if (sentiment >= 0.6) return 'Neutral';
    return 'Negative';
  };

  const filteredPosts = posts.filter(post => {
    return selectedPlatform === 'all' || post.platform === selectedPlatform;
  });

  const totalEngagement = filteredPosts.reduce((sum, post) => 
    sum + post.engagement.likes + post.engagement.shares + post.engagement.comments, 0
  );
  const totalReach = filteredPosts.reduce((sum, post) => sum + post.engagement.reach, 0);
  const totalLeads = filteredPosts.reduce((sum, post) => sum + post.generatedLeads, 0);
  const averageSentiment = filteredPosts.reduce((sum, post) => sum + post.sentiment, 0) / filteredPosts.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl">
              <Share2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                📱 Social Media Integration
              </h1>
              <p className="text-gray-600">Manage your restaurant's social presence and engagement</p>
            </div>
          </div>
        </div>

        {/* Social Media Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Engagement</p>
                <p className="text-2xl font-bold text-pink-600">{totalEngagement.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-lg">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+18% this week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold text-purple-600">{totalReach.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+25% growth</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Generated Leads</p>
                <p className="text-2xl font-bold text-indigo-600">{totalLeads}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+12 new customers</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-teal-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Sentiment</p>
                <p className="text-2xl font-bold text-teal-600">{(averageSentiment * 100).toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <Star className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">Positive sentiment</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Platforms</option>
                <option value="instagram">📸 Instagram</option>
                <option value="facebook">📘 Facebook</option>
                <option value="twitter">🐦 Twitter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Create Post
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Social Media Posts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">📱 Recent Posts</h2>
                  <p className="text-gray-600">Latest social media activity</p>
                </div>
              </div>

              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-gradient-to-r ${getPlatformColor(post.platform)} rounded-lg`}>
                          <div className="text-white">
                            {getPlatformIcon(post.platform)}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 capitalize">{post.platform}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(post.postedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(post.sentiment)}`}>
                          {getSentimentLabel(post.sentiment)}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-gray-700 mb-3">{post.content}</p>
                      
                      {/* Menu Items Mentioned */}
                      {post.menuItemsMentioned.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.menuItemsMentioned.map((item, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              🍽️ {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Engagement Metrics */}
                    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-gray-900">{post.engagement.likes}</span>
                        </div>
                        <p className="text-xs text-gray-500">Likes</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Share2 className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900">{post.engagement.shares}</span>
                        </div>
                        <p className="text-xs text-gray-500">Shares</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <MessageCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-gray-900">{post.engagement.comments}</span>
                        </div>
                        <p className="text-xs text-gray-500">Comments</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Eye className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium text-gray-900">{post.engagement.reach}</span>
                        </div>
                        <p className="text-xs text-gray-500">Reach</p>
                      </div>
                    </div>

                    {/* Generated Leads */}
                    {post.generatedLeads > 0 && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Generated {post.generatedLeads} leads
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-6">
            {/* Platform Performance */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">📊 Platform Performance</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-600" />
                    <span className="font-medium text-gray-900">Instagram</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-pink-600">3,381</p>
                    <p className="text-xs text-gray-500">engagement</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Facebook</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">1,193</p>
                    <p className="text-xs text-gray-500">engagement</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-sky-600" />
                    <span className="font-medium text-gray-900">Twitter</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sky-600">779</p>
                    <p className="text-xs text-gray-500">engagement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Hashtags */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Hash className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900"># Trending Hashtags</h3>
              </div>

              <div className="space-y-2">
                {['#PizzaPerfection', '#WoodFired', '#WeekendSpecial', '#HealthyEating', '#DessertGoals', '#ChefLife'].map((hashtag, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">{hashtag}</span>
                    <span className="text-xs text-gray-500">{Math.floor(Math.random() * 100) + 50} uses</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">⚡ Quick Actions</h3>
              </div>

              <div className="space-y-3">
                <button className="w-full p-3 bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800 rounded-lg hover:from-pink-200 hover:to-purple-200 transition-colors flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Create Photo Post
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-gray-800 rounded-lg hover:from-blue-200 hover:to-indigo-200 transition-colors flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Create Video Post
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-green-100 to-teal-100 text-gray-800 rounded-lg hover:from-green-200 hover:to-teal-200 transition-colors flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Post
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-orange-100 to-red-100 text-gray-800 rounded-lg hover:from-orange-200 hover:to-red-200 transition-colors flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Boost Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Social Media Features */}
        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-pink-600" />
            <h3 className="text-lg font-bold text-gray-900">🤖 AI-Powered Social Features</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📝 Auto Content Generation</h4>
              <p className="text-sm text-gray-600">AI creates engaging posts based on menu items and events</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🎯 Smart Targeting</h4>
              <p className="text-sm text-gray-600">Optimize post timing and audience for maximum engagement</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📊 Sentiment Analysis</h4>
              <p className="text-sm text-gray-600">Real-time monitoring of customer sentiment and feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}