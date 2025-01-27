import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { PersonFill, JournalBookmark, PlusCircle } from 'react-bootstrap-icons';

export default function Navbar() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));

  // Effect to listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('user'));
    };

    // Listen for changes to localStorage
    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('http://localhost/online-bookstore/backend/api/auth/logout.php', {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('user'); // Remove user data from localStorage
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar py-3">
      <div className="container">
        <Link to="/catalog" className="navbar-brand fw-bold fs-4">
          <JournalBookmark className="me-2" />
          BookCafe
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            {/* Show "My Library," "Add Book," and "Logout" if logged in */}
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink to="/my-library" className="nav-link d-flex align-items-center gap-1">
                    <PersonFill /> My Library
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/add-book" className="btn btn-primary d-flex align-items-center gap-1">
                    <PlusCircle /> Add Book
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-link nav-link text-danger">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // Show "Login" and "Register" if not logged in
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="btn btn-primary">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}