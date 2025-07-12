import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';
import { Context } from '../context/Context';

const PrivateRoute = ({ children }) => {
  const { currentUser, loadingCurrentUser } = useContext(AuthContext);
  const [showServerMsg, setShowServerMsg] = useState(false);
  const { setPopupModal, setModalMessage } = useContext(Context)
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
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-cyan-100">
        {/* Spinning ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
          <div className="absolute inset-1 rounded-full bg-white"></div>
        </div>
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
