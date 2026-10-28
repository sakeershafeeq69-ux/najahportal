import React, { useState, useMemo } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  CalendarCheck,
  Trophy,
  Award,
  Filter,
  Sparkles,
  UserCheck,
  Clock,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const COLORS = ['#086a7e', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const ClassPerformanceDashboard: React.FC = () => {
  const { students, attendance, events, rewards } = usePortal();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'all' | '30days' | '7days'>('all');

  // Overall Class Attendance Rate
  const attendanceMetrics = useMemo(() => {
    if (attendance.length === 0) {
      return { total: 0, present: 0, absent: 0, late: 0, excused: 0, rate: 0 };
    }
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === 'present').length;
    const absent = attendance.filter((a) => a.status === 'absent').length;
    const late = attendance.filter((a) => a.status === 'late').length;
    const excused = attendance.filter((a) => a.status === 'excused').length;
    const rate = Math.round(((present + late * 0.5) / (total || 1)) * 100);

    return { total, present, absent, late, excused, rate };
  }, [attendance]);

  // Attendance Status Distribution for PieChart
  const statusPieData = useMemo(() => {
    if (attendance.length === 0) {
      return [
        { name: 'Present', value: 1, color: '#10b981' },
        { name: 'Late', value: 0, color: '#f59e0b' },
        { name: 'Excused', value: 0, color: '#086a7e' },
        { name: 'Absent', value: 0, color: '#ef4444' },
      ];
    }
    return [
      { name: 'Present', value: attendanceMetrics.present, color: '#10b981' },
      { name: 'Late', value: attendanceMetrics.late, color: '#f59e0b' },
      { name: 'Excused', value: attendanceMetrics.excused, color: '#086a7e' },
      { name: 'Absent', value: attendanceMetrics.absent, color: '#ef4444' },
    ];
  }, [attendance, attendanceMetrics]);

  // Daily/Weekly Trend data for AreaChart
  const attendanceTrendData = useMemo(() => {
    // Group records by date
    const dateMap = new Map<string, { date: string; present: number; total: number; rate: number }>();

    attendance.forEach((rec) => {
      const existing = dateMap.get(rec.date) || { date: rec.date, present: 0, total: 0, rate: 0 };
      existing.total += 1;
      if (rec.status === 'present') existing.present += 1;
      else if (rec.status === 'late') existing.present += 0.5;
      dateMap.set(rec.date, existing);
    });

    const dates = Array.from(dateMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((item) => ({
        ...item,
        rate: Math.round((item.present / (item.total || 1)) * 100),
      }));

    if (dates.length === 0) {
      // Default baseline preview points if no attendance has been marked yet
      return [
        { date: 'Mon', rate: 95, present: 19, total: 20 },
        { date: 'Tue', rate: 92, present: 18, total: 20 },
        { date: 'Wed', rate: 98, present: 20, total: 20 },
        { date: 'Thu', rate: 94, present: 19, total: 20 },
        { date: 'Fri', rate: 96, present: 19, total: 20 },
      ];
    }

    return dates.slice(-14);
  }, [attendance]);

  // Event & Category Participation Bar Data
  const categoryParticipationData = useMemo(() => {
    const categories = ['Tech', 'Cultural', 'Sports', 'Class', 'Workshop'];
    return categories.map((cat) => {
      const catEvents = events.filter((e) => {
        const evCat = e.category === 'Academic' ? 'Class' : e.category;
        return evCat === cat;
      });
      const totalSignups = catEvents.reduce((acc, curr) => acc + (curr.registeredStudentIds?.length || 0), 0);
      const totalAttendees = catEvents.reduce((acc, curr) => acc + (curr.attendedStudentIds?.length || 0), 0);
      return {
        category: cat,
        events: catEvents.length,
        signups: totalSignups,
        attendees: totalAttendees,
      };
    });
  }, [events]);

  // Individual Student Performance Metrics
  const selectedStudent = useMemo(() => {
    if (selectedStudentId === 'all') return null;
    return students.find((s) => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  const studentMetrics = useMemo(() => {
    if (!selectedStudent) return null;
    const studentRecords = attendance.filter((a) => a.studentId === selectedStudent.id);
    const totalDays = studentRecords.length;
    const presentDays = studentRecords.filter((a) => a.status === 'present').length;
    const lateDays = studentRecords.filter((a) => a.status === 'late').length;
    const rate = totalDays > 0 ? Math.round(((presentDays + lateDays * 0.5) / totalDays) * 100) : 100;

    const studentEvents = events.filter((e) => e.registeredStudentIds?.includes(selectedStudent.id)).length;
    const studentRewards = rewards.filter((r) => r.studentId === selectedStudent.id);
    const totalPoints = studentRewards.reduce((sum, r) => sum + r.points, selectedStudent.rewardPoints || 0);

    return {
      totalDays,
      presentDays,
      lateDays,
      rate,
      eventsCount: studentEvents,
      points: totalPoints,
      badges: studentRewards.length,
    };
  }, [selectedStudent, attendance, events, rewards]);

  // Comparative metrics: Selected Student vs Class Average
  const comparisonData = useMemo(() => {
    if (!selectedStudent || !studentMetrics) return [];
    const avgAttendance = attendanceMetrics.rate || 90;
    const avgEvents = students.length > 0 ? Math.round(events.length / students.length) : 1;
    const avgPoints = students.length > 0
      ? Math.round(rewards.reduce((s, r) => s + r.points, 0) / (students.length || 1))
      : 25;

    return [
      {
        metric: 'Attendance Rate (%)',
        Student: studentMetrics.rate,
        ClassAvg: avgAttendance,
      },
      {
        metric: 'Events Joined',
        Student: studentMetrics.eventsCount,
        ClassAvg: avgEvents,
      },
      {
        metric: 'Reward Points',
        Student: Math.min(studentMetrics.points, 100),
        ClassAvg: Math.min(avgPoints, 100),
      },
    ];
  }, [selectedStudent, studentMetrics, attendanceMetrics, students, events, rewards]);

  // Top Participating Students
  const topStudents = useMemo(() => {
    return [...students]
      .map((std) => {
        const studentRewards = rewards.filter((r) => r.studentId === std.id);
        const pts = studentRewards.reduce((sum, r) => sum + r.points, std.rewardPoints || 0);
        const eventsCount = events.filter((e) => e.registeredStudentIds?.includes(std.id)).length;
        const studentAtt = attendance.filter((a) => a.studentId === std.id);
        const pres = studentAtt.filter((a) => a.status === 'present').length;
        const rate = studentAtt.length > 0 ? Math.round((pres / studentAtt.length) * 100) : 100;
        return {
          ...std,
          totalPoints: pts,
          eventsCount,
          attendanceRate: rate,
        };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints || b.eventsCount - a.eventsCount)
      .slice(0, 5);
  }, [students, rewards, events, attendance]);

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#086a7e] dark:text-teal-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Class Performance Analytics</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Class Performance Dashboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time individual and group attendance trends, event participation, and engagement charts powered by Recharts.
          </p>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">View:</span>
          </div>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
          >
            <option value="all">Entire Class (Group View)</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Class Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#086a7e] dark:text-teal-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {attendanceMetrics.rate}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{attendance.length > 0 ? `${attendanceMetrics.present} Present Records` : 'Active Session'}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Enrolled Students</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {students.length}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {students.length > 0 ? 'Admin-managed roster' : 'Ready for admin additions'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Class Events</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {events.length}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {events.filter((e) => e.status === 'upcoming').length} Upcoming
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Reward Stars</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {rewards.reduce((s, r) => s + r.points, 0)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {rewards.length} badges awarded
          </div>
        </div>
      </div>

      {/* 3. Recharts Section: Group Attendance Trends & Attendance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attendance Trends AreaChart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Attendance Rate Trend (%)</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Chronological class attendance performance over time</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#086a7e] dark:text-teal-400">
              Target: 95%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#086a7e" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#086a7e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Attendance Rate']}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#086a7e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#attendanceGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Breakdown Donut PieChart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Attendance Breakdown</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Roll call status distribution</p>
            
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {statusPieData.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600 dark:text-slate-400">{s.name}:</span>
                <span className="font-bold text-slate-900 dark:text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Student Individual Drilldown (When a student is picked) OR Category BarChart */}
      {selectedStudent && studentMetrics ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-teal-200 dark:border-teal-900/60 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-[#086a7e]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedStudent.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-[#086a7e] dark:text-teal-400">
                    {selectedStudent.rollNo}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{selectedStudent.department} · {selectedStudent.email}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudentId('all')}
              className="text-xs font-bold text-[#086a7e] dark:text-teal-400 hover:underline"
            >
              ← Back to Group View
            </button>
          </div>

          {/* Student Specific Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Individual Attendance</span>
              <div className="text-2xl font-black text-[#086a7e] dark:text-teal-400 mt-1">
                {studentMetrics.rate}%
              </div>
              <span className="text-[10px] text-slate-400">{studentMetrics.presentDays} of {studentMetrics.totalDays} sessions</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Events Registered</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {studentMetrics.eventsCount}
              </div>
              <span className="text-[10px] text-slate-400">Competitions & workshops</span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Reward Points</span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {studentMetrics.points}
              </div>
              <span className="text-[10px] text-slate-400">{studentMetrics.badges} Badges earned</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Engagement Rating</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {studentMetrics.rate > 85 ? 'Exemplary' : 'Good Standing'}
              </div>
              <span className="text-[10px] text-slate-400">Class honors track</span>
            </div>
          </div>

          {/* Student vs Class Average Bar Chart */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Student vs Class Average Comparison
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="metric" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Student" fill="#086a7e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="ClassAvg" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        /* Event Category Participation Bar Chart */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Participation Metrics by Category
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Number of registered student signups across Tech, Sports, and Cultural programs
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {events.length} Total Events
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryParticipationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="signups" name="Student Signups" fill="#086a7e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="attendees" name="Verified Attendees" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 5. Top Class Performers Leaderboard */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Class Participation & Attendance Honor Roll
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-bold">Top 5 Leaders</span>
        </div>

        {topStudents.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No student records yet. When the administrator adds students and records attendance, the leaderboard will display here.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topStudents.map((std, idx) => (
              <div
                key={std.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 px-2 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    idx === 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                    idx === 1 ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200' :
                    idx === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300' :
                    'text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <img
                    src={std.avatar}
                    alt={std.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {std.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Roll No: {std.rollNo} · {std.department}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right hidden sm:block">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{std.attendanceRate}%</span>
                    <div className="text-[10px] text-slate-400">Attendance</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-purple-600 dark:text-purple-400">⭐ {std.totalPoints} pts</span>
                    <div className="text-[10px] text-slate-400">{std.eventsCount} Events</div>
                  </div>
                  <button
                    onClick={() => setSelectedStudentId(std.id)}
                    className="px-2.5 py-1 text-[11px] font-bold text-[#086a7e] dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 rounded-xl hover:bg-teal-100 transition-colors"
                  >
                    View Drilldown
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
