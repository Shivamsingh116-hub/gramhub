import React, { useContext, useState } from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import { AuthContext } from '../context/AuthContext'
import Loader from './Loader'
import WelcomeOverlay from './small/WelcomeOverlay'

const Layout = () => {
    const [showWelcome, setShowWelcome] = useState(true)
    useState(() => {
        const isAlreadyShow = sessionStorage.getItem('welcome_shown')
        if (isAlreadyShow) {
            setShowWelcome(false)
        }
    }, [])
    const handleWelcomeFinish = () => {
        sessionStorage.setItem('welcome_shown', true)
        setShowWelcome(false)
    }
    if (showWelcome) {
        return <WelcomeOverlay onFinish={handleWelcomeFinish} />
    }
    return (
        <div className='relative'>
            <Navbar />
            <main className='min-h-screen'><Outlet /></main>
            <Footer />
        </div>
    )
}

export default Layout