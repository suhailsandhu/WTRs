import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, X, MapPin, RefreshCw, Flame, UserCheck } from 'lucide-react';

export const SimulationControls: React.FC = () => {
  const {
    isDevControlsOpen,
    setIsDevControlsOpen,
    location,
    simulateLocation,
    courts,
    setArrivalCourt,
    switchUserAccount,
    user,
    resetToSeedData
  } = useApp();

  if (!isDevControlsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#111114] border border-zinc-800 rounded-3xl p-6 text-white shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-[#FF5722]" />
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white font-display">
              SIMULATION CONTROLS
            </h3>
          </div>
          <button
            onClick={() => setIsDevControlsOpen(false)}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current State summary */}
        <div className="bg-black/50 border border-zinc-800 p-3.5 rounded-xl space-y-1 text-xs">
          <div className="text-zinc-400">Current Position:</div>
          <div className="text-white font-bold flex items-center gap-1.5">
            <MapPin size={14} className="text-[#FF5722]" />
            <span>{location.label}</span>
          </div>
          <div className="text-[10px] text-zinc-500">
            Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </div>
        </div>

        {/* Teleport Preset Buttons */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5722] block mb-2">
            TELEPORT GEOFENCE (TEST ARRIVAL & UNLOCK CHECK-IN)
          </span>
          <div className="space-y-1.5">
            <button
              onClick={() => {
                simulateLocation('crt_24h_downtown');
                setIsDevControlsOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-[#17171c] hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left text-xs text-white font-bold flex items-center justify-between transition-colors"
            >
              <span>At 24 Hr Downtown Rooftop (0.0 mi)</span>
              <span className="text-[9px] uppercase bg-white text-black px-1.5 py-0.5 rounded font-black">
                Triggers Prompt
              </span>
            </button>

            <button
              onClick={() => {
                simulateLocation('crt_24h_natomas');
                setIsDevControlsOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-[#17171c] hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left text-xs text-white font-bold flex items-center justify-between transition-colors"
            >
              <span>At 24 Hr North Natomas (0.0 mi)</span>
              <span className="text-[9px] uppercase bg-white text-black px-1.5 py-0.5 rounded font-black">
                Triggers Prompt
              </span>
            </button>

            <button
              onClick={() => {
                simulateLocation('crt_inshape_rocklin');
                setIsDevControlsOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-[#17171c] hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left text-xs text-white font-bold flex items-center justify-between transition-colors"
            >
              <span>At In-Shape Rocklin (0.0 mi)</span>
              <span className="text-[9px] uppercase bg-white text-black px-1.5 py-0.5 rounded font-black">
                Triggers Prompt
              </span>
            </button>

            <button
              onClick={() => {
                simulateLocation('MIDTOWN');
                setIsDevControlsOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-[#17171c] hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left text-xs text-zinc-300 font-semibold flex items-center justify-between transition-colors"
            >
              <span>Midtown Sacramento (1.2 mi away)</span>
              <span className="text-[9px] text-zinc-500 uppercase">En Route</span>
            </button>

            <button
              onClick={() => {
                simulateLocation('ROSEVILLE');
                setIsDevControlsOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-[#17171c] hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left text-xs text-zinc-300 font-semibold flex items-center justify-between transition-colors"
            >
              <span>Roseville (18 mi away)</span>
              <span className="text-[9px] text-zinc-500 uppercase">Suburban</span>
            </button>

            <button
              onClick={() => {
                simulateLocation('REAL');
                setIsDevControlsOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-left text-xs text-white font-bold flex items-center justify-between transition-colors"
            >
              <span>Real Device GPS Location</span>
              <span className="text-[9px] text-zinc-400 uppercase">Native GPS</span>
            </button>
          </div>
        </div>

        {/* Direct Prompt Trigger */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">
            MANUAL ARRIVAL PROMPT TEST
          </span>
          <button
            onClick={() => {
              if (courts.length > 0) {
                setArrivalCourt(courts[0]);
                setIsDevControlsOpen(false);
              }
            }}
            className="w-full py-3 bg-[#17171c] hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2"
          >
            <Flame size={16} className="text-[#FF5722]" />
            <span>TRIGGER "ARE YOU HOOPING?" MODAL</span>
          </button>
        </div>

        {/* Fast User Switch */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">
            TEST AS DIFFERENT HOOPER
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'usr_suhail', name: 'Suhail' },
              { id: 'usr_marcus', name: 'Marcus' },
              { id: 'usr_jordan', name: 'Jordan' },
              { id: 'usr_tyler', name: 'Tyler' },
            ].map(u => (
              <button
                key={u.id}
                onClick={() => {
                  switchUserAccount(u.id);
                  setIsDevControlsOpen(false);
                }}
                className={`py-2 px-3 text-xs font-bold rounded-lg border text-left transition-colors ${
                  user?.id === u.id
                    ? 'bg-white text-black border-white'
                    : 'bg-[#17171c] text-zinc-300 border-zinc-800 hover:text-white'
                }`}
              >
                {u.name} {user?.id === u.id ? '✓' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Database */}
        <div className="pt-2 border-t border-zinc-800">
          <button
            onClick={async () => {
              await resetToSeedData();
              setIsDevControlsOpen(false);
            }}
            className="w-full py-2.5 text-zinc-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw size={14} />
            <span>RESET DATABASE TO SEED STATE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
