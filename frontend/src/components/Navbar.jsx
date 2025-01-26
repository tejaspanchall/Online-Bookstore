import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  
  return (
    <nav className="bg-dark-2 border-b border-dark-3">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/catalog" className="text-2xl font-bold text-primary">
          BookVerse
        </Link>
        
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <NavLink to="/my-library" className="hover:text-primary">
                My Library
              </NavLink>
              <NavLink to="/add-book" className="btn-primary px-4 py-2">
                Add Book
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-primary">
                Login
              </NavLink>
              <NavLink to="/register" className="btn-primary px-4 py-2">
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}