import { useEffect } from 'react';

export default function BookPopup({ book, onClose, onAddToLibrary }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'unset';
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        <div className="flex gap-6">
          <img 
            src={book.image} 
            alt={book.title} 
            className="w-48 h-64 object-cover rounded"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
            <p className="text-lg mb-2 text-gray-300">by {book.author}</p>
            <p className="mb-4 text-gray-400">{book.description}</p>
            <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={onAddToLibrary}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add to My Library
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}