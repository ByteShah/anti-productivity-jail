import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Settings, History, Skull } from 'lucide-react';

const navItems = [
  { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
  { to: '/task', icon: <PlusCircle size={20} />, label: 'New Task' },
  { to: '/consequences', icon: <Skull size={20} />, label: 'Consequences' },
  { to: '/history', icon: <History size={20} />, label: 'History' },
  { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700">
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                isActive
                  ? 'bg-red-900/30 text-red-400'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`
            }
            end={item.to === '/'}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="prison-bars-bg rounded-lg bg-slate-700/50 p-4 text-sm">
          <p className="font-semibold text-red-400 mb-1">Failure is not an option</p>
          <p className="text-slate-400 text-xs">Complete your tasks or face the consequences.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;