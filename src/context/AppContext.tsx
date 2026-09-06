import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, RankedCourt, FilterOptions, NotificationItem } from '../types';
import { api } from '../services/api';

export type ActiveTab = 'HOME' | 'RUNS' | 'MAP' | 'FRIENDS' | 'PROFILE';

export interface LocationState {
  lat: number;
  lng: number;
  label: string;
  isSimulated: boolean;
}

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  courts: RankedCourt[];
  loadingCourts: boolean;
  refreshCourts: () => Promise<void>;
  selectedCourtId: string | null;
  setSelectedCourtId: (id: string | null) => void;
  location: LocationState;
  setLocation: (loc: LocationState) => void;
  simulateLocation: (courtId: string | 'MIDTOWN' | 'ROSEVILLE' | 'REAL') => void;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  refreshNotifications: () => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
  isNotifDrawerOpen: boolean;
  setIsNotifDrawerOpen: (open: boolean) => void;
  arrivalCourt: RankedCourt | null;
  setArrivalCourt: (c: RankedCourt | null) => void;
  isOnboarded: boolean;
  completeOnboarding: () => void;
  reopenOnboarding: () => void;
  isDevControlsOpen: boolean;
  setIsDevControlsOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  switchUserAccount: (userId: string) => Promise<void>;
  resetToSeedData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('HOME');
  const [courts, setCourts] = useState<RankedCourt[]>([]);
  const [loadingCourts, setLoadingCourts] = useState<boolean>(true);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);

  // Default Location: Downtown Sacramento
  const [location, setLocation] = useState<LocationState>({
    lat: 38.5816,
    lng: -121.4944,
    label: 'Downtown Sacramento',
    isSimulated: true
  });

  const [filters, setFilters] = useState<FilterOptions>({
    maxDistance: 50,
    brandFilter: 'ALL',
    courtType: 'ALL'
  });
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [arrivalCourt, setArrivalCourt] = useState<RankedCourt | null>(null);

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('wtr_onboarded') === 'true';
  });

  const [isDevControlsOpen, setIsDevControlsOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Load User Session
  useEffect(() => {
    const savedUserId = localStorage.getItem('wtr_user_id') || 'usr_suhail';
    api.getMe(savedUserId)
      .then(res => {
        setUser(res.user);
      })
      .catch(err => {
        console.error('Failed to load user', err);
      });
  }, []);

  // Fetch Ranked Courts
  const refreshCourts = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.getCourts(location.lat, location.lng, user.id);
      setCourts(res.courts);

      // Check geofence arrival: if user is within 0.15 miles of a court and not checked in anywhere
      const userCheckedIn = res.courts.some(c => c.activeCheckIns?.some(chk => chk.userId === user.id));
      if (!userCheckedIn) {
        const closest = res.courts.find(c => c.distanceMiles <= 0.15);
        if (closest && (!arrivalCourt || arrivalCourt.id !== closest.id)) {
          setArrivalCourt(closest);
        }
      } else {
        setArrivalCourt(null);
      }
    } catch (e) {
      console.error('Error fetching courts', e);
    } finally {
      setLoadingCourts(false);
    }
  }, [user, location.lat, location.lng, arrivalCourt]);

  // Fetch Notifications
  const refreshNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.getNotifications(user.id);
      setNotifications(res.notifications);
    } catch (e) {
      console.error('Error fetching notifications', e);
    }
  }, [user]);

  // Periodic polling for real-time basketball activity
  useEffect(() => {
    if (user) {
      refreshCourts();
      refreshNotifications();

      const interval = setInterval(() => {
        refreshCourts();
        refreshNotifications();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [user, refreshCourts, refreshNotifications]);

  const markNotificationsAsRead = async () => {
    if (!user) return;
    await api.markNotificationsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const completeOnboarding = () => {
    setIsOnboarded(true);
    localStorage.setItem('wtr_onboarded', 'true');
  };

  const reopenOnboarding = () => {
    setIsOnboarded(false);
    localStorage.removeItem('wtr_onboarded');
  };

  const switchUserAccount = async (userId: string) => {
    try {
      const res = await api.switchUser(userId);
      setUser(res.user);
      localStorage.setItem('wtr_user_id', res.user.id);
      await refreshCourts();
      await refreshNotifications();
    } catch (e) {
      console.error('Failed to switch user', e);
    }
  };

  const resetToSeedData = async () => {
    await api.resetDatabase();
    await refreshCourts();
    await refreshNotifications();
  };

  // Location Simulation Presets
  const simulateLocation = (target: string | 'MIDTOWN' | 'ROSEVILLE' | 'REAL') => {
    if (target === 'REAL') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              label: 'My Real GPS Location',
              isSimulated: false
            });
          },
          (err) => {
            alert('Location access denied or unavailable. Using Sacramento GPS.');
          }
        );
      }
      return;
    }

    if (target === 'MIDTOWN') {
      setLocation({
        lat: 38.5729,
        lng: -121.4690,
        label: 'Midtown Sacramento (1.2 mi to Downtown)',
        isSimulated: true
      });
      return;
    }

    if (target === 'ROSEVILLE') {
      setLocation({
        lat: 38.7521,
        lng: -121.2880,
        label: 'Roseville (Suburban Sacramento)',
        isSimulated: true
      });
      return;
    }

    // Otherwise target is a specific court id (teleport directly to that court to test arrival!)
    const targetCourt = courts.find(c => c.id === target);
    if (targetCourt) {
      setLocation({
        lat: targetCourt.lat,
        lng: targetCourt.lng,
        label: `At ${targetCourt.name} (${targetCourt.subName})`,
        isSimulated: true
      });
    }
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeTab,
        setActiveTab,
        courts,
        loadingCourts,
        refreshCourts,
        selectedCourtId,
        setSelectedCourtId,
        location,
        setLocation,
        simulateLocation,
        filters,
        setFilters,
        isFilterSheetOpen,
        setIsFilterSheetOpen,
        notifications,
        unreadNotifsCount,
        refreshNotifications,
        markNotificationsAsRead,
        isNotifDrawerOpen,
        setIsNotifDrawerOpen,
        arrivalCourt,
        setArrivalCourt,
        isOnboarded,
        completeOnboarding,
        reopenOnboarding,
        isDevControlsOpen,
        setIsDevControlsOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        switchUserAccount,
        resetToSeedData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
