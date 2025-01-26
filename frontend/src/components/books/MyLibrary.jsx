import { useState, useEffect } from 'react';
import BookCard from './BookCard';

export default function MyLibrary() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyLibrary = async () => {
      try {
        const res = await fetch('http://localhost/online-bookstore/backend/api/books/my-library.php', {
          credentials: 'include'
        });
        
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        } else {
          const errorData = await res.json();
          setError(errorData.error);
        }
      } catch (error) {
        setError('Failed to fetch library');
      }
    };

    fetchMyLibrary();
  }, []);

  if (error) {
    return <div className="text-red-400 text-center mt-8">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {books.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No books in your library</p>
      )}
    </div>
  );
}