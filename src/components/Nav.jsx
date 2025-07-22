import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';

export default function Nav({ navOpen, setNavOpen }) {
  const { user } = useContext(AuthContext);
  const navRef = useRef();
  const burgerRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (
        navOpen &&
        navRef.current &&
        !navRef.current.contains(e.target) &&
        burgerRef.current &&
        !burgerRef.current.contains(e.target)
      ) {
        setNavOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [navOpen, setNavOpen]);

  // Track viewport size
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const menuItems = (
    <>
      <li className="navbar-item">
        <Link to="/leaderboard" onClick={() => setNavOpen(false)}>
          Leaderboard
        </Link>
      </li>
      <li className="navbar-item">
        <Link to="/pickem" onClick={() => setNavOpen(false)}>
          Pick’em
        </Link>
      </li>
      <li className="navbar-item">
        <Link to="/stats" onClick={() => setNavOpen(false)}>
          Stats
        </Link>
      </li>
      <li className="navbar-item">
        <Link to="/profile" onClick={() => setNavOpen(false)}>
          Profile
        </Link>
      </li>
    </>
  );

  return isMobile ? (
    <>
      <button
        className="hamburger"
        ref={burgerRef}
        onClick={() => setNavOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span className="hamburger-bar" />
        <span className="hamburger-bar" />
        <span className="hamburger-bar" />
      </button>

      <ul
        ref={navRef}
        className={`navbar-list mobile${navOpen ? ' open' : ''}`}
      >
        {menuItems}
      </ul>
    </>
  ) : (
    <nav className="navbar">
      <ul className="navbar-list">{menuItems}</ul>
      {user && (
        <div className="navbar-user">
          <img
            src={user.avatarUrl || '/assets/default-avatar.png'}
            alt={`${user.username} avatar`}
            className="avatar-sm"
          />
          <span>{user.username}</span>
        </div>
      )}
    </nav>
  );
}