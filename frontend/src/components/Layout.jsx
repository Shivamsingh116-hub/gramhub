import React, { useContext } from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import { AuthContext } from '../context/AuthContext'
import Loader from './Loader'

const Layout = () => {
    return (
        <div className='relative'>
            <Navbar />
            <main className='min-h-screen'><Outlet /></main>
            <Footer />
        </div>
    )
}

export default Layout