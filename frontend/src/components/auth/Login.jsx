import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost/online-bookstore/backend/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/catalog');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <AuthForm 
      onSubmit={handleSubmit} 
      title="Login"
      footerLink={{ to: '/forgot-password', text: 'Forgot Password?' }}
    >
      <input 
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({...form, email: e.target.value})}
        required
        className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input 
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({...form, password: e.target.value})}
        required
        className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
      >
        Login
      </button>
    </AuthForm>
  );
}