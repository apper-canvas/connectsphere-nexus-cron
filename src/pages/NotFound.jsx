import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-glow">
            <ApperIcon name="AlertTriangle" className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </div>
          
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold text-gradient mb-4 sm:mb-6">404</h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-surface-900 dark:text-white mb-4 sm:mb-6">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-surface-600 dark:text-surface-300 mb-8 sm:mb-10 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. Let's get you back to connecting with others.
          </p>
          
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl sm:rounded-2xl shadow-glow hover:shadow-float transition-all duration-300"
            >
              <ApperIcon name="Home" className="w-5 h-5" />
              <span className="text-sm sm:text-base">Back to Home</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound