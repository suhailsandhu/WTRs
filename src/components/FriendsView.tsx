import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { api } from '../services/api';
import { Search, UserPlus, Check, X, Flame, Clock, MapPin, Shield } from 'lucide-react';

export const FriendsView: React.FC = () => {
  const { user, setSelectedCourtId } = useApp();
  const [friends, setFriends] = useState<Array<User & { statusDescription: string; activeCourtName: string | null; isLive: boolean; isHeading: boolean }>>([]);
  const [pendingRequests, setPendingRequests] = useState<Array<{ friendshipId: string; sender: User }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadFriends = async () => {
    if (!user) return;
    try {
      const res = await api.getFriends(user.id);
      setFriends(res.friends);
      setPendingRequests(res.pendingRequests);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadFriends();
    const interval = setInterval(loadFriends, 8000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !user) return;
    setSearching(true);
    try {
      const res = await api.searchUsers(searchQuery, user.id);
      setSearchResults(res.users);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (targetUsername: string) => {
    if (!user) return;
    try {
      await api.sendFriendRequest(targetUsername, user.id);
      setActionSuccess(`Friend request sent to @${targetUsername}`);
      setTimeout(() => setActionSuccess(''), 4000);
      setSearchQuery('');
      setSearchResults([]);
    } catch (e: any) {
      alert(e.message || 'Failed to send request');
    }
  };

  const handleRespond = async (friendshipId: string, action: 'accept' | 'decline') => {
    try {
      await api.respondFriendRequest(friendshipId, action);
      await loadFriends();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="pb-28 pt-2 px-5 max-w-lg mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white font-display">
          CREW RADAR
        </h2>
        <p className="text-xs text-zinc-400 font-medium">
          Know where your friends are running games across Sacramento
        </p>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-[#FF5722]/15 border border-[#FF5722]/40 text-[#FF5722] text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Username Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search hoopers by @username..."
          className="w-full bg-[#141418] border border-zinc-800 rounded-xl pl-10 pr-20 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
        />
        <Search size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
        <button
          type="submit"
          className="absolute right-2 top-2 px-3 py-1.5 bg-zinc-800 hover:bg-white hover:text-black text-white font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors"
        >
          {searching ? '...' : 'FIND'}
        </button>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-[#141418] border border-zinc-800 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
            SEARCH RESULTS
          </span>
          <div className="divide-y divide-zinc-800/60">
            {searchResults.map(sr => (
              <div key={sr.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={sr.avatar}
                    alt={sr.displayName}
                    className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                  />
                  <div>
                    <div className="text-sm font-bold text-white leading-tight">
                      {sr.displayName}
                    </div>
                    <div className="text-xs text-zinc-500">
                      @{sr.username} · {sr.homeArea || 'Sacramento'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSendRequest(sr.username)}
                  className="px-3 py-1.5 bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-1"
                >
                  <UserPlus size={14} />
                  <span>ADD</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Friend Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-[#141418] border border-zinc-800 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5722] block">
            PENDING REQUESTS ({pendingRequests.length})
          </span>
          <div className="divide-y divide-zinc-800/60">
            {pendingRequests.map(req => (
              <div key={req.friendshipId} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={req.sender.avatar}
                    alt={req.sender.displayName}
                    className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                  />
                  <div>
                    <div className="text-sm font-bold text-white leading-tight">
                      {req.sender.displayName}
                    </div>
                    <div className="text-xs text-zinc-500">
                      @{req.sender.username}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleRespond(req.friendshipId, 'accept')}
                    className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
                    title="Accept"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => handleRespond(req.friendshipId, 'decline')}
                    className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white transition-colors"
                    title="Decline"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Friends Roster */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            ACTIVE CREW ({friends.length})
          </span>
          <span className="text-[10px] uppercase font-bold text-zinc-500">
            Real-Time
          </span>
        </div>

        {friends.length === 0 ? (
          <div className="text-center py-12 bg-[#111114] border border-zinc-800 rounded-2xl p-6 text-zinc-400 text-xs">
            No friends added yet. Search for hoopers like <strong>@marcus_916</strong> or <strong>@jordan_dimes</strong> above!
          </div>
        ) : (
          <div className="space-y-2.5">
            {friends.map(f => (
              <div
                key={f.id}
                className="bg-[#111114] border border-zinc-800/80 hover:border-zinc-700 p-4 rounded-xl flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={f.avatar}
                      alt={f.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                    />
                    {f.isLive && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#FF5722] rounded-full ring-2 ring-black" />
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white leading-tight">
                      {f.displayName}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      @{f.username} {f.position && `· ${f.position}`}
                    </div>
                    <div className={`text-xs font-semibold mt-0.5 ${
                      f.isLive ? 'text-[#FF5722]' : f.isHeading ? 'text-zinc-200' : 'text-zinc-500'
                    }`}>
                      {f.statusDescription}
                    </div>
                  </div>
                </div>

                {f.activeCourtName && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded">
                    {f.isLive ? 'Playing' : 'En Route'}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
