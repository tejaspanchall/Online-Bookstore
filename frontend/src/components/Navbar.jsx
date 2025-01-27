import { Link, NavLink } from 'react-router-dom';
import { PersonFill, JournalBookmark, PlusCircle } from 'react-bootstrap-icons';

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem('user');

  const handleLogout = async () => {
    try {
      await fetch('http://localhost/online-bookstore/backend/api/auth/logout.php', {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar py-3">
      <div className="container">
        <Link to="/catalog" className="navbar-brand fw-bold fs-4">
          <JournalBookmark className="me-2" />
          BookVerse
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
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
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="btn btn-primary">
                    Get Started
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