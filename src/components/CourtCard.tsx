import React from 'react';
import { RankedCourt } from '../types';
import { useApp } from '../context/AppContext';
import { MapPin } from 'lucide-react';

interface CourtCardProps {
  court: RankedCourt;
  rankIndex?: number;
}

export const CourtCard: React.FC<CourtCardProps> = ({ court }) => {
  const { setSelectedCourtId } = useApp();

  const isLive = court.isLiveConfirmed || court.confirmedPlayersCount >= 5;
  const isHeatingUp = !isLive && (court.confirmedPlayersCount > 0 || court.headingThereCount > 0);

  return (
    <div
      onClick={() => setSelectedCourtId(court.id)}
      className="group relative w-full mb-4 cursor-pointer transition-all duration-200 active:scale-[0.99] rounded-2xl overflow-hidden bg-[#141416] border border-zinc-800/80 hover:border-zinc-700 shadow-md"
    >
      {/* Court Photo with subtle aspect ratio */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
        <img
          src={court.primaryPhoto}
          alt={court.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 brightness-90 contrast-105"
          loading="lazy"
        />

        {/* Clean Vignette / Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-black/20 to-black/30" />

        {/* Status Pill - Top Left */}
        <div className="absolute top-3 left-3 flex items-center pointer-events-none">
          {isLive ? (
            <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-orange-500/60 shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse" />
              <span className="text-[11px] font-bold tracking-tight text-white">
                {court.confirmedPlayersCount > 0 ? `${court.confirmedPlayersCount} Hooping` : 'Run Active'}
              </span>
            </div>
          ) : isHeatingUp ? (
            <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-700 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[11px] font-medium tracking-tight text-zinc-200">
                {court.confirmedPlayersCount > 0 
                  ? `${court.confirmedPlayersCount} hooping` 
                  : `${court.headingThereCount} on the way`}
              </span>
            </div>
          ) : (
            <div className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-800/80 text-[10px] font-medium text-zinc-400 shadow-sm">
              Quiet now
            </div>
          )}
        </div>

        {/* Distance Pill - Top Right */}
        <div className="absolute top-3 right-3 pointer-events-none">
          <div className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-medium text-zinc-300 shadow-sm">
            {court.distanceMiles} mi
          </div>
        </div>

        {/* Calm Bottom Title & Spec Overlay */}
        <div className="absolute bottom-3 inset-x-4 text-white pointer-events-none">
          <h3 className="text-lg font-bold tracking-tight text-white leading-snug drop-shadow-sm">
            {court.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-zinc-300 mt-0.5">
            <span className="flex items-center gap-1 text-zinc-300 truncate">
              <MapPin size={12} className="text-zinc-400 shrink-0" />
              <span>{court.city}</span>
            </span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-400 truncate">
              {court.indoor ? 'Indoor Hardwood' : (court.hasLights ? 'Outdoor · Lit' : 'Outdoor')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
