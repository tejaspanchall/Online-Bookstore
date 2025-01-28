import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../auth/AuthForm';

export default function AddBook() {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    image: '',
    description: '',
    isbn: '',
    author: '',
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fixed URL to match the server configuration
      const res = await fetch('http://localhost/online-bookstore/backend/api/books/add.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Add cache control headers to prevent caching issues
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
          setMessage('Session expired. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        throw new Error(data.error || 'Failed to add book');
      }

      setMessage('Book added successfully!');
      setTimeout(() => navigate('/'), 2000);

    } catch (error) {
      console.error('Error details:', error);
      setMessage(error.message || 'Failed to connect to server');
    }
  };

  return (
    <AuthForm
      onSubmit={handleSubmit}
      title="Add New Book"
      footerLink={{ to: '/', text: 'Back to Home' }}
    >
      <div className="mb-3">
        <input
          type="text"
          className="form-control bg-dark text-white"
          placeholder="Title"
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control bg-dark text-white"
          placeholder="Image URL"
          value={book.image}
          onChange={(e) => setBook({ ...book, image: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control bg-dark text-white"
          placeholder="Description"
          value={book.description}
          onChange={(e) => setBook({ ...book, description: e.target.value })}
          required
          rows="4"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control bg-dark text-white"
          placeholder="ISBN"
          value={book.isbn}
          onChange={(e) => setBook({ ...book, isbn: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control bg-dark text-white"
          placeholder="Author"
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100 py-2">
        Add Book
      </button>
      {message && (
        <div className={`mt-3 alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}
    </AuthForm>
  );
}