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
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded flex-1 border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <button 
          onClick={searchBooks}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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