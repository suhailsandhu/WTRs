import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, Flame, Clock, Calendar, CheckCheck } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotifDrawerOpen,
    setIsNotifDrawerOpen,
    notifications,
    markNotificationsAsRead,
    setSelectedCourtId
  } = useApp();

  if (!isNotifDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex justify-end backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-[#111114] border-l border-zinc-800 text-white min-h-screen p-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-[#FF5722]" />
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-white font-display">
                ACTIVITY ALERTS
              </h3>
            </div>
            <button
              onClick={() => setIsNotifDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-xs text-zinc-500">
              No recent notifications
            </div>
          ) : (
            <div className="space-y-2.5">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (notif.courtId) {
                      setSelectedCourtId(notif.courtId);
                      setIsNotifDrawerOpen(false);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    notif.read
                      ? 'bg-black/30 border-zinc-800/60 text-zinc-400'
                      : 'bg-[#17171c] border-zinc-700 text-white shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 text-[#FF5722] shrink-0">
                      {notif.type === 'FRIEND_CHECKED_IN' && <Flame size={16} />}
                      {notif.type === 'FRIEND_HEADING_THERE' && <Clock size={16} />}
                      {notif.type === 'RUN_RSVP' && <Calendar size={16} />}
                      {notif.type === 'RUN_INVITE' && <Calendar size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold leading-snug">
                        {notif.title}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {notif.body}
                      </p>
                      <span className="text-[9px] text-zinc-500 font-semibold block mt-1">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-zinc-800">
          <button
            onClick={markNotificationsAsRead}
            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider text-zinc-300 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <CheckCheck size={14} />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>
    </div>
  );
};
