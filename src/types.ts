export type Position = 'Guard' | 'Wing' | 'Forward' | 'Center';
export type ExperienceLevel = 'College / Pro' | 'High School Varsity' | 'Adult Competitive' | 'Casual Pickup';

export interface User {
  id: string;
  username: string; // e.g. "suhail_hoops"
  displayName: string; // Real or Display Name
  hooperAlias?: string; // e.g. "Silent Assassin", "Chef", "Buckets"
  hideRealName?: boolean; // if true, prioritize hooperAlias and @username on runs
  email?: string;
  phone?: string;
  avatar: string;
  height: string; // e.g. "6'2\""
  weight: string; // e.g. "195 lbs"
  position: Position;
  experienceLevel: ExperienceLevel;
  playStyle?: string; // e.g. "3 & D Specialist", "Floor General", "Slasher / Finisher", "Lockdown Defender"
  homeArea: string; // e.g. "Downtown Sacramento"
  favoriteCourtId?: string;
  favoriteCourtName?: string;
  runsLoggedCount?: number;
  checkInsCount?: number;
  reliableEtaRate?: number; // percentage
  isAdmin?: boolean;
  createdAt: string;
}

export interface Court {
  id: string;
  name: string;
  subName: string;
  brand: '24 Hour Fitness' | 'In-Shape Fitness' | 'Public Park' | 'Sports Complex';
  address: string;
  city: string;
  lat: number;
  lng: number;
  type: 'Indoor Gym' | 'Outdoor Rooftop' | 'Outdoor Park' | 'Sports Complex';
  courtSize: 'Full Court' | 'Half Court' | 'Multiple Full Courts';
  hoopCount: number;
  hasLights?: boolean;
  surface: 'Hardwood' | 'Outdoor Sport Tile' | 'All-Weather Acrylic Asphalt' | 'Standard Asphalt';
  primaryPhoto: string;
  additionalPhotos: string[];
  indoor: boolean;
  membershipRequired: boolean;
  hours: string;
  description: string;
  courtSpecsNotice?: string;
  isActive: boolean;
  typicalBusyTime: string;
  bestTimeToday: string;
  historicalActivityByHour: Record<number, number>; // 6..23 (activity probability 0-100)
  cotwRating?: number; // Courts of the World community rating (out of 5.0)
  cotwVerified?: boolean; // Verified on Courts of the World directory
  cotwUrl?: string;
  netType?: string; // e.g. "Chain Nets", "Anti-Whip Heavy Duty Nylon"
  rimType?: string; // e.g. "Regulation Glass Backboard", "Double Rim (Streetball Standard)"
  lightsSchedule?: string;
  amenities?: string[];
  bestRunTimes?: string;
}

export interface CheckIn {
  id: string;
  courtId: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  status: 'CONFIRMED_HOOPER' | 'VENUE_PRESENCE';
  checkedInAt: string;
  expiresAt: string;
}

export interface HeadingThere {
  id: string;
  courtId: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  startedAt: string;
  expiresAt: string; // strictly 25 minutes after startedAt
  etaMinutes: number;
}

export interface PlannedRunRSVP {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  joinedAt: string;
}

export interface PlannedRun {
  id: string;
  courtId: string;
  courtName: string;
  courtSubName: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "6:30 PM"
  startTimestamp: number;
  creatorId: string;
  creatorUsername: string;
  creatorDisplayName: string;
  notes?: string;
  maxSpots?: number;
  rsvps: PlannedRunRSVP[];
  createdAt: string;
}

export interface Friendship {
  id: string;
  userA: string;
  userB: string;
  status: 'accepted' | 'pending';
  requestedBy: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'ARRIVAL_PROMPT' | 'FRIEND_HOOPING' | 'HEADING_THERE' | 'RUN_REMINDER' | 'RUN_JOINED';
  title: string;
  body: string;
  courtId?: string;
  runId?: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
}

export interface RankedCourt extends Court {
  distanceMiles: number;
  confirmedPlayersCount: number;
  headingThereCount: number;
  venuePresenceCount: number;
  friendsHere: User[];
  friendsHeading: User[];
  activityStatusLabel: 'RUN ACTIVE' | 'GETTING ACTIVE' | 'QUIET RIGHT NOW' | 'RUN STARTING SOON';
  activityDetailLabel: string;
  isLiveConfirmed: boolean;
  rankingScore: number;
  nextPlannedRun?: PlannedRun | null;
  activeCheckIns: CheckIn[];
  activeHeadingThere: HeadingThere[];
}

export interface FilterOptions {
  maxDistance: number; // in miles (e.g. 5, 10, 25, 50)
  brandFilter: string; // 'ALL' | '24 Hour Fitness' | 'In-Shape Fitness' | 'Public Park'
  courtType: 'ALL' | 'INDOOR' | 'OUTDOOR';
  cotwOnly?: boolean; // Courts of the World verified
}
