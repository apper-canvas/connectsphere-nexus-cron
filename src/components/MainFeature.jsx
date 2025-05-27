import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

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
      comments: [
        {
          id: 1,
          author: {
            name: "Alex Rodriguez",
            username: "@alexr",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          },
          content: "Congratulations! This looks amazing 🎉",
          timestamp: "1h ago",
          likes: 3
        },
        {
          id: 2,
          author: {
            name: "Emma Wilson",
            username: "@emmaw",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
          },
          content: "Can't wait to try it out! When will it be available?",
          timestamp: "45m ago",
          likes: 1
        }
      ],
      timestamp: "2h ago",
      liked: false,
      shares: 5
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
      comments: [
        {
          id: 3,
          author: {
            name: "Sarah Chen",
            username: "@sarahc",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
          },
          content: "Absolutely stunning! Where was this taken?",
          timestamp: "2h ago",
          likes: 8
        }
      ],
      timestamp: "4h ago",
      liked: true,
      shares: 12
    }
  ])


  const [newPost, setNewPost] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [activeTab, setActiveTab] = useState("feed")
  const [showComments, setShowComments] = useState({})
  const [newComment, setNewComment] = useState({})
  const [isCommenting, setIsCommenting] = useState({})
  const [showShareDialog, setShowShareDialog] = useState({})
  const [followedUsers, setFollowedUsers] = useState(new Set())
  const [hiddenPosts, setHiddenPosts] = useState(new Set())

  const [showOptionsMenu, setShowOptionsMenu] = useState({})

  const [isLiking, setIsLiking] = useState({})
  const [isSharing, setIsSharing] = useState({})

  const currentUser = { username: '@you', name: 'You' } // Simulated current user

  const navigate = useNavigate()

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

  const handleLike = async (postId) => {
    if (isLiking[postId]) return
    
    setIsLiking(prev => ({ ...prev, [postId]: true }))
    
    // Optimistic update
    const post = posts.find(p => p.id === postId)
    const wasLiked = post.liked
    
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked, 
            likes: post.liked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ))
    
    // Simulate API call
    setTimeout(() => {
      setIsLiking(prev => ({ ...prev, [postId]: false }))
      if (!wasLiked) {
        toast.success("Post liked! ❤️")
      } else {
        toast.info("Like removed")
      }
    }, 500)
  }

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const handleCommentChange = (postId, value) => {
    setNewComment(prev => ({
      ...prev,
      [postId]: value
    }))
  }

  const handleAddComment = async (postId) => {
    const commentText = newComment[postId]?.trim()
    if (!commentText || isCommenting[postId]) return

    setIsCommenting(prev => ({ ...prev, [postId]: true }))

    const comment = {
      id: Date.now(),
      author: {
        name: "You",
        username: "@you",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
      },
      content: commentText,
      timestamp: "now",
      likes: 0
    }

    // Simulate API call
    setTimeout(() => {
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              comments: [...post.comments, comment]
            }
          : post
      ))
      
      setNewComment(prev => ({ ...prev, [postId]: "" }))
      setIsCommenting(prev => ({ ...prev, [postId]: false }))
      toast.success("Comment added successfully!")
    }, 800)
  }

  const handleLikeComment = (postId, commentId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: post.comments.map(comment =>
              comment.id === commentId
                ? { ...comment, likes: comment.likes + 1 }
                : comment
            )
          }
        : post
    ))
    toast.success("Comment liked!")
  }

  const toggleShareDialog = (postId) => {
    setShowShareDialog(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const handleShare = async (postId, platform = 'general') => {
    if (isSharing[postId]) return
    
    setIsSharing(prev => ({ ...prev, [postId]: true }))
    
    const post = posts.find(p => p.id === postId)
    const shareUrl = `${window.location.origin}/post/${postId}`
    const shareText = `Check out this post by ${post.author.name}: "${post.content.substring(0, 100)}..."`
    
    try {
      switch (platform) {
        case 'copy':
          await navigator.clipboard.writeText(shareUrl)
          toast.success("Link copied to clipboard!")
          break
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
          toast.success("Opening Facebook...")
          break
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
          toast.success("Opening Twitter...")
          break
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
          toast.success("Opening WhatsApp...")
          break
        case 'email':
          window.open(`mailto:?subject=${encodeURIComponent('Check out this post')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`, '_blank')
          toast.success("Opening email client...")
          break
        default:
          // General share - increment counter
          setPosts(posts.map(p => 
            p.id === postId 
              ? { ...p, shares: (p.shares || 0) + 1 }
              : p
          ))
          toast.success("Post shared!")
      }
      
      setShowShareDialog(prev => ({ ...prev, [postId]: false }))
    } catch (error) {
      toast.error("Failed to share post")
    } finally {
      setTimeout(() => {
        setIsSharing(prev => ({ ...prev, [postId]: false }))
      }, 500)
    }
  }

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`)
  }

  const toggleOptionsMenu = (postId) => {
    setShowOptionsMenu(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const handleEditPost = (postId) => {
    const post = posts.find(p => p.id === postId)
    toast.info(`Edit post: "${post.content.substring(0, 50)}..."`)
    setShowOptionsMenu(prev => ({ ...prev, [postId]: false }))
  }

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== postId))
      toast.success('Post deleted successfully!')
      setShowOptionsMenu(prev => ({ ...prev, [postId]: false }))
    }
  }

  const handleReportPost = (postId) => {
    toast.warning('Post reported. We\'ll review it shortly.')
    setShowOptionsMenu(prev => ({ ...prev, [postId]: false }))
  }

  const handleSavePost = (postId) => {
    toast.success('Post saved to your collection!')
    setShowOptionsMenu(prev => ({ ...prev, [postId]: false }))
  }

  const handleFollowUser = (userId, userName) => {
    const isCurrentlyFollowed = followedUsers.has(userId)
    
    setFollowedUsers(prev => {
      const newSet = new Set(prev)
      if (isCurrentlyFollowed) {
        newSet.delete(userId)
        toast.info(`Unfollowed ${userName}`)
      } else {
        newSet.add(userId)
        toast.success(`Now following ${userName}!`)
      }
      return newSet
    })
    
    setShowOptionsMenu(prev => ({ ...prev, [userId]: false }))
  }

  const handleHidePost = (postId) => {
    setHiddenPosts(prev => new Set(prev).add(postId))
    toast.success('Post hidden from your feed')
    setShowOptionsMenu(prev => ({ ...prev, [postId]: false }))
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
            {posts.filter(post => !hiddenPosts.has(post.id)).map((post) => (

            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-card hover:shadow-float transition-all duration-300 border border-surface-200/50 dark:border-surface-700/50"
              >
                {/* Post Header */}
                {/* Post Header */}
                <div className="flex items-center space-x-4 mb-4 sm:mb-6">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    onClick={() => handleUserClick(post.author.id || post.id)}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover shadow-card cursor-pointer hover:shadow-float transition-all duration-200"
                  />
                  <div className="flex-1" onClick={() => handleUserClick(post.author.id || post.id)}>
                    <h3 className="font-semibold text-surface-900 dark:text-white text-sm sm:text-base cursor-pointer hover:text-primary transition-colors duration-200">{post.author.name}</h3>
                    <p className="text-surface-600 dark:text-surface-400 text-xs sm:text-sm cursor-pointer hover:text-primary transition-colors duration-200">{post.author.username} • {post.timestamp}</p>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => toggleOptionsMenu(post.id)}
                      className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors duration-200"
                    >
                      <ApperIcon name="MoreHorizontal" className="w-4 h-4 sm:w-5 sm:h-5 text-surface-600 dark:text-surface-400" />
                    </button>
                    
                    {/* Options Dropdown */}
                    {showOptionsMenu[post.id] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute top-full right-0 mt-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-float p-2 z-50 min-w-[160px]"
                      >
                        {/* Conditional options based on post ownership */}
                        {post.author.username === currentUser.username ? (
                          <>
                            <button
                              onClick={() => handleEditPost(post.id)}
                              className="w-full flex items-center space-x-3 p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200 text-left"
                            >
                              <ApperIcon name="Edit" className="w-4 h-4 text-surface-500" />
                              <span className="text-sm text-surface-700 dark:text-surface-300">Edit Post</span>
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="w-full flex items-center space-x-3 p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200 text-left"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-surface-700 dark:text-surface-300">Delete Post</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleReportPost(post.id)}
                              className="w-full flex items-center space-x-3 p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200 text-left"
                            >
                              <ApperIcon name="Flag" className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-surface-700 dark:text-surface-300">Report Post</span>
                            </button>
                            <button
                              onClick={() => handleSavePost(post.id)}
                              className="w-full flex items-center space-x-3 p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200 text-left"
                            >
                              <ApperIcon name="Bookmark" className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-surface-700 dark:text-surface-300">Save Post</span>
                            </button>
                          </>
                        )}
                        
                        {/* Common options for all posts */}
                        <button
                          onClick={() => handleHidePost(post.id)}
                          className="w-full flex items-center space-x-3 p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200 text-left"
                        >
                          <ApperIcon name="EyeOff" className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-surface-700 dark:text-surface-300">Hide Post</span>
                        </button>
                        
                        {/* Follow option for posts from other users */}
                        {post.author.username !== currentUser.username && (
                          <button
                            onClick={() => handleFollowUser(post.author.username, post.author.name)}
                            className="w-full flex items-center space-x-3 p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200 text-left"
                          >
                            <ApperIcon 
                              name={followedUsers.has(post.author.username) ? "UserMinus" : "UserPlus"} 
                              className={`w-4 h-4 ${followedUsers.has(post.author.username) ? 'text-red-500' : 'text-primary'}`} 
                            />
                            <span className="text-sm text-surface-700 dark:text-surface-300">
                              {followedUsers.has(post.author.username) ? 'Unfollow' : 'Follow'} {post.author.name}
                            </span>
                          </button>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>

                      </motion.div>
                    )}
                  </div>
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
                <div className="pt-4 sm:pt-6 border-t border-surface-200/50 dark:border-surface-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 sm:space-x-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(post.id)}
                        disabled={isLiking[post.id]}
                        className={`flex items-center space-x-2 p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                          post.liked
                            ? "text-red-500 bg-red-50 dark:bg-red-500/10"
                            : "text-surface-600 dark:text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                        } ${isLiking[post.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isLiking[post.id] ? (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ApperIcon name="Heart" className="w-4 h-4 sm:w-5 sm:h-5" fill={post.liked ? "currentColor" : "none"} />
                        )}
                        <span className="text-xs sm:text-sm font-medium">{post.likes}</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center space-x-2 p-2 sm:p-3 rounded-xl text-surface-600 dark:text-surface-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-200"
                      >
                        <ApperIcon name="MessageCircle" className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm font-medium">{post.comments.length}</span>
                      </motion.button>

                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleShareDialog(post.id)}
                          disabled={isSharing[post.id]}
                          className={`flex items-center space-x-2 p-2 sm:p-3 rounded-xl text-surface-600 dark:text-surface-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 transition-all duration-200 ${
                            isSharing[post.id] ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {isSharing[post.id] ? (
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <ApperIcon name="Share" className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                          <span className="text-xs sm:text-sm font-medium">{post.shares || 0}</span>
                        </motion.button>

                        {/* Share Dialog */}
                        <AnimatePresence>
                          {showShareDialog[post.id] && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 10 }}
                              className="absolute bottom-full left-0 mb-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-float p-3 z-50 min-w-[200px]"
                            >
                              <div className="text-xs font-medium text-surface-600 dark:text-surface-400 mb-2 px-2">
                                Share this post
                              </div>
                              <div className="space-y-1">
                                <button
                                  onClick={() => handleShare(post.id, 'copy')}
                                  className="w-full flex items-center space-x-3 p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200 text-left"
                                >
                                  <ApperIcon name="Copy" className="w-4 h-4 text-surface-500" />
                                  <span className="text-sm text-surface-700 dark:text-surface-300">Copy link</span>
                                </button>
                                <button
                                  onClick={() => handleShare(post.id, 'facebook')}
                                  className="w-full flex items-center space-x-3 p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200 text-left"
                                >
                                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">f</span>
                                  </div>
                                  <span className="text-sm text-surface-700 dark:text-surface-300">Facebook</span>
                                </button>
                                <button
                                  onClick={() => handleShare(post.id, 'twitter')}
                                  className="w-full flex items-center space-x-3 p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200 text-left"
                                >
                                  <div className="w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
                                    <ApperIcon name="Twitter" className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="text-sm text-surface-700 dark:text-surface-300">Twitter</span>
                                </button>
                                <button
                                  onClick={() => handleShare(post.id, 'whatsapp')}
                                  className="w-full flex items-center space-x-3 p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200 text-left"
                                >
                                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <ApperIcon name="Phone" className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="text-sm text-surface-700 dark:text-surface-300">WhatsApp</span>
                                </button>
                                <button
                                  onClick={() => handleShare(post.id, 'email')}
                                  className="w-full flex items-center space-x-3 p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200 text-left"
                                >
                                  <ApperIcon name="Mail" className="w-4 h-4 text-surface-500" />
                                  <span className="text-sm text-surface-700 dark:text-surface-300">Email</span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 sm:p-3 rounded-xl text-surface-600 dark:text-surface-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 transition-all duration-200"
                    >
                      <ApperIcon name="Bookmark" className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {showComments[post.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-surface-200/50 dark:border-surface-700/50 pt-4"
                      >
                        {/* Comment Input */}
                        <div className="flex items-start space-x-3 mb-4">
                          <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
                            alt="Your avatar"
                            className="w-8 h-8 rounded-lg object-cover shadow-sm"
                          />
                          <div className="flex-1">
                            <div className="relative">
                              <textarea
                                value={newComment[post.id] || ""}
                                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full p-3 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-none transition-all duration-300"
                                rows="2"
                                maxLength="500"
                              />
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-surface-400 dark:text-surface-500">
                                  {(newComment[post.id] || "").length}/500
                                </span>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleAddComment(post.id)}
                                  disabled={!newComment[post.id]?.trim() || isCommenting[post.id]}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                                    !newComment[post.id]?.trim() || isCommenting[post.id]
                                      ? "bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-500 cursor-not-allowed"
                                      : "bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-md"
                                  }`}
                                >
                                  {isCommenting[post.id] && (
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  )}
                                  <span>{isCommenting[post.id] ? "Posting..." : "Comment"}</span>
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-3">
                          {post.comments.map((comment) => (
                            <motion.div
                              key={comment.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-start space-x-3"
                            >
                              <img
                                src={comment.author.avatar}
                                alt={comment.author.name}
                                className="w-8 h-8 rounded-lg object-cover shadow-sm"
                              />
                              <div className="flex-1">
                                <div className="bg-surface-50 dark:bg-surface-900 rounded-xl p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-sm text-surface-900 dark:text-white">
                                      {comment.author.name}
                                    </span>
                                    <span className="text-xs text-surface-500 dark:text-surface-400">
                                      {comment.author.username}
                                    </span>
                                    <span className="text-xs text-surface-400 dark:text-surface-500">•</span>
                                    <span className="text-xs text-surface-400 dark:text-surface-500">
                                      {comment.timestamp}
                                    </span>
                                  </div>
                                  <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
                                    {comment.content}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-4 mt-2 pl-3">
                                  <button
                                    onClick={() => handleLikeComment(post.id, comment.id)}
                                    className="flex items-center space-x-1 text-xs text-surface-500 dark:text-surface-400 hover:text-red-500 transition-colors duration-200"
                                  >
                                    <ApperIcon name="Heart" className="w-3 h-3" />
                                    <span>{comment.likes}</span>
                                  </button>
                                  <button className="text-xs text-surface-500 dark:text-surface-400 hover:text-primary transition-colors duration-200">
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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