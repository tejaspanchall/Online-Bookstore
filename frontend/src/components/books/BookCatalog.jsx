import { useState, useEffect } from 'react';

export default function BookCatalog() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');

  const searchBooks = async () => {
    try {
      const res = await fetch(`http://localhost/online-bookstore/backend/api/books/search.php?q=${search}`);
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      alert('Search failed');
    }
  };

  useEffect(() => {
    searchBooks();
  }, [searchBooks]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-2 border rounded mr-2"
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
          <div key={book.id} className="border rounded p-4">
            <img src={book.image} alt={book.title} className="w-full h-48 object-cover mb-2" />
            <h3 className="text-xl font-bold">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
            <p className="mt-2">{book.description}</p>
            <p className="mt-2 text-sm">ISBN: {book.isbn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}