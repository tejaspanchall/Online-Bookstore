export default function BookPopup({ book, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark-2 rounded-2xl p-8 max-w-3xl w-full border border-dark-3 shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <img
            src={book.image}
            alt={book.title}
            className="lg:w-1/3 h-80 object-cover rounded-xl"
          />
          
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-bold">{book.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-8 h-8" />
              </button>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg text-gray-300">by {book.author}</p>
              <p className="text-sm text-primary font-mono">ISBN: {book.isbn}</p>
            </div>

            <p className="text-gray-300 leading-relaxed">{book.description}</p>

            <div className="flex gap-4 pt-6">
              <button className="btn-primary flex-1">
                Add to Library
              </button>
              <button
                onClick={onClose}
                className="bg-dark-3 hover:bg-dark-2 text-white px-6 py-3 rounded-lg"
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