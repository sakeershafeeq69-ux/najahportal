import React, { useState, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileCheck,
  TrendingUp,
  Save,
  Filter,
  Check,
  X,
  Users
} from 'lucide-react';
import { AttendanceStatus } from '../../types';

export const AttendanceSystem: React.FC = () => {
  const { currentUser, students, attendance, markAttendance } = usePortal();
  const isAdmin = currentUser?.role === 'admin';

  // Date selection (default today)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Draft attendance for the selected date
  const [dailyStatuses, setDailyStatuses] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  // Initialize or load daily statuses whenever selectedDate or students change
  useEffect(() => {
    const existingRecords = attendance.filter((a) => a.date === selectedDate);
    const initialMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};

    students.forEach((student) => {
      const match = existingRecords.find((r) => r.studentId === student.id);
      if (match) {
        initialMap[student.id] = { status: match.status, remarks: match.remarks || '' };
      } else {
        // Default to present if not marked yet
        initialMap[student.id] = { status: 'present', remarks: '' };
      }
    });

    setDailyStatuses(initialMap);
  }, [selectedDate, students, attendance]);

  // Bulk actions
  const handleMarkAll = (status: AttendanceStatus) => {
    setDailyStatuses((prev) => {
      const next = { ...prev };
      students.forEach((s) => {
        next[s.id] = { ...next[s.id], status };
      });
      return next;
    });
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setDailyStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { remarks: '' }),
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setDailyStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: 'present' }),
        remarks,
      },
    }));
  };

  const handleSaveAttendance = () => {
    const records = Object.entries(dailyStatuses).map(([studentId, data]) => ({
      studentId,
      status: data.status,
      remarks: data.remarks,
    }));

    markAttendance(selectedDate, records);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2000);
  };

  // Metrics for Admin for selected date
  const totalStudents = students.length;
  const presentCount = Object.values(dailyStatuses).filter((d) => d.status === 'present').length;
  const absentCount = Object.values(dailyStatuses).filter((d) => d.status === 'absent').length;
  const lateCount = Object.values(dailyStatuses).filter((d) => d.status === 'late').length;
  const presentRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  // Student-specific metrics
  const myRecords = !isAdmin ? attendance.filter((a) => a.studentId === currentUser?.id) : [];
  const myTotal = myRecords.length;
  const myPresent = myRecords.filter((a) => a.status === 'present').length;
  const myAbsent = myRecords.filter((a) => a.status === 'absent').length;
  const myLate = myRecords.filter((a) => a.status === 'late').length;
  const myPercentage = myTotal > 0 ? Math.round((myPresent / myTotal) * 100) : 100;

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0b5e70] via-teal-700 to-sky-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-200">
            <CalendarCheck className="w-4 h-4 text-emerald-300" />
            <span>Class Daily Attendance System</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            {isAdmin ? 'Class Roll Call & Absent Management' : 'My Class Attendance Record'}
          </h2>
          <p className="text-xs text-teal-100 max-w-xl mt-1 leading-relaxed">
            {isAdmin
              ? 'Mark present, absent, late, and excused records for every class session. Students receive real-time updates.'
              : 'Keep track of your class attendance percentage, absence log, and eligibility for exams and events.'}
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2.5 shrink-0">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold focus:outline-hidden"
            />
            <button
              onClick={handleSaveAttendance}
              disabled={students.length === 0}
              className={`px-4 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                students.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Save Record</span>
            </button>
          </div>
        )}
      </div>

      {saveSuccessToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Attendance records for {selectedDate} saved successfully!</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin ? (
          <>
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Total Enrolled
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalStudents}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Present on {selectedDate}
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>{presentCount}</span>
                <span className="text-xs font-bold text-slate-400">({presentRate}%)</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Absent Today
              </div>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1.5">
                <XCircle className="w-5 h-5 text-rose-500" />
                <span>{absentCount}</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Late / Excused
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>{lateCount}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Attendance Rate
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                <TrendingUp className="w-5 h-5" />
                <span>{myPercentage}%</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Sessions Present
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {myPresent} / {myTotal || 1}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Absences Logged
              </div>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {myAbsent}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Eligibility Status
              </div>
              <div className="text-sm font-extrabold mt-1.5 text-emerald-600 dark:text-emerald-400">
                {myPercentage >= 75 ? 'Qualified (Good Standing)' : 'Warning (Below 75%)'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Admin Attendance Sheet View */}
      {isAdmin && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Class Attendance Roster — {selectedDate}
              </h3>
              <p className="text-xs text-slate-400">
                Tap Present, Absent, or Late for each student, then click &ldquo;Save Record&rdquo;.
              </p>
            </div>

            {/* Quick Bulk Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMarkAll('present')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-colors"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('absent')}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 text-xs font-bold transition-colors"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No students enrolled in this class yet
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Admin must add students in &ldquo;Manage Students&rdquo; before taking daily roll call.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student) => {
                const currentStatus = dailyStatuses[student.id]?.status || 'present';
                const currentRemarks = dailyStatuses[student.id]?.remarks || '';

                return (
                  <div
                    key={student.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 px-2 rounded-2xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {student.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Roll: {student.rollNo} • Dept: {student.department}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {/* Status Toggle Buttons */}
                      <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'present'
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'absent'
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'excused')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === 'excused'
                              ? 'bg-sky-500 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Excused
                        </button>
                      </div>

                      {/* Remarks Input */}
                      <input
                        type="text"
                        placeholder="Optional remarks..."
                        value={currentRemarks}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white max-w-[160px]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-3 flex justify-end">
            <button
              onClick={handleSaveAttendance}
              disabled={students.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0b5e70] to-teal-600 hover:to-teal-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              Save Daily Attendance
            </button>
          </div>
        </div>
      )}

      {/* Student View: Personal Log */}
      {!isAdmin && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              My Class Session Logs
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Total Logged: {myRecords.length} sessions
            </span>
          </div>

          {myRecords.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <CalendarCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No session attendance records found yet
              </div>
              <p className="text-xs text-slate-400">
                When your instructor marks roll call, your records will show here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {myRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Class Session: {rec.date}
                    </div>
                    {rec.remarks && (
                      <div className="text-[11px] text-slate-500 italic mt-0.5">
                        Remarks: {rec.remarks}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Marked by {rec.markedBy} at {rec.markedAt}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      rec.status === 'present'
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : rec.status === 'absent'
                        ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                        : rec.status === 'late'
                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : 'bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
