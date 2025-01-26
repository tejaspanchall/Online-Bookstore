import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';

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
    <AuthForm 
      onSubmit={handleSubmit} 
      title="Register"
      footerLink={{ to: '/login', text: 'Already have an account? Login' }}
    >
      <div className="grid grid-cols-2 gap-4">
        <input 
          type="text"
          placeholder="First Name"
          value={form.firstname}
          onChange={e => setForm({...form, firstname: e.target.value})}
          required
          className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="text"
          placeholder="Last Name"
          value={form.lastname}
          onChange={e => setForm({...form, lastname: e.target.value})}
          required
          className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <input 
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({...form, email: e.target.value})}
        required
        className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input 
        type="email"
        placeholder="Confirm Email"
        value={form.confirmEmail}
        onChange={e => setForm({...form, confirmEmail: e.target.value})}
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
        Register
      </button>
    </AuthForm>
  );
}