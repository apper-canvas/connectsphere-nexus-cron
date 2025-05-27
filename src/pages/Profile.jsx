import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Profile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [darkMode, setDarkMode] = useState(false)

  // Mock user data
  const mockUsers = {
    1: {
      id: 1,
      name: "Sarah Chen",
      username: "@sarahc",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop",
      bio: "Full-stack developer passionate about creating amazing user experiences. Love coffee, coding, and connecting with fellow creators! 🚀☕️",
      location: "San Francisco, CA",
      website: "https://sarahchen.dev",
      joinDate: "March 2023",
      verified: true,
      stats: {
        posts: 142,
        followers: 2840,
        following: 385
      }
    },
    2: {
      id: 2,
      name: "Alex Rodriguez",
      username: "@alexr",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      cover: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=300&fit=crop",
      bio: "Nature photographer capturing moments that inspire. Always chasing the perfect sunset! 📸🌅",
      location: "Portland, OR",
      website: "https://alexphoto.com",
      joinDate: "January 2023",
      verified: false,
      stats: {
        posts: 89,
        followers: 1256,
        following: 523
      }
    }
  }

  const mockPosts = {
    1: [
      {
        id: 1,
        content: "Just launched my new project! Excited to share it with the ConnectSphere community 🚀",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop",
        likes: 24,
        comments: 8,
        timestamp: "2h ago",
        liked: false
      },
      {
        id: 3,
        content: "Working on some exciting new features. Can't wait to show you all what we've been building! 💻✨",
        image: null,
        likes: 45,
        comments: 12,
        timestamp: "1d ago",
        liked: true
      }
    ],
    2: [
      {
        id: 2,
        content: "Beautiful sunset from my evening walk. Nature never fails to inspire! 🌅",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
        likes: 156,
        comments: 23,
        timestamp: "4h ago",
        liked: true
      }
    ]
  }

  useEffect(() => {
    // Simulate API call to fetch user data
    setLoading(true)
    setTimeout(() => {
      const userData = mockUsers[userId] || mockUsers[1]
      const posts = mockPosts[userId] || []
      setUser(userData)
      setUserPosts(posts)
      setLoading(false)
    }, 800)
  }, [userId])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleFollow = () => {
    setFollowing(!following)
    if (!following) {
      toast.success(`Now following ${user.name}!`)
      setUser(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          followers: prev.stats.followers + 1
        }
      }))
    } else {
      toast.info(`Unfollowed ${user.name}`)
      setUser(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          followers: prev.stats.followers - 1
        }
      }))
    }
  }

  const handleMessage = () => {
    toast.success(`Opening conversation with ${user.name}...`)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Profile link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-surface-600 dark:text-surface-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="UserX" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">User not found</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-6">The profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
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
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors duration-200"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gradient">Profile</h1>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">{user.stats.posts} posts</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
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
                onClick={handleShare}
                className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-300 shadow-card"
              >
                <ApperIcon name="Share" className="w-4 h-4 sm:w-5 sm:h-5 text-surface-600 dark:text-surface-400" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Profile Content */}
      <main className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Cover Photo */}
            <div className="relative h-48 sm:h-64 lg:h-80 rounded-2xl sm:rounded-3xl overflow-hidden mb-6 shadow-card">
              <img
                src={user.cover}
                alt="Cover photo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            {/* Profile Info */}
            <div className="relative -mt-16 sm:-mt-20 mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl object-cover shadow-card border-4 border-white dark:border-surface-800"
                  />
                  {user.verified && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-glow">
                      <ApperIcon name="Check" className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-1">
                        {user.name}
                        {user.verified && (
                          <ApperIcon name="BadgeCheck" className="w-6 h-6 text-primary inline ml-2" />
                        )}
                      </h1>
                      <p className="text-surface-600 dark:text-surface-400 mb-2">{user.username}</p>
                      <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
                        {user.location && (
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="MapPin" className="w-4 h-4" />
                            <span>{user.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Calendar" className="w-4 h-4" />
                          <span>Joined {user.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleMessage}
                        className="px-4 py-2 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl transition-all duration-200 flex items-center space-x-2"
                      >
                        <ApperIcon name="MessageCircle" className="w-4 h-4" />
                        <span>Message</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleFollow}
                        className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                          following
                            ? "bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                            : "bg-gradient-to-r from-primary to-secondary text-white shadow-glow hover:shadow-float"
                        }`}
                      >
                        <ApperIcon name={following ? "UserMinus" : "UserPlus"} className="w-4 h-4" />
                        <span>{following ? "Unfollow" : "Follow"}</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <p className="text-surface-700 dark:text-surface-300 leading-relaxed mb-4">
                  {user.bio}
                </p>
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-primary hover:text-primary-dark transition-colors duration-200"
                  >
                    <ApperIcon name="ExternalLink" className="w-4 h-4" />
                    <span>{user.website}</span>
                  </a>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 mt-6">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
                    {user.stats.posts.toLocaleString()}
                  </div>
                  <div className="text-sm text-surface-600 dark:text-surface-400">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
                    {user.stats.followers.toLocaleString()}
                  </div>
                  <div className="text-sm text-surface-600 dark:text-surface-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
                    {user.stats.following.toLocaleString()}
                  </div>
                  <div className="text-sm text-surface-600 dark:text-surface-400">Following</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl p-2 mb-8 shadow-card border border-surface-200/50 dark:border-surface-700/50">
              {[
                { id: "posts", label: "Posts", icon: "Grid3X3" },
                { id: "media", label: "Media", icon: "Image" },
                { id: "likes", label: "Likes", icon: "Heart" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-glow"
                      : "text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Posts */}
            <AnimatePresence mode="wait">
              {activeTab === "posts" && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-card hover:shadow-float transition-all duration-300 border border-surface-200/50 dark:border-surface-700/50"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-xl object-cover shadow-card"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-surface-900 dark:text-white">{user.name}</h3>
                            <p className="text-surface-600 dark:text-surface-400 text-sm">{user.username} • {post.timestamp}</p>
                          </div>
                        </div>

                        <p className="text-surface-900 dark:text-white mb-4 leading-relaxed">{post.content}</p>

                        {post.image && (
                          <div className="mb-4 rounded-xl overflow-hidden shadow-card">
                            <img
                              src={post.image}
                              alt="Post content"
                              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        <div className="flex items-center space-x-6 pt-4 border-t border-surface-200/50 dark:border-surface-700/50">
                          <div className="flex items-center space-x-2 text-surface-600 dark:text-surface-400">
                            <ApperIcon name="Heart" className="w-4 h-4" fill={post.liked ? "currentColor" : "none"} />
                            <span className="text-sm">{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-surface-600 dark:text-surface-400">
                            <ApperIcon name="MessageCircle" className="w-4 h-4" />
                            <span className="text-sm">{post.comments}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-surface-600 dark:text-surface-400">
                            <ApperIcon name="Share" className="w-4 h-4" />
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <ApperIcon name="FileText" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">No posts yet</h3>
                      <p className="text-surface-600 dark:text-surface-400">{user.name} hasn't shared any posts.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {(activeTab === "media" || activeTab === "likes") && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <ApperIcon name="Construction" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">Coming Soon</h3>
                  <p className="text-surface-600 dark:text-surface-400">
                    The {activeTab} section is under development.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Profile