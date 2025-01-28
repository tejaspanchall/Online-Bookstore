import { Search } from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from './BookCard';
import BookPopup from './BookPopup';

export default function BookCatalog() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState('');

  const searchBooks = async () => {
    try {
      const res = await fetch(
        `http://localhost/online-bookstore/backend/api/books/search.php?q=${search}`
      );
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('Search failed');
    }
  };

  const handleAddToLibrary = async (book) => {
    try {
      const res = await fetch('http://localhost/online-bookstore/backend/api/books/add.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        credentials: 'include',
        body: JSON.stringify(book),
      });
  
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          setMessage('Please login to add books to your library');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        throw new Error(data.error || 'Failed to add book');
      }
  
      setMessage('Book added to library successfully!');
      setSelectedBook(null);
      setTimeout(() => navigate('/my-library'), 2000);
    } catch (error) {
      console.error('Error details:', error);
      setMessage(error.message || 'Failed to add book to library');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchBooks();
    }
  };

  useEffect(() => {
    searchBooks();
  }, []);

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-dark border-dark">
              <Search />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={searchBooks}
              className="btn btn-primary px-4"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-4`}>
          {message}
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-5 g-4">
        {books.map((book) => (
          <div className="col" key={book.id}>
            <BookCard
              book={book}
              onClick={() => setSelectedBook(book)}
            />
          </div>
        ))}
      </div>

      {selectedBook && (
        <BookPopup
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddToLibrary={() => handleAddToLibrary(selectedBook)}
        />
      )}
    </div>
  );
}