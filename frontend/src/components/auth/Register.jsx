import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    confirmEmail: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.email !== form.confirmEmail) {
      alert('Emails must match');
      return;
    }
    
    try {
      const res = await fetch('http://localhost/online-bookstore/backend/api/auth/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        navigate('/login');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-6 text-center">Register</h2>
        <input 
          type="text"
          placeholder="First Name"
          value={form.firstname}
          onChange={e => setForm({...form, firstname: e.target.value})}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input 
          type="text"
          placeholder="Last Name"
          value={form.lastname}
          onChange={e => setForm({...form, lastname: e.target.value})}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input 
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input 
          type="email"
          placeholder="Confirm Email"
          value={form.confirmEmail}
          onChange={e => setForm({...form, confirmEmail: e.target.value})}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input 
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
}