import React from 'react';
import { useApp } from '../context/AppContext';
import { SlidersHorizontal, Bell, Compass, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    location,
    filters,
    setIsFilterSheetOpen,
    setIsNotifDrawerOpen,
    unreadNotifsCount,
    setIsDevControlsOpen,
    user,
    setIsAdminModalOpen
  } = useApp();

  const isFilterActive = filters.maxDistance !== 50 || filters.brandFilter !== 'ALL' || filters.courtType !== 'ALL' || !!filters.cotwOnly;

  return (
    <header className="sticky top-0 z-40 bg-[#000000] text-white border-b border-zinc-900 px-5 pt-[calc(env(safe-area-inset-top)+0.6rem)] pb-3">
      {/* Top micro bar */}
      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF5722] animate-pulse" />
          <span className="text-zinc-300 font-semibold tracking-wider">GREATER SACRAMENTO</span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400">
          <span className="truncate max-w-[170px]">{location.label}</span>
          {location.isSimulated && (
            <span className="text-[9px] px-1 py-0.5 bg-zinc-800 text-zinc-400 rounded">SIM</span>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-black italic tracking-tight uppercase text-white font-display">
            WTR-SACRAMENTO
          </h1>
          <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">
            {activeTab === 'HOME' && 'PICKUP RADAR'}
            {activeTab === 'RUNS' && 'SCHEDULED'}
            {activeTab === 'MAP' && 'MAP'}
            {activeTab === 'FRIENDS' && 'CREW'}
            {activeTab === 'PROFILE' && 'PLAYER CARD'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Admin badge if user is admin */}
          {user?.isAdmin && (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              title="Admin Court Manager"
            >
              <ShieldCheck size={18} />
            </button>
          )}

          {/* Dev Location Simulator */}
          <button
            onClick={() => setIsDevControlsOpen(true)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            title="Location & Scenario Simulator"
          >
            <Compass size={18} />
          </button>

          {/* Filter button on Home view */}
          {activeTab === 'HOME' && (
            <button
              onClick={() => setIsFilterSheetOpen(true)}
              className="p-2 text-zinc-400 hover:text-white transition-colors relative"
              title="Filter Courts"
            >
              <SlidersHorizontal size={18} />
              {isFilterActive && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-black" />
              )}
            </button>
          )}

          {/* Notifications button */}
          <button
            onClick={() => setIsNotifDrawerOpen(true)}
            className="p-2 text-zinc-400 hover:text-white transition-colors relative"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5722] rounded-full ring-2 ring-black" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
