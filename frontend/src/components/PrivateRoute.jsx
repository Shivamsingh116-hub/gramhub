import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';

const PrivateRoute = ({ children }) => {
  const { currentUser, loadingCurrentUser } = useContext(AuthContext);
 
  if (loadingCurrentUser) {
    return <Loader/>
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
