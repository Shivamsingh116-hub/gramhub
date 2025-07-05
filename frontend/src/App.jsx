import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NoMatch from './pages/NoMatch'
import Layout from './components/Layout'
import Profile from './components/Profile'
import Search from './components/Search'
import Logout from './components/Logout'
import Messages from './components/Messages'
import Explore from './components/Explore'
import Notification from './components/Notification'
import Create from './components/Create'
import Modal from './Modal'
import { useContext } from 'react'
import { Context } from './context/Context'
import { AuthContext } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Loader from './components/Loader'
import ForgotPassword from './pages/ForgotPassword'
import ScrollToTop from './components/ScrollToTop'

const App = () => {

  const { modalMessage, setPopupModal, popupModal } = useContext(Context)
  const { currentUser, loadingCurrentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  useEffect(() => {
    if (!loadingCurrentUser && !currentUser) {
      navigate('/login')
    }
  }, [loadingCurrentUser, currentUser])
  if (loadingCurrentUser) {
    return <div>
      {loadingCurrentUser && <Loader />}
    </div>
  }
  return (

    <div>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path='/search' element={<PrivateRoute><Search /></PrivateRoute>} />
          <Route path='/messages' element={<PrivateRoute>< Messages /></PrivateRoute>} />
          <Route path='/explore' element={<PrivateRoute><Explore /></PrivateRoute>} />
          <Route path='/notification' element={<PrivateRoute><Notification /></PrivateRoute>} />
          <Route path='/create' element={<PrivateRoute><Create /></PrivateRoute>} />
          <Route path='*' element={<NoMatch />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
      {popupModal && <Modal message={modalMessage} onClose={() => setPopupModal(false)} duration={3000} />}
    </div>
  )
}

export default App