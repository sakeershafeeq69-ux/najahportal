import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  AdminUser,
  StudentUser,
  AuthUser,
  CampusEvent,
  NoticeItem,
  GalleryItem,
  CertificateItem,
  CampusInquiry,
  AuditLog,
  EventWinner,
  RewardRecord,
  AttendanceRecord,
  AttendanceStatus,
  ChatMessage,
  SchedulePeriod,
  ScheduleDeadline,
} from '../types';
import {
  INITIAL_ADMIN,
  INITIAL_STUDENTS,
  INITIAL_EVENTS,
  INITIAL_NOTICES,
  INITIAL_GALLERY,
  INITIAL_CERTIFICATES,
  INITIAL_INQUIRIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_REWARDS,
  INITIAL_ATTENDANCE,
  INITIAL_MESSAGES,
  INITIAL_SCHEDULE_PERIODS,
  INITIAL_SCHEDULE_DEADLINES,
} from '../data/mockData';

export const DEFAULT_LOGO = '/assets/aistudio/f166505f-a49d-44a3-aea5-f2fc3758a9fa_9e956595.png';

interface PortalContextType {
  currentUser: AuthUser | null;
  adminUser: AdminUser;
  students: StudentUser[];
  events: CampusEvent[];
  notices: NoticeItem[];
  gallery: GalleryItem[];
  certificates: CertificateItem[];
  inquiries: CampusInquiry[];
  auditLogs: AuditLog[];
  rewards: RewardRecord[];
  attendance: AttendanceRecord[];

  // Class Branding & Logo
  customLogo: string;
  setCustomLogo: (logoUrl: string) => void;
  resetCustomLogo: () => void;

  // Real-Time Unlimited Class Chat & Direct Messages
  messages: ChatMessage[];
  sendMessage: (data: {
    receiverId: string;
    receiverName?: string;
    message: string;
    attachmentUrl?: string;
  }) => void;
  deleteMessage: (messageId: string) => void;
  addMessageReaction: (messageId: string, emoji: string) => void;
  clearChat: (channelOrPeerId: string) => void;

  // Authentication
  login: (role: Role, username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  updateAdminPassword: (newPass: string) => void;

  // Student Management (Admin Only)
  addStudent: (data: {
    name: string;
    rollNo: string;
    username: string;
    password: string;
    email: string;
    department: string;
    phone?: string;
    avatar?: string;
  }) => { success: boolean; message?: string };
  deleteStudent: (studentId: string) => void;
  updateStudent: (studentId: string, updates: Partial<StudentUser>) => void;

  // Events Management
  createEvent: (data: Omit<CampusEvent, 'id' | 'registeredStudentIds' | 'attendedStudentIds' | 'qrCodeString'>) => void;
  updateEvent: (eventId: string, updates: Partial<CampusEvent>) => void;
  deleteEvent: (eventId: string) => void;
  setEventWinners: (eventId: string, winners: EventWinner[]) => void;
  checkInStudent: (eventId: string, studentId: string) => void;

  // Student Actions
  registerForEvent: (eventId: string) => void;
  cancelRegistration: (eventId: string) => void;
  submitInquiry: (subject: string, message: string) => void;

  // Notices
  addNotice: (notice: Omit<NoticeItem, 'id' | 'publishedDate'>) => void;
  deleteNotice: (noticeId: string) => void;

  // Gallery
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'uploadedAt'>) => void;
  deleteGalleryItem: (id: string) => void;

  // Certificates
  issueCertificate: (cert: Omit<CertificateItem, 'id' | 'verificationCode' | 'issuedDate' | 'qrCode'>) => void;
  deleteCertificate: (id: string) => void;

  // Inquiries
  replyToInquiry: (inquiryId: string, reply: string) => void;

  // Rewards System
  addReward: (data: {
    studentId: string;
    title: string;
    points: number;
    category: RewardRecord['category'];
    badgeIcon: RewardRecord['badgeIcon'];
    notes?: string;
  }) => void;
  deleteReward: (rewardId: string) => void;

  // Attendance System
  markAttendance: (date: string, records: { studentId: string; status: AttendanceStatus; remarks?: string }[]) => void;
  deleteAttendanceRecord: (recordId: string) => void;

