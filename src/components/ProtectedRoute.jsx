// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';

export default function ProtectedRoute({ children }) {
  const { user, isRestoring } = useContext(AuthContext);

  // 1) Still reading from localStorage? show nothing or a spinner
  if (isRestoring) {
    return null; // or <Spinner /> if you have one
  }

  // 2) No user → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3) Authenticated → show the protected component
  return children;
}