import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { X, Plus, Calendar, Clock, MapPin } from 'lucide-react';

interface CreateRunModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export const CreateRunModal: React.FC<CreateRunModalProps> = ({ onClose, onCreated }) => {
  const { user, courts } = useApp();
  const [courtId, setCourtId] = useState<string>(courts[0]?.id || '');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('6:30 PM');
  const [notes, setNotes] = useState('');
  const [maxSpots, setMaxSpots] = useState<number>(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      await api.createPlannedRun(
        {
          courtId,
          title: title || 'Pickup 5v5 Full Court',
          date,
          time,
          notes,
          maxSpots: Number(maxSpots)
        },
        user.id
      );
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create run');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#111114] border border-zinc-800 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white font-display">
              SCHEDULE A RUN
            </h3>
            <p className="text-xs text-zinc-400">Lock in pickup games across Sacramento</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1.5">
              COURT VENUE
            </label>
            <select
              value={courtId}
              onChange={e => setCourtId(e.target.value)}
              className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white"
            >
              {courts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.subName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1.5">
              RUN TITLE
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 5v5 Full Court Games"
              className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1.5">
                DAY
              </label>
              <select
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1.5">
                START TIME
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="6:00 PM"
                className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1.5">
              MAX PLAYERS (SPOTS)
            </label>
            <input
              type="number"
              min="5"
              max="30"
              value={maxSpots}
              onChange={e => setMaxSpots(Number(e.target.value))}
              className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1.5">
              RUN NOTES & RUN LEVEL (OPTIONAL)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Competitive 5s, fast break style. Calling fouls on the floor."
              rows={2}
              className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 bg-zinc-800 text-zinc-400 text-xs font-bold uppercase rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase tracking-wider rounded-lg transition-colors"
            >
              {loading ? 'Publishing...' : 'Publish Run'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
