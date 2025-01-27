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
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        Login
      </button>
    </AuthForm>
  );
}