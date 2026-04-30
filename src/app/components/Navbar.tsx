import { NavLink } from 'react-router';
import { Home, Heart, PlusCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

export function Navbar() {
  const { t } = useLanguage();

  const navItems = [
    { to: '/home', icon: Home, label: t('home') },
    { to: '/favorites', icon: Heart, label: t('fav') },
    { to: '/add', icon: PlusCircle, label: '+', isFab: true },
    { to: '/admin', icon: ShieldCheck, label: t('admin') },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 flex justify-around items-center px-4 py-2 h-[72px] z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-all",
            item.isFab ? "relative" : "",
            isActive && !item.isFab ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
          )}
        >
          {item.isFab ? (
            <div className="bg-orange-500 text-white w-14 h-14 rounded-full flex items-center justify-center -mt-10 shadow-lg shadow-orange-200 border-4 border-white transform transition-transform hover:scale-110 active:scale-95">
              <PlusCircle size={28} />
            </div>
          ) : (
            <>
              <item.icon size={22} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
