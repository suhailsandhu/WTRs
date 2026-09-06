import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, Star } from 'lucide-react';

export const FilterSheet: React.FC = () => {
  const { filters, setFilters, isFilterSheetOpen, setIsFilterSheetOpen } = useApp();

  if (!isFilterSheetOpen) return null;

  const distances = [5, 10, 25, 50];
  const brands = ['ALL', '24 Hour Fitness', 'In-Shape Fitness', 'Public Park'];
  const types: Array<{ label: string; value: 'ALL' | 'INDOOR' | 'OUTDOOR' }> = [
    { label: 'All Courts', value: 'ALL' },
    { label: 'Indoor Hardwood', value: 'INDOOR' },
    { label: 'Outdoor Park / Rooftop', value: 'OUTDOOR' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#111114] border-t border-zinc-800 rounded-t-3xl px-6 pt-3 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] text-white space-y-5">
        {/* iOS Drag Handle */}
        <div className="w-full flex justify-center pb-2">
          <div className="w-10 h-1 bg-zinc-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
          <div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white font-display">
              FILTER RUNS
            </h3>
            <p className="text-xs text-zinc-400">Customize your Greater Sacramento radar</p>
          </div>
          <button
            onClick={() => setIsFilterSheetOpen(false)}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Courts of the World Community Verified Highlight */}
        <div>
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, cotwOnly: !prev.cotwOnly }))}
            className={`w-full py-3 px-4 rounded-xl border flex items-center justify-between transition-all ${
              filters.cotwOnly
                ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 shadow-md'
                : 'bg-[#18181c] border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star size={16} className={filters.cotwOnly ? 'fill-amber-400 text-amber-400' : 'text-zinc-500'} />
              <div className="text-left">
                <div className="text-xs font-black uppercase tracking-wider">
                  Courts of the World Verified
                </div>
                <div className="text-[10px] text-zinc-400">
                  Outdoor parks vetted by the courtsoftheworld.com community
                </div>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
              filters.cotwOnly ? 'bg-amber-400 text-black border-amber-400' : 'border-zinc-700'
            }`}>
              {filters.cotwOnly && <Check size={12} strokeWidth={3} />}
            </div>
          </button>
        </div>

        {/* Distance Range */}
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 block mb-2.5">
            MAX DISTANCE FROM YOU
          </span>
          <div className="grid grid-cols-4 gap-2">
            {distances.map(d => {
              const selected = filters.maxDistance === d;
              return (
                <button
                  key={d}
                  onClick={() => setFilters(prev => ({ ...prev, maxDistance: d }))}
                  className={`py-2.5 text-xs font-black uppercase tracking-wider rounded-lg transition-colors border ${
                    selected
                      ? 'bg-white text-black border-white'
                      : 'bg-[#18181c] text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {d === 50 ? 'ANY MI' : `${d} MI`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Venue Brand */}
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 block mb-2.5">
            VENUE TYPE
          </span>
          <div className="grid grid-cols-2 gap-2">
            {brands.map(b => {
              const selected = filters.brandFilter === b;
              return (
                <button
                  key={b}
                  onClick={() => setFilters(prev => ({ ...prev, brandFilter: b }))}
                  className={`py-2.5 px-3 text-xs font-bold uppercase tracking-tight rounded-lg text-left transition-colors border flex items-center justify-between ${
                    selected
                      ? 'bg-white text-black border-white font-black'
                      : 'bg-[#18181c] text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <span>{b === 'ALL' ? 'All Venues' : b}</span>
                  {selected && <Check size={14} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Indoor vs Outdoor */}
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 block mb-2.5">
            COURT SURFACE
          </span>
          <div className="grid grid-cols-3 gap-2">
            {types.map(t => {
              const selected = filters.courtType === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setFilters(prev => ({ ...prev, courtType: t.value }))}
                  className={`py-2.5 px-2 text-[11px] font-bold uppercase tracking-tight rounded-lg transition-colors border text-center ${
                    selected
                      ? 'bg-white text-black border-white'
                      : 'bg-[#18181c] text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={() => {
              setFilters({ maxDistance: 50, brandFilter: 'ALL', courtType: 'ALL', cotwOnly: false });
            }}
            className="flex-1 py-3 bg-zinc-800 text-zinc-300 hover:text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => setIsFilterSheetOpen(false)}
            className="flex-2 py-3 bg-white text-black hover:bg-zinc-200 font-black italic uppercase tracking-widest text-xs rounded-xl transition-colors"
          >
            Show Courts
          </button>
        </div>
      </div>
    </div>
  );
};
