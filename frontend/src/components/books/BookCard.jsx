export default function BookCard({ book, onClick }) {
  return (
    <div className="book-card card h-100 border-0 overflow-hidden" onClick={onClick}>
      <div className="position-relative">
        <img 
          src={book.image || 'https://via.placeholder.com/300x200?text=Book+Cover'} 
          alt={book.title} 
          className="card-img-top" 
          style={{height: '250px', objectFit: 'cover'}}
        />
        <div className="badge bg-primary position-absolute top-0 end-0 m-2">
          {book.author}
        </div>
      </div>
      <div className="card-body">
        <h5 className="card-title fw-bold mb-3">{book.title}</h5>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">ISBN: {book.isbn}</small>
        </div>
      </div>
    </div>
  );
}