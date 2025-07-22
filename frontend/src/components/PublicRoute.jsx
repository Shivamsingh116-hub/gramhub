// src/utils/routeGuards/PublicRoute.jsx
import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { currentUser, loading, loadingCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showServerMsg, setShowServerMsg] = useState(false);

  // Show server delay message if auth takes long
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowServerMsg(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Show animated loader with message
  if (loadingCurrentUser) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-cyan-100">
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

  // Redirect authenticated user
  if (!loading && currentUser) {
    return <Navigate to="/" replace />;
  }

  // Allow public access
  return children;
};

export default PublicRoute;
