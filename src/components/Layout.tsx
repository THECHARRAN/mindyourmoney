import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, DollarSign, User, LogOut } from 'lucide-react';

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-4 hover:text-indigo-600">
                <Home className="h-5 w-5" />
                <span className="ml-2">Dashboard</span>
              </Link>
              <Link to="/expenses" className="flex items-center px-4 hover:text-indigo-600">
                <DollarSign className="h-5 w-5" />
                <span className="ml-2">Expenses</span>
              </Link>
              <Link to="/profile" className="flex items-center px-4 hover:text-indigo-600">
                <User className="h-5 w-5" />
                <span className="ml-2">Profile</span>
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-2">Logout</span>
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}