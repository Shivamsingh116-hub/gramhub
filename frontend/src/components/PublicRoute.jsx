// src/utils/routeGuards/PublicRoute.jsx
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (window.history.length > 2) {
        navigate(-1, { replace: true }); // 👈 back to previous page
      } else {
        navigate('/profile', { replace: true }); // 👈 fallback route
      }
    }
  }, [currentUser, navigate]);

  if (currentUser) return null; // prevent flicker of login component

  return children;
};

export default PublicRoute;
