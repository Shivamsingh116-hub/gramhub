import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ setCurrentUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        navigate('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 shadow-md"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
