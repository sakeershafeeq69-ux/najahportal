import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  CalendarDays, 
  CalendarRange,
  Award, 
  QrCode, 
  BellRing, 
  CalendarCheck,
  Trophy,
  Star,
  MapPin,
  Bot
} from 'lucide-react';
import { CampusEvent, StudentUser } from '../../types';

interface StudentDashboardProps {
  setActiveTab: (tab: string) => void;
  openAiChat: () => void;
  onViewCertificate: (certId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  setActiveTab,
  openAiChat,
  onViewCertificate,
}) => {
  const { currentUser, events, certificates, notices, cancelRegistration, attendance, rewards, schedulePeriods } = usePortal();
  const student = currentUser as StudentUser;

  // Selected event for QR Pass modal
  const [selectedEventForQr, setSelectedEventForQr] = useState<CampusEvent | null>(null);

  // My registered events
  const myRegisteredEvents = events.filter((e) => e.registeredStudentIds.includes(student?.id));
  
  // My certificates
  const myCertificates = certificates.filter((c) => c.studentId === student?.id);

  // My attendance stats
  const myAttendanceRecords = attendance.filter((a) => a.studentId === student?.id);
  const myPresents = myAttendanceRecords.filter((a) => a.status === 'present').length;
  const attendanceRate = myAttendanceRecords.length > 0
    ? Math.round((myPresents / myAttendanceRecords.length) * 100)
    : 100;

  // My rewards
  const myRewards = rewards.filter((r) => r.studentId === student?.id);

  // Latest notices
  const latestNotices = notices.slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Student Welcome Hero */}
      <div className="bg-gradient-to-r from-[#073642] via-[#095061] to-[#086a7e] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={student?.avatar}
              alt={student?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/30 text-teal-200 border border-teal-400/30">
                  {student?.rollNo}
                </span>
                <span className="text-xs text-teal-200/80 font-medium">{student?.department}</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight mt-1">
                Welcome, {student?.name}
              </h2>
              <p className="text-xs text-teal-100/80 mt-0.5">
                Username: <code className="font-mono text-amber-300">@{student?.username}</code> · Email: {student?.email}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('attendance')}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-2.5 px-3.5 border border-white/15 text-center min-w-[85px] transition-colors"
            >
              <div className="text-[10px] uppercase tracking-wider text-teal-200 font-bold flex items-center justify-center gap-1">
                <CalendarCheck className="w-3 h-3 text-emerald-300" />
                <span>Attendance</span>
              </div>
              <div className="text-xl font-black font-mono text-emerald-300 tabular-nums mt-0.5">
                {attendanceRate}%
              </div>
              <div className="text-[10px] text-teal-300">Present</div>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-2.5 px-3.5 border border-white/15 text-center min-w-[85px] transition-colors"
            >
              <div className="text-[10px] uppercase tracking-wider text-teal-200 font-bold flex items-center justify-center gap-1">
                <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span>Stars</span>
              </div>
              <div className="text-xl font-black font-mono text-amber-300 tabular-nums mt-0.5">
                {student?.rewardPoints || 0}
              </div>
              <div className="text-[10px] text-teal-300">Points</div>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-2.5 px-3.5 border border-white/15 text-center min-w-[85px] transition-colors"
            >
              <div className="text-[10px] uppercase tracking-wider text-teal-200 font-bold flex items-center justify-center gap-1">
                <CalendarRange className="w-3 h-3 text-cyan-300" />
                <span>Schedule</span>
              </div>
              <div className="text-xl font-black font-mono text-cyan-300 tabular-nums mt-0.5">
                {schedulePeriods.length}
              </div>
              <div className="text-[10px] text-teal-300">Periods</div>
            </button>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 px-3.5 border border-white/15 text-center min-w-[85px]">
              <div className="text-[10px] uppercase tracking-wider text-teal-200 font-bold">Certificates</div>
              <div className="text-xl font-black font-mono text-white tabular-nums mt-0.5">
                {myCertificates.length}
              </div>
              <div className="text-[10px] text-teal-300">Earned</div>
            </div>

            <button
              onClick={openAiChat}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold p-2.5 px-3.5 rounded-2xl flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Bot className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] uppercase tracking-wider">Ask AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Registered Events & Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: My Registered Events with QR Pass */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#086a7e] dark:text-teal-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  My Class Event Registrations ({myRegisteredEvents.length})
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('events')}
                className="text-xs font-bold text-[#086a7e] dark:text-teal-400 hover:underline"
              >
                Browse All &rarr;
              </button>
            </div>

            {myRegisteredEvents.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
                <CalendarDays className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-800 dark:text-white">No active event registrations</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Browse scheduled class competitions, workshops, and sports tournaments to register for your spot.
                </p>
                <button
                  onClick={() => setActiveTab('events')}
                  className="mt-2 px-4 py-2 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-xl shadow-xs"
                >
                  View Upcoming Events
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myRegisteredEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl border border-teal-100 dark:border-teal-900 bg-teal-50/40 dark:bg-teal-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-teal-300 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300">
                        {ev.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{ev.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>{ev.date} · {ev.venue}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedEventForQr(ev)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#086a7e] text-white hover:bg-[#065464] rounded-xl shadow-xs transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR Ticket</span>
                      </button>
                      <button
                        onClick={() => cancelRegistration(ev.id)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Show QR ticket at the class registration desk for check-in.</span>
          </div>
        </div>

        {/* Right: My Issued Certificates */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  My Official Certificates ({myCertificates.length})
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('my-certificates')}
                className="text-xs font-bold text-[#086a7e] dark:text-teal-400 hover:underline"
              >
                View Vault &rarr;
              </button>
            </div>

            {myCertificates.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
                <Award className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-800 dark:text-white">No certificates awarded yet</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Certificates are automatically issued by the Class Admin after event participation and competition conclusions.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-2xl border border-amber-200/70 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
                        <Award className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{cert.eventTitle}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {cert.role} · Code: <code className="font-mono text-[#086a7e] dark:text-teal-400">{cert.verificationCode}</code>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onViewCertificate(cert.id)}
                      className="px-3 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-200/80 dark:bg-amber-950/80 hover:bg-amber-300 rounded-xl transition-colors shrink-0"
                    >
                      View / Print
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>All certificates include digital signature & QR verification.</span>
          </div>
        </div>

      </div>

      {/* Class Bulletins & Notices Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Official Class Bulletins & Notices</h3>
          </div>
          <button
            onClick={() => setActiveTab('notices')}
            className="text-xs font-bold text-[#086a7e] dark:text-teal-400 hover:underline"
          >
            All Notices &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestNotices.map((notice) => (
            <div key={notice.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  notice.category === 'urgent' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {notice.category}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2">{notice.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-3 leading-relaxed">
                  {notice.content}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>{notice.publishedDate}</span>
                <span>{notice.publishedBy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital QR Entry Pass Modal */}
      {selectedEventForQr && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <img
              src="/assets/aistudio/f166505f-a49d-44a3-aea5-f2fc3758a9fa_9e956595.png"
              alt="Najah Portal Logo"
              className="w-12 h-12 mx-auto mb-2"
            />
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#086a7e] dark:text-teal-400">
              Official Class Digital Pass
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
              {selectedEventForQr.title}
            </h3>
            
            {/* Fake QR Graphic Simulation */}
            <div className="my-5 p-4 rounded-2xl bg-slate-900 text-white inline-block shadow-inner">
              <div className="w-40 h-40 bg-white p-2 rounded-xl flex items-center justify-center">
                <svg className="w-36 h-36" viewBox="0 0 100 100" fill="#073642">
                  <rect x="0" y="0" width="30" height="30" rx="4" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />
                  
                  <rect x="70" y="0" width="30" height="30" rx="4" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" />

                  <rect x="0" y="70" width="30" height="30" rx="4" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" />

                  <rect x="35" y="10" width="8" height="8" />
                  <rect x="48" y="10" width="14" height="6" />
                  <rect x="38" y="25" width="20" height="6" />
                  <rect x="10" y="45" width="15" height="8" />
                  <rect x="35" y="40" width="30" height="20" />
                  <rect x="75" y="45" width="18" height="8" />
                  <rect x="40" y="70" width="12" height="12" />
                  <rect x="60" y="70" width="25" height="10" />
                  <rect x="45" y="88" width="35" height="8" />
                </svg>
              </div>
              <div className="text-[10px] font-mono text-teal-300 mt-2">
                PASS: {student?.rollNo} · {selectedEventForQr.id}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 text-left space-y-1 mb-4">
              <div><strong>Attendee:</strong> {student?.name} ({student?.rollNo})</div>
              <div><strong>Date & Time:</strong> {selectedEventForQr.date} ({selectedEventForQr.time})</div>
              <div><strong>Venue:</strong> {selectedEventForQr.venue}</div>
            </div>

            <button
              onClick={() => setSelectedEventForQr(null)}
              className="w-full py-2.5 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-xl"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
