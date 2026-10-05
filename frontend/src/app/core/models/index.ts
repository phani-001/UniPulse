export interface User {
  _id: string;
  registrationNumber: string;
  name: string;
  email?: string;
  phone?: string;
  branch?: string;
  year?: number;
  bio?: string;
  photo?: string | null;
  skills: string[];
  interests: string[];
  links?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  achievements: string[];
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    showLinks: boolean;
  };
  points: number;
  role: 'student' | 'admin';
  isFirstLogin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Joined data (from profile endpoint)
  clubs?: Club[];
  events?: Event[];
}

export interface Club {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: 'Tech' | 'Cultural' | 'Sports' | 'Academic' | 'Arts' | 'Social' | 'Other';
  logo?: string | null;
  coverImage?: string | null;
  coordinators: Array<{ user: User; role: string }>;
  memberCount: number;
  isActive: boolean;
  foundedYear?: number;
  socialLinks?: { instagram?: string; twitter?: string; website?: string };
  // Joined status for current user
  membershipStatus?: 'active' | 'inactive' | null;
  applicationStatus?: 'pending' | 'accepted' | 'rejected' | null;
  isMember?: boolean;
  createdAt: string;
}

export interface ClubApplication {
  _id: string;
  user: User | string;
  club: Club | string;
  reason: string;
  skills?: string;
  status: 'pending' | 'accepted' | 'rejected';
  reviewNote?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  type: 'hackathon' | 'workshop' | 'competition' | 'seminar' | 'cultural' | 'sports' | 'other';
  club?: Club | string | null;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  venue: string;
  isOnline: boolean;
  onlineLink?: string;
  teamSize: { min: number; max: number };
  prizes?: Array<{ position: number; description: string; amount?: number }>;
  maxParticipants?: number;
  registrationCount: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags?: string[];
  banner?: string;
  registrationStatus?: 'registered' | 'cancelled' | null;
  createdAt: string;
}

export interface EventRegistration {
  _id: string;
  event: Event;
  user: User | string;
  teamName?: string;
  teamMembers?: Array<User | string>;
  status: 'registered' | 'cancelled' | 'attended';
  registeredAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'general' | 'event' | 'result' | 'urgent' | 'club';
  priority?: 'urgent' | 'high' | 'normal' | string;
  club?: Club | null;
  createdBy: User | string;
  isPinned: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface Result {
  _id: string;
  event: Event;
  week: string;
  weekStart: string;
  weekEnd: string;
  positions: Array<{
    position: number;
    winners: Array<{ user?: User; name?: string; registrationNumber?: string }>;
    club?: Club;
    points: number;
    prize?: string;
    prizeWon?: string;
    teamName?: string;
    projectTitle?: string;
    projectDescription?: string;
    members?: Array<{ user?: User; name?: string; registrationNumber?: string }>;
  }>;
  isPublished: boolean;
  createdAt: string;
}

export interface Connection {
  _id: string;
  requester: User;
  recipient: User;
  note?: string;
  status: 'pending' | 'accepted' | 'declined';
  respondedAt?: string;
  createdAt: string;
}

export interface ConnectionStatus {
  status: 'none' | 'connected' | 'pending_sent' | 'pending_received' | 'declined';
  connectionId?: string;
}

export interface TeamPost {
  _id: string;
  author: User;
  creator?: User;
  title: string;
  event?: Event | null;
  eventName?: string;
  description?: string;
  skillsNeeded: string[];
  teamSize: { current: number; needed: number };
  isOpen: boolean;
  respondents?: User[];
  createdAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  relatedModel?: string;
  relatedId?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
  requirePasswordChange: boolean;
}

export interface Message {
  _id: string;
  sender: User | { _id: string; name: string; registrationNumber: string; photo?: string };
  recipient: User | string;
  content: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  connectionId: string;
  peer: User;
  lastMessage?: {
    content: string;
    createdAt: string;
    isMine: boolean;
    isRead: boolean;
  } | null;
  unreadCount: number;
  connectedSince: string;
}

