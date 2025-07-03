import React, { useContext } from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import { AuthContext } from '../context/AuthContext'
import Loader from './Loader'

const Layout = () => {
    const { loadingCurrentUser } = useContext(AuthContext)
    return (
        <div className='relative'>
            <Navbar />
            <main className='min-h-screen'><Outlet /></main>
            <Footer />
            {loadingCurrentUser && <Loader/>}
        </div>
    )
}

export default Layout