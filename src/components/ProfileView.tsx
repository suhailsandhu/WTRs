import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  User, 
  Shield, 
  Edit3, 
  Check, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Flame, 
  Sparkles, 
  Award, 
  Crosshair, 
  MapPin, 
  Zap,
  CheckCircle2
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200'
];

const PLAY_STYLES = [
  'Floor General',
  '3 & D Specialist',
  'Lockdown Defender',
  'Slasher / Finisher',
  'Mid-Range Assassin',
  'Sharpshooter',
  'Rim Protector',
  'Hustle / Rebounder'
];

export const ProfileView: React.FC = () => {
  const {
    user,
    setUser,
    reopenOnboarding,
    setIsAdminModalOpen,
    switchUserAccount,
    resetToSeedData
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [hooperAlias, setHooperAlias] = useState(user?.hooperAlias || '');
  const [hideRealName, setHideRealName] = useState(user?.hideRealName ?? true);
  const [username, setUsername] = useState(user?.username || '');
  const [homeArea, setHomeArea] = useState(user?.homeArea || 'Downtown Sacramento');
  const [position, setPosition] = useState(user?.position || 'Guard');
  const [height, setHeight] = useState(user?.height || `6'1"`);
  const [weight, setWeight] = useState(user?.weight || '185 lbs');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Competitive Pickup');
  const [playStyle, setPlayStyle] = useState(user?.playStyle || 'Floor General');
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_PRESETS[0]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.updateProfile(user.id, {
        displayName,
        hooperAlias,
        hideRealName,
        username,
        homeArea,
        position,
        height,
        weight,
        experienceLevel,
        playStyle,
        avatar
      });
      setUser(res.user);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { id: 'usr_suhail', name: 'Suhail Sandhu', alias: 'Midtown Chef', handle: '@suhail_s', role: 'Creator & Admin' },
    { id: 'usr_marcus', name: 'Marcus Barnes', alias: 'Natomas Flash', handle: '@marcus_916', role: 'Natomas Hooper' },
    { id: 'usr_jordan', name: 'Jordan Clark', alias: 'Downtown Sniper', handle: '@jordan_dimes', role: 'Downtown Guard' },
    { id: 'usr_tyler', name: 'Tyler Reed', alias: 'Rocklin Lock', handle: '@tyler_r916', role: 'Roseville Wing' },
  ];

  // Determine primary display moniker: Alias or Handle if real name is hidden/absent
  const primaryDisplay = (user.hideRealName || !user.displayName)
    ? (user.hooperAlias || `@${user.username}`)
    : user.displayName;

  const secondaryDisplay = user.hideRealName
    ? `@${user.username}`
    : (user.hooperAlias ? `"${user.hooperAlias}" · @${user.username}` : `@${user.username}`);

  return (
    <div className="pb-28 pt-2 px-4 max-w-lg mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white font-display">
            PLAYER CARD
          </h2>
          <p className="text-xs text-zinc-400 font-medium">
            Sacramento Hooper Identity · No Real Name Required
          </p>
        </div>

        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setSaveSuccess(false);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
            isEditing
              ? 'bg-zinc-800 text-white hover:bg-zinc-700'
              : 'bg-white text-black hover:bg-zinc-200 shadow-md'
          }`}
        >
          <Edit3 size={13} />
          <span>{isEditing ? 'Cancel' : 'Edit Card'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-[#18181c] border border-emerald-500/40 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Hooper profile updated successfully!</span>
        </div>
      )}

      {/* Athletic Digital Trading Card */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-[#FF5722]/50 via-zinc-800 to-zinc-900 shadow-2xl">
        <div className="bg-[#0e0e11] rounded-[23px] p-5 text-white space-y-5 relative overflow-hidden">
          {/* Subtle Watermark Texture */}
          <div className="absolute right-0 top-0 text-[110px] font-black italic text-white/[0.03] font-display select-none pointer-events-none -mr-4 -mt-6">
            916
          </div>

          {/* Top Card Badge Row */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-[#FF5722]/20 border border-[#FF5722]/40 text-[#FF5722] rounded-full">
                SACRAMENTO RUNNER
              </span>
              {user.isAdmin && (
                <span className="text-[9px] font-black uppercase tracking-wider bg-white text-black px-1.5 py-0.5 rounded">
                  ADMIN
                </span>
              )}
            </div>

            {/* Privacy indicator pill */}
            <div className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400 bg-black/60 px-2 py-0.5 rounded-full border border-zinc-800">
              {user.hideRealName ? (
                <>
                  <EyeOff size={11} className="text-[#FF5722]" />
                  <span>ANONYMOUS TAG</span>
                </>
              ) : (
                <>
                  <Eye size={11} className="text-zinc-400" />
                  <span>NAME VISIBLE</span>
                </>
              )}
            </div>
          </div>

          {/* Card Hero Hooper Identity */}
          <div className="flex items-start gap-4 relative z-10">
            <div className="relative">
              <img
                src={user.avatar}
                alt={primaryDisplay}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FF5722] border-2 border-black flex items-center justify-center text-[10px] font-black text-white">
                #
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-black italic uppercase tracking-tight text-white font-display leading-tight truncate">
                {primaryDisplay}
              </h3>
              <p className="text-xs text-[#FF5722] font-bold tracking-wide mt-0.5">
                {secondaryDisplay}
              </p>
              <div className="flex items-center gap-1 text-xs text-zinc-300 font-semibold mt-1">
                <MapPin size={12} className="text-zinc-500 shrink-0" />
                <span className="truncate">{user.homeArea || 'Sacramento, CA'}</span>
              </div>
            </div>
          </div>

          {/* Play Style Badge Pill */}
          <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/80">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">STYLE:</span>
            <span className="text-xs font-bold text-zinc-200 bg-zinc-900 border border-zinc-700/60 px-2.5 py-0.5 rounded-full">
              ⚡ {user.playStyle || 'Floor General'}
            </span>
          </div>

          {/* Athletic Specs Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800/80">
              <span className="text-[9px] uppercase font-bold text-zinc-500 block">Position</span>
              <span className="text-xs font-black text-white font-display mt-0.5 block truncate">
                {user.position || 'Guard'}
              </span>
            </div>

            <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800/80">
              <span className="text-[9px] uppercase font-bold text-zinc-500 block">Height</span>
              <span className="text-xs font-black text-white font-display mt-0.5 block">
                {user.height || `6'1"`}
              </span>
            </div>

            <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800/80">
              <span className="text-[9px] uppercase font-bold text-zinc-500 block">Run Level</span>
              <span className="text-xs font-black text-white font-display mt-0.5 block truncate">
                {user.experienceLevel || 'Pickup'}
              </span>
            </div>
          </div>

          {/* Hooper Credibility Metrics */}
          <div className="bg-[#141418] rounded-xl p-3 border border-zinc-800/80 flex items-center justify-between text-center">
            <div>
              <div className="text-base font-black italic text-white font-display leading-none">
                {user.runsLoggedCount ?? 14}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
                Runs Logged
              </div>
            </div>

            <div className="w-[1px] h-6 bg-zinc-800" />

            <div>
              <div className="text-base font-black italic text-[#FF5722] font-display leading-none">
                {user.reliableEtaRate ?? 96}%
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
                Reliable ETA
              </div>
            </div>

            <div className="w-[1px] h-6 bg-zinc-800" />

            <div>
              <div className="text-base font-black italic text-white font-display leading-none">
                {user.checkInsCount ?? 28}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
                Check-Ins
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-[#111114] border border-zinc-800 p-5 rounded-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5722] block">
              CUSTOMIZE HOOPER PROFILE
            </span>
            <span className="text-[10px] text-zinc-400">Privacy First</span>
          </div>

          {/* Privacy Toggle: Hide Real Name */}
          <div className="bg-[#18181d] border border-zinc-700/80 p-3 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <EyeOff size={14} className="text-[#FF5722]" />
                <span>Anonymous Mode (Hide Real Name)</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Only show your Hooper Alias or @handle on pickup radar and runs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHideRealName(!hideRealName)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                hideRealName ? 'bg-[#FF5722]' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  hideRealName ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Hooper Alias & Username */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                HOOPER ALIAS / NICKNAME
              </label>
              <input
                type="text"
                value={hooperAlias}
                onChange={e => setHooperAlias(e.target.value)}
                placeholder="e.g. Midtown Chef"
                className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#FF5722] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                @USERNAME / HANDLE
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="suhail_916"
                className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#FF5722] focus:outline-none"
              />
            </div>
          </div>

          {/* Real Name (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                REAL NAME (OPTIONAL)
              </label>
              <span className="text-[9px] text-zinc-500">{hideRealName ? 'Hidden on court radar' : 'Visible to other players'}</span>
            </div>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="e.g. Suhail (or leave blank)"
              className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#FF5722] focus:outline-none"
            />
          </div>

          {/* Play Style */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1.5">
              PRIMARY PLAY STYLE
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PLAY_STYLES.map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setPlayStyle(style)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                    playStyle === style
                      ? 'bg-[#FF5722] text-white border-[#FF5722]'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Home Area & Position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                HOME AREA
              </label>
              <select
                value={homeArea}
                onChange={e => setHomeArea(e.target.value)}
                className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FF5722] focus:outline-none"
              >
                <option value="Downtown / Midtown Sacramento">Downtown / Midtown</option>
                <option value="North Natomas">North Natomas</option>
                <option value="East Sacramento / McKinley">East Sacramento</option>
                <option value="Roseville / Rocklin">Roseville / Rocklin</option>
                <option value="Elk Grove">Elk Grove</option>
                <option value="Citrus Heights / Fair Oaks">Citrus Heights / Fair Oaks</option>
                <option value="Arden-Arcade / Carmichael">Arden-Arcade</option>
                <option value="West Sacramento / Davis">West Sacramento / Davis</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                POSITION
              </label>
              <select
                value={position}
                onChange={e => setPosition(e.target.value as any)}
                className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FF5722] focus:outline-none"
              >
                <option value="Guard">Point Guard / Combo Guard</option>
                <option value="Wing">Wing / Shooting Guard</option>
                <option value="Forward">Small / Power Forward</option>
                <option value="Center">Center / Big</option>
              </select>
            </div>
          </div>

          {/* Height & Run Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                HEIGHT
              </label>
              <input
                type="text"
                value={height}
                onChange={e => setHeight(e.target.value)}
                placeholder="6'2&quot;"
                className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FF5722] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                RUN LEVEL
              </label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value as any)}
                className="w-full bg-[#18181c] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FF5722] focus:outline-none"
              >
                <option value="Casual Pickup">Casual Pickup</option>
                <option value="Adult Competitive">Competitive Pickup</option>
                <option value="High School Varsity">High School Varsity</option>
                <option value="College / Pro">College / Pro</option>
              </select>
            </div>
          </div>

          {/* Avatar Presets */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1.5">
              CHOOSE AVATAR
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-transform ${
                    avatar === preset ? 'border-[#FF5722] scale-105' : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-wider text-xs rounded-xl transition-colors shadow-lg"
          >
            {loading ? 'Saving Card...' : 'Save Hooper Card'}
          </button>
        </form>
      )}

      {/* Demo Switch Account Section */}
      <div className="bg-[#111114] border border-zinc-800 rounded-2xl p-5 space-y-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
          SWITCH TEST HOOPER
        </span>
        <div className="space-y-2">
          {demoAccounts.map(acc => {
            const isCurrent = user.id === acc.id;
            return (
              <button
                key={acc.id}
                onClick={() => switchUserAccount(acc.id)}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors border ${
                  isCurrent
                    ? 'bg-zinc-800/80 border-white/40 text-white'
                    : 'bg-[#16161a] border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{acc.alias || acc.name}</span>
                    <span className="text-zinc-500 font-normal">{acc.handle}</span>
                  </div>
                  <div className="text-[10px] text-[#FF5722] font-semibold">{acc.role}</div>
                </div>
                {isCurrent ? (
                  <span className="text-[10px] font-black text-white bg-black px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">
                    Switch
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions & Settings */}
      <div className="space-y-2.5">
        {user.isAdmin && (
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Shield size={16} className="text-[#FF5722]" />
            <span>ADMIN COURT MANAGER</span>
          </button>
        )}

        <button
          onClick={reopenOnboarding}
          className="w-full py-3 bg-[#111114] hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <span>REPLAY ONBOARDING</span>
        </button>

        <button
          onClick={resetToSeedData}
          className="w-full py-3 bg-[#111114] hover:bg-zinc-800 border border-zinc-800 text-zinc-500 hover:text-red-400 font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw size={14} />
          <span>RESET TO SACRAMENTO SEED DATA</span>
        </button>
      </div>
    </div>
  );
};
