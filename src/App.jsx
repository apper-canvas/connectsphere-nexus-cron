import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Profile from './pages/Profile'

import Follow from './pages/Follow'

import Search from './pages/Search'
import Notifications from './pages/Notifications'

import Messages from './pages/Messages'


import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:userId" element={<Profile />} />

        <Route path="/follow" element={<Follow />} />

        <Route path="/search" element={<Search />} />
        <Route path="/notifications" element={<Notifications />} />

        <Route path="/messages" element={<Messages />} />



      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="!z-50"
        toastClassName="!rounded-xl !shadow-float"
      />
    </div>
  )
}

export default App