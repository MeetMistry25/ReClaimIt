import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  UserCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';

// Add toggle switch styles
const toggleSwitchStyles = `\
/* From Uiverse.io by njesenberger */ \
.toggle-wrapper {\
  display: flex;\
  justify-content: center;\
  align-items: center;\
  position: relative;\
  border-radius: .5em;\
  padding: .125em;\
  background-image: linear-gradient(to bottom, #d5d5d5, #e8e8e8);\
  box-shadow: 0 1px 1px rgb(255 255 255 / .6);\
  font-size: 1.2em;\
}\
.toggle-checkbox {\
  appearance: none;\
  position: absolute;\
  z-index: 1;\
  border-radius: inherit;\
  width: 100%;\
  height: 100%;\
  font: inherit;\
  opacity: 0;\
  cursor: pointer;\
}\
.toggle-container {\
  display: flex;\
  align-items: center;\
  position: relative;\
  border-radius: .375em;\
  width: 2.4em;\
  height: 1.2em;\
  background-color: #e8e8e8;\
  box-shadow: inset 0 0 .0625em .125em rgb(255 255 255 / .2), inset 0 .0625em .125em rgb(0 0 0 / .4);\
  transition: background-color .4s linear;\
}\
.toggle-checkbox:checked + .toggle-container {\
  background-color: #4169E1;\
}\
.toggle-button {\
  display: flex;\
  justify-content: center;\
  align-items: center;\
  position: absolute;\
  left: .0625em;\
  border-radius: .3125em;\
  width: 1.1em;\
  height: 1.1em;\
  background-color: #e8e8e8;\
  box-shadow: inset 0 -.0625em .0625em .125em rgb(0 0 0 / .1), inset 0 -.125em .0625em rgb(0 0 0 / .2), inset 0 .1875em .0625em rgb(255 255 255 / .3), 0 .125em .125em rgb(0 0 0 / .5);\
  transition: left .4s;\
}\
.toggle-checkbox:checked + .toggle-container > .toggle-button {\
  left: 1.25em;\
}\
.toggle-button-circles-container {\
  display: grid;\
  grid-template-columns: repeat(3, min-content);\
  gap: .125em;\
  position: absolute;\
  margin: 0 auto;\
}\
.toggle-button-circle {\
  border-radius: 50%;\
  width: .125em;\
  height: .125em;\
  background-image: radial-gradient(circle at 50% 0, #f5f5f5, #c4c4c4);\
}\
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);

  // On mount, set theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Handle toggle
  const handleThemeToggle = (e) => {
    const checked = e.target.checked;
    setIsDark(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const navigation = [
      { name: 'Browse Items', href: '/found-items' },
    ...(
      user
        ? [
            { name: 'Report Lost', href: '/report-lost' },
            { name: 'Report Found', href: '/report-found' },
            
          ]
        : []
    )
  ];

  const location = useLocation();
  const isHome = location.pathname === '/';
  const navBarClass = isHome
    ? 'bg-white shadow-sm border-b border-gray-200'
    : 'bg-gradient-to-br from-primary-600 to-primary-800 text-white py-2'; // py-6 (24px) - 15px = py-2 (8px)
  const navTextClass = isHome
    ? 'text-gray-500 hover:text-gray-900'
    : 'text-white hover:text-primary-200';
  const navProfileTextClass = isHome
    ? 'text-gray-700 hover:text-gray-900'
    : 'text-white hover:text-primary-200';
  const navInputClass = isHome
    ? 'w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg'
    : 'w-full pl-12 pr-4 py-3 border border-white rounded-lg bg-primary-700 bg-opacity-30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent text-lg';
  const navIconClass = isHome ? 'text-gray-400' : 'text-primary-100';
  return (
    <>
      <style>{toggleSwitchStyles}</style>
      <nav className={navBarClass}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between" style={{ height: isHome ? '64px' : '49px', width: '100%' }}>
            {/* Left section: Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* ReClaimIt logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <span className={`text-3xl font-marcellus font-bold ${isHome ? 'text-gray-900' : 'text-white'}`}>ReClaimIt</span>
                </Link>
              </div>

              {/* Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${navTextClass} px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Center section: Search bar */}
            <div className="flex-1 flex justify-center mx-4 lg:mx-8 min-w-0 max-w-2xl">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={navInputClass}
                  />
                  <MagnifyingGlassIcon className={`absolute left-4 top-3 h-6 w-6 ${navIconClass}`} />
                </div>
              </form>
            </div>
            {/* Right section: Toggle switch, Auth buttons, Mobile menu */}
            <div className="flex items-center space-x-4">
              {/* Toggle switch */}
              <div className="hidden sm:block">
                <div className="toggle-wrapper">
                  <input
                    className="toggle-checkbox"
                    type="checkbox"
                    id="custom-toggle-switch"
                    checked={isDark}
                    onChange={handleThemeToggle}
                  />
                  <div className="toggle-container">
                    <div className="toggle-button">
                      <div className="toggle-button-circles-container">
                        <div className="toggle-button-circle"></div>
                        <div className="toggle-button-circle"></div>
                        <div className="toggle-button-circle"></div>
                        <div className="toggle-button-circle"></div>
                        <div className="toggle-button-circle"></div>
                        <div className="toggle-button-circle"></div>
                        <div className="toggle-button-circle"></div>
                        <div className="toggle-button-circle"></div>
                        <div className="toggle-button-circle"></div>
                        <div className="toggle-button-circle"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account/Profile and notifications */}
              <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Notifications */}
                  <button className={`p-2 ${navTextClass}`}>
                    <BellIcon className="h-6 w-6" />
                  </button>
                  {/* User menu - extreme right */}
                  <div className="relative">
                    <Link
                      to="/profile"
                      className={`flex items-center space-x-2 ${navProfileTextClass} text-base`}
                    >
                      <UserCircleIcon className="h-8 w-8" />
                      <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* Admin Link */}
                  <Link
                    to="/admin/login"
                    className={`${navTextClass} px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/20`}
                  >
                    Admin
                  </Link>
                  <div className="hidden sm:flex space-x-4 items-center">
                    <Link
                      to="/login"
                      className={`${navTextClass} px-5 py-2 rounded-md text-base font-semibold`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={`bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md text-base font-semibold transition-colors duration-200`}
                    >
                      Register
                    </Link>
                  </div>
                </>
              )}

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="sm:hidden p-2 text-gray-400 hover:text-gray-500"
                >
                  {isOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="sm:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 ${isHome ? 'bg-white border-t border-gray-200' : 'bg-gradient-to-br from-primary-600 to-primary-800 text-white'}`}>
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="px-3 py-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={isHome ? 'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent' : 'w-full pl-10 pr-4 py-2 border border-white rounded-lg bg-primary-700 bg-opacity-30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent'}
                  />
                  <MagnifyingGlassIcon className={`absolute left-3 top-2.5 h-5 w-5 ${isHome ? 'text-gray-400' : 'text-primary-100'}`} />
                </div>
              </form>

              {/* Mobile navigation */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${isHome ? 'text-gray-500 hover:text-gray-900' : 'text-white hover:text-primary-200'} block px-5 py-3 rounded-md text-base font-semibold`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile auth buttons */}
              {!user ? (
                <div className="px-3 py-2 space-y-2">
                  <Link
                    to="/login"
                    className={`block ${isHome ? 'text-gray-500 hover:text-gray-900' : 'text-white hover:text-primary-200'} px-5 py-3 rounded-md text-base font-semibold`}
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md text-base font-semibold text-center transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Link
                    to="/profile"
                    className={`block ${isHome ? 'text-gray-500 hover:text-gray-900' : 'text-white hover:text-primary-200'} px-5 py-3 rounded-md text-base font-semibold`}
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;