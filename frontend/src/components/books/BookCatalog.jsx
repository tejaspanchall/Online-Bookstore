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
      const res = await fetch(
        `http://localhost/online-bookstore/backend/api/books/search.php?q=${search}`
      );
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      alert('Search failed');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchBooks();
    }
  };

  const handleAddToLibrary = async (book) => {
    try {
      const res = await fetch(
        'http://localhost/online-bookstore/backend/api/books/add.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            title: book.title,
            image: book.image,
            description: book.description,
            isbn: book.isbn,
            author: book.author
          })
        }
      );
      if (!res.ok) throw new Error('Failed to add to library');
      alert('Book added to your library!');
    } catch (error) {
      alert(error.message);
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
    {books.map(book => (
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