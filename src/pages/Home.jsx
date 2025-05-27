import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

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
              Connect, Share, 
              <span className="text-gradient block sm:inline"> Discover</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto leading-relaxed">
              Join millions of people sharing moments, building communities, and discovering new connections in our vibrant social platform.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16"
          >
            {[
              { icon: "Users", label: "Active Users", value: "2.5M+" },
              { icon: "MessageCircle", label: "Messages", value: "180M+" },
              { icon: "Image", label: "Posts Shared", value: "50M+" },
              { icon: "Heart", label: "Connections", value: "1B+" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center shadow-card hover:shadow-float transition-all duration-300 border border-surface-200/50 dark:border-surface-700/50"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-secondary rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-glow">
                  <ApperIcon name={stat.icon} className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-surface-900 dark:text-white mb-1 sm:mb-2">{stat.value}</h3>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Feature */}
          <MainFeature />

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 sm:mt-16 lg:mt-20"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-surface-900 dark:text-white mb-8 sm:mb-12">
              Why Choose ConnectSphere?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: "Shield",
                  title: "Privacy First",
                  description: "Your data is protected with end-to-end encryption and advanced privacy controls."
                },
                {
                  icon: "Zap",
                  title: "Real-time Updates",
                  description: "Stay connected with instant notifications and real-time messaging."
                },
                {
                  icon: "Sparkles",
                  title: "Smart Discovery",
                  description: "Find like-minded people and communities with our intelligent recommendation system."
                },
                {
                  icon: "Palette",
                  title: "Rich Media",
                  description: "Share photos, videos, and stories with powerful editing tools."
                },
                {
                  icon: "Users",
                  title: "Communities",
                  description: "Join groups and communities based on your interests and passions."
                },
                {
                  icon: "Smartphone",
                  title: "Mobile Optimized",
                  description: "Seamless experience across all devices with our responsive design."
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="group bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-card hover:shadow-float transition-all duration-300 border border-surface-200/50 dark:border-surface-700/50 hover:border-primary/30"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-secondary rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <ApperIcon name={feature.icon} className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-white mb-2 sm:mb-3">{feature.title}</h4>
                  <p className="text-sm sm:text-base text-surface-600 dark:text-surface-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
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