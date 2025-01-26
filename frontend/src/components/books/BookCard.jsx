export default function BookCard({ book, onClick }) {
    return (
      <div 
        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
        onClick={onClick}
      >
        <img 
          src={book.image} 
          alt={book.title} 
          className="w-full h-48 object-cover rounded mb-4"
        />
        <h3 className="font-bold truncate">{book.title}</h3>
        <p className="text-gray-400 text-sm truncate">{book.author}</p>
      </div>
    );
  }