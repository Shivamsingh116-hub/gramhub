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
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
