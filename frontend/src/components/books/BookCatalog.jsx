import { Search } from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';
import BookCard from './BookCard';
import BookPopup from './BookPopup';

export default function BookCatalog() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  const searchBooks = async () => {
    try {
      console.log('Fetching books...'); // Debugging
      const res = await fetch(
        `http://localhost/online-bookstore/backend/api/books/search.php?q=${search}`
      );
      console.log('Response status:', res.status); // Debugging
      const data = await res.json();
      console.log('API Response:', data); // Debugging
      setBooks(data);
    } catch (error) {
      console.error('Fetch error:', error); // Debugging
      alert('Search failed');
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

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {books.map((book) => (
          <div className="col" key={book.id}>
            <BookCard
              book={book}
              onClick={() => setSelectedBook(book)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}