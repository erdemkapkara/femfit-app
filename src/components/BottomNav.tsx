import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, Zap, Apple, User } from 'lucide-react';

const TABS = [
  { href: '/',          label: 'Home',      Icon: Home     },
  { href: '/cycle',     label: 'Cycle',     Icon: Calendar },
  { href: '/active',    label: 'Active',    Icon: Zap      },
  { href: '/nutrition', label: 'Nutrition', Icon: Apple    },
  { href: '/profile',   label: 'Profile',   Icon: User     },
];

const BottomNav: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 6px)' }}
    >
      <div className="flex">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <NavLink
              key={href}
              to={href}
              className="flex-1 flex flex-col items-center justify-center pt-2 pb-1 gap-0.5 transition-all"
            >
              <div className={`p-1.5 rounded-2xl transition-all duration-200 ${active ? 'bg-sage/15 scale-110' : ''}`}>
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.7}
                  className={`transition-colors ${active ? 'text-sage' : 'text-gray-400'}`}
                />
              </div>
              <span className={`text-[10px] font-bold leading-none transition-colors ${active ? 'text-sage' : 'text-gray-400'}`}>
                {label}
              </span>
              {active && <span className="w-1 h-1 rounded-full bg-sage mt-0.5" />}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
