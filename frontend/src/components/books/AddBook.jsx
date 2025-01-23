import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddBook() {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    image: '',
    description: '',
    isbn: '',
    author: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://localhost/online-bookstore/backend/api/books/add.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      });
      
      if (res.ok) {
        navigate('/my-library');
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (error) {
      alert('Failed to add book');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <input 
        type="text"
        placeholder="Title"
        value={book.title}
        onChange={e => setBook({...book, title: e.target.value})}
        required
        className="block w-full mb-4 p-2 border rounded"
      />
      <input 
        type="text"
        placeholder="Image URL"
        value={book.image}
        onChange={e => setBook({...book, image: e.target.value})}
        className="block w-full mb-4 p-2 border rounded"
      />
      <textarea
        placeholder="Description"
        value={book.description}
        onChange={e => setBook({...book, description: e.target.value})}
        required
        className="block w-full mb-4 p-2 border rounded"
      />
      <input 
        type="text"
        placeholder="ISBN"
        value={book.isbn}
        onChange={e => setBook({...book, isbn: e.target.value})}
        required
        className="block w-full mb-4 p-2 border rounded"
      />
      <input 
        type="text"
        placeholder="Author"
        value={book.author}
        onChange={e => setBook({...book, author: e.target.value})}
        required
        className="block w-full mb-4 p-2 border rounded"
      />
      <button 
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Book
      </button>
    </form>
  );
}