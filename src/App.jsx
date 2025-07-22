// src/App.jsx

import React, { useState } from 'react';
import './styles/theme.css';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';

import { AuthProvider }       from './context/authcontext';
import Login                  from './components/Login';
import Signup                 from './components/Signup';
import ForgotPassword         from './components/ForgotPassword';
import ResetPassword          from './components/ResetPassword';
import Leaderboard            from './components/Leaderboard';
import Pickem                 from './components/Pickem';
import Stats                  from './components/Stats';
import Profile                from './components/Profile';
import Nav                    from './components/Nav';
import ProtectedRoute         from './components/ProtectedRoute';

function LayoutWithNav({ navOpen, setNavOpen }) {
  const location = useLocation();
  const hideNav = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password'
  ].includes(location.pathname);

  // Toggle between your global theme.css classes
  const shiftCls = navOpen ? 'contentShift' : 'content';

  return (
    <>
      {!hideNav && <Nav navOpen={navOpen} setNavOpen={setNavOpen} />}
      <div className={shiftCls}>
        <Outlet />
      </div>
    </>
  );
}

export default function App() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"           element={<Login />} />
          <Route path="/signup"          element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />

          {/* Protected w/ Nav */}
          <Route element={<LayoutWithNav navOpen={navOpen} setNavOpen={setNavOpen} />}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pickem"
              element={
                <ProtectedRoute>
                  <Pickem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <ProtectedRoute>
                  <Stats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}