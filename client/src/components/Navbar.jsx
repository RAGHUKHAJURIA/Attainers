import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Paid Mock', href: '#' },
    { name: 'PDF', href: '#' },
    { name: 'Video Lecture', href: '#' },
    { name: 'Course', href: '#' },
    { name: 'Previous Year Papers', href: '#' },
  ];

  // Detect scroll for blur/shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${isScrolled
        ? "bg-white/70 backdrop-blur-md shadow-lg"
        : "bg-white/50 backdrop-blur-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="text-xl sm:text-2xl font-bold text-indigo-600">
              Attainers
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <ul className="flex items-center space-x-4 xl:space-x-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="relative font-medium tracking-wide text-gray-700 hover:text-indigo-600 transition-colors duration-300 group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sign In Button (Desktop) */}
          <div className="hidden lg:block">
            <a
              href="#"
              className="px-4 sm:px-5 py-2 font-semibold bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-400 hover:scale-105 transition-transform duration-300"
            >
              Sign In
            </a>
          </div>

          {/* Mobile / Tablet Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-200 transition"
            >
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Menu */}
      <div
        className={`${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden lg:hidden transition-all duration-500 ease-in-out`}
      >
        <ul className="px-4 pt-2 pb-4 space-y-2 text-center bg-white/90 backdrop-blur-md rounded-b-lg shadow-md">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition"
              >
                {link.name}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#"
              className="block w-3/4 sm:w-1/2 mx-auto mt-3 px-4 sm:px-5 py-2 font-semibold bg-indigo-500 text-white rounded-xl shadow-md hover:bg-indigo-600 hover:scale-105 transition-transform duration-300"
            >
              Sign In
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
