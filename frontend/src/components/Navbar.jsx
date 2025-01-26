import { Link } from 'react-router-dom';

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem('user');
  
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/catalog" className="text-xl font-bold">Bookstore</Link>
        <div className="space-x-4">
          {isLoggedIn ? (
            <>
              <Link to="/my-library" className="hover:text-gray-300">My Library</Link>
              <Link to="/add-book" className="hover:text-gray-300">Add Book</Link>
              <button onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/login';
              }} className="hover:text-gray-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}