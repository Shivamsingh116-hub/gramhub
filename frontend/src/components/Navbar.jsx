import React from 'react';
import { Link } from 'react-router-dom';
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
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-1 hover:cursor-pointer" style={{ color: "#d62976" }}>
                        <InstagramIcon fontSize="medium" />
                        <span className="text-[1.1rem] font-medium self-end" style={{ fontFamily: "Edu NSW ACT Cursive, cursive" }}>
                            Instagram
                        </span>
                    </Link>

                    {/* Navigation */}
                    <ul className="navigation-item">
                        <li>
                            <Link to="/" >
                                <HomeOutlinedIcon />
                                <span>Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/search" >
                                <SearchOutlinedIcon />
                                <span>Search</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/explore">
                                <ExploreOutlinedIcon />
                                <span>Explore</span>
                            </Link>
                        </li>
                        <li className="mobile-button-1">
                            <Link to="/notification">
                                <FavoriteBorderOutlinedIcon />
                                <span>Notification</span>
                            </Link>
                        </li>
                        <li className="mobile-button-2">
                            <Link to="/messages">
                                <ForumOutlinedIcon />
                                <span>Messages</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/create">
                                <AddBoxOutlinedIcon />
                                <span>Create</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile">
                                <PersonOutlineOutlinedIcon />
                                <span>Profile</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
