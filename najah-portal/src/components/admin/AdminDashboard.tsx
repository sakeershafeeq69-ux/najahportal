import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Users, 
  CalendarDays, 
  CalendarRange,
  Award, 
  BellRing, 
  CalendarCheck,
  Trophy,
  ShieldCheck, 
  Plus, 
  Database
} from 'lucide-react';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
  openAddStudentModal: () => void;
  openCreateEventModal: () => void;
  openPublishNoticeModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  setActiveTab,
  openAddStudentModal,
  openCreateEventModal,
  openPublishNoticeModal,
}) => {
  const { 
    currentUser, 
    students, 
    events, 
    certificates, 
    notices, 
    inquiries,
    rewards,
    attendance
  } = usePortal();

  const totalRegistrations = events.reduce((sum, e) => sum + e.registeredStudentIds.length, 0);
  const openInquiries = inquiries.filter((i) => i.status === 'open');
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a) => a.date === todayStr);
  const todayPresents = todayAttendance.filter((a) => a.status === 'present').length;

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#073642] via-[#095061] to-[#086a7e] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/f166505f-a49d-44a3-aea5-f2fc3758a9fa_9e956595.png"
              alt="Najah Portal Logo"
              className="w-16 h-16 object-contain bg-white/10 rounded-2xl p-1.5 backdrop-blur-md border border-white/20"
            />
            <div>
              <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Najah Class Administrator Console</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight mt-0.5">
                Welcome back, {currentUser?.name}
              </h2>
              <p className="text-xs text-teal-100/90 mt-1">
                Full master authority over class attendance, rewards, student rosters, event registrations, and notices.
              </p>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('attendance')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-sm"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Take Attendance</span>
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 transition-colors shadow-sm"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Grant Reward</span>
            </button>
            <button
              onClick={openAddStudentModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-white text-[#073642] hover:bg-teal-50 transition-colors shadow-sm"
            >
              <Users className="w-3.5 h-3.5 text-[#086a7e]" />
              <span>Enroll Student</span>
            </button>
            <button
              onClick={openCreateEventModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#086a7e] hover:bg-[#065464] text-white transition-colors border border-teal-400/30 shadow-sm"
            >
              <CalendarDays className="w-3.5 h-3.5 text-amber-300" />
              <span>New Event</span>
            </button>
            <button
              onClick={openPublishNoticeModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-white/15 hover:bg-white/20 text-white transition-colors border border-white/20"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Post Notice</span>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-teal-400/20 hover:bg-teal-400/30 text-teal-100 transition-colors border border-teal-300/30"
            >
              <CalendarRange className="w-3.5 h-3.5 text-cyan-300" />
              <span>Timetable</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Metric 1: Students */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Enrolled
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#086a7e] dark:text-teal-400">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {students.length}
            </span>
            <span className="text-[11px] text-slate-500">Students</span>
          </div>
          <button
            onClick={() => setActiveTab('students')}
            className="mt-2 text-[11px] font-bold text-[#086a7e] dark:text-teal-400 hover:underline block"
          >
            Manage &rarr;
          </button>
        </div>

        {/* Metric 2: Attendance */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Attendance
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CalendarCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {todayPresents}/{students.length || 0}
            </span>
            <span className="text-[11px] text-slate-500">Today</span>
          </div>
          <button
            onClick={() => setActiveTab('attendance')}
            className="mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline block"
          >
            Roll Call &rarr;
          </button>
        </div>

        {/* Metric 3: Rewards */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Rewards
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Trophy className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-amber-500 font-mono">
              {rewards.length}
            </span>
            <span className="text-[11px] text-slate-500">Badges</span>
          </div>
          <button
            onClick={() => setActiveTab('rewards')}
            className="mt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline block"
          >
            Leaderboard &rarr;
          </button>
        </div>

        {/* Metric 4: Events */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Class Events
            </span>
            <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <CalendarDays className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {events.length}
            </span>
            <span className="text-[11px] text-slate-500">Total</span>
          </div>
          <button
            onClick={() => setActiveTab('events')}
            className="mt-2 text-[11px] font-bold text-[#086a7e] dark:text-teal-400 hover:underline block"
          >
            Schedule &rarr;
          </button>
        </div>

        {/* Metric 5: Certificates */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Certificates
            </span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {certificates.length}
            </span>
            <span className="text-[11px] text-slate-500">Issued</span>
          </div>
          <button
            onClick={() => setActiveTab('certificates')}
            className="mt-2 text-[11px] font-bold text-[#086a7e] dark:text-teal-400 hover:underline block"
          >
            Verify &rarr;
          </button>
        </div>

        {/* Metric 6: Notices & Inquiries */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Bulletins
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <BellRing className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {notices.length}
            </span>
            <span className="text-[11px] text-slate-500">Alerts</span>
          </div>
          <button
            onClick={() => setActiveTab('notices')}
            className="mt-2 text-[11px] font-bold text-[#086a7e] dark:text-teal-400 hover:underline block"
          >
            Notices &rarr;
          </button>
        </div>

      </div>

      {/* Main 2-Column Split: Manage Students & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Students Enrollment Quick Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#086a7e] dark:text-teal-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Class Student Directory
                </h3>
              </div>
              <button
                onClick={openAddStudentModal}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-xl transition-colors flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Student</span>
              </button>
            </div>

            {students.length === 0 ? (
              <div className="p-6 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 text-[#086a7e] dark:text-teal-300 mx-auto flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-white">No students currently enrolled</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  As instructed, students must be added directly by the Admin. Click <strong>&ldquo;Add Student&rdquo;</strong> to create student usernames and passwords.
                </p>
                <button
                  onClick={openAddStudentModal}
                  className="mt-2 px-3 py-1.5 text-xs font-bold text-[#086a7e] dark:text-teal-300 bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-700 rounded-xl hover:bg-teal-50"
                >
                  + Enroll First Student
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {students.slice(0, 4).map((student) => (
                  <div key={student.id} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={student.avatar} alt={student.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{student.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {student.rollNo} · <code className="text-[#086a7e] dark:text-teal-400 font-bold">@{student.username}</code>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-[#e6f7f7] text-[#0b5e70] dark:bg-teal-950/70 dark:text-teal-300 px-2 py-0.5 rounded-full">
                      {student.department}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Admin sets student credentials.</span>
            <button
              onClick={() => setActiveTab('students')}
              className="font-bold text-[#086a7e] dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              Full Student Roster &rarr;
            </button>
          </div>
        </div>

        {/* Right: Class Events Quick Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Scheduled Class Events
                </h3>
              </div>
              <button
                onClick={openCreateEventModal}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Event</span>
              </button>
            </div>

            <div className="space-y-3">
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300">
                      {event.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{event.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{event.date} · {event.venue}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-[#086a7e] dark:text-teal-400 font-mono">
                      {event.registeredStudentIds.length} Registered
                    </div>
                    <span className="text-[10px] text-slate-400">Cap: {event.maxCapacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Countdown timers & QR check-in active.</span>
            <button
              onClick={() => setActiveTab('events')}
              className="font-bold text-[#086a7e] dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              All Events & Results &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* System Security Notice */}
      <div className="bg-[#072430] dark:bg-slate-900 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-teal-900 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Class Data Security & Purge Controls</div>
            <div className="text-xs text-slate-300">
              Need to wipe all student test records or export a full JSON backup? Head to Settings & Security.
            </div>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('settings')}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-colors shrink-0 shadow-xs"
        >
          Open Settings &rarr;
        </button>
      </div>

    </div>
  );
};
