import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from './BookCard';
import BookPopup from './BookPopup';

export default function MyLibrary() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchMyLibrary = async () => {
      try {
        const res = await fetch('http://localhost/online-bookstore/backend/api/books/my-library.php', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            setError('Please login to view your library');
            setTimeout(() => navigate('/login'), 2000);
            return;
          }
          throw new Error('Failed to fetch library');
        }

        const data = await res.json();
        
        // Check if the response is valid
        if (!data) {
          throw new Error('Invalid response from server');
        }

        // Handle both array and object responses
        setBooks(Array.isArray(data) ? data : data.books || []);

      } catch (error) {
        console.error('Fetch error:', error);
        setError(`Failed to fetch library: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMyLibrary();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
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
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
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
          {books.map(book => (
            <div className="col" key={book.id}>
              <BookCard 
                book={book}
                onClick={() => setSelectedBook(book)}
              />
            </div>
          ))}
        </div>
      )}

      {selectedBook && (
        <BookPopup
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          // Remove the add to library button since books are already in library
          onAddToLibrary={null}
        />
      )}
    </div>
  );
}