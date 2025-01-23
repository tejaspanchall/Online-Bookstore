import { useState, useEffect } from 'react';

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
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Library</h2>
      
      {books.length === 0 ? (
        <p className="text-center text-gray-500">No books in your library</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map(book => (
            <div key={book.id} className="border rounded p-4">
              <img 
                src={book.image} 
                alt={book.title} 
                className="w-full h-48 object-cover mb-2" 
              />
              <h3 className="text-xl font-bold">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
              <p className="mt-2">{book.description}</p>
              <p className="mt-2 text-sm">ISBN: {book.isbn}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}