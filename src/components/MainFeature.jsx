import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: "Sarah Chen",
        username: "@sarahc",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      },
      content: "Just launched my new project! Excited to share it with the ConnectSphere community 🚀",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop",
      likes: 24,
      comments: 8,
      timestamp: "2h ago",
      liked: false
    },
    {
      id: 2,
      author: {
        name: "Alex Rodriguez",
        username: "@alexr",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      content: "Beautiful sunset from my evening walk. Nature never fails to inspire! 🌅",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      likes: 156,
      comments: 23,
      timestamp: "4h ago",
      liked: true
    }
  ])

  const [newPost, setNewPost] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [activeTab, setActiveTab] = useState("feed")
  const fileInputRef = useRef(null)

  const sampleImages = [
    "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=300&fit=crop"
  ]

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real app, you'd upload to a server
      // For demo, we'll use a random sample image
      const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)]
      setSelectedImage(file)
      setImagePreview(randomImage)
    }
  }

  const handlePost = async () => {
    if (!newPost.trim() && !selectedImage) {
      toast.error("Please add some content to your post!")
      return
    }

    setIsPosting(true)

    // Simulate API call
    setTimeout(() => {
      const post = {
        id: Date.now(),
        author: {
          name: "You",
          username: "@you",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
        },
        content: newPost,
        image: imagePreview,
        likes: 0,
        comments: 0,
        timestamp: "now",
        liked: false
      }

      setPosts([post, ...posts])
      setNewPost("")
      setSelectedImage(null)
      setImagePreview("")
      setIsPosting(false)
      toast.success("Post shared successfully!")
    }, 1500)
  }

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked, 
            likes: post.liked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ))
    
    const post = posts.find(p => p.id === postId)
    if (!post.liked) {
      toast.success("Post liked! ❤️")
    }
  }

  const handleComment = (postId) => {
    toast.info("Comment feature coming soon!")
  }

  const handleShare = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, shares: (post.shares || 0) + 1 }
        : post
    ))
    toast.success("Post shared!")
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      {/* Tab Navigation */}
      <div className="flex bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-2 mb-6 sm:mb-8 shadow-card border border-surface-200/50 dark:border-surface-700/50">
        {[
          { id: "feed", label: "Feed", icon: "Home" },
          { id: "create", label: "Create", icon: "Plus" },
          { id: "trending", label: "Trending", icon: "TrendingUp" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-glow"
                : "text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"
            }`}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Create Post Tab */}
        {activeTab === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-card border border-surface-200/50 dark:border-surface-700/50 mb-6 sm:mb-8"
          >
            <div className="flex items-start space-x-4 mb-6">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
                alt="Your avatar"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover shadow-card"
              />
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's happening in your world?"
                  className="w-full p-4 sm:p-6 bg-surface-50 dark:bg-surface-900 rounded-xl sm:rounded-2xl border border-surface-200 dark:border-surface-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm sm:text-base transition-all duration-300"
                  rows="4"
                />
              </div>
            </div>

            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative mb-6 rounded-xl sm:rounded-2xl overflow-hidden shadow-card"
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 sm:h-64 object-cover"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null)
                    setImagePreview("")
                  }}
                  className="absolute top-3 right-3 p-2 bg-surface-900/70 rounded-xl text-white hover:bg-surface-900/90 transition-colors duration-200"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 p-3 bg-surface-100 dark:bg-surface-700 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors duration-200"
                >
                  <ApperIcon name="Image" className="w-4 h-4 sm:w-5 sm:h-5 text-surface-600 dark:text-surface-400" />
                  <span className="text-sm sm:text-base text-surface-600 dark:text-surface-400 hidden sm:inline">Photo</span>
                </button>
                
                <button className="flex items-center space-x-2 p-3 bg-surface-100 dark:bg-surface-700 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors duration-200">
                  <ApperIcon name="Smile" className="w-4 h-4 sm:w-5 sm:h-5 text-surface-600 dark:text-surface-400" />
                  <span className="text-sm sm:text-base text-surface-600 dark:text-surface-400 hidden sm:inline">Emoji</span>
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePost}
                disabled={isPosting || (!newPost.trim() && !selectedImage)}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isPosting || (!newPost.trim() && !selectedImage)
                    ? "bg-surface-300 dark:bg-surface-600 text-surface-500 dark:text-surface-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary to-secondary text-white shadow-glow hover:shadow-float"
                }`}
              >
                {isPosting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                <span className="text-sm sm:text-base">{isPosting ? "Posting..." : "Share Post"}</span>
                {!isPosting && <ApperIcon name="Send" className="w-4 h-4" />}
              </motion.button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </motion.div>
        )}

        {/* Feed Tab */}
        {(activeTab === "feed" || activeTab === "trending") && (
          <motion.div
            key="feed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 sm:space-y-8"
          >
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-card hover:shadow-float transition-all duration-300 border border-surface-200/50 dark:border-surface-700/50"
              >
                {/* Post Header */}
                <div className="flex items-center space-x-4 mb-4 sm:mb-6">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover shadow-card"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-surface-900 dark:text-white text-sm sm:text-base">{post.author.name}</h3>
                    <p className="text-surface-600 dark:text-surface-400 text-xs sm:text-sm">{post.author.username} • {post.timestamp}</p>
                  </div>
                  <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors duration-200">
                    <ApperIcon name="MoreHorizontal" className="w-4 h-4 sm:w-5 sm:h-5 text-surface-600 dark:text-surface-400" />
                  </button>
                </div>

                {/* Post Content */}
                <p className="text-surface-900 dark:text-white mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">{post.content}</p>

                {/* Post Image */}
                {post.image && (
                  <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden shadow-card">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-48 sm:h-64 lg:h-80 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-surface-200/50 dark:border-surface-700/50">
                  <div className="flex items-center space-x-4 sm:space-x-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                        post.liked
                          ? "text-red-500 bg-red-50 dark:bg-red-500/10"
                          : "text-surface-600 dark:text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                      }`}
                    >
                      <ApperIcon name={post.liked ? "Heart" : "Heart"} className="w-4 h-4 sm:w-5 sm:h-5" fill={post.liked ? "currentColor" : "none"} />
                      <span className="text-xs sm:text-sm font-medium">{post.likes}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleComment(post.id)}
                      className="flex items-center space-x-2 p-2 sm:p-3 rounded-xl text-surface-600 dark:text-surface-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-200"
                    >
                      <ApperIcon name="MessageCircle" className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-medium">{post.comments}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleShare(post.id)}
                      className="flex items-center space-x-2 p-2 sm:p-3 rounded-xl text-surface-600 dark:text-surface-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 transition-all duration-200"
                    >
                      <ApperIcon name="Share" className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-medium">{post.shares || 0}</span>
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 sm:p-3 rounded-xl text-surface-600 dark:text-surface-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 transition-all duration-200"
                  >
                    <ApperIcon name="Bookmark" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}

            {/* Load More */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 shadow-card hover:shadow-float">
                <span className="text-sm sm:text-base">Load More Posts</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default MainFeature