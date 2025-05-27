import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Follow = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('discover')
  const [followedUsers, setFollowedUsers] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    interests: [],
    location: '',
    sortBy: 'relevance'
  })
  
  const navigate = useNavigate()
  
  // Mock users data for following
  const mockUsers = [
    { 
      id: 1, 
      username: 'alice_wonder', 
      name: 'Alice Wonder', 
      avatar: '👩‍💻', 
      bio: 'Full-stack developer passionate about AI and machine learning. Building the future one line of code at a time.', 
      location: 'San Francisco, CA', 
      interests: ['tech', 'ai', 'coding', 'startups'], 
      followers: 15234, 
      following: 892, 
      mutualConnections: 12,
      verified: true,
      isOnline: true,
      joinDate: '2021'
    },
    { 
      id: 2, 
      username: 'bob_creator', 
      name: 'Bob Creator', 
      avatar: '👨‍🎨', 
      bio: 'Digital artist and UI/UX designer creating beautiful experiences. Love minimalism and clean design.', 
      location: 'New York, NY', 
      interests: ['art', 'design', 'creativity', 'photography'], 
      followers: 8924, 
      following: 456, 
      mutualConnections: 8,
      verified: false,
      isOnline: false,
      joinDate: '2020'
    },
    { 
      id: 3, 
      username: 'charlie_dev', 
      name: 'Charlie Dev', 
      avatar: '👨‍💼', 
      bio: 'Startup founder and tech entrepreneur. Previously founded two successful companies.', 
      location: 'Austin, TX', 
      interests: ['tech', 'startups', 'business', 'investing'], 
      followers: 32156, 
      following: 1205, 
      mutualConnections: 25,
      verified: true,
      isOnline: true,
      joinDate: '2019'
    },
    { 
      id: 4, 
      username: 'diana_photo', 
      name: 'Diana Photo', 
      avatar: '📸', 
      bio: 'Travel photographer capturing moments around the world. Nature lover and adventure seeker.', 
      location: 'Los Angeles, CA', 
      interests: ['photography', 'travel', 'nature', 'adventure'], 
      followers: 45321, 
      following: 892, 
      mutualConnections: 18,
      verified: true,
      isOnline: false,
      joinDate: '2018'
    },
    { 
      id: 5, 
      username: 'eve_music', 
      name: 'Eve Music', 
      avatar: '🎵', 
      bio: 'Music producer and sound engineer. Creating beats that move souls and hearts.', 
      location: 'Nashville, TN', 
      interests: ['music', 'audio', 'production', 'concerts'], 
      followers: 28976, 
      following: 567, 
      mutualConnections: 15,
      verified: false,
      isOnline: true,
      joinDate: '2020'
    },
    { 
      id: 6, 
      username: 'frank_fitness', 
      name: 'Frank Fitness', 
      avatar: '💪', 
      bio: 'Personal trainer and nutrition coach helping people achieve their fitness goals.', 
      location: 'Miami, FL', 
      interests: ['fitness', 'health', 'nutrition', 'sports'], 
      followers: 19543, 
      following: 234, 
      mutualConnections: 7,
      verified: false,
      isOnline: true,
      joinDate: '2021'
    },
    { 
      id: 7, 
      username: 'grace_games', 
      name: 'Grace Games', 
      avatar: '🎮', 
      bio: 'Professional gamer and streamer. Competing in esports tournaments worldwide.', 
      location: 'Seattle, WA', 
      interests: ['gaming', 'esports', 'streaming', 'tech'], 
      followers: 67890, 
      following: 445, 
      mutualConnections: 22,
      verified: true,
      isOnline: true,
      joinDate: '2019'
    },
    { 
      id: 8, 
      username: 'henry_chef', 
      name: 'Henry Chef', 
      avatar: '👨‍🍳', 
      bio: 'Michelin star chef sharing culinary secrets and cooking tips for food enthusiasts.', 
      location: 'Paris, France', 
      interests: ['food', 'cooking', 'culinary', 'travel'], 
      followers: 34567, 
      following: 678, 
      mutualConnections: 11,
      verified: true,
      isOnline: false,
      joinDate: '2017'
    }
  ]
  
  const interests = ['tech', 'art', 'music', 'photography', 'travel', 'food', 'fitness', 'gaming', 'fashion', 'business', 'science', 'sports']
  
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM manipulation happens after render
    const timeoutId = setTimeout(() => {
      if (darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }, 0)
    
    return () => clearTimeout(timeoutId)
  }, [darkMode])

  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }
  
  const handleFollowToggle = (user) => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setFollowedUsers(prev => {
        const newSet = new Set(prev)
        if (newSet.has(user.id)) {
          newSet.delete(user.id)
          toast.success(`Unfollowed ${user.name}`)
        } else {
          newSet.add(user.id)
          toast.success(`Now following ${user.name}`)
        }
        return newSet
      })
      setLoading(false)
    }, 500)
  }
  
  const handleViewProfile = (user) => {
    toast.info(`Viewing ${user.name}'s profile`)
  }
  
  const handleMessageUser = (user) => {
    toast.info(`Opening conversation with ${user.name}`)
  }
  
  const handleInterestToggle = (interest) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }
  
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = !searchQuery || 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesInterests = filters.interests.length === 0 || 
      filters.interests.some(interest => user.interests.includes(interest))
    
    const matchesLocation = !filters.location || 
      user.location.toLowerCase().includes(filters.location.toLowerCase())
    
    return matchesSearch && matchesInterests && matchesLocation
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'followers':
        return b.followers - a.followers
      case 'mutual':
        return b.mutualConnections - a.mutualConnections
      case 'recent':
        return new Date(b.joinDate) - new Date(a.joinDate)
      default:
        return b.mutualConnections - a.mutualConnections
    }
  })
  
  const suggestedUsers = mockUsers.filter(user => 
    user.mutualConnections > 5 && !followedUsers.has(user.id)
  ).slice(0, 3)
  
  const tabs = [
    { id: 'discover', label: 'Discover', icon: 'Search' },
    { id: 'suggestions', label: 'Suggestions', icon: 'Users' },
    { id: 'following', label: 'Following', icon: 'UserCheck' }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200/50 dark:border-surface-700/50 sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow">
                  <ApperIcon name="Globe" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gradient">ConnectSphere</h1>
                  <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 hidden sm:block">Follow & Connect</p>
                </div>
              </button>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-300 shadow-card"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-surface-600 dark:text-surface-400" 
                />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 sm:p-3 rounded-xl bg-primary hover:bg-primary-dark transition-all duration-300 shadow-glow"
              >
                <ApperIcon name="Bell" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-surface-200/50 dark:border-surface-700/50 sticky top-24"
            >
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <ApperIcon 
                    name="Search" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400 dark:text-surface-500" 
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-3 bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-surface-900 dark:text-white">{followedUsers.size}</div>
                  <div className="text-sm text-surface-600 dark:text-surface-400">Following</div>
                </div>
                <div className="bg-gradient-to-r from-accent/10 to-green-500/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-surface-900 dark:text-white">{suggestedUsers.length}</div>
                  <div className="text-sm text-surface-600 dark:text-surface-400">Suggestions</div>
                </div>
              </div>
              
              {/* Filters */}
              <div className="space-y-6">
                {/* Interests Filter */}
                <div>
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-3 flex items-center">
                    <ApperIcon name="Heart" className="w-4 h-4 mr-2 text-primary" />
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          filters.interests.includes(interest)
                            ? 'bg-primary text-white shadow-glow'
                            : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Location Filter */}
                <div>
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-3 flex items-center">
                    <ApperIcon name="MapPin" className="w-4 h-4 mr-2 text-primary" />
                    Location
                  </h3>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter city or region"
                    className="w-full px-3 py-2 bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                </div>
                
                {/* Sort By */}
                <div>
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-3 flex items-center">
                    <ApperIcon name="ArrowUpDown" className="w-4 h-4 mr-2 text-primary" />
                    Sort By
                  </h3>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="followers">Most Followers</option>
                    <option value="mutual">Mutual Connections</option>
                    <option value="recent">Recently Joined</option>
                  </select>
                </div>
                
                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setFilters({ interests: [], location: '', sortBy: 'relevance' })
                    setSearchQuery('')
                  }}
                  className="w-full text-sm text-surface-500 dark:text-surface-400 hover:text-primary transition-colors duration-200"
                >
                  Clear all filters
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl mb-6 shadow-card border border-surface-200/50 dark:border-surface-700/50"
            >
              <div className="flex border-b border-surface-200/50 dark:border-surface-700/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'text-primary border-b-2 border-primary bg-primary/5'
                        : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-surface-700/50'
                    }`}
                  >
                    <ApperIcon name={tab.icon} className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Discover Tab */}
              {activeTab === 'discover' && (
                <div className="space-y-6">
                  {/* Quick Suggestions */}
                  {suggestedUsers.length > 0 && (
                    <div className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-surface-200/50 dark:border-surface-700/50">
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center">
                        <ApperIcon name="Sparkles" className="w-5 h-5 mr-2 text-primary" />
                        Quick Suggestions
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {suggestedUsers.map((user) => (
                          <motion.div
                            key={user.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-surface-50/50 dark:bg-surface-700/50 rounded-xl p-4 text-center hover:bg-surface-100/50 dark:hover:bg-surface-600/50 transition-all duration-300"
                          >
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-2xl font-medium mx-auto mb-3">
                              {user.avatar}
                            </div>
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <h4 className="font-semibold text-surface-900 dark:text-white text-sm">{user.name}</h4>
                              {user.verified && (
                                <ApperIcon name="BadgeCheck" className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <p className="text-xs text-surface-500 dark:text-surface-400 mb-2">{user.mutualConnections} mutual</p>
                            <button
                              onClick={() => handleFollowToggle(user)}
                              disabled={loading}
                              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg hover:shadow-glow transition-all duration-300 text-sm font-medium disabled:opacity-50"
                            >
                              {loading ? 'Following...' : 'Follow'}
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* All Users */}
                  <div className="space-y-4">
                    {filteredUsers.length === 0 ? (
                      <div className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-card border border-surface-200/50 dark:border-surface-700/50 text-center">
                        <ApperIcon name="UserX" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">No users found</h3>
                        <p className="text-surface-600 dark:text-surface-400">Try adjusting your search terms or filters</p>
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-surface-200/50 dark:border-surface-700/50 hover:shadow-float transition-all duration-300"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-2xl font-medium">
                                  {user.avatar}
                                </div>
                                {user.isOnline && (
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent border-2 border-white dark:border-surface-800 rounded-full"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{user.name}</h3>
                                  {user.verified && (
                                    <ApperIcon name="BadgeCheck" className="w-5 h-5 text-primary" />
                                  )}
                                  {user.isOnline && (
                                    <span className="text-xs text-accent font-medium">Online</span>
                                  )}
                                </div>
                                <p className="text-surface-600 dark:text-surface-400 text-sm mb-2">@{user.username}</p>
                                <p className="text-surface-700 dark:text-surface-300 mb-3 text-sm leading-relaxed">{user.bio}</p>
                                <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400 mb-3">
                                  <span className="flex items-center">
                                    <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                                    {user.location}
                                  </span>
                                  <span>{user.followers.toLocaleString()} followers</span>
                                  <span>{user.mutualConnections} mutual</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {user.interests.slice(0, 4).map((interest) => (
                                    <span
                                      key={interest}
                                      className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 text-xs rounded-full"
                                    >
                                      {interest}
                                    </span>
                                  ))}
                                  {user.interests.length > 4 && (
                                    <span className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 text-xs rounded-full">
                                      +{user.interests.length - 4}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => handleViewProfile(user)}
                                className="px-4 py-2 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors duration-200 text-sm font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleMessageUser(user)}
                                className="px-4 py-2 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors duration-200 text-sm font-medium"
                              >
                                Message
                              </button>
                              <button
                                onClick={() => handleFollowToggle(user)}
                                disabled={loading}
                                className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium disabled:opacity-50 ${
                                  followedUsers.has(user.id)
                                    ? 'bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-500'
                                    : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-glow'
                                }`}
                              >
                                {loading ? 'Loading...' : followedUsers.has(user.id) ? 'Following' : 'Follow'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}
              
              {/* Suggestions Tab */}
              {activeTab === 'suggestions' && (
                <div className="space-y-6">
                  <div className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-surface-200/50 dark:border-surface-700/50">
                    <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-6 flex items-center">
                      <ApperIcon name="Users" className="w-6 h-6 mr-2 text-primary" />
                      People You May Know
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockUsers.filter(user => user.mutualConnections > 3 && !followedUsers.has(user.id)).map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-surface-50/50 dark:bg-surface-700/50 rounded-xl p-6 hover:bg-surface-100/50 dark:hover:bg-surface-600/50 transition-all duration-300"
                        >
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-xl font-medium">
                              {user.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-surface-900 dark:text-white">{user.name}</h4>
                                {user.verified && (
                                  <ApperIcon name="BadgeCheck" className="w-4 h-4 text-primary" />
                                )}
                              </div>
                              <p className="text-sm text-surface-600 dark:text-surface-400">@{user.username}</p>
                            </div>
                          </div>
                          <p className="text-sm text-surface-700 dark:text-surface-300 mb-3">{user.bio}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-surface-500 dark:text-surface-400">
                              {user.mutualConnections} mutual connections
                            </span>
                            <button
                              onClick={() => handleFollowToggle(user)}
                              disabled={loading}
                              className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-glow transition-all duration-300 text-sm font-medium disabled:opacity-50"
                            >
                              {loading ? 'Following...' : 'Follow'}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Following Tab */}
              {activeTab === 'following' && (
                <div className="space-y-6">
                  <div className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-surface-200/50 dark:border-surface-700/50">
                    <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-6 flex items-center">
                      <ApperIcon name="UserCheck" className="w-6 h-6 mr-2 text-primary" />
                      Following ({followedUsers.size})
                    </h3>
                    {followedUsers.size === 0 ? (
                      <div className="text-center py-12">
                        <ApperIcon name="UserPlus" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-surface-900 dark:text-white mb-2">Not following anyone yet</h4>
                        <p className="text-surface-600 dark:text-surface-400 mb-6">Discover and follow interesting people to see their content here</p>
                        <button
                          onClick={() => setActiveTab('discover')}
                          className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl hover:shadow-glow transition-all duration-300 font-medium"
                        >
                          Discover People
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mockUsers.filter(user => followedUsers.has(user.id)).map((user) => (
                          <motion.div
                            key={user.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-surface-50/50 dark:bg-surface-700/50 rounded-xl p-6 hover:bg-surface-100/50 dark:hover:bg-surface-600/50 transition-all duration-300"
                          >
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-xl font-medium">
                                  {user.avatar}
                                </div>
                                {user.isOnline && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent border-2 border-white dark:border-surface-700 rounded-full"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-semibold text-surface-900 dark:text-white">{user.name}</h4>
                                  {user.verified && (
                                    <ApperIcon name="BadgeCheck" className="w-4 h-4 text-primary" />
                                  )}
                                </div>
                                <p className="text-sm text-surface-600 dark:text-surface-400">@{user.username}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewProfile(user)}
                                className="flex-1 bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 px-4 py-2 rounded-lg hover:bg-surface-300 dark:hover:bg-surface-500 transition-colors duration-200 text-sm font-medium"
                              >
                                View Profile
                              </button>
                              <button
                                onClick={() => handleFollowToggle(user)}
                                disabled={loading}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50"
                              >
                                {loading ? 'Unfollowing...' : 'Unfollow'}
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Follow