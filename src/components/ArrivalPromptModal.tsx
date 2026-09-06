import React from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Flame, X } from 'lucide-react';

export const ArrivalPromptModal: React.FC = () => {
  const { arrivalCourt, setArrivalCourt, user, refreshCourts } = useApp();

  if (!arrivalCourt || !user) return null;

  const handleResponse = async (status: 'CONFIRMED_HOOPER' | 'VENUE_PRESENCE') => {
    try {
      await api.checkIn(arrivalCourt.id, status, user.id);
      setArrivalCourt(null);
      await refreshCourts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-[#121215] border border-zinc-700 p-6 rounded-3xl shadow-2xl text-center space-y-4">
        <button
          onClick={() => setArrivalCourt(null)}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 bg-white text-black rounded-full mx-auto flex items-center justify-center shadow-lg">
          <Flame size={28} />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5722]">
            ARRIVAL RECOGNIZED
          </span>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white font-display mt-1">
            ARE YOU HOOPING?
          </h3>
          <p className="text-xs text-zinc-300 mt-2 font-medium">
            You arrived at <strong className="text-white">{arrivalCourt.name} ({arrivalCourt.subName})</strong>.
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">
            Confirming your run alerts nearby players and keeps the Sacramento pickup board accurate.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => handleResponse('CONFIRMED_HOOPER')}
            className="w-full py-4 bg-white text-black font-black italic uppercase tracking-widest text-sm rounded-xl hover:bg-zinc-200 transition-colors shadow"
          >
            YES, I'M HOOPING NOW
          </button>

          <button
            onClick={() => handleResponse('VENUE_PRESENCE')}
            className="w-full py-3 bg-zinc-800 text-zinc-300 font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-zinc-700 transition-colors"
          >
            JUST AT THE FACILITY
          </button>

          <button
            onClick={() => setArrivalCourt(null)}
            className="w-full py-2 text-zinc-500 font-semibold text-xs hover:text-white"
          >
            Not right now
          </button>
        </div>
      </div>
    </div>
  );
};
