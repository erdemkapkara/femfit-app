import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Lock } from 'lucide-react';
import { useMembership } from '../hooks/useMembership';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isPremium } = useMembership();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/cycle', label: 'Cycle' },
    { href: '/active', label: 'Active' },
    { href: '/nutrition', label: 'Nutrition' },
    { href: '/blog', label: 'Blog' },
    { href: '/social', label: 'Social', premium: true },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="bg-sage shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-white text-2xl font-bold">FemFit</span>
            <span className="hidden sm:inline text-white/75 text-sm">Women's Wellness</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-1">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'text-white/85 hover:bg-white/15'
                  }`
                }
              >
                {link.premium && !isPremium && <Lock size={14} />}
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-sage/90 py-2">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-white/25 text-white' : 'text-white/85 hover:bg-white/15'
                  }`
                }
              >
                {link.premium && !isPremium && <Lock size={14} />}
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
