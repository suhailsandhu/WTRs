import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CourtCard } from './components/CourtCard';
import { CourtDetailModal } from './components/CourtDetailModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ArrivalPromptModal } from './components/ArrivalPromptModal';
import { FilterSheet } from './components/FilterSheet';
import { NotificationDrawer } from './components/NotificationDrawer';
import { SimulationControls } from './components/SimulationControls';
import { AdminModal } from './components/AdminModal';
import { PlannedRunsView } from './components/PlannedRunsView';
import { MapView } from './components/MapView';
import { FriendsView } from './components/FriendsView';
import { ProfileView } from './components/ProfileView';
import { Flame, RefreshCw, SlidersHorizontal, MapPin } from 'lucide-react';

const MainScreen: React.FC = () => {
  const {
    activeTab,
    courts,
    loadingCourts,
    refreshCourts,
    selectedCourtId,
    setSelectedCourtId,
    filters,
    setIsFilterSheetOpen
  } = useApp();

  // Apply filters
  const filteredCourts = courts.filter(c => {
    if (c.distanceMiles > filters.maxDistance) return false;
    if (filters.brandFilter !== 'ALL' && c.brand !== filters.brandFilter) return false;
    if (filters.courtType === 'INDOOR' && !c.indoor) return false;
    if (filters.courtType === 'OUTDOOR' && c.indoor) return false;
    if (filters.cotwOnly && !c.cotwVerified) return false;
    return true;
  });

  // Segregate into Top Ranked / Active options and Quiet/Expected later options
  const activeOrRunSoon = filteredCourts.filter(
    c => c.isLiveConfirmed || c.activityStatusLabel === 'GETTING ACTIVE' || c.activityStatusLabel === 'RUN STARTING SOON'
  );
  const quietCourts = filteredCourts.filter(
    c => !c.isLiveConfirmed && c.activityStatusLabel !== 'GETTING ACTIVE' && c.activityStatusLabel !== 'RUN STARTING SOON'
  );

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#FF5722] selection:text-white flex flex-col justify-between">
      {/* Native App View Container */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col relative bg-[#09090b] min-h-screen shadow-2xl">
        {/* Persistent App Header */}
        <Header />

        {/* Dynamic Tab Body */}
        <main className="flex-1 overflow-x-hidden">
          {activeTab === 'HOME' && (
            <div className="pb-28 pt-4 px-4">
              {/* Question Banner */}
              <div className="mb-5 px-1 flex items-baseline justify-between">
                <div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white font-display leading-none">
                    WHERE'S THE RUNS
                  </h2>
                  <p className="text-[12px] font-semibold text-zinc-400 mt-1">
                    Ranked by live confirmed players & heading ETA
                  </p>
                </div>
                <button
                  onClick={refreshCourts}
                  className="p-2 text-zinc-500 hover:text-white transition-colors"
                  title="Refresh Live Radar"
                >
                  <RefreshCw size={15} />
                </button>
              </div>

              {loadingCourts ? (
                <div className="py-24 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-[#FF5722] rounded-full animate-spin" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                    Scanning Sacramento Runs...
                  </span>
                </div>
              ) : filteredCourts.length === 0 ? (
                <div className="py-16 text-center bg-[#111114] rounded-2xl border border-zinc-800 p-6 space-y-3">
                  <MapPin size={32} className="mx-auto text-zinc-600" />
                  <h3 className="text-sm font-bold text-white uppercase">No Courts in this Range</h3>
                  <p className="text-xs text-zinc-400">
                    Try expanding distance or clearing brand filters.
                  </p>
                  <button
                    onClick={() => setIsFilterSheetOpen(true)}
                    className="px-4 py-2 bg-white text-black font-bold uppercase text-xs rounded-lg"
                  >
                    Adjust Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Primary Active Runs Section */}
                  {activeOrRunSoon.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                          RECOMMENDED RUNS RIGHT NOW
                        </span>
                      </div>
                      <div>
                        {activeOrRunSoon.map((court, idx) => (
                          <CourtCard key={court.id} court={court} rankIndex={idx + 1} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quiet / Expected Later Section */}
                  {quietCourts.length > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          QUIET RIGHT NOW · PREDICTED LATER
                        </span>
                        <span className="text-[9px] uppercase font-bold text-zinc-500">
                          Historical
                        </span>
                      </div>
                      <div>
                        {quietCourts.map(court => (
                          <CourtCard key={court.id} court={court} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'RUNS' && <PlannedRunsView />}
          {activeTab === 'MAP' && <MapView />}
          {activeTab === 'FRIENDS' && <FriendsView />}
          {activeTab === 'PROFILE' && <ProfileView />}
        </main>

        {/* Bottom Tab Navigation */}
        <Navigation />

        {/* Modals & Overlays */}
        {selectedCourtId && (
          <CourtDetailModal
            courtId={selectedCourtId}
            onClose={() => setSelectedCourtId(null)}
          />
        )}
        <OnboardingModal />
        <ArrivalPromptModal />
        <FilterSheet />
        <NotificationDrawer />
        <SimulationControls />
        <AdminModal />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainScreen />
    </AppProvider>
  );
}

export default App;
