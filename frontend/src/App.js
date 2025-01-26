import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import BookCatalog from './components/books/BookCatalog';
import MyLibrary from './components/books/MyLibrary';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import AddBook from './components/books/AddBook';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <BrowserRouter>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/catalog" />} />
            <Route path="/catalog" element={<BookCatalog />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/my-library" element={<MyLibrary />} />
          </Routes>
        </div>
        <Toaster position="bottom-right" toastOptions={{ className: 'bg-gray-800 text-white' }} />
      </BrowserRouter>
    </div>
  );
}