import { X } from 'react-bootstrap-icons';

export default function BookPopup({ book, onClose, onAddToLibrary }) {
  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <button 
              onClick={onClose} 
              className="btn-close btn-close-white position-absolute end-0 top-0 m-3"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row g-5">
              <div className="col-md-5">
                <img
                  src={book.image || 'https://via.placeholder.com/400x600?text=Book+Cover'}
                  alt={book.title}
                  className="img-fluid rounded-3 shadow"
                />
              </div>
              <div className="col-md-7">
                <h2 className="display-5 fw-bold mb-4">{book.title}</h2>
                <div className="d-flex gap-3 mb-4">
                  <span className="badge bg-primary fs-6">{book.author}</span>
                  <span className="badge bg-secondary fs-6">ISBN: {book.isbn}</span>
                </div>
                <p className="lead">{book.description}</p>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 justify-content-start px-4 pb-4">
            <button 
              className="btn btn-lg btn-primary px-5 py-3"
              onClick={onAddToLibrary}
            >
              Add to Library
            </button>
            <button 
              className="btn btn-lg btn-outline-light px-5 py-3 ms-3"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}