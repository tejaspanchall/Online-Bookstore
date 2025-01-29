import { Search } from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from './BookCard';
import BookPopup from './BookPopup';
import Pagination from './Pagination';

export default function BookCatalog() {
  const navigate = useNavigate();
  const [allBooks, setAllBooks] = useState([]); // Store all books
  const [displayedBooks, setDisplayedBooks] = useState([]); // Store paginated books
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const BOOKS_PER_PAGE = 10;

  const searchBooks = async () => {
    try {
      const res = await fetch(
        `http://localhost/online-bookstore/backend/api/books/search.php?q=${search}`
      );
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      
      // Store all books
      const books = Array.isArray(data) ? data : data.books || [];
      setAllBooks(books);
      
      // Calculate total pages
      const total = Math.ceil(books.length / BOOKS_PER_PAGE);
      setTotalPages(total);
      
      // Update displayed books for current page
      updateDisplayedBooks(books, 1);
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('Search failed');
      setAllBooks([]);
      setDisplayedBooks([]);
      setTotalPages(1);
    }
  };

  // Function to update displayed books based on current page
  const updateDisplayedBooks = (books, page) => {
    const startIndex = (page - 1) * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;
    setDisplayedBooks(books.slice(startIndex, endIndex));
    setCurrentPage(page);
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

  const handlePageChange = (page) => {
    updateDisplayedBooks(allBooks, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setCurrentPage(1);
      searchBooks();
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    searchBooks();
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
              onClick={handleSearch}
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

      {displayedBooks.length === 0 ? (
        <div className="text-center mt-4">
          <p className="text-muted">No books found</p>
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-5 g-4">
            {displayedBooks.map((book) => (
              <div className="col" key={book.id}>
                <BookCard
                  book={book}
                  onClick={() => setSelectedBook(book)}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

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