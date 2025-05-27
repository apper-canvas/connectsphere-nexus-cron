import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import io from 'socket.io-client'

const Messages = () => {
  const navigate = useNavigate()
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState({})
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [unreadCounts, setUnreadCounts] = useState({})
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [messageReactions, setMessageReactions] = useState({})
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Mock current user
  const currentUser = {
    id: 'user1',
    name: 'You',
    username: '@you',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    status: 'online'
  }

  // Mock users for search and chat creation
  const mockUsers = [
    {
      id: 'user2',
      name: 'Sarah Chen',
      username: '@sarahc',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      lastSeen: null
    },
    {
      id: 'user3',
      name: 'Alex Rodriguez',
      username: '@alexr',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      status: 'offline',
      lastSeen: '2 hours ago'
    },
    {
      id: 'user4',
      name: 'Emma Wilson',
      username: '@emmaw',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      status: 'online',
      lastSeen: null
    },
    {
      id: 'user5',
      name: 'Michael Brown',
      username: '@michaelb',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'away',
      lastSeen: '15 minutes ago'
    }
  ]

  // Mock conversations
  const mockConversations = [
    {
      id: 'conv1',
      type: 'direct',
      participants: ['user1', 'user2'],
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      lastMessage: {
        content: 'Hey! How\'s the new project going?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        senderId: 'user2'
      },
      status: 'online'
    },
    {
      id: 'conv2',
      type: 'direct',
      participants: ['user1', 'user3'],
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      lastMessage: {
        content: 'Thanks for the feedback on my photos!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        senderId: 'user3'
      },
      status: 'offline'
    },
    {
      id: 'conv3',
      type: 'group',
      participants: ['user1', 'user2', 'user4', 'user5'],
      name: 'Team ConnectSphere',
      avatar: null,
      lastMessage: {
        content: 'Meeting scheduled for tomorrow at 2 PM',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        senderId: 'user4'
      },
      status: 'active'
    }
  ]

  // Mock messages
  const mockMessages = {
    conv1: [
      {
        id: 'msg1',
        content: 'Hi there! How are you doing?',
        senderId: 'user1',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: 'read',
        reactions: { '👍': ['user2'], '❤️': ['user2'] }
      },
      {
        id: 'msg2',
        content: 'I\'m doing great! Just finished a big project. How about you?',
        senderId: 'user2',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 60 * 1000),
        status: 'read',
        reactions: { '🎉': ['user1'] }
      },
      {
        id: 'msg3',
        content: 'That\'s awesome! I\'d love to hear more about it.',
        senderId: 'user1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'read'
      },
      {
        id: 'msg4',
        content: 'Hey! How\'s the new project going?',
        senderId: 'user2',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'delivered'
      }
    ],
    conv2: [
      {
        id: 'msg5',
        content: 'Your latest photo series is incredible!',
        senderId: 'user1',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: 'read'
      },
      {
        id: 'msg6',
        content: 'Thanks for the feedback on my photos!',
        senderId: 'user3',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'read'
      }
    ],
    conv3: [
      {
        id: 'msg7',
        content: 'Welcome to the team chat everyone!',
        senderId: 'user2',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: 'read'
      },
      {
        id: 'msg8',
        content: 'Excited to work with you all!',
        senderId: 'user4',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: 'read'
      },
      {
        id: 'msg9',
        content: 'Meeting scheduled for tomorrow at 2 PM',
        senderId: 'user4',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'delivered'
      }
    ]
  }

  const emojis = ['😀', '😂', '❤️', '👍', '👎', '😮', '😢', '😡', '🎉', '🔥', '💯', '👏']

  useEffect(() => {
    // Initialize conversations and messages
    setConversations(mockConversations)
    setMessages(mockMessages)
    setUnreadCounts({ conv1: 1, conv3: 2 })
    setOnlineUsers(new Set(['user2', 'user4']))

    // Initialize Socket.IO connection (simulated)
    const newSocket = {
      connected: true,
      on: (event, callback) => {
        // Simulate socket events
        if (event === 'connect') {
          setTimeout(() => callback(), 1000)
        }
      },
      emit: (event, data) => {
        console.log('Socket emit:', event, data)
        // Simulate real-time updates
        if (event === 'typing') {
          simulateTyping(data)
        }
      },
      disconnect: () => {
        setIsConnected(false)
      }
    }
    
    setSocket(newSocket)
    setIsConnected(true)
    toast.success('Connected to messaging service')

    // Simulate receiving messages
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        simulateIncomingMessage()
      }
    }, 10000)

    return () => {
      clearInterval(interval)
      if (newSocket) {
        newSocket.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedConversation])

  const simulateTyping = (data) => {
    setIsTyping(prev => ({ ...prev, [data.conversationId]: data.isTyping ? data.userId : null }))
    if (data.isTyping) {
      setTimeout(() => {
        setIsTyping(prev => ({ ...prev, [data.conversationId]: null }))
      }, 3000)
    }
  }

  const simulateIncomingMessage = () => {
    const randomConv = conversations[Math.floor(Math.random() * conversations.length)]
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    const randomMessages = [
      'Hey! What\'s up?',
      'Just saw your latest post, amazing!',
      'Are you free for a call later?',
      'Thanks for your help earlier!',
      'Looking forward to our meeting'
    ]

    const newMessage = {
      id: `msg_${Date.now()}`,
      content: randomMessages[Math.floor(Math.random() * randomMessages.length)],
      senderId: randomUser.id,
      timestamp: new Date(),
      status: 'delivered'
    }

    setMessages(prev => ({
      ...prev,
      [randomConv.id]: [...(prev[randomConv.id] || []), newMessage]
    }))

    setUnreadCounts(prev => ({
      ...prev,
      [randomConv.id]: (prev[randomConv.id] || 0) + 1
    }))

    // Play notification sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LyvmgbBT2X3++7eiMFl')
    audio.volume = 0.3
    audio.play().catch(() => {})

    toast.info(`New message from ${randomUser.name}`)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message = {
      id: `msg_${Date.now()}`,
      content: newMessage.trim(),
      senderId: currentUser.id,
      timestamp: new Date(),
      status: 'sending'
    }

    // Optimistically add message
    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), message]
    }))

    setNewMessage('')

    // Simulate sending
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id].map(msg =>
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        )
      }))
      toast.success('Message sent!')
    }, 1000)

    // Simulate read receipt
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id].map(msg =>
          msg.id === message.id ? { ...msg, status: 'read' } : msg
        )
      }))
    }, 3000)
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value)
    
    if (socket && selectedConversation) {
      socket.emit('typing', {
        conversationId: selectedConversation.id,
        userId: currentUser.id,
        isTyping: e.target.value.length > 0
      })

      // Clear typing indicator after 1 second of no typing
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          conversationId: selectedConversation.id,
          userId: currentUser.id,
          isTyping: false
        })
      }, 1000)
    }
  }

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleReaction = (messageId, emoji) => {
    setMessageReactions(prev => {
      const messageReactions = prev[messageId] || {}
      const emojiReactions = messageReactions[emoji] || []
      const hasReacted = emojiReactions.includes(currentUser.id)
      
      return {
        ...prev,
        [messageId]: {
          ...messageReactions,
          [emoji]: hasReacted 
            ? emojiReactions.filter(id => id !== currentUser.id)
            : [...emojiReactions, currentUser.id]
        }
      }
    })
    toast.success(`Reacted with ${emoji}`)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      toast.success(`File "${file.name}" uploaded successfully!`)
      // In a real app, you'd upload the file and send a message with the file URL
    }
  }

  const handleSearchConversations = (query) => {
    setSearchQuery(query)
    // In a real app, you'd filter conversations based on the search query
  }

  const handleNewChat = () => {
    setShowNewChatModal(true)
  }

  const handleCreateChat = () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user')
      return
    }

    const newConversation = {
      id: `conv_${Date.now()}`,
      type: selectedUsers.length === 1 ? 'direct' : 'group',
      participants: [currentUser.id, ...selectedUsers.map(u => u.id)],
      name: selectedUsers.length === 1 
        ? selectedUsers[0].name 
        : `Group with ${selectedUsers.map(u => u.name).join(', ')}`,
      avatar: selectedUsers.length === 1 ? selectedUsers[0].avatar : null,
      lastMessage: null,
      status: 'active'
    }

    setConversations(prev => [newConversation, ...prev])
    setMessages(prev => ({ ...prev, [newConversation.id]: [] }))
    setSelectedConversation(newConversation)
    setShowNewChatModal(false)
    setSelectedUsers([])
    toast.success('New conversation created!')
  }

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u.id === user.id)
      if (isSelected) {
        return prev.filter(u => u.id !== user.id)
      } else {
        return [...prev, user]
      }
    })
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const diff = now - new Date(timestamp)
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (hours > 24) {
      return new Date(timestamp).toLocaleDateString()
    } else if (hours > 0) {
      return `${hours}h ago`
    } else if (minutes > 0) {
      return `${minutes}m ago`
    } else {
      return 'Just now'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sending': return 'Clock'
      case 'delivered': return 'Check'
      case 'read': return 'CheckCheck'
      default: return 'Check'
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                <h1 className="text-xl sm:text-2xl font-bold text-gradient">Messages</h1>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">
                  {isConnected ? (
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Connected</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Connecting...</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNewChat}
                className="p-2 sm:p-3 rounded-xl bg-primary hover:bg-primary-dark transition-all duration-300 shadow-card"
                title="New Chat"
              >
                <ApperIcon name="Plus" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
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

      {/* Main Content */}
      <div className="flex h-[calc(100vh-5rem)] sm:h-[calc(100vh-5rem)]">
        {/* Conversations Sidebar */}
        <motion.div 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full sm:w-80 border-r border-surface-200/50 dark:border-surface-700/50 bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm"
        >
          {/* Search */}
          <div className="p-4 border-b border-surface-200/50 dark:border-surface-700/50">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400 dark:text-surface-500" 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchConversations(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-300"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="overflow-y-auto h-full">
            {filteredConversations.map((conversation) => {
              const unreadCount = unreadCounts[conversation.id] || 0
              const isSelected = selectedConversation?.id === conversation.id
              
              return (
                <motion.button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation)
                    setUnreadCounts(prev => ({ ...prev, [conversation.id]: 0 }))
                  }}
                  className={`w-full p-4 flex items-center space-x-3 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200 border-b border-surface-100 dark:border-surface-700/50 ${
                    isSelected ? 'bg-primary/10 border-r-2 border-r-primary' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    {conversation.avatar ? (
                      <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                        <ApperIcon name="Users" className="w-6 h-6 text-white" />
                      </div>
                    )}
                    {conversation.type === 'direct' && (
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-surface-800 ${
                        getStatusColor(conversation.status)
                      }`}></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-surface-900 dark:text-white truncate">
                        {conversation.name}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-surface-500 dark:text-surface-400">
                          {formatTimestamp(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-surface-600 dark:text-surface-400 truncate">
                        {conversation.lastMessage ? conversation.lastMessage.content : 'No messages yet'}
                      </p>
                      {unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] h-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 border-b border-surface-200/50 dark:border-surface-700/50 bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-3">
                  {selectedConversation.avatar ? (
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                      <ApperIcon name="Users" className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-surface-900 dark:text-white">
                      {selectedConversation.name}
                    </h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {selectedConversation.type === 'group' 
                        ? `${selectedConversation.participants.length} members`
                        : onlineUsers.has(selectedConversation.participants.find(id => id !== currentUser.id))
                          ? 'Online'
                          : 'Last seen recently'
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors duration-200">
                      <ApperIcon name="Phone" className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                    </button>
                    <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors duration-200">
                      <ApperIcon name="Video" className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                    </button>
                    <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors duration-200">
                      <ApperIcon name="MoreVertical" className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-surface-50/50 to-surface-100/50 dark:from-surface-900/50 dark:to-surface-800/50">
                <AnimatePresence>
                  {(messages[selectedConversation.id] || []).map((message) => {
                    const isOwn = message.senderId === currentUser.id
                    const sender = isOwn ? currentUser : mockUsers.find(u => u.id === message.senderId)
                    
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                          isOwn ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          {!isOwn && (
                            <img
                              src={sender?.avatar}
                              alt={sender?.name}
                              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                            />
                          )}
                          
                          <div className={`relative group`}>
                            <div className={`px-4 py-2 rounded-2xl ${
                              isOwn 
                                ? 'bg-primary text-white rounded-br-md'
                                : 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white rounded-bl-md'
                            }`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              
                              {/* Message reactions */}
                              {(messageReactions[message.id] || message.reactions) && (
                                <div className="flex items-center space-x-1 mt-1">
                                  {Object.entries(messageReactions[message.id] || message.reactions || {}).map(([emoji, users]) => 
                                    users.length > 0 && (
                                      <span
                                        key={emoji}
                                        className="text-xs bg-surface-100 dark:bg-surface-600 rounded-full px-1 py-0.5 flex items-center space-x-1"
                                      >
                                        <span>{emoji}</span>
                                        <span className="text-surface-600 dark:text-surface-300">{users.length}</span>
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className={`flex items-center space-x-1 mt-1 text-xs text-surface-500 dark:text-surface-400 ${
                              isOwn ? 'justify-end' : 'justify-start'
                            }`}>
                              <span>{formatTimestamp(message.timestamp)}</span>
                              {isOwn && (
                                <ApperIcon 
                                  name={getMessageStatusIcon(message.status)} 
                                  className={`w-3 h-3 ${
                                    message.status === 'read' ? 'text-primary' : 'text-surface-400'
                                  }`} 
                                />
                              )}
                            </div>
                            
                            {/* Reaction picker */}
                            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="bg-white dark:bg-surface-700 rounded-lg shadow-lg p-1 flex items-center space-x-1">
                                {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
                                  <button
                                    key={emoji}
                                    onClick={() => handleReaction(message.id, emoji)}
                                    className="p-1 hover:bg-surface-100 dark:hover:bg-surface-600 rounded"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                
                {/* Typing indicator */}
                {isTyping[selectedConversation.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-surface-300 dark:bg-surface-600 flex items-center justify-center">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-surface-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-1 h-1 bg-surface-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1 h-1 bg-surface-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                      </div>
                      <span className="text-sm text-surface-500 dark:text-surface-400">typing...</span>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 border-t border-surface-200/50 dark:border-surface-700/50 bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm"
              >
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <div className="relative">
                      <textarea
                        value={newMessage}
                        onChange={handleTyping}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        placeholder="Type a message..."
                        className="w-full px-4 py-3 pr-20 bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all duration-300"
                        rows="1"
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                      />
                      
                      <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-1.5 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200"
                        >
                          <ApperIcon name="Paperclip" className="w-4 h-4 text-surface-500 dark:text-surface-400" />
                        </button>
                        
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-1.5 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200"
                        >
                          <ApperIcon name="Smile" className="w-4 h-4 text-surface-500 dark:text-surface-400" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-16 right-4 bg-white dark:bg-surface-800 rounded-xl shadow-float p-3 border border-surface-200 dark:border-surface-700 z-50"
                      >
                        <div className="grid grid-cols-6 gap-2">
                          {emojis.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleEmojiSelect(emoji)}
                              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200 text-lg"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${
                      newMessage.trim()
                        ? 'bg-primary hover:bg-primary-dark text-white shadow-glow'
                        : 'bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-500 cursor-not-allowed'
                    }`}
                  >
                    <ApperIcon name="Send" className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </>
          ) : (
            /* No Conversation Selected */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex items-center justify-center bg-gradient-to-b from-surface-50/50 to-surface-100/50 dark:from-surface-900/50 dark:to-surface-800/50"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <ApperIcon name="MessageCircle" className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-3">
                  Welcome to Messages
                </h3>
                <p className="text-surface-600 dark:text-surface-400 mb-6 max-w-md">
                  Select a conversation to start messaging, or create a new chat to connect with your friends.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNewChat}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-medium shadow-glow hover:shadow-float transition-all duration-300"
                >
                  Start New Chat
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowNewChatModal(false)
                setSelectedUsers([])
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-float p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-surface-900 dark:text-white">New Chat</h3>
                <button
                  onClick={() => {
                    setShowNewChatModal(false)
                    setSelectedUsers([])
                  }}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors duration-200"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {mockUsers.filter(user => user.id !== currentUser.id).map(user => {
                  const isSelected = selectedUsers.find(u => u.id === user.id)
                  
                  return (
                    <button
                      key={user.id}
                      onClick={() => toggleUserSelection(user)}
                      className={`w-full p-3 flex items-center space-x-3 rounded-xl transition-all duration-200 ${
                        isSelected 
                          ? 'bg-primary/10 border-2 border-primary' 
                          : 'hover:bg-surface-100 dark:hover:bg-surface-700 border-2 border-transparent'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-surface-800 ${
                          getStatusColor(user.status)
                        }`}></div>
                      </div>
                      
                      <div className="flex-1 text-left">
                        <h4 className="font-medium text-surface-900 dark:text-white">{user.name}</h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400">{user.username}</p>
                      </div>
                      
                      {isSelected && (
                        <ApperIcon name="Check" className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  {selectedUsers.length} selected
                </p>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setShowNewChatModal(false)
                      setSelectedUsers([])
                    }}
                    className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateChat}
                    disabled={selectedUsers.length === 0}
                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                      selectedUsers.length > 0
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow hover:shadow-float'
                        : 'bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-500 cursor-not-allowed'
                    }`}
                  >
                    Create Chat
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  )
}

export default Messages