import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Court, CheckIn, HeadingThere } from '../types';
import { api } from '../services/api';
import { 
  X, 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Edit3,
  Check,
  ExternalLink
} from 'lucide-react';

interface CourtDetailModalProps {
  courtId: string;
  onClose: () => void;
}

export const CourtDetailModal: React.FC<CourtDetailModalProps> = ({ courtId, onClose }) => {
  const { user, location, refreshCourts, simulateLocation } = useApp();
  const [data, setData] = useState<{
    court: Court;
    activeCheckIns: CheckIn[];
    activeHeadingThere: HeadingThere[];
    myCheckIn: CheckIn | null;
    myHeadingThere: HeadingThere | null;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editPhotoUrl, setEditPhotoUrl] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editSaving, setEditSaving] = useState<boolean>(false);

  const loadCourt = async () => {
    if (!user) return;
    try {
      const res = await api.getCourtDetail(courtId, user.id);
      setData(res);
      setEditPhotoUrl(res.court.primaryPhoto);
      setEditDescription(res.court.description);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourt();
    const interval = setInterval(loadCourt, 8000);
    return () => clearInterval(interval);
  }, [courtId, user]);

  if (loading || !data) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#FF5722] rounded-full animate-spin" />
      </div>
    );
  }

  const { court, activeCheckIns, activeHeadingThere, myCheckIn, myHeadingThere } = data;
  const confirmedHoopers = activeCheckIns.filter(c => c.status === 'CONFIRMED_HOOPER');

  // Direct distance calculation
  const dLat = (court.lat - location.lat) * 69;
  const dLon = (court.lng - location.lng) * 54;
  const directDistance = Math.round(Math.sqrt(dLat * dLat + dLon * dLon) * 10) / 10;
  const isAtCourt = directDistance <= 0.35;

  let headingCountdownMinutes = 25;
  if (myHeadingThere) {
    const remainingMs = new Date(myHeadingThere.expiresAt).getTime() - Date.now();
    headingCountdownMinutes = Math.max(0, Math.ceil(remainingMs / 60000));
  }

  const handleHeadingToggle = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      if (myHeadingThere) {
        await api.cancelHeadingThere(user.id);
      } else {
        await api.headThere(court.id, 15, user.id);
      }
      await loadCourt();
      await refreshCourts();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckInToggle = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      if (myCheckIn) {
        await api.checkOut(user.id);
      } else {
        if (!isAtCourt) {
          simulateLocation(court.id);
        }
        await api.checkIn(court.id, 'CONFIRMED_HOOPER', user.id);
      }
      await loadCourt();
      await refreshCourts();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveCourtDetails = async () => {
    if (!user) return;
    setEditSaving(true);
    try {
      await api.updateCourt(court.id, {
        primaryPhoto: editPhotoUrl,
        description: editDescription
      }, user.id);
      await loadCourt();
      await refreshCourts();
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setEditSaving(false);
    }
  };

  const openDirections = () => {
    const query = encodeURIComponent(`${court.name} ${court.address} ${court.city} CA`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 flex flex-col justify-end backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg mx-auto bg-[#121215] text-white min-h-[82vh] max-h-[92vh] rounded-t-3xl overflow-y-auto border-t border-zinc-800 shadow-2xl flex flex-col">
        
        {/* Top Handle and Header Actions */}
        <div className="sticky top-0 z-20 bg-[#121215]/95 backdrop-blur-md px-5 pt-3 pb-2.5 flex items-center justify-between border-b border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <MapPin size={13} className="text-zinc-500" />
            <span>{court.city} · {directDistance} mi away</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-2.5 py-1 text-[11px] font-medium text-zinc-400 hover:text-white bg-zinc-800/80 rounded-full flex items-center gap-1 transition-colors"
              title="Edit photo or description"
            >
              <Edit3 size={12} />
              <span>Edit</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-zinc-800/90 text-zinc-300 hover:text-white flex items-center justify-center transition-colors active:scale-95"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Real Court Photography */}
        <div className="relative aspect-[16/9] w-full bg-zinc-900 shrink-0 overflow-hidden">
          <img
            src={court.primaryPhoto}
            alt={court.name}
            className="w-full h-full object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-black/30" />
          
          <div className="absolute bottom-3 inset-x-5">
            <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
              {court.name}
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5">
              {court.address}
            </p>
          </div>
        </div>

        {/* Edit Info Drawer */}
        {isEditing && (
          <div className="mx-5 my-3 p-4 bg-zinc-900 border border-zinc-700 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">
                Update Court Photo & Details
              </span>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Photo URL</label>
              <input
                type="text"
                value={editPhotoUrl}
                onChange={e => setEditPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-black border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-[#FF5722]"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Court Description</label>
              <textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-black border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-[#FF5722]"
              />
            </div>
            <button
              onClick={handleSaveCourtDetails}
              disabled={editSaving}
              className="w-full py-2 bg-[#FF5722] hover:bg-orange-600 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check size={14} />
              <span>{editSaving ? 'Saving...' : 'Save Updates'}</span>
            </button>
          </div>
        )}

        {/* Main Content Area - Calm & Uncluttered */}
        <div className="px-5 py-4 pb-20 space-y-5 flex-1 overflow-y-auto">

          {/* Action Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2.5">
              {myCheckIn ? (
                <button
                  onClick={handleCheckInToggle}
                  disabled={submitting}
                  className="py-3 px-3 bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <CheckCircle2 size={16} />
                  <span>Checked In (Check Out)</span>
                </button>
              ) : (
                <button
                  onClick={handleCheckInToggle}
                  disabled={submitting}
                  className="py-3 px-3 bg-[#FF5722] hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                >
                  <CheckCircle2 size={16} />
                  <span>I'm Hooping Here</span>
                </button>
              )}

              {myHeadingThere ? (
                <button
                  onClick={handleHeadingToggle}
                  disabled={submitting}
                  className="py-3 px-3 bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                >
                  <Clock size={16} className="text-[#FF5722] animate-pulse" />
                  <span>On The Way ({headingCountdownMinutes}m)</span>
                </button>
              ) : (
                <button
                  onClick={handleHeadingToggle}
                  disabled={submitting}
                  className="py-3 px-3 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Flame size={15} className="text-[#FF5722]" />
                  <span>Heading There</span>
                </button>
              )}
            </div>

            <button
              onClick={openDirections}
              className="w-full py-2.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-zinc-800"
            >
              <Navigation size={14} />
              <span>Get Directions</span>
            </button>
          </div>

          {/* Current Hoopers Section */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Live Activity
              </span>
              <span className="text-xs font-medium text-zinc-300">
                {confirmedHoopers.length > 0 
                  ? `${confirmedHoopers.length} hoopers playing` 
                  : 'No active games right now'}
              </span>
            </div>

            {confirmedHoopers.length > 0 ? (
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl divide-y divide-zinc-800/40">
                {confirmedHoopers.map(item => (
                  <div key={item.id} className="p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.avatar}
                        alt={item.displayName}
                        className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                      />
                      <span className="text-xs font-medium text-white">{item.displayName}</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">Hooping</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-zinc-900/30 border border-zinc-800/60 rounded-xl text-center">
                <p className="text-xs text-zinc-400">
                  Be the first to check in and let other players know a run is starting.
                </p>
              </div>
            )}

            {/* Players on the way */}
            {activeHeadingThere.length > 0 && (
              <div className="mt-2 space-y-1">
                <span className="text-[11px] text-zinc-400 block font-medium">On the way:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {activeHeadingThere.map(item => (
                    <div key={item.id} className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full text-xs text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
                      <span>{item.displayName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Court Details & Specs (Clean 2-column key/value) */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
              Court Specs & Hours
            </span>
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800/50">
                <span className="text-zinc-400">Type</span>
                <span className="text-zinc-200 font-medium">{court.courtSize || 'Full Court'} · {court.indoor ? 'Indoor Hardwood' : 'Outdoor'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/50">
                <span className="text-zinc-400">Surface</span>
                <span className="text-zinc-200 font-medium">{court.surface || (court.indoor ? 'Hardwood' : 'All-Weather Acrylic')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/50">
                <span className="text-zinc-400">Lighting</span>
                <span className="text-zinc-200 font-medium">{court.lightsSchedule || (court.hasLights ? 'Lit until 10:00 PM' : 'Daylight only')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/50">
                <span className="text-zinc-400">Rims & Nets</span>
                <span className="text-zinc-200 font-medium">{court.rimType || 'Regulation'} · {court.netType || 'Nets intact'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Hours</span>
                <span className="text-zinc-200 font-medium">{court.hours}</span>
              </div>
            </div>
          </div>

          {/* Accurate Description */}
          {court.description && (
            <div className="space-y-1 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                About
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/50">
                {court.description}
              </p>
            </div>
          )}

          {/* COTW verification link if applicable */}
          {court.cotwUrl && (
            <div className="pt-1 flex items-center justify-between text-xs text-zinc-400">
              <span>Courts of the World</span>
              <a
                href={court.cotwUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-medium"
              >
                <span>View COTW Page</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
