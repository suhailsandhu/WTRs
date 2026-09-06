import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import { Flame, Calendar, MapPin, Users, User } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'HOME', label: 'HOME', icon: <Flame size={20} /> },
    { id: 'RUNS', label: 'RUNS', icon: <Calendar size={20} /> },
    { id: 'MAP', label: 'MAP', icon: <MapPin size={20} /> },
    { id: 'FRIENDS', label: 'FRIENDS', icon: <Users size={20} /> },
    { id: 'PROFILE', label: 'PROFILE', icon: <User size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#000000] border-t border-zinc-900 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5 px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 relative ${
                isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#FF5722] rounded-full" />
                )}
              </div>
              <span className={`text-[9px] font-black tracking-widest mt-1 uppercase transition-opacity ${
                isActive ? 'text-white font-extrabold' : 'text-zinc-500 font-semibold'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
