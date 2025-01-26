import { useState } from 'react';
import AuthForm from './AuthForm';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost/online-bookstore/backend/api/auth/forgot-password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage('Reset instructions sent to your email');
      } else {
        setMessage(data.error || 'Failed to send reset instructions');
      }
    } catch (error) {
      setMessage('Failed to send reset instructions');
    }
  };

  return (
    <AuthForm 
      onSubmit={handleSubmit} 
      title="Forgot Password"
      footerLink={{ to: '/login', text: 'Back to Login' }}
    >
      <input 
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
      >
        Reset Password
      </button>
      {message && (
        <p className={`text-center mt-4 ${
          message.includes('sent') ? 'text-green-400' : 'text-red-400'
        }`}>
          {message}
        </p>
      )}
    </AuthForm>
  );
}