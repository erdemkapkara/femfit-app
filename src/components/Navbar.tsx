import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Lock, BookOpen, Users } from 'lucide-react';
import { useMembership } from '../hooks/useMembership';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isPremium } = useMembership();

  const desktopLinks = [
    { href: '/',          label: 'Home' },
    { href: '/cycle',     label: 'Cycle' },
    { href: '/active',    label: 'Active' },
    { href: '/nutrition', label: 'Nutrition' },
    { href: '/blog',      label: 'Blog' },
    { href: '/social',    label: 'Social', premium: true },
    { href: '/profile',   label: 'Profile' },
  ];

  // On mobile only Blog + Social shown in hamburger (rest handled by BottomNav)
  const mobileExtra = [
    { href: '/blog',   label: 'Blog',   icon: <BookOpen size={16} /> },
    { href: '/social', label: 'Social', icon: <Users size={16} />, premium: true },
  ];

  return (
    <nav className="bg-sage shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-white text-xl font-bold tracking-tight">FemFit</span>
            <span className="hidden sm:inline text-white/70 text-xs">Women's Wellness</span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex gap-1">
            {desktopLinks.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                    isActive ? 'bg-white/25 text-white' : 'text-white/80 hover:bg-white/15 hover:text-white'
                  }`
                }
              >
                {link.premium && !isPremium && <Lock size={12} />}
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile right side: extra links + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `p-2 rounded-lg transition ${isActive ? 'bg-white/25' : 'hover:bg-white/15'}`
              }
            >
              <BookOpen size={18} className="text-white" />
            </NavLink>
            <NavLink
              to="/social"
              className={({ isActive }) =>
                `p-2 rounded-lg transition ${isActive ? 'bg-white/25' : 'hover:bg-white/15'}`
              }
            >
              {!isPremium ? <Lock size={18} className="text-white/70" /> : <Users size={18} className="text-white" />}
            </NavLink>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden bg-sage/95 backdrop-blur-sm border-t border-white/10 py-2">
          {desktopLinks.map(link => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {link.premium && !isPremium && <Lock size={13} />}
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
