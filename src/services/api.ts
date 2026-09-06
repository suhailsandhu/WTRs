import { Court, RankedCourt, User, CheckIn, HeadingThere, PlannedRun, NotificationItem } from '../types';

const API_BASE = '/api';

export const api = {
  // Auth & Session
  async getMe(userId?: string): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: userId ? { 'x-user-id': userId } : {}
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async switchUser(userId: string): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (!res.ok) throw new Error('Failed to switch user');
    return res.json();
  },

  async login(payload: { provider: string; email?: string; phone?: string; username?: string }): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async signup(payload: Partial<User>): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    return data;
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async searchUsers(query: string, currentUserId: string): Promise<{ users: User[] }> {
    const res = await fetch(`${API_BASE}/users?q=${encodeURIComponent(query)}`, {
      headers: { 'x-user-id': currentUserId }
    });
    if (!res.ok) throw new Error('Failed to search users');
    return res.json();
  },

  // Courts
  async getCourts(lat: number, lng: number, userId: string): Promise<{ courts: RankedCourt[]; userLocation: { lat: number; lng: number } }> {
    const res = await fetch(`${API_BASE}/courts?lat=${lat}&lng=${lng}`, {
      headers: { 'x-user-id': userId }
    });
    if (!res.ok) throw new Error('Failed to fetch ranked courts');
    return res.json();
  },

  async getCourtDetail(courtId: string, userId: string): Promise<{
    court: Court;
    activeCheckIns: CheckIn[];
    activeHeadingThere: HeadingThere[];
    plannedRuns: PlannedRun[];
    myCheckIn: CheckIn | null;
    myHeadingThere: HeadingThere | null;
  }> {
    const res = await fetch(`${API_BASE}/courts/${courtId}`, {
      headers: { 'x-user-id': userId }
    });
    if (!res.ok) throw new Error('Failed to fetch court detail');
    return res.json();
  },

  async addCourt(courtData: Partial<Court>, userId: string): Promise<{ court: Court }> {
    const res = await fetch(`${API_BASE}/courts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify(courtData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add court');
    return data;
  },

  async updateCourt(courtId: string, courtData: Partial<Court>, userId: string): Promise<{ court: Court }> {
    const res = await fetch(`${API_BASE}/courts/${courtId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify(courtData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update court');
    return data;
  },

  async deleteCourt(courtId: string, userId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/courts/${courtId}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId }
    });
    if (!res.ok) throw new Error('Failed to delete court');
    return res.json();
  },

  // Check In & Check Out
  async checkIn(courtId: string, status: 'CONFIRMED_HOOPER' | 'VENUE_PRESENCE', userId: string): Promise<{ checkIn: CheckIn }> {
    const res = await fetch(`${API_BASE}/check-ins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify({ courtId, status })
    });
    if (!res.ok) throw new Error('Check in failed');
    return res.json();
  },

  async checkOut(userId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/check-ins/leave`, {
      method: 'POST',
      headers: { 'x-user-id': userId }
    });
    if (!res.ok) throw new Error('Check out failed');
    return res.json();
  },

  // Heading There
  async headThere(courtId: string, etaMinutes: number, userId: string): Promise<{ headingThere: HeadingThere }> {
    const res = await fetch(`${API_BASE}/heading-there`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify({ courtId, etaMinutes })
    });
    if (!res.ok) throw new Error('Heading there request failed');
    return res.json();
  },

  async cancelHeadingThere(userId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/heading-there`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId }
    });
    if (!res.ok) throw new Error('Failed to cancel heading there');
    return res.json();
  },

  // Planned Runs
  async getPlannedRuns(): Promise<{ runs: PlannedRun[] }> {
    const res = await fetch(`${API_BASE}/runs`);
    if (!res.ok) throw new Error('Failed to fetch runs');
    return res.json();
  },

  async createPlannedRun(runData: { courtId: string; title: string; date: string; time: string; notes?: string; maxSpots?: number }, userId: string): Promise<{ run: PlannedRun }> {
    const res = await fetch(`${API_BASE}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify(runData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create run');
    return data;
  },

  async rsvpRun(runId: string, userId: string): Promise<{ run: PlannedRun; joined: boolean }> {
    const res = await fetch(`${API_BASE}/runs/${runId}/rsvp`, {
      method: 'POST',
      headers: { 'x-user-id': userId }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update RSVP');
    return data;
  },

  async deleteRun(runId: string, userId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/runs/${runId}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId }
    });
    if (!res.ok) throw new Error('Failed to delete run');
    return res.json();
  },

  // Friends
  async getFriends(userId: string): Promise<{
    friends: Array<User & { statusDescription: string; activeCourtName: string | null; isLive: boolean; isHeading: boolean }>;
    pendingRequests: Array<{ friendshipId: string; sender: User }>;
  }> {
    const res = await fetch(`${API_BASE}/friends`, {
      headers: { 'x-user-id': userId }
    });
    if (!res.ok) throw new Error('Failed to fetch friends');
    return res.json();
  },

  async sendFriendRequest(username: string, userId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/friends/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify({ username })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send friend request');
    return data;
  },

  async respondFriendRequest(friendshipId: string, action: 'accept' | 'decline'): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/friends/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendshipId, action })
    });
    if (!res.ok) throw new Error('Failed to respond to request');
    return res.json();
  },

  async removeFriend(friendId: string, userId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/friends/${friendId}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId }
    });
    if (!res.ok) throw new Error('Failed to remove friend');
    return res.json();
  },

  // Notifications
  async getNotifications(userId: string): Promise<{ notifications: NotificationItem[] }> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: { 'x-user-id': userId }
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationsRead(userId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/notifications/read`, {
      method: 'POST',
      headers: { 'x-user-id': userId }
    });
    if (!res.ok) throw new Error('Failed to mark notifications read');
    return res.json();
  },

  // Simulation reset
  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/simulate/reset`, { method: 'POST' });
    return res.json();
  }
};
