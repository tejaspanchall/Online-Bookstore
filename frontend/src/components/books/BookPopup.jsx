import { X } from 'react-bootstrap-icons';

export default function BookPopup({ book, onClose, onAddToLibrary }) {
  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <button 
              onClick={onClose} 
              className="btn-close btn-close-white position-absolute end-0 top-0 m-3"
            ></button>
          </div>
          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-4">
                <img
                  src={book.image || 'https://via.placeholder.com/200x300?text=Book+Cover'}
                  alt={book.title}
                  className="img-fluid rounded-3 shadow-sm"
                  style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-8">
                <h3 className="fw-bold mb-3">{book.title}</h3>
                <div className="d-flex gap-2 mb-3">
                  <span className="badge bg-primary">{book.author}</span>
                  <span className="badge bg-secondary">ISBN: {book.isbn}</span>
                </div>
                <p className="mb-4" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {book.description}
                </p>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={onAddToLibrary}
                  >
                    Add to Library
                  </button>
                  <button 
                    className="btn btn-outline-light"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}