import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'


const Home = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchRef = useRef(null)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'like', user: 'Alice Wonder', content: 'liked your post', read: false },
    { id: 2, type: 'comment', user: 'Bob Creator', content: 'commented on your post', read: false },
    { id: 3, type: 'follow', user: 'Charlie Dev', content: 'started following you', read: true }
  ])

  const unreadNotifications = notifications.filter(n => !n.read).length

  const navigate = useNavigate()

  // Mock users data for search suggestions
  const mockUsers = [
    { id: 1, username: 'alice_wonder', name: 'Alice Wonder', avatar: '👩‍💻', interests: ['tech', 'gaming'] },
    { id: 2, username: 'bob_creator', name: 'Bob Creator', avatar: '👨‍🎨', interests: ['art', 'design'] },
    { id: 3, username: 'charlie_dev', name: 'Charlie Dev', avatar: '👨‍💼', interests: ['tech', 'startups'] },
    { id: 4, username: 'diana_photo', name: 'Diana Photo', avatar: '📸', interests: ['photography', 'travel'] },
    { id: 5, username: 'eve_music', name: 'Eve Music', avatar: '🎵', interests: ['music', 'concerts'] }
  ]


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

  // Handle clicks outside search to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])


  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    setHighlightedIndex(-1)
    
    if (query.trim()) {
      const filtered = mockUsers.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.interests.some(interest => interest.toLowerCase().includes(query.toLowerCase()))
      )
      setSearchResults(filtered.slice(0, 5))
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const handleKeyDown = (e) => {
    if (!showSearchResults) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
          handleUserSelect(searchResults[highlightedIndex])
        } else if (searchQuery.trim()) {
          handleSearchSubmit(e)
        }
        break
      case 'Escape':
        setShowSearchResults(false)
        setHighlightedIndex(-1)
        break
    }
  }


  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearchResults(false)
    }
  }

  const handleUserSelect = (user) => {
    navigate(`/profile/${user.id}`)
    setSearchQuery('')
    setShowSearchResults(false)
    setHighlightedIndex(-1)
  }


  const handleAdvancedSearch = () => {
    navigate('/search')
    setSearchQuery('')
    setShowSearchResults(false)
    setHighlightedIndex(-1)
  }


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-pulse-soft"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-accent/10 rounded-full blur-xl animate-bounce-gentle"></div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200/50 dark:border-surface-700/50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow">
                <ApperIcon name="Globe" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gradient">ConnectSphere</h1>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 hidden sm:block">Social Network Platform</p>
              </div>
            </div>
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <ApperIcon 
                    name="Search" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400 dark:text-surface-500" 
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (searchResults.length > 0) {
                        setShowSearchResults(true)
                      }
                    }}
                    placeholder="Search users, posts, groups..."
                    className="w-full pl-10 pr-12 py-2 sm:py-3 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={handleAdvancedSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-surface-400 hover:text-primary transition-colors duration-200"
                    title="Advanced Search"
                  >
                    <ApperIcon name="SlidersHorizontal" className="w-4 h-4" />
                  </button>
                </div>
              </form>


              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-float z-50 max-h-80 overflow-y-auto"
                >
                  <div className="p-2">
                    <div className="text-xs font-medium text-surface-500 dark:text-surface-400 px-3 py-2 border-b border-surface-100 dark:border-surface-700">
                      Users ({searchResults.length})
                    </div>
                    {searchResults.map((user, index) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 text-left ${
                          index === highlightedIndex
                            ? 'bg-primary/10 dark:bg-primary/20'
                            : 'hover:bg-surface-50 dark:hover:bg-surface-700'
                        }`}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-medium">
                          {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-surface-900 dark:text-white text-sm truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-surface-500 dark:text-surface-400 truncate">
                            @{user.username}
                          </div>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={handleAdvancedSearch}
                      className="w-full p-3 text-center text-sm text-primary hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200 border-t border-surface-100 dark:border-surface-700"
                    >
                      View all results →
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

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
                onClick={() => navigate('/follow')}
                className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-300 shadow-card"
                title="Follow Users"
              >
                <ApperIcon name="UserPlus" className="w-4 h-4 sm:w-5 sm:h-5 text-surface-600 dark:text-surface-400" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/messages')}
                className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-300 shadow-card"
                title="Messages"
              >
                <ApperIcon name="MessageCircle" className="w-4 h-4 sm:w-5 sm:h-5 text-surface-600 dark:text-surface-400" />
              </motion.button>


              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/notifications')}
                className="relative p-2 sm:p-3 rounded-xl bg-primary hover:bg-primary-dark transition-all duration-300 shadow-glow"
                title="Notifications"
              >
                <ApperIcon name="Bell" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                {unreadNotifications > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white dark:border-surface-900 rounded-full flex items-center justify-center"
                  >
                    <span className="text-xs font-bold text-white">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  </motion.div>
                )}
              </motion.button>
            </div>

          </div>

        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-surface-900 dark:text-white mb-4 sm:mb-6">
              <span className="text-gradient block sm:inline"></span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto leading-relaxed">
            </p>

          </motion.div>

          {/* Main Feature */}
          <MainFeature />

        </div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="relative z-10 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-t border-surface-200/50 dark:border-surface-700/50 mt-12 sm:mt-16 lg:mt-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <p className="text-sm sm:text-base text-surface-600 dark:text-surface-400">
              © 2024 ConnectSphere. Bringing people together, one connection at a time.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home