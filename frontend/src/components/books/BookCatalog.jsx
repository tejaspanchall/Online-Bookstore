import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
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

  const handleAddToLibrary = async (bookId) => {
    try {
      const res = await fetch(
        'http://localhost/online-bookstore/backend/api/books/add.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ book_id: bookId })
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
    <div className="container mx-auto p-4">
      <div className="mb-6 flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-dark-2 text-white p-2 rounded flex-1 border border-dark-3 focus:outline-none focus:border-primary pr-12"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
        <button 
          onClick={searchBooks}
          className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <BookCard 
            key={book.id} 
            book={book}
            onClick={() => setSelectedBook(book)}
          />
        ))}
      </div>

      {selectedBook && (
        <BookPopup
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddToLibrary={() => {
            handleAddToLibrary(selectedBook.id);
            setSelectedBook(null);
          }}
        />
      )}
    </div>
  );
}