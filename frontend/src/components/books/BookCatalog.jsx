import { useState, useEffect } from 'react';
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
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <button 
          onClick={searchBooks}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <div 
            key={book.id} 
            className="border rounded p-4 cursor-pointer hover:shadow-lg"
            onClick={() => setSelectedBook(book)}
          >
            <img 
              src={book.image} 
              alt={book.title} 
              className="w-full h-48 object-cover mb-2" 
            />
            <h3 className="text-xl font-bold truncate">{book.title}</h3>
            <p className="text-gray-600 truncate">{book.author}</p>
          </div>
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