  // User Self-Management & Profile
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  changeStudentPassword: (studentId: string, currentPass: string, newPass: string) => { success: boolean; message?: string };
  updateStudentProfile: (studentId: string, updates: Partial<StudentUser>) => void;

  // Class Schedule & Deadlines
  schedulePeriods: SchedulePeriod[];
  scheduleDeadlines: ScheduleDeadline[];
  addSchedulePeriod: (period: Omit<SchedulePeriod, 'id'>) => void;
  updateSchedulePeriod: (id: string, updates: Partial<SchedulePeriod>) => void;
  deleteSchedulePeriod: (id: string) => void;
  addScheduleDeadline: (deadline: Omit<ScheduleDeadline, 'id'>) => void;
  toggleScheduleDeadline: (id: string) => void;
  deleteScheduleDeadline: (id: string) => void;

  // System & Settings
  purgeAllData: () => void;
  exportBackup: () => string;
  importBackup: (jsonString: string) => boolean;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const NAJAH_STORAGE_PREFIX = 'najah_portal_v2_';

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Admin account
  const [adminUser, setAdminUser] = useState<AdminUser>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'admin');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN;
    } catch {
      return INITIAL_ADMIN;
    }
  });

  // Current session (defaults to null so login screen displays)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Students list - defaults to EMPTY as required by user!
  const [students, setStudents] = useState<StudentUser[]>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  // Events (Clean initialization - strictly empty array if stale mocks found)
  const [events, setEvents] = useState<CampusEvent[]>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((e: any) => e.id === 'ev-101' || e.id === 'ev-102')) {
          localStorage.setItem(NAJAH_STORAGE_PREFIX + 'events', '[]');
          return [];
        }
        return parsed;
      }
      return INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  // Notices (Clean initialization - strictly empty array if stale mocks found)
  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'notices');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((n: any) => n.id === 'not-1' || n.id === 'not-2')) {
          localStorage.setItem(NAJAH_STORAGE_PREFIX + 'notices', '[]');
          return [];
        }
        return parsed;
      }
      return INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  });

  // Gallery (Clean initialization - strictly empty array if stale mocks found)
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'gallery');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((g: any) => g.id === 'gal-1' || g.id === 'gal-2')) {
          localStorage.setItem(NAJAH_STORAGE_PREFIX + 'gallery', '[]');
          return [];
        }
        return parsed;
      }
      return INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  // Custom Logo & Branding
  const [customLogo, setCustomLogoState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'custom_logo');
      return saved || DEFAULT_LOGO;
    } catch {
      return DEFAULT_LOGO;
    }
  });

  const setCustomLogo = (logoUrl: string) => {
    if (currentUser?.role !== 'admin') {
      console.warn('[Security Guard] Student cannot change custom logo.');
      return;
    }
    setCustomLogoState(logoUrl);
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'custom_logo', logoUrl);
  };

  const resetCustomLogo = () => {
    if (currentUser?.role !== 'admin') {
      console.warn('[Security Guard] Student cannot reset custom logo.');
      return;
    }
    setCustomLogoState(DEFAULT_LOGO);
    localStorage.removeItem(NAJAH_STORAGE_PREFIX + 'custom_logo');
  };

  // Real-Time Unlimited Class Chat & Direct Messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'messages');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  // Certificates
  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'certificates');
      return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
    } catch {
      return INITIAL_CERTIFICATES;
    }
  });

  // Inquiries
  const [inquiries, setInquiries] = useState<CampusInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'inquiries');
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  // Rewards
  const [rewards, setRewards] = useState<RewardRecord[]>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'rewards');
      return saved ? JSON.parse(saved) : INITIAL_REWARDS;
    } catch {
      return INITIAL_REWARDS;
    }
  });

  // Attendance
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'attendance');
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'auditLogs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Class Schedule Periods & Timetable
  const [schedulePeriods, setSchedulePeriods] = useState<SchedulePeriod[]>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'schedule');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Class Schedule & Event Deadlines
  const [scheduleDeadlines, setScheduleDeadlines] = useState<ScheduleDeadline[]>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'deadlines');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(NAJAH_STORAGE_PREFIX + 'dark_mode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem(NAJAH_STORAGE_PREFIX + 'dark_mode', String(next));
      if (next) {
        document.documentElement.classList.add('dark');
        document.body?.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body?.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body?.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body?.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  // LocalStorage Persistence
  useEffect(() => {
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'admin', JSON.stringify(adminUser));
  }, [adminUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(NAJAH_STORAGE_PREFIX + 'currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(NAJAH_STORAGE_PREFIX + 'currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'schedule', JSON.stringify(schedulePeriods));
  }, [schedulePeriods]);

  useEffect(() => {
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'deadlines', JSON.stringify(scheduleDeadlines));
  }, [scheduleDeadlines]);

  // Real-Time Unlimited Class Chat & Direct Messages Methods (Zero limits, no tokens, no paywalls)
  const sendMessage = (data: {
    receiverId: string;
    receiverName?: string;
    message: string;
    attachmentUrl?: string;
  }) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      receiverId: data.receiverId,
      receiverName: data.receiverName || (data.receiverId === 'all' ? 'All Class Members' : 'Direct Message'),
      message: data.message,
      timestamp: `${dateStr}, ${timeStr}`,
      attachmentUrl: data.attachmentUrl,
      reactions: {},
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const deleteMessage = (messageId: string) => {
    if (!currentUser) return;
    setMessages((prev) =>
      prev.filter((m) => {
        if (m.id !== messageId) return true;
        // Admin can delete any message; student can only delete messages they sent themselves
        if (currentUser.role === 'admin' || m.senderId === currentUser.id) {
          return false;
        }
        console.warn('[Security Guard] Student cannot delete messages sent by others.');
        return true;
      })
    );
  };

  const addMessageReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;
    const uid = currentUser.id;
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const currentReactions = { ...(m.reactions || {}) };
        const userList = currentReactions[emoji] || [];
        if (userList.includes(uid)) {
          currentReactions[emoji] = userList.filter((id) => id !== uid);
          if (currentReactions[emoji].length === 0) {
            delete currentReactions[emoji];
          }
        } else {
          currentReactions[emoji] = [...userList, uid];
        }
        return { ...m, reactions: currentReactions };
      })
    );
  };

  const clearChat = (channelOrPeerId: string) => {
    if (!currentUser) return;
    if (channelOrPeerId === 'all') {
      if (currentUser.role !== 'admin') {
        console.warn('[Security Guard] Only admin can clear the entire class-wide chat channel.');
        return;
      }
      setMessages((prev) => prev.filter((m) => m.receiverId !== 'all'));
    } else {
      setMessages((prev) =>
        prev.filter(
          (m) =>
            !(
              (m.senderId === channelOrPeerId && m.receiverId === currentUser?.id) ||
              (m.senderId === currentUser?.id && m.receiverId === channelOrPeerId)
            )
        )
      );
    }
  };

  // Helpers
  const addAuditLog = (action: string, user: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleString(),
      action,
      user,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  // Authentication
  const login = (role: Role, username: string, pass: string): { success: boolean; message?: string } => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (role === 'admin') {
      const validUser = adminUser.username.toLowerCase();
      const validPass = adminUser.password || 'admin123';

      if (cleanUser === validUser && cleanPass === validPass) {
        setCurrentUser(adminUser);
        addAuditLog('LOGIN_SUCCESS', 'admin', 'Class Administrator signed in.');
        return { success: true };
      }
      return { success: false, message: 'Invalid Admin username or password.' };
    }

    if (role === 'student') {
      const student = students.find((s) => s.username.toLowerCase() === cleanUser);
      if (!student) {
        return {
          success: false,
          message: 'Student account not found. Please contact the administrator to enroll you.',
        };
      }

      if (student.password !== cleanPass) {
        return { success: false, message: 'Incorrect student password.' };
      }

      setCurrentUser(student);
      addAuditLog('LOGIN_SUCCESS', student.username, `Student ${student.name} logged in.`);
      return { success: true };
    }

    return { success: false, message: 'Invalid role selection.' };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('LOGOUT', currentUser.username, `User logged out: ${currentUser.name}`);
    }
    setCurrentUser(null);
  };

  // Security Guard Middleware: Rejects any unauthorized data mutation from student roles
  const requireAdmin = (actionName: string): boolean => {
    if (currentUser?.role !== 'admin') {
      console.warn(
        `[Security Guard Middleware] Blocked unauthorized attempt to trigger mutation "${actionName}" from student account (@${currentUser?.username || 'anonymous'}).`
      );
      addAuditLog(
        'SECURITY_BLOCKED_UNAUTHORIZED_MUTATION',
        currentUser?.username || 'unauthorized_student',
        `Blocked student attempt to invoke admin mutation "${actionName}". Read-only restriction enforced.`
      );
      return false;
    }
    return true;
  };

  const updateAdminPassword = (newPass: string) => {
    if (!requireAdmin('updateAdminPassword')) return;
    setAdminUser((prev) => ({ ...prev, password: newPass }));
    addAuditLog('ADMIN_PASSWORD_UPDATED', 'admin', 'Admin updated master security password.');
  };

  // Student Management (Admin)
  const addStudent = (data: {
    name: string;
    rollNo: string;
    username: string;
    password: string;
    email: string;
    department: string;
    phone?: string;
    avatar?: string;
  }) => {
    if (!requireAdmin('addStudent')) {
      return { success: false, message: 'Unauthorized: Administrator privileges are required to enroll students.' };
    }
    const cleanUser = data.username.trim().toLowerCase();
    const existing = students.find(
      (s) => s.username.toLowerCase() === cleanUser || s.rollNo.toLowerCase() === data.rollNo.trim().toLowerCase()
    );

    if (existing) {
      return { success: false, message: 'A student with this Username or Roll Number already exists.' };
    }

    const newStudent: StudentUser = {
      id: `std-${Date.now()}`,
      name: data.name.trim(),
      rollNo: data.rollNo.trim().toUpperCase(),
      username: cleanUser,
      password: data.password.trim(),
      email: data.email.trim(),
      department: data.department.trim(),
      phone: data.phone?.trim() || '+1 (555) 000-0000',
      avatar:
        data.avatar ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
      registeredEventIds: [],
      attendanceCount: 0,
      rewardPoints: 0,
      badgesCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
      role: 'student',
    };

    setStudents((prev) => [...prev, newStudent]);
    addAuditLog('STUDENT_ENROLLED', 'admin', `Admin added student: ${newStudent.name} (User: ${newStudent.username})`);
    return { success: true };
  };

  const deleteStudent = (studentId: string) => {
    if (!requireAdmin('deleteStudent')) return;
    const target = students.find((s) => s.id === studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    // Remove from registered events
    setEvents((prev) =>
      prev.map((ev) => ({
        ...ev,
        registeredStudentIds: ev.registeredStudentIds.filter((id) => id !== studentId),
        attendedStudentIds: ev.attendedStudentIds.filter((id) => id !== studentId),
      }))
    );
    // Remove attendance & rewards
    setAttendance((prev) => prev.filter((a) => a.studentId !== studentId));
    setRewards((prev) => prev.filter((r) => r.studentId !== studentId));

    if (target) {
      addAuditLog('STUDENT_DELETED', 'admin', `Admin removed student ${target.name} (${target.username})`);
    }
  };

  const updateStudent = (studentId: string, updates: Partial<StudentUser>) => {
    if (currentUser?.role !== 'admin' && currentUser?.id !== studentId) {
      requireAdmin('updateStudent');
      return;
    }
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s)));
    if (currentUser?.role === 'student' && currentUser.id === studentId) {
      setCurrentUser((prev) => (prev ? ({ ...prev, ...updates } as AuthUser) : null));
    }
    addAuditLog('STUDENT_UPDATED', currentUser?.username || 'admin', `Modified profile for student ID: ${studentId}`);
  };

  // Events Management
  const createEvent = (
    eventData: Omit<CampusEvent, 'id' | 'registeredStudentIds' | 'attendedStudentIds' | 'qrCodeString'>
  ) => {
    if (!requireAdmin('createEvent')) return;
    const newId = `ev-${Date.now()}`;
    const newEvent: CampusEvent = {
      ...eventData,
      id: newId,
      registeredStudentIds: [],
      attendedStudentIds: [],
      qrCodeString: `NAJAH-EVENT-${newId.toUpperCase()}-PASS`,
    };
    setEvents((prev) => [newEvent, ...prev]);
    addAuditLog('EVENT_CREATED', 'admin', `Created new event: ${newEvent.title}`);
  };

  const updateEvent = (eventId: string, updates: Partial<CampusEvent>) => {
    if (!requireAdmin('updateEvent')) return;
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, ...updates } : e)));
    addAuditLog('EVENT_UPDATED', 'admin', `Updated event ID: ${eventId}`);
  };

  const deleteEvent = (eventId: string) => {
    if (!requireAdmin('deleteEvent')) return;
    const ev = events.find((e) => e.id === eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    addAuditLog('EVENT_DELETED', 'admin', `Deleted event: ${ev?.title || eventId}`);
  };

  const setEventWinners = (eventId: string, winners: EventWinner[]) => {
    if (!requireAdmin('setEventWinners')) return;
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, winners, status: 'completed' } : e))
    );
    addAuditLog('WINNERS_ANNOUNCED', 'admin', `Published winners for event ID: ${eventId}`);
  };

  const checkInStudent = (eventId: string, studentId: string) => {
    if (!requireAdmin('checkInStudent')) return;
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId && !e.attendedStudentIds.includes(studentId)) {
          return { ...e, attendedStudentIds: [...e.attendedStudentIds, studentId] };
        }
        return e;
      })
    );

    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attendanceCount: (s.attendanceCount || 0) + 1 } : s))
    );

    addAuditLog('QR_CHECKIN', 'system', `Student ${studentId} checked into event ${eventId}`);
  };

  // Student Event Actions
  const registerForEvent = (eventId: string) => {
    if (!currentUser || currentUser.role !== 'student') return;
    const stdId = currentUser.id;

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId && !e.registeredStudentIds.includes(stdId)) {
          return { ...e, registeredStudentIds: [...e.registeredStudentIds, stdId] };
        }
        return e;
      })
    );

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === stdId && !s.registeredEventIds.includes(eventId)) {
          return { ...s, registeredEventIds: [...s.registeredEventIds, eventId] };
        }
        return s;
      })
    );

    setCurrentUser((prev) => {
      if (!prev || prev.role !== 'student') return prev;
      return {
        ...prev,
        registeredEventIds: prev.registeredEventIds.includes(eventId)
          ? prev.registeredEventIds
          : [...prev.registeredEventIds, eventId],
      };
    });

    addAuditLog('EVENT_REGISTRATION', currentUser.username, `Registered for event ${eventId}`);
  };

  const cancelRegistration = (eventId: string) => {
    if (!currentUser || currentUser.role !== 'student') return;
    const stdId = currentUser.id;

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            registeredStudentIds: e.registeredStudentIds.filter((id) => id !== stdId),
          };
        }
        return e;
      })
    );

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === stdId) {
          return {
            ...s,
            registeredEventIds: s.registeredEventIds.filter((id) => id !== eventId),
          };
        }
        return s;
      })
    );

    setCurrentUser((prev) => {
      if (!prev || prev.role !== 'student') return prev;
      return {
        ...prev,
        registeredEventIds: prev.registeredEventIds.filter((id) => id !== eventId),
      };
    });

    addAuditLog('REGISTRATION_CANCELLED', currentUser.username, `Cancelled registration for event ${eventId}`);
  };

  const submitInquiry = (subject: string, message: string) => {
    if (!currentUser || currentUser.role !== 'student') return;
    const newInquiry: CampusInquiry = {
      id: `inq-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRollNo: currentUser.rollNo,
      subject,
      message,
      status: 'open',
      sentAt: new Date().toLocaleString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  // Notices
  const addNotice = (noticeData: Omit<NoticeItem, 'id' | 'publishedDate'>) => {
    if (!requireAdmin('addNotice')) return;
    const newNotice: NoticeItem = {
      ...noticeData,
      id: `not-${Date.now()}`,
      publishedDate: new Date().toISOString().split('T')[0],
    };
    setNotices((prev) => [newNotice, ...prev]);
    addAuditLog('NOTICE_PUBLISHED', 'admin', `Published notice: ${newNotice.title}`);
  };

  const deleteNotice = (noticeId: string) => {
    if (!requireAdmin('deleteNotice')) return;
    setNotices((prev) => prev.filter((n) => n.id !== noticeId));
  };

  // Gallery
  const addGalleryItem = (itemData: Omit<GalleryItem, 'id' | 'uploadedAt'>) => {
    if (!requireAdmin('addGalleryItem')) return;
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setGallery((prev) => [newItem, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    if (!requireAdmin('deleteGalleryItem')) return;
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  // Certificates
  const issueCertificate = (
    certData: Omit<CertificateItem, 'id' | 'verificationCode' | 'issuedDate' | 'qrCode'>
  ) => {
    if (!requireAdmin('issueCertificate')) return;
    const code = `NAJAH-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newCert: CertificateItem = {
      ...certData,
      id: `cert-${Date.now()}`,
      verificationCode: code,
      issuedDate: new Date().toISOString().split('T')[0],
      qrCode: `VERIFY:https://najah.portal/verify/${code}`,
    };
    setCertificates((prev) => [newCert, ...prev]);
    addAuditLog('CERTIFICATE_ISSUED', 'admin', `Issued certificate ${code} to ${certData.studentName}`);
  };

  const deleteCertificate = (id: string) => {
    if (!requireAdmin('deleteCertificate')) return;
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  };

  const replyToInquiry = (inquiryId: string, reply: string) => {
    if (!requireAdmin('replyToInquiry')) return;
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, reply, status: 'answered' } : inq))
    );
  };

  // Rewards System
  const addReward = (data: {
    studentId: string;
    title: string;
    points: number;
    category: RewardRecord['category'];
    badgeIcon: RewardRecord['badgeIcon'];
    notes?: string;
  }) => {
    if (!requireAdmin('addReward')) return;
    const student = students.find((s) => s.id === data.studentId);
    if (!student) return;

    const newReward: RewardRecord = {
      id: `rew-${Date.now()}`,
      studentId: data.studentId,
      studentName: student.name,
      studentRollNo: student.rollNo,
      title: data.title,
      points: data.points,
      category: data.category,
      badgeIcon: data.badgeIcon,
      awardedDate: new Date().toISOString().split('T')[0],
      awardedBy: 'Class Administrator',
      notes: data.notes,
    };

    setRewards((prev) => [newReward, ...prev]);

    // Update student's points and badge count
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === data.studentId) {
          return {
            ...s,
            rewardPoints: (s.rewardPoints || 0) + data.points,
            badgesCount: (s.badgesCount || 0) + 1,
          };
        }
        return s;
      })
    );

    if (currentUser?.role === 'student' && currentUser.id === data.studentId) {
      setCurrentUser((prev) => {
        if (!prev || prev.role !== 'student') return prev;
        return {
          ...prev,
          rewardPoints: (prev.rewardPoints || 0) + data.points,
          badgesCount: (prev.badgesCount || 0) + 1,
        };
      });
    }

    addAuditLog(
      'REWARD_AWARDED',
      'admin',
      `Awarded ${data.points} pts & badge (${data.title}) to ${student.name}`
    );
  };

  const deleteReward = (rewardId: string) => {
    if (!requireAdmin('deleteReward')) return;
    const target = rewards.find((r) => r.id === rewardId);
    if (target) {
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === target.studentId) {
            return {
              ...s,
              rewardPoints: Math.max(0, (s.rewardPoints || 0) - target.points),
              badgesCount: Math.max(0, (s.badgesCount || 0) - 1),
            };
          }
          return s;
        })
      );
    }
    setRewards((prev) => prev.filter((r) => r.id !== rewardId));
  };

  // Attendance System
  const markAttendance = (
    date: string,
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[]
  ) => {
    if (!requireAdmin('markAttendance')) return;
    // Remove existing records for this date
    const otherDates = attendance.filter((a) => a.date !== date);

    const newRecords: AttendanceRecord[] = records.map((rec) => {
      const student = students.find((s) => s.id === rec.studentId);
      return {
        id: `att-${date}-${rec.studentId}`,
        date,
        studentId: rec.studentId,
        studentName: student?.name || 'Student',
        studentRollNo: student?.rollNo || 'N/A',
        status: rec.status,
        remarks: rec.remarks,
        markedBy: 'Class Administrator',
        markedAt: new Date().toLocaleTimeString(),
      };
    });

    const updatedAll = [...newRecords, ...otherDates];
    setAttendance(updatedAll);

    // Update each student's attendanceCount
    setStudents((prev) =>
      prev.map((s) => {
        const studentPresents = updatedAll.filter(
          (a) => a.studentId === s.id && a.status === 'present'
        ).length;
        return { ...s, attendanceCount: studentPresents };
      })
    );

    addAuditLog('ATTENDANCE_MARKED', 'admin', `Marked attendance for date ${date} (${records.length} students)`);
  };

  const deleteAttendanceRecord = (recordId: string) => {
    if (!requireAdmin('deleteAttendanceRecord')) return;
    setAttendance((prev) => prev.filter((a) => a.id !== recordId));
  };

  // Student self-profile update & password change (Architecture: students can only update their own profile)
  const changeStudentPassword = (studentId: string, currentPass: string, newPass: string) => {
    if (currentUser?.id !== studentId && currentUser?.role !== 'admin') {
      requireAdmin('changeStudentPassword');
      return { success: false, message: 'Unauthorized: You can only change your own password.' };
    }
    const student = students.find((s) => s.id === studentId);
    if (!student) return { success: false, message: 'Student account not found.' };
    if (student.password !== currentPass) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    if (newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }

    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, password: newPass } : s))
    );
    if (currentUser?.role === 'student' && currentUser.id === studentId) {
      setCurrentUser((prev) => (prev ? ({ ...prev, password: newPass } as AuthUser) : null));
    }
    addAuditLog('STUDENT_PASSWORD_CHANGED', student.username, `Student ${student.name} changed their password.`);
    return { success: true };
  };

  const updateStudentProfile = (
    studentId: string,
    updates: Partial<StudentUser>
  ) => {
    if (currentUser?.id !== studentId && currentUser?.role !== 'admin') {
      requireAdmin('updateStudentProfile');
      return;
    }
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s))
    );
    if (currentUser?.role === 'student' && currentUser.id === studentId) {
      setCurrentUser((prev) => (prev ? ({ ...prev, ...updates } as AuthUser) : null));
    }
    addAuditLog('STUDENT_PROFILE_UPDATED', currentUser?.username || 'student', 'Student updated self profile details.');
  };

  // Class Schedule & Deadlines Management
  const addSchedulePeriod = (periodData: Omit<SchedulePeriod, 'id'>) => {
    if (!requireAdmin('addSchedulePeriod')) return;
    const newPeriod: SchedulePeriod = {
      ...periodData,
      id: `sch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setSchedulePeriods((prev) => [...prev, newPeriod]);
    addAuditLog('SCHEDULE_PERIOD_ADDED', 'admin', `Added class period: ${newPeriod.subjectCode} (${newPeriod.day} ${newPeriod.startTime})`);
  };

  const updateSchedulePeriod = (id: string, updates: Partial<SchedulePeriod>) => {
    if (!requireAdmin('updateSchedulePeriod')) return;
    setSchedulePeriods((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addAuditLog('SCHEDULE_PERIOD_UPDATED', 'admin', `Updated schedule period ID: ${id}`);
  };

  const deleteSchedulePeriod = (id: string) => {
    if (!requireAdmin('deleteSchedulePeriod')) return;
    setSchedulePeriods((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('SCHEDULE_PERIOD_DELETED', 'admin', `Removed schedule period ID: ${id}`);
  };

  const addScheduleDeadline = (deadlineData: Omit<ScheduleDeadline, 'id'>) => {
    if (!requireAdmin('addScheduleDeadline')) return;
    const newDeadline: ScheduleDeadline = {
      ...deadlineData,
      id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setScheduleDeadlines((prev) => [newDeadline, ...prev]);
    addAuditLog('DEADLINE_ADDED', 'admin', `Added milestone deadline: ${newDeadline.title}`);
  };

  const toggleScheduleDeadline = (id: string) => {
    if (!requireAdmin('toggleScheduleDeadline')) return;
    setScheduleDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
    );
  };

  const deleteScheduleDeadline = (id: string) => {
    if (!requireAdmin('deleteScheduleDeadline')) return;
    setScheduleDeadlines((prev) => prev.filter((d) => d.id !== id));
  };

  // PURGE ALL DATA - Explicitly deletes everything, zero events, zero notices, zero students
  const purgeAllData = () => {
    if (!requireAdmin('purgeAllData')) return;
    localStorage.removeItem(NAJAH_STORAGE_PREFIX + 'currentUser');
    localStorage.removeItem(NAJAH_STORAGE_PREFIX + 'students');
    localStorage.removeItem(NAJAH_STORAGE_PREFIX + 'events');
    localStorage.removeItem(NAJAH_STORAGE_PREFIX + 'notices');
    localStorage.removeItem(NAJAH_STORAGE_PREFIX + 'gallery');
    localStorage.removeItem(NAJAH_STORAGE_PREFIX + 'certificates');
    localStorage.removeItem(NAJAH_STORAGE_PREFIX + 'inquiries');
    localStorage.removeItem(NAJAH_STORAGE_PREFIX + 'rewards');
    localStorage.removeItem(NAJAH_STORAGE_PREFIX + 'attendance');
    localStorage.removeItem(NAJAH_STORAGE_PREFIX + 'messages');
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'schedule', JSON.stringify([]));
    localStorage.setItem(NAJAH_STORAGE_PREFIX + 'deadlines', JSON.stringify([]));

    // Wipe state completely
    setStudents([]); // ZERO STUDENTS! Only Admin can add!
    setEvents([]);   // ZERO EVENTS! Only Admin can add!
    setNotices([]);  // ZERO NOTICES! Only Admin can add!
    setGallery([]);  // ZERO GALLERY! Only Admin can add!
    setCertificates([]);
    setInquiries([]);
    setRewards([]);
    setAttendance([]);
    setMessages([]);
    setSchedulePeriods([]); // ZERO SCHEDULE PERIODS! Clean wipe!
    setScheduleDeadlines([]); // ZERO DEADLINES! Clean wipe!

    // Keep admin logged in or set current user to admin
    setCurrentUser(INITIAL_ADMIN);
    setAdminUser(INITIAL_ADMIN);

    const purgeLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action: 'SYSTEM_PURGE_DATA',
      user: 'admin',
      details: 'All class events, notices, students, attendance records, and messages purged permanently.',
    };
    setAuditLogs([purgeLog]);
  };

  const exportBackup = () => {
    const backup = {
      version: '2.5',
      exportedAt: new Date().toISOString(),
      admin: adminUser,
      students,
      events,
      notices,
      gallery,
      certificates,
      inquiries,
      rewards,
      attendance,
      messages,
      schedulePeriods,
      scheduleDeadlines,
      auditLogs,
    };
    return JSON.stringify(backup, null, 2);
  };

  const importBackup = (jsonString: string): boolean => {
    if (!requireAdmin('importBackup')) return false;
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.students)) setStudents(data.students);
      if (Array.isArray(data.events)) setEvents(data.events);
      if (Array.isArray(data.notices)) setNotices(data.notices);
      if (Array.isArray(data.gallery)) setGallery(data.gallery);
      if (Array.isArray(data.certificates)) setCertificates(data.certificates);
      if (Array.isArray(data.rewards)) setRewards(data.rewards);
      if (Array.isArray(data.attendance)) setAttendance(data.attendance);
      if (Array.isArray(data.messages)) setMessages(data.messages);
      if (Array.isArray(data.schedulePeriods)) setSchedulePeriods(data.schedulePeriods);
      if (Array.isArray(data.scheduleDeadlines)) setScheduleDeadlines(data.scheduleDeadlines);
      addAuditLog('SYSTEM_RESTORE', 'admin', 'Class data backup successfully restored.');
      return true;
    } catch {
      return false;
    }
  };

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        adminUser,
        students,
        events,
        notices,
        gallery,
        certificates,
        inquiries,
        auditLogs,
        rewards,
        attendance,
        customLogo,
        setCustomLogo,
        resetCustomLogo,
        messages,
        sendMessage,
        deleteMessage,
        addMessageReaction,
        clearChat,
        schedulePeriods,
        scheduleDeadlines,
        addSchedulePeriod,
        updateSchedulePeriod,
        deleteSchedulePeriod,
        addScheduleDeadline,
        toggleScheduleDeadline,
        deleteScheduleDeadline,
        login,
        logout,
        updateAdminPassword,
        addStudent,
        deleteStudent,
        updateStudent,
        createEvent,
        updateEvent,
        deleteEvent,
        setEventWinners,
        checkInStudent,
        registerForEvent,
        cancelRegistration,
        submitInquiry,
        addNotice,
        deleteNotice,
        addGalleryItem,
        deleteGalleryItem,
        issueCertificate,
        deleteCertificate,
        replyToInquiry,
        addReward,
        deleteReward,
        markAttendance,
        deleteAttendanceRecord,
        isDarkMode,
        toggleDarkMode,
        changeStudentPassword,
        updateStudentProfile,
        purgeAllData,
        exportBackup,
        importBackup,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
