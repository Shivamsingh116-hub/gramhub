import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
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

const App = () => {

  const { modalMessage, setPopupModal, popupModal } = useContext(Context)
  const { fetchCurrentUserData } = useContext(AuthContext)
  useEffect(() => {
    fetchCurrentUserData()
  }, [])

  return (

    <div>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/search' element={<Search />} />
          <Route path='/messages' element={< Messages />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/notification' element={<Notification />} />
          <Route path='/create' element={<Create />} />
          <Route path='*' element={<NoMatch />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      {popupModal && <Modal message={modalMessage} onClose={() => setPopupModal(false)} duration={3000} />}
    </div>
  )
}

export default App