import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      user: {
        name: 'Alice Wonder',
        username: '@alice_wonder',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      content: 'liked your post',
      post: {
        id: 123,
        excerpt: 'Just launched my new project! Excited to share...'
      },
      timestamp: '2 minutes ago',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: 2,
      type: 'comment',
      user: {
        name: 'Bob Creator',
        username: '@bob_creator',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      content: 'commented on your post',
      comment: 'This looks amazing! Great work 👏',
      post: {
        id: 123,
        excerpt: 'Just launched my new project! Excited to share...'
      },
      timestamp: '15 minutes ago',
      read: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: 3,
      type: 'follow',
      user: {
        name: 'Charlie Dev',
        username: '@charlie_dev',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      content: 'started following you',
      timestamp: '1 hour ago',
      read: true,
      createdAt: new Date(Date.now() - 60 * 60 * 1000)
    },
    {
      id: 4,
      type: 'message',
      user: {
        name: 'Diana Photo',
        username: '@diana_photo',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      content: 'sent you a message',
      message: 'Hey! I loved your latest post about...',
      timestamp: '2 hours ago',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 5,
      type: 'like',
      user: {
        name: 'Eve Music',
        username: '@eve_music',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      content: 'and 12 others liked your post',
      post: {
        id: 124,
        excerpt: 'Beautiful sunset from my evening walk...'
      },
      timestamp: '3 hours ago',
      read: true,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
    },
    {
      id: 6,
      type: 'follow',
      user: {
        name: 'Frank Artist',
        username: '@frank_artist',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      content: 'started following you',
      timestamp: '1 day ago',
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ])

  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [notificationsPerPage] = useState(10)

  const navigate = useNavigate()

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return { icon: 'Heart', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' }
      case 'comment':
        return { icon: 'MessageCircle', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' }
      case 'follow':
        return { icon: 'UserPlus', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' }
      case 'message':
        return { icon: 'Mail', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' }
      default:
        return { icon: 'Bell', color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-500/10' }
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read) ||
      notification.type === filter

    const matchesSearch = !searchQuery || 
      notification.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const indexOfLastNotification = currentPage * notificationsPerPage
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage
  const currentNotifications = filteredNotifications.slice(indexOfFirstNotification, indexOfLastNotification)
  const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = async (notificationId) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      )
      setLoading(false)
      toast.success('Notification marked as read')
    }, 500)
  }

  const handleMarkAsUnread = async (notificationId) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: false }
            : notification
        )
      )
      setLoading(false)
      toast.success('Notification marked as unread')
    }, 500)
  }

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        setSelectedNotifications(prev => {
          const newSet = new Set(prev)
          newSet.delete(notificationId)
          return newSet
        })
        setLoading(false)
        toast.success('Notification deleted successfully')
      }, 500)
    }
  }

  const handleMarkAllAsRead = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      )
      setLoading(false)
      toast.success('All notifications marked as read')
    }, 800)
  }

  const handleBulkAction = async (action) => {
    if (selectedNotifications.size === 0) {
      toast.warning('Please select notifications first')
      return
    }

    setLoading(true)
    const selectedIds = Array.from(selectedNotifications)

    // Simulate API call
    setTimeout(() => {
      if (action === 'read') {
        setNotifications(prev => 
          prev.map(notification => 
            selectedIds.includes(notification.id)
              ? { ...notification, read: true }
              : notification
          )
        )
        toast.success(`${selectedIds.length} notifications marked as read`)
      } else if (action === 'unread') {
        setNotifications(prev => 
          prev.map(notification => 
            selectedIds.includes(notification.id)
              ? { ...notification, read: false }
              : notification
          )
        )
        toast.success(`${selectedIds.length} notifications marked as unread`)
      } else if (action === 'delete') {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} notifications?`)) {
          setNotifications(prev => 
            prev.filter(notification => !selectedIds.includes(notification.id))
          )
          toast.success(`${selectedIds.length} notifications deleted`)
        }
      }
      
      setSelectedNotifications(new Set())
      setShowBulkActions(false)
      setLoading(false)
    }, 800)
  }

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev)
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId)
      } else {
        newSet.add(notificationId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedNotifications.size === currentNotifications.length) {
      setSelectedNotifications(new Set())
    } else {
      setSelectedNotifications(new Set(currentNotifications.map(n => n.id)))
    }
  }

  const handleNotificationClick = (notification) => {
    // Mark as read if unread
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'like':
      case 'comment':
        toast.info(`Viewing post: "${notification.post.excerpt}"`) 
        break
      case 'follow':
        navigate(`/profile/${notification.user.username}`)
        break
      case 'message':
        navigate('/messages')
        break
      default:
        break
    }
  }

  useEffect(() => {
    setShowBulkActions(selectedNotifications.size > 0)
  }, [selectedNotifications])

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200/50 dark:border-surface-700/50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-300"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </motion.button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow">
                  <ApperIcon name="Bell" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Notifications</h1>
                  <p className="text-sm text-surface-600 dark:text-surface-400">
                    {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-surface-200/50 dark:border-surface-700/50 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All', count: notifications.length },
                { id: 'unread', label: 'Unread', count: unreadCount },
                { id: 'like', label: 'Likes', count: notifications.filter(n => n.type === 'like').length },
                { id: 'comment', label: 'Comments', count: notifications.filter(n => n.type === 'comment').length },
                { id: 'follow', label: 'Follows', count: notifications.filter(n => n.type === 'follow').length },
                { id: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFilter(tab.id)
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                    filter === tab.id
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-glow"
                      : "bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{tab.count}</span>
                </motion.button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <ApperIcon 
                name="Search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400 dark:text-surface-500" 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="w-full lg:w-64 pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-300"
              />
            </div>
          </div>
        </motion.div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {showBulkActions && selectedNotifications.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-primary/10 dark:bg-primary/20 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-primary/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  {selectedNotifications.size} notification{selectedNotifications.size !== 1 ? 's' : ''} selected
                </span>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBulkAction('read')}
                    disabled={loading}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50"
                  >
                    Mark Read
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBulkAction('unread')}
                    disabled={loading}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50"
                  >
                    Mark Unread
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBulkAction('delete')}
                    disabled={loading}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50"
                  >
                    Delete
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedNotifications(new Set())}
                    className="px-3 py-1 bg-surface-500 hover:bg-surface-600 text-white rounded-lg text-sm font-medium transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Select All */}
        {currentNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSelectAll}
              className="flex items-center space-x-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-primary transition-colors duration-200"
            >
              <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                selectedNotifications.size === currentNotifications.length
                  ? 'bg-primary border-primary'
                  : 'border-surface-300 dark:border-surface-600'
              }`}>
                {selectedNotifications.size === currentNotifications.length && (
                  <ApperIcon name="Check" className="w-3 h-3 text-white" />
                )}
              </div>
              <span>
                {selectedNotifications.size === currentNotifications.length ? 'Deselect All' : 'Select All'}
              </span>
            </motion.button>
            
            <span className="text-sm text-surface-500 dark:text-surface-400">
              Showing {indexOfFirstNotification + 1}-{Math.min(indexOfLastNotification, filteredNotifications.length)} of {filteredNotifications.length}
            </span>
          </motion.div>
        )}

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          {currentNotifications.length === 0 ? (
            <div className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-12 text-center shadow-card border border-surface-200/50 dark:border-surface-700/50">
              <div className="w-16 h-16 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Bell" className="w-8 h-8 text-surface-400 dark:text-surface-500" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                {searchQuery ? 'No notifications found' : 'No notifications yet'}
              </h3>
              <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
                {searchQuery ? 'Try adjusting your search or filter criteria.' : 'When you get notifications, they\'ll appear here.'}
              </p>
            </div>
          ) : (
            currentNotifications.map((notification) => {
              const { icon, color, bg } = getNotificationIcon(notification.type)
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-card hover:shadow-float transition-all duration-300 border border-surface-200/50 dark:border-surface-700/50 cursor-pointer group ${
                    !notification.read ? 'ring-2 ring-primary/20' : ''
                  } ${
                    selectedNotifications.has(notification.id) ? 'ring-2 ring-primary/50 bg-primary/5' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Selection Checkbox */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectNotification(notification.id)
                      }}
                      className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                        selectedNotifications.has(notification.id)
                          ? 'bg-primary border-primary'
                          : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                      }`}
                    >
                      {selectedNotifications.has(notification.id) && (
                        <ApperIcon name="Check" className="w-3 h-3 text-white" />
                      )}
                    </motion.button>

                    {/* User Avatar */}
                    <img
                      src={notification.user.avatar}
                      alt={notification.user.name}
                      className="w-12 h-12 rounded-xl object-cover shadow-card"
                    />

                    {/* Notification Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                      <ApperIcon name={icon} className={`w-5 h-5 ${color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-surface-900 dark:text-white font-medium">
                            <span className="font-semibold">{notification.user.name}</span>
                            {' '}{notification.content}
                          </p>
                          
                          {notification.comment && (
                            <p className="text-surface-600 dark:text-surface-400 text-sm mt-1 italic">
                              "{notification.comment}"
                            </p>
                          )}
                          
                          {notification.message && (
                            <p className="text-surface-600 dark:text-surface-400 text-sm mt-1 italic">
                              "{notification.message}"
                            </p>
                          )}
                          
                          {notification.post && (
                            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
                              on: "{notification.post.excerpt}"
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-surface-500 dark:text-surface-400">
                              {notification.timestamp}
                            </span>
                            
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              notification.read ? handleMarkAsUnread(notification.id) : handleMarkAsRead(notification.id)
                            }}
                            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200"
                            title={notification.read ? 'Mark as unread' : 'Mark as read'}
                          >
                            <ApperIcon 
                              name={notification.read ? 'MailOpen' : 'Mail'} 
                              className="w-4 h-4 text-surface-500 dark:text-surface-400" 
                            />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteNotification(notification.id)
                            }}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                            title="Delete notification"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center space-x-2 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 dark:hover:bg-surface-700"
            >
              Previous
            </motion.button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow'
                    : 'bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
                }`}
              >
                {page}
              </motion.button>
            ))}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 dark:hover:bg-surface-700"
            >
              Next
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Notifications