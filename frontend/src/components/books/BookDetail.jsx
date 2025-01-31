import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState(null);
  const [error, setError] = useState(null);

  const fetchBook = async () => {
    try {
      const res = await fetch(`http://localhost/online-bookstore/backend/api/books/get-books.php?id=${id}`, {
        credentials: 'include'
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch book');
      }
      
      const data = await res.json();
      setBook(data);
      setEditedBook({...data});
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost/online-bookstore/backend/api/books/update-book.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedBook)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update book');
      }

      setBook(editedBook);
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const res = await fetch(`http://localhost/online-bookstore/backend/api/books/delete-book.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: book.id })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete book');
      }

      navigate('/catalog');
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-4">
          {isEditing ? (
            <input
              type="text"
              name="image"
              value={editedBook.image || ''}
              onChange={handleInputChange}
              className="form-control mb-2"
              placeholder="Image URL"
            />
          ) : (
            <img
              src={book.image || 'https://via.placeholder.com/200x300?text=Book+Cover'}
              alt={book.title}
              className="img-fluid rounded-3 shadow-sm"
              style={{ maxHeight: '100%', width: '300px', objectFit: 'cover' }}
            />
          )}
        </div>
        <div className="col-md-8">
          {isEditing ? (
            <>
              <input
                type="text"
                name="title"
                value={editedBook.title}
                onChange={handleInputChange}
                className="form-control mb-2"
                placeholder="Book Title"
              />
              <input
                type="text"
                name="author"
                value={editedBook.author}
                onChange={handleInputChange}
                className="form-control mb-2"
                placeholder="Author"
              />
              <input
                type="text"
                name="isbn"
                value={editedBook.isbn}
                onChange={handleInputChange}
                className="form-control mb-2"
                placeholder="ISBN"
              />
              <textarea
                name="description"
                value={editedBook.description}
                onChange={handleInputChange}
                className="form-control mb-2"
                placeholder="Book Description"
                rows="4"
              />
            </>
          ) : (
            <>
              <h3 className="fw-bold mb-3">{book.title}</h3>
              <div className="d-flex gap-2 mb-3">
                <span className="badge bg-primary">{book.author}</span>
                <span className="badge bg-secondary">ISBN: {book.isbn}</span>
              </div>
              <p className="mb-4" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {book.description}
              </p>
            </>
          )}
          
          <div className="d-flex gap-2">
            {isEditing ? (
              <>
                <button 
                  className="btn btn-success"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleEditToggle}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn btn-primary"
                  onClick={handleEditToggle}
                >
                  Edit Book
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete Book
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Back to Catalog
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}