import React, { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import '../styles/Navbar.scss';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';
import { useState } from 'react';

const Navbar = () => {
    const location = useLocation()
    const { currentUser } = useContext(AuthContext)
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false)
    const avatarURL = currentUser?.avatarURL
    const menuItems = [
        { path: "/", title: "Home", icon: <HomeOutlinedIcon /> },
        { path: "/search", title: "Search", icon: <SearchOutlinedIcon /> },
        { path: "/create", title: "Create", icon: <AddBoxOutlinedIcon /> },
        { path: "/notification", title: "Notification", icon: <FavoriteBorderOutlinedIcon /> },
        { path: "/messages", title: "Messages", icon: <ForumOutlinedIcon /> },
    ]
    useEffect(() => {
        if (!avatarURL) return;

        setImageLoaded(false);
        setImageError(false);

        const img = new Image();
        img.src = avatarURL;

        if (img.complete) {
            // If already loaded from cache
            setImageLoaded(true);
        } else {
            img.onload = () => setImageLoaded(true);
            img.onerror = () => setImageError(true);
        }

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [avatarURL]);


    return (
        <nav className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-1 hover:cursor-pointer" style={{ color: "#333" }}>
                        <InstagramIcon fontSize="inherit" style={{ fontSize: "30px" }} />
                        <span className="text-xl ml-0.5 font-semibold self-end" >
                            GramHub
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className='flex flex-row gap-6'>
                        <ul className="navigation-item">
                            {menuItems.map((item) => {
                                return (
                                    <li key={`${item.path}_navitem`} id={item.title} >
                                        <NavLink id={item.path} className={({ isActive }) => isActive ? 'active' : ''} to={item.path}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </NavLink>
                                    </li>
                                )
                            })}

                        </ul>
                        <div className='w-9 h-9 relative rounded-full overflow-hidden hover:cursor-pointer hover:scale-110 transition-scale duration-100 transition-normal'>
                            <NavLink to='/profile'>

                                {avatarURL && !imageError && (
                                    <img
                                        src={avatarURL}
                                        alt="Avatar"
                                        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                        onLoad={() => setImageLoaded(true)}
                                        onError={() => setImageError(true)}
                                    />
                                )}

                                {/* Fallback if image fails or not available */}
                                {(!avatarURL || imageError) && (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-xl font-semibold">
                                        {currentUser?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                {!imageLoaded && avatarURL && !imageError && <Loader size='sm' />}
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
