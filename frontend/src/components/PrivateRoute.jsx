import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';
import { Context } from '../context/Context';

const PrivateRoute = ({ children }) => {
  const { currentUser, loadingCurrentUser } = useContext(AuthContext);
  const [showServerMsg, setShowServerMsg] = useState(false);
  const {setPopupModal, setModalMessage} = useContext(Context)
  useEffect(() => {
    if (loadingCurrentUser) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [loadingCurrentUser]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowServerMsg(true);
    }, 4000); // Delay for server message
    return () => clearTimeout(timer);
  }, []);
  if (loadingCurrentUser) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-cyan-100 text-center px-4">

        {/* GramHub Intro Title */}
        <h1 className="text-5xl sm:text-6xl font-extrabold text-cyan-700 tracking-wide mb-2 animate-bounce">
          Welcome to <span className="text-cyan-500">GramHub</span>
        </h1>

        {/* Tagline */}
        <p className="text-base sm:text-lg text-cyan-600 opacity-90">
          Where your moments meet the world.
        </p>

        {/* Soft Loading Text */}
        <div className="mt-10">
          <p className="text-xs text-gray-600 tracking-wide animate-pulse">
            authenticating your experience...
          </p>
        </div>

        {/* Optional Server Delay Message */}
        {showServerMsg && (
          <p className="mt-4 text-xs text-gray-500 transition-opacity duration-700 ease-in-out">
            This might take a moment as the server starts up.
          </p>
        )}
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (!currentUser.isAuthenticated) {
    setModalMessage("Block by Admin ❌")
    setPopupModal(true)
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;
