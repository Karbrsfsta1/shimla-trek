import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Mountain, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/treks', label: 'Treks' },
  { to: '/homestays', label: 'Homestays' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate('/');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-1 py-2 text-gray-700 hover:text-forest transition-colors focus:outline-none focus-visible:text-forest focus-visible:underline ${
      isActive ? 'text-forest font-semibold border-b-2 border-forest' : ''
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-forest">
            <Mountain className="h-7 w-7" />
            <span>ShimlaTrek</span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  className="text-gray-700 hover:text-forest transition-colors focus:outline-none focus-visible:text-forest focus-visible:underline"
                >
                  Dashboard
                </NavLink>
                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  <Button variant="secondary" size="sm">
                    Login
                  </Button>
                </NavLink>
                <NavLink to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-forest transition-colors ${
                    isActive ? 'text-forest font-semibold bg-gray-50' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
              {user ? (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-forest focus:outline-none focus-visible:text-forest focus-visible:underline"
                  >
                    Dashboard
                  </NavLink>
                  <Button variant="secondary" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full">
                      Login
                    </Button>
                  </NavLink>
                  <NavLink to="/register" onClick={() => setOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
