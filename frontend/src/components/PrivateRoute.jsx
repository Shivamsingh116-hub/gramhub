import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';

const PrivateRoute = ({ children }) => {
  const { currentUser, loadingCurrentUser } = useContext(AuthContext);

  if (loadingCurrentUser) {
    return     <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-cyan-100">
        {/* Spinning ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
          <div className="absolute inset-1 rounded-full bg-white"></div>
        </div>

        {/* Message */}
        <p className="mt-6 text-cyan-800 text-lg font-semibold tracking-wide">
          Authenticating...
        </p>
      </div>
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
