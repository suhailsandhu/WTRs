import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PlannedRun } from '../types';
import { api } from '../services/api';
import { CreateRunModal } from './CreateRunModal';
import { Plus, Users, Calendar, Clock, MapPin, Check, Trash2, ArrowUpRight } from 'lucide-react';

export const PlannedRunsView: React.FC = () => {
  const { user, setSelectedCourtId } = useApp();
  const [runs, setRuns] = useState<PlannedRun[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRuns = async () => {
    try {
      const res = await api.getPlannedRuns();
      setRuns(res.runs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  const handleRsvp = async (runId: string) => {
    if (!user) return;
    setActionLoading(runId);
    try {
      await api.rsvpRun(runId, user.id);
      await fetchRuns();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRun = async (runId: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to cancel this scheduled run?')) return;
    try {
      await api.deleteRun(runId, user.id);
      await fetchRuns();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="pb-28 pt-2 px-5 max-w-lg mx-auto">
      {/* Top Banner & Action */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white font-display">
            PLANNED RUNS
          </h2>
          <p className="text-xs text-zinc-400 font-medium">
            Upcoming scheduled pickup runs across Greater Sacramento
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase tracking-wider rounded-lg transition-all"
        >
          <Plus size={16} />
          <span>SCHEDULE</span>
        </button>
      </div>

      {/* Runs List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#FF5722] rounded-full animate-spin" />
        </div>
      ) : runs.length === 0 ? (
        <div className="text-center py-16 bg-[#111114] rounded-2xl border border-zinc-800 p-8 space-y-3">
          <Calendar size={36} className="mx-auto text-zinc-600" />
          <h3 className="text-base font-bold text-white uppercase">No Planned Runs Yet</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Be the first to rally Sacramento hoopers for a scheduled run at your favorite gym or park.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-2 px-4 py-2.5 bg-white text-black font-black uppercase tracking-wider text-xs rounded-lg"
          >
            CREATE A RUN
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {runs.map(run => {
            const hasJoined = user && run.rsvps.some(r => r.userId === user.id);
            const isOrganizer = user && run.organizerId === user.id;

            return (
              <div
                key={run.id}
                className="bg-[#111114] border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all space-y-3"
              >
                {/* Header: Date, Time & Organizer */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF5722]/15 text-[#FF5722] px-2 py-0.5 rounded">
                      {run.date}
                    </span>
                    <span className="text-white font-black tracking-tight text-sm">
                      {run.time}
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-400">
                    Host: <span className="text-zinc-200 font-semibold">{run.organizerName}</span>
                  </div>
                </div>

                {/* Main Title & Court */}
                <div>
                  <h3 className="text-lg font-black italic uppercase tracking-tighter text-white font-display">
                    {run.title}
                  </h3>
                  <button
                    onClick={() => setSelectedCourtId(run.courtId)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mt-1 group"
                  >
                    <MapPin size={14} className="text-zinc-500 group-hover:text-white" />
                    <span className="font-semibold text-zinc-300 underline underline-offset-2">
                      {run.courtName}
                    </span>
                    <ArrowUpRight size={14} className="opacity-60" />
                  </button>
                </div>

                {/* Notes */}
                {run.notes && (
                  <p className="text-xs text-zinc-400 bg-black/30 p-2.5 rounded-lg border border-zinc-900">
                    {run.notes}
                  </p>
                )}

                {/* RSVP Roster & Capacity */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {run.rsvps.slice(0, 4).map(r => (
                        <img
                          key={r.userId}
                          src={r.avatar}
                          alt={r.displayName}
                          className="w-6 h-6 rounded-full border border-black object-cover"
                          title={r.displayName}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-zinc-300 font-medium">
                      <strong>{run.rsvps.length}</strong>
                      {run.maxSpots ? ` / ${run.maxSpots}` : ''} joined
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isOrganizer && (
                      <button
                        onClick={() => handleDeleteRun(run.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Cancel Run"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => handleRsvp(run.id)}
                      disabled={actionLoading === run.id}
                      className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                        hasJoined
                          ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          : 'bg-white text-black hover:bg-zinc-200'
                      }`}
                    >
                      {hasJoined ? (
                        <>
                          <Check size={14} className="text-[#FF5722]" />
                          <span>Joined</span>
                        </>
                      ) : (
                        <span>Join Run</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <CreateRunModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchRuns}
        />
      )}
    </div>
  );
};
