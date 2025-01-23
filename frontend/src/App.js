import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Add Navigate here
import Register from './components/auth/Register.jsx';
import Login from './components/auth/Login.jsx';
import ForgotPassword from './components/auth/ForgotPassword.jsx';
import BookCatalog from './components/books/BookCatalog.jsx';
import AddBook from './components/books/AddBook.jsx';
import MyLibrary from './components/books/MyLibrary.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/catalog" element={<BookCatalog />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/my-library" element={<MyLibrary />} />
      </Routes>
    </BrowserRouter>
  );
}