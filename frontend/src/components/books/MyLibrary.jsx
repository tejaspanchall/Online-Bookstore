// MyLibrary.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from './BookCard';

export default function MyLibrary() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return 'https://via.placeholder.com/200x300?text=Book+Cover';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  useEffect(() => {
    const fetchMyLibrary = async () => {
      try {
        const res = await fetch(
          'http://localhost/online-bookstore/backend/api/books/get-library.php',
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            setError('Please login to view your library');
            setTimeout(() => navigate('/login'), 2000);
            return;
          }
          throw new Error('Failed to fetch library');
        }

        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to fetch library');
      } finally {
        setLoading(false);
      }
    };

    fetchMyLibrary();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container py-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '200px' }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Library</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Browse More Books
        </button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted mb-4">Your library is empty</p>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-lg btn-primary"
              onClick={() => navigate('/')}
            >
              Discover Books
            </button>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-5 g-4">
          {books.map((book) => (
            <div className="col" key={book.id}>
              <BookCard
                book={book}
                onClick={() => navigate(`/book/${book.id}`)}
                getImageUrl={getImageUrl}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
