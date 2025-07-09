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

const Navbar = () => {
    const location = useLocation()
    const menuItems = [
        { path: "/", title: "Home", icon: <HomeOutlinedIcon /> },
        { path: "/search", title: "Search", icon: <SearchOutlinedIcon /> },
        { path: "/explore", title: "Explore", icon: <ExploreOutlinedIcon /> },
        { path: "/notification", title: "Notification", icon: <FavoriteBorderOutlinedIcon /> },
        { path: "/messages", title: "Messages", icon: <ForumOutlinedIcon /> },
        { path: "/create", title: "Create", icon: <AddBoxOutlinedIcon /> },
        { path: "/profile", title: "Profile", icon: <PersonOutlineOutlinedIcon /> }
    ]

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-1 hover:cursor-pointer" style={{ color: "#333" }}>
                        <InstagramIcon fontSize="inherit" style={{fontSize:"30px"}} />
                        <span className="text-xl ml-0.5 font-semibold self-end" >
                            GramHub
                        </span>
                    </Link>

                    {/* Navigation */}
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
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
