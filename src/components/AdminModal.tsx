import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Court } from '../types';
import { api } from '../services/api';
import { X, Plus, Edit2, Trash2, ShieldAlert, Check } from 'lucide-react';

export const AdminModal: React.FC = () => {
  const { isAdminModalOpen, setIsAdminModalOpen, courts, user, refreshCourts } = useApp();
  const [tab, setTab] = useState<'LIST' | 'ADD'>('LIST');

  // Form State for Adding/Editing
  const [name, setName] = useState('');
  const [subName, setSubName] = useState('');
  const [brand, setBrand] = useState('24 Hour Fitness');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Sacramento');
  const [lat, setLat] = useState('38.5816');
  const [lng, setLng] = useState('-121.4944');
  const [indoor, setIndoor] = useState(true);
  const [membershipRequired, setMembershipRequired] = useState(true);
  const [hours, setHours] = useState('5:00 AM – 11:00 PM');
  const [primaryPhoto, setPrimaryPhoto] = useState('https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop');
  const [typicalBusyTime, setTypicalBusyTime] = useState('Usually active 5:30 PM - 8:30 PM');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isAdminModalOpen || !user?.isAdmin) return null;

  const handleAddCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.addCourt(
        {
          name,
          subName,
          brand,
          address,
          city,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          indoor,
          membershipRequired,
          hours,
          primaryPhoto,
          typicalBusyTime,
          description: description || `${name} pickup basketball court in ${city}, California.`
        },
        user.id
      );
      setStatusMsg('Court added successfully to Sacramento launch list!');
      await refreshCourts();
      setTab('LIST');
      setName('');
      setSubName('');
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (e: any) {
      alert(e.message || 'Error adding court');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourt = async (courtId: string) => {
    if (!confirm('Are you sure you want to deactivate this court from WTR Sacramento?')) return;
    try {
      await api.deleteCourt(courtId, user.id);
      await refreshCourts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#111114] border border-zinc-800 rounded-3xl p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722]" />
            <h3 className="text-xl font-black italic uppercase tracking-tight text-white font-display">
              WTR COURT OPERATIONS
            </h3>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 font-bold px-2 py-0.5 rounded">
              SACRAMENTO ADMIN
            </span>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {statusMsg && (
          <div className="mb-4 p-3 bg-[#FF5722]/15 border border-[#FF5722]/40 text-[#FF5722] text-xs font-bold rounded-xl flex items-center gap-2">
            <Check size={16} />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Tab Toggle */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab('LIST')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-colors ${
              tab === 'LIST' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            COURTS DIRECTORY ({courts.length})
          </button>
          <button
            onClick={() => setTab('ADD')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1 ${
              tab === 'ADD' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            <Plus size={14} />
            <span>ADD NEW COURT</span>
          </button>
        </div>

        {tab === 'LIST' && (
          <div className="space-y-3">
            {courts.map(c => (
              <div
                key={c.id}
                className="bg-black/40 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.primaryPhoto}
                    alt={c.name}
                    className="w-12 h-12 rounded-lg object-cover border border-zinc-800"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {c.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400">{c.subName} · {c.city}</p>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      {c.indoor ? 'Indoor' : 'Outdoor'} · {c.hours}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteCourt(c.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Deactivate Court"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'ADD' && (
          <form onSubmit={handleAddCourt} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                  COURT / VENUE NAME
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Life Time Folsom"
                  className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                  SUB-LOCATION / DETAIL
                </label>
                <input
                  type="text"
                  required
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  placeholder="Main Hardwood Gymnasium"
                  className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                  BRAND / CATEGORY
                </label>
                <select
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="24 Hour Fitness">24 Hour Fitness</option>
                  <option value="In-Shape Fitness">In-Shape Fitness</option>
                  <option value="Chuze Fitness">Chuze Fitness</option>
                  <option value="City Park / Public">City Park / Public</option>
                  <option value="University / College">University / College</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                  CITY
                </label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="Sacramento">Sacramento</option>
                  <option value="North Natomas">North Natomas</option>
                  <option value="Roseville">Roseville</option>
                  <option value="Rocklin">Rocklin</option>
                  <option value="Elk Grove">Elk Grove</option>
                  <option value="Folsom">Folsom</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                  LATITUDE
                </label>
                <input
                  type="text"
                  required
                  value={lat}
                  onChange={e => setLat(e.target.value)}
                  className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                  LONGITUDE
                </label>
                <input
                  type="text"
                  required
                  value={lng}
                  onChange={e => setLng(e.target.value)}
                  className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                  STREET ADDRESS
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="1020 K Street"
                  className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                  HOURS
                </label>
                <input
                  type="text"
                  required
                  value={hours}
                  onChange={e => setHours(e.target.value)}
                  placeholder="5:00 AM - 11:00 PM"
                  className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                PHOTO URL
              </label>
              <input
                type="text"
                required
                value={primaryPhoto}
                onChange={e => setPrimaryPhoto(e.target.value)}
                className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={indoor}
                  onChange={e => setIndoor(e.target.checked)}
                  className="rounded bg-zinc-800"
                />
                Indoor Hardwood Court
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={membershipRequired}
                  onChange={e => setMembershipRequired(e.target.checked)}
                  className="rounded bg-zinc-800"
                />
                Membership / Day Pass Required
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-wider text-xs rounded-xl transition-colors mt-2"
            >
              {submitting ? 'Adding...' : 'PUBLISH COURT TO SACRAMENTO RADAR'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
