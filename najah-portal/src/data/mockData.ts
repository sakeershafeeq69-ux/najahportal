import {
  AdminUser,
  StudentUser,
  CampusEvent,
  NoticeItem,
  GalleryItem,
  CertificateItem,
  CampusInquiry,
  AuditLog,
  RewardRecord,
  AttendanceRecord,
  ChatMessage,
  SchedulePeriod,
  ScheduleDeadline,
} from '../types';

export const INITIAL_ADMIN: AdminUser = {
  id: 'admin-root',
  name: 'Najah Class Administrator',
  username: 'admin',
  password: 'admin123',
  email: 'admin@najah.portal',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
};

// USER INSTRUCTION: Zero mock data across all modules. Only admin can add schedules, events, notices, students, etc.
export const INITIAL_STUDENTS: StudentUser[] = [];

export const INITIAL_EVENTS: CampusEvent[] = [];

export const INITIAL_NOTICES: NoticeItem[] = [];

export const INITIAL_GALLERY: GalleryItem[] = [];

export const INITIAL_MESSAGES: ChatMessage[] = [];

export const INITIAL_CERTIFICATES: CertificateItem[] = [];

export const INITIAL_INQUIRIES: CampusInquiry[] = [];

export const INITIAL_REWARDS: RewardRecord[] = [];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

export const INITIAL_SCHEDULE_PERIODS: SchedulePeriod[] = [];

export const INITIAL_SCHEDULE_DEADLINES: ScheduleDeadline[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-24 09:00 AM',
    action: 'SYSTEM_INITIALIZATION',
    user: 'admin',
    details: 'Najah Smart AI Class Portal initialized with secure role boundary.',
  },
];
