export type Role = 'admin' | 'student';

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  password?: string;
  email: string;
  role: 'admin';
  avatar: string;
}

export interface StudentUser {
  id: string;
  name: string;
  rollNo: string;
  username: string; // Set by admin
  password: string; // Set by admin
  email: string;
  department?: string;
  phone: string;
  avatar: string;
  registeredEventIds: string[];
  attendanceCount: number;
  createdDate: string;
  role: 'student';

  // Detailed profile fields from image_9c33410f.png & image_4c9427f5.png
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  community?: string;
  category?: string;
  motherTongue?: string;
  birthplace?: string;
  identificationMarks?: string;

  // Contact Details
  mobile?: string;
  whatsapp?: string;

  // Address Details
  cityTown?: string;
  state?: string;
  taluk?: string;
  panchayath?: string;
  postOffice?: string;
  pinCode?: string;
  fullAddress?: string;

  // Rewards System
  rewardPoints: number;
  badgesCount: number;
}

export type AuthUser = AdminUser | StudentUser;

export interface EventWinner {
  position: '1st Place' | '2nd Place' | '3rd Place' | 'Special Mention';
  studentName: string;
  rollNo?: string;
  prize?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: string; // Allows presets or any custom category typed by admin
  date: string; // YYYY-MM-DD
  time: string;
  venue: string;
  description: string;
  bannerUrl: string;
  maxCapacity?: number; // Optional - unlimited by default
  registeredStudentIds: string[];
  attendedStudentIds: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registrationOpen: boolean;
  qrCodeString: string;
  winners?: EventWinner[];
  rules?: string[];
  coordinator?: string;
}

export type ClassEvent = CampusEvent;

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: string; // Allows presets or any custom category typed by admin
  publishedDate: string;
  publishedBy: string;
  isPinned: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  url: string;
  eventTag: string;
  uploadedAt: string;
  description?: string;
}

export interface CertificateItem {
  id: string;
  verificationCode: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  eventTitle: string;
  eventDate: string;
  role: 'Winner' | 'Participant' | 'Organizer' | 'Merit Award';
  issuedDate: string;
  signatureTitle: string;
  qrCode: string;
}

export interface CampusInquiry {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  subject: string;
  message: string;
  reply?: string;
  status: 'open' | 'answered';
  sentAt: string;
}

export type ClassInquiry = CampusInquiry;

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

// Reward & Recognition System Types
export interface RewardRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  title: string;
  points: number;
  category: 'Class' | 'Attendance' | 'Conduct' | 'Event' | 'Leadership' | 'Creativity' | 'Other' | 'Academic';
  badgeIcon: 'trophy' | 'star' | 'medal' | 'zap' | 'crown' | 'sparkles' | 'award';
  awardedDate: string;
  awardedBy: string;
  notes?: string;
}

// Attendance System Types
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  studentRollNo: string;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string;
  markedAt: string;
}

// Class Chat & Direct Messaging Types
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  senderAvatar?: string;
  receiverId: string; // 'all' for class-wide channel, or 'admin-root', or studentId
  receiverName?: string;
  message: string;
  timestamp: string;
  attachmentUrl?: string;
  reactions?: { [emoji: string]: string[] }; // emoji -> array of userIds
}

// Portal Branding Configuration
export interface PortalBranding {
  logoUrl: string;
  portalName: string;
  portalSubtitle: string;
}

// Class Schedule & Weekly Timetable Types
export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface SchedulePeriod {
  id: string;
  day: Weekday;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:15"
  subject: string;
  subjectCode: string;
  instructor: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar' | 'Workshop';
  colorTag: 'teal' | 'indigo' | 'amber' | 'emerald' | 'purple' | 'rose' | 'sky';
  notes?: string;
}

export interface ScheduleDeadline {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // e.g. "11:59 PM"
  type: 'Assignment' | 'Project' | 'Quiz' | 'Exam' | 'Event Deadline';
  priority: 'high' | 'medium' | 'low';
  course: string;
  completed?: boolean;
  notes?: string;
}

