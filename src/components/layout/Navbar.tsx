import React from 'react';
import { Link } from 'react-router-dom';
import { AlarmClock, LogOut, Menu, X } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout } = useAuthContext();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <AlarmClock className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">Anti-Productivity Jail</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {user && (
            <>
              <div className="text-sm opacity-75">
                Logged in as <span className="font-semibold">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 py-2 px-4">
          <nav className="space-y-2">
            <Link 
              to="/" 
              className="block py-2 px-3 text-white rounded-lg hover:bg-slate-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/task" 
              className="block py-2 px-3 text-white rounded-lg hover:bg-slate-700"
              onClick={() => setIsMenuOpen(false)}
            >
              New Task
            </Link>
            <Link 
              to="/consequences" 
              className="block py-2 px-3 text-white rounded-lg hover:bg-slate-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Consequences
            </Link>
            <Link 
              to="/settings" 
              className="block py-2 px-3 text-white rounded-lg hover:bg-slate-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
            <Link 
              to="/history" 
              className="block py-2 px-3 text-white rounded-lg hover:bg-slate-700"
              onClick={() => setIsMenuOpen(false)}
            >
              History
            </Link>
            {user && (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-white rounded-lg hover:bg-slate-700 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;