import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedRoute({children , allowedRoles}) {
  const {user} = useAuth();
  if(!user){
    return <Navigate to="/" replace />
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
}

export default ProtectedRoute
