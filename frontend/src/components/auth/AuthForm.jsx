import { Link } from 'react-router-dom';

export default function AuthForm({ children, onSubmit, title, footerLink }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={onSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl mb-6 text-center font-bold">{title}</h2>
        <div className="space-y-4">
          {children}
        </div>
        {footerLink && (
          <div className="text-center pt-4">
            <Link to={footerLink.to} className="text-blue-400 hover:text-blue-300 text-sm">
              {footerLink.text}
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}