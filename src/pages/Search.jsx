import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Search = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('users')
  const [filters, setFilters] = useState({
    interests: [],
    location: '',
    userType: 'all',
    sortBy: 'relevance'
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({
    users: [],
    posts: [],
    groups: []
  })
  
  const navigate = useNavigate()
  const location = useLocation()
  
  // Mock data
  const mockUsers = [
    { id: 1, username: 'alice_wonder', name: 'Alice Wonder', avatar: '👩‍💻', bio: 'Full-stack developer passionate about AI', location: 'San Francisco', interests: ['tech', 'ai', 'coding'], followers: 1234, following: 567, verified: true },
    { id: 2, username: 'bob_creator', name: 'Bob Creator', avatar: '👨‍🎨', bio: 'Digital artist and UI/UX designer', location: 'New York', interests: ['art', 'design', 'creativity'], followers: 892, following: 234, verified: false },
    { id: 3, username: 'charlie_dev', name: 'Charlie Dev', avatar: '👨‍💼', bio: 'Startup founder and tech entrepreneur', location: 'Austin', interests: ['tech', 'startups', 'business'], followers: 2156, following: 789, verified: true },
    { id: 4, username: 'diana_photo', name: 'Diana Photo', avatar: '📸', bio: 'Travel photographer capturing moments', location: 'Los Angeles', interests: ['photography', 'travel', 'nature'], followers: 3421, following: 445, verified: true },
    { id: 5, username: 'eve_music', name: 'Eve Music', avatar: '🎵', bio: 'Music producer and sound engineer', location: 'Nashville', interests: ['music', 'audio', 'production'], followers: 1876, following: 322, verified: false }
  ]
  
  const mockPosts = [
    { id: 1, author: 'alice_wonder', avatar: '👩‍💻', content: 'Just launched my new AI project! Check it out 🚀', timestamp: '2 hours ago', likes: 45, comments: 12, shares: 8, type: 'text' },
    { id: 2, author: 'diana_photo', avatar: '📸', content: 'Sunset vibes from my latest trip to Bali', timestamp: '4 hours ago', likes: 128, comments: 23, shares: 15, type: 'image' },
    { id: 3, author: 'bob_creator', avatar: '👨‍🎨', content: 'New design system for mobile apps - thoughts?', timestamp: '6 hours ago', likes: 67, comments: 19, shares: 11, type: 'design' },
    { id: 4, author: 'eve_music', avatar: '🎵', content: 'Working on a new track in the studio tonight 🎹', timestamp: '8 hours ago', likes: 89, comments: 31, shares: 6, type: 'audio' }
  ]
  
  const mockGroups = [
    { id: 1, name: 'Tech Innovators', description: 'A community for tech enthusiasts and innovators', members: 12500, category: 'Technology', avatar: '💻', verified: true },
    { id: 2, name: 'Digital Artists Hub', description: 'Share your digital art and get feedback', members: 8900, category: 'Art & Design', avatar: '🎨', verified: false },
    { id: 3, name: 'Startup Founders', description: 'Connect with fellow entrepreneurs', members: 15600, category: 'Business', avatar: '🚀', verified: true },
    { id: 4, name: 'Photography Masters', description: 'Learn and share photography techniques', members: 22300, category: 'Photography', avatar: '📷', verified: true },
    { id: 5, name: 'Music Producers', description: 'Collaborate and share music production tips', members: 6700, category: 'Music', avatar: '🎼', verified: false }
  ]
  
  const interests = ['tech', 'art', 'music', 'photography', 'travel', 'food', 'fitness', 'gaming', 'fashion', 'business', 'science', 'sports']
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])
  
  useEffect(() => {
    // Get query from URL params
    const params = new URLSearchParams(location.search)
    const query = params.get('q')
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [location.search])
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }
  
  const performSearch = (query = searchQuery) => {
    if (!query.trim()) return
    
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const searchTerm = query.toLowerCase()
      
      // Filter users
      const filteredUsers = mockUsers.filter(user => {
        const matchesQuery = user.username.toLowerCase().includes(searchTerm) ||
                           user.name.toLowerCase().includes(searchTerm) ||
                           user.bio.toLowerCase().includes(searchTerm) ||
                           user.interests.some(interest => interest.toLowerCase().includes(searchTerm))
        
        const matchesInterests = filters.interests.length === 0 || 
                               filters.interests.some(interest => user.interests.includes(interest))
        
        const matchesLocation = !filters.location || 
                              user.location.toLowerCase().includes(filters.location.toLowerCase())
        
        return matchesQuery && matchesInterests && matchesLocation
      })
      
      // Filter posts
      const filteredPosts = mockPosts.filter(post => 
        post.content.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm)
      )
      
      // Filter groups
      const filteredGroups = mockGroups.filter(group =>
        group.name.toLowerCase().includes(searchTerm) ||
        group.description.toLowerCase().includes(searchTerm) ||
        group.category.toLowerCase().includes(searchTerm)
      )
      
      setResults({
        users: filteredUsers,
        posts: filteredPosts,
        groups: filteredGroups
      })
      setLoading(false)
    }, 800)
  }
  
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch()
      // Update URL
      const params = new URLSearchParams(location.search)
      params.set('q', searchQuery.trim())
      navigate(`/search?${params.toString()}`, { replace: true })
    }
  }
  
  const handleInterestToggle = (interest) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }
  
  const handleFollowUser = (user) => {
    toast.success(`You are now following ${user.name}`)
  }
  
  const handleViewProfile = (user) => {
    toast.info(`Viewing ${user.name}'s profile`)
  }
  
  const handleLikePost = (post) => {
    toast.success('Post liked!')
  }
  
  const handleJoinGroup = (group) => {
    toast.success(`You joined ${group.name}`)
  }
  
  const tabs = [
    { id: 'users', label: 'Users', icon: 'Users', count: results.users.length },
    { id: 'posts', label: 'Posts', icon: 'FileText', count: results.posts.length },
    { id: 'groups', label: 'Groups', icon: 'Users2', count: results.groups.length }
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
                  <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 hidden sm:block">Advanced Search</p>
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
            </div>
          </div>
        </div>
      </motion.header>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Search & Filters Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-surface-200/50 dark:border-surface-700/50 sticky top-24"
            >
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="relative">
                  <ApperIcon 
                    name="Search" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400 dark:text-surface-500" 
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search everything..."
                    className="w-full pl-10 pr-4 py-3 bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-3 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-medium hover:shadow-glow transition-all duration-300"
                >
                  Search
                </button>
              </form>
              
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
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                </div>
                
                {/* Clear Filters */}
                <button
                  onClick={() => setFilters({ interests: [], location: '', userType: 'all', sortBy: 'relevance' })}
                  className="w-full text-sm text-surface-500 dark:text-surface-400 hover:text-primary transition-colors duration-200"
                >
                  Clear all filters
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Results Section */}
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
                    {tab.count > 0 && (
                      <span className="bg-surface-200 dark:bg-surface-600 text-surface-600 dark:text-surface-300 text-xs px-2 py-0.5 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
            
            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-card border border-surface-200/50 dark:border-surface-700/50 text-center"
              >
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-surface-600 dark:text-surface-400">Searching...</p>
              </motion.div>
            )}
            
            {/* Results */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {/* Users Results */}
                {activeTab === 'users' && (
                  <div className="space-y-4">
                    {results.users.length === 0 ? (
                      <div className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-card border border-surface-200/50 dark:border-surface-700/50 text-center">
                        <ApperIcon name="UserX" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">No users found</h3>
                        <p className="text-surface-600 dark:text-surface-400">Try adjusting your search terms or filters</p>
                      </div>
                    ) : (
                      results.users.map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-surface-200/50 dark:border-surface-700/50 hover:shadow-float transition-all duration-300"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-2xl font-medium">
                                {user.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{user.name}</h3>
                                  {user.verified && (
                                    <ApperIcon name="BadgeCheck" className="w-5 h-5 text-primary" />
                                  )}
                                </div>
                                <p className="text-surface-600 dark:text-surface-400 text-sm mb-2">@{user.username}</p>
                                <p className="text-surface-700 dark:text-surface-300 mb-3">{user.bio}</p>
                                <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400 mb-3">
                                  <span className="flex items-center">
                                    <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                                    {user.location}
                                  </span>
                                  <span>{user.followers.toLocaleString()} followers</span>
                                  <span>{user.following.toLocaleString()} following</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {user.interests.map((interest) => (
                                    <span
                                      key={interest}
                                      className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 text-xs rounded-full"
                                    >
                                      {interest}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewProfile(user)}
                                className="px-4 py-2 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors duration-200 text-sm font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleFollowUser(user)}
                                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-glow transition-all duration-300 text-sm font-medium"
                              >
                                Follow
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
                
                {/* Posts Results */}
                {activeTab === 'posts' && (
                  <div className="space-y-4">
                    {results.posts.length === 0 ? (
                      <div className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-card border border-surface-200/50 dark:border-surface-700/50 text-center">
                        <ApperIcon name="FileX" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">No posts found</h3>
                        <p className="text-surface-600 dark:text-surface-400">Try searching for different keywords</p>
                      </div>
                    ) : (
                      results.posts.map((post) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-surface-200/50 dark:border-surface-700/50 hover:shadow-float transition-all duration-300"
                        >
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-lg font-medium">
                              {post.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-surface-900 dark:text-white">@{post.author}</h4>
                                <span className="text-surface-500 dark:text-surface-400 text-sm">{post.timestamp}</span>
                              </div>
                              <p className="text-surface-700 dark:text-surface-300">{post.content}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-surface-200/50 dark:border-surface-700/50">
                            <div className="flex items-center space-x-6">
                              <button
                                onClick={() => handleLikePost(post)}
                                className="flex items-center space-x-2 text-surface-500 dark:text-surface-400 hover:text-red-500 transition-colors duration-200"
                              >
                                <ApperIcon name="Heart" className="w-5 h-5" />
                                <span className="text-sm">{post.likes}</span>
                              </button>
                              <button className="flex items-center space-x-2 text-surface-500 dark:text-surface-400 hover:text-primary transition-colors duration-200">
                                <ApperIcon name="MessageCircle" className="w-5 h-5" />
                                <span className="text-sm">{post.comments}</span>
                              </button>
                              <button className="flex items-center space-x-2 text-surface-500 dark:text-surface-400 hover:text-primary transition-colors duration-200">
                                <ApperIcon name="Share" className="w-5 h-5" />
                                <span className="text-sm">{post.shares}</span>
                              </button>
                            </div>
                            <span className="text-xs text-surface-400 dark:text-surface-500 px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded-full">
                              {post.type}
                            </span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
                
                {/* Groups Results */}
                {activeTab === 'groups' && (
                  <div className="space-y-4">
                    {results.groups.length === 0 ? (
                      <div className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-card border border-surface-200/50 dark:border-surface-700/50 text-center">
                        <ApperIcon name="Users2" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">No groups found</h3>
                        <p className="text-surface-600 dark:text-surface-400">Try searching for different topics or categories</p>
                      </div>
                    ) : (
                      results.groups.map((group) => (
                        <motion.div
                          key={group.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-surface-200/50 dark:border-surface-700/50 hover:shadow-float transition-all duration-300"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-2xl font-medium">
                                {group.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{group.name}</h3>
                                  {group.verified && (
                                    <ApperIcon name="BadgeCheck" className="w-5 h-5 text-primary" />
                                  )}
                                </div>
                                <p className="text-surface-700 dark:text-surface-300 mb-3">{group.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
                                  <span className="flex items-center">
                                    <ApperIcon name="Users" className="w-4 h-4 mr-1" />
                                    {group.members.toLocaleString()} members
                                  </span>
                                  <span className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 rounded-full">
                                    {group.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleJoinGroup(group)}
                              className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-glow transition-all duration-300 font-medium"
                            >
                              Join
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search