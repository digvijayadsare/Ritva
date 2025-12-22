
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, BookOpen, PlusCircle } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/' },
    { icon: <Calendar size={24} />, label: 'Calendar', path: '/calendar' },
    { icon: <PlusCircle size={24} />, label: 'Add', path: '/create' },
    { icon: <Users size={24} />, label: 'Ancestors', path: '/ancestors' },
    { icon: <BookOpen size={24} />, label: 'Family', path: '/family' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-20 p-4 bg-[#FDF7F2]">
        {children}
      </main>
      
      <nav className="absolute bottom-0 w-full bg-white border-t border-orange-100 flex justify-around py-3 px-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              location.pathname === item.path ? 'text-orange-600' : 'text-gray-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
