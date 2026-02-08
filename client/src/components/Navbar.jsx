import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const location = useLocation();

  // Scroll effect detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  // Navigation Data Structure
  const navGroups = [
    { name: 'Home', href: '/', type: 'link' },
    { name: 'Mock Tests', href: '/mock-tests', type: 'link' },
    {
      name: 'Study Material',
      type: 'dropdown',
      items: [
        { name: 'PDFs', href: '/pdfs' },
        { name: 'Courses', href: '/courses' },
        { name: 'Previous Papers', href: '/previous-papers' },
        { name: 'Free Courses', href: '/free-courses' },
      ]
    },
    {
      name: 'Content Hub',
      type: 'dropdown',
      items: [
        { name: 'Blogs', href: '/blogs' },
        { name: 'YouTube', href: '/youtube' },
        { name: 'Updates', href: '/updates' },
        { name: 'Schedules', href: '/schedules' },
      ]
    },
    { name: 'Contact Us', href: '/contact', type: 'link' }
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/80 backdrop-blur-md shadow-lg"
        : "bg-transparent" // Start transparent, overlapping hero if desired, or bg-white if not
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full shadow-lg group-hover:scale-105 transition-transform" />
            <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Attainers x Dlatestinfo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navGroups.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => item.type === 'dropdown' && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.type === 'link' ? (
                  <Link
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                      }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${activeDropdown === item.name ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                      }`}
                  >
                    <span>{item.name}</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}

                {/* Dropdown Menu */}
                {item.type === 'dropdown' && (
                  <div
                    className={`absolute top-full left-0 w-56 pt-2 transition-all duration-200 origin-top-left ${activeDropdown === item.name
                      ? 'opacity-100 scale-100 visible'
                      : 'opacity-0 scale-95 invisible'
                      }`}
                  >
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-black ring-opacity-5">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={`block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors ${isActive(subItem.href) ? 'bg-blue-50 text-blue-600' : ''}`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isLoaded ? (
              <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
            ) : isSignedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">
                  {user.firstName || user.username}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            {isSignedIn && <UserButton afterSignOutUrl="/" />}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border-t border-gray-100 shadow-lg pb-6 px-4 pt-2">
          <div className="space-y-1">
            {navGroups.map((item, index) => (
              <div key={index}>
                {item.type === 'link' ? (
                  <Link
                    to={item.href}
                    className={`block px-4 py-3 rounded-lg text-base font-medium ${isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {item.name}
                    </div>
                    <div className="space-y-1 pl-2">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${isActive(subItem.href)
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                            }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Mobile Auth Buttons */}
          {!isSignedIn && isLoaded && (
            <div className="mt-6 space-y-3 px-4">
              <SignInButton mode="modal">
                <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;