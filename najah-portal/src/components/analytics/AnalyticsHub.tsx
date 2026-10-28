import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  BarChart3, 
  Users, 
  CalendarDays, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Activity,
  PieChart
} from 'lucide-react';

export const AnalyticsHub: React.FC = () => {
  const { students, events, certificates, notices } = usePortal();

  const totalSeats = events.reduce((sum, e) => sum + (e.maxCapacity || 100), 0);
  const totalRegistrations = events.reduce((sum, e) => sum + e.registeredStudentIds.length, 0);
  const totalAttended = events.reduce((sum, e) => sum + e.attendedStudentIds.length, 0);

  const fillRate = totalSeats > 0 ? Math.round((totalRegistrations / totalSeats) * 100) : 0;
  const attendanceRate = totalRegistrations > 0 ? Math.round((totalAttended / totalRegistrations) * 100) : 0;

  // Category counts
  const categoryCounts: { [cat: string]: number } = {};
  events.forEach((ev) => {
    categoryCounts[ev.category] = (categoryCounts[ev.category] || 0) + ev.registeredStudentIds.length;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#086a7e] dark:text-teal-400 mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Class Intelligence & Growth Metrics</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Executive Analytics & Engagement
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time analytics on student turnout, capacity utilization, and event popularity.
        </p>
      </div>

      {/* 4 Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Students
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            {students.length}
          </div>
          <div className="text-[11px] text-teal-700 font-semibold mt-1">Admin-enrolled base</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Sign-Ups
          </span>
          <div className="text-2xl font-black text-[#086a7e] font-mono mt-1">
            {totalRegistrations}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across {events.length} events</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Capacity Fill Rate
          </span>
          <div className="text-2xl font-black text-amber-600 font-mono mt-1">
            {fillRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{totalRegistrations} of {totalSeats} seats</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Check-In Turnout
          </span>
          <div className="text-2xl font-black text-purple-600 font-mono mt-1">
            {attendanceRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{totalAttended} confirmed present</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Popular Events by Registration */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Event Popularity & Seat Fill</h3>
            <span className="text-xs font-mono text-[#086a7e] font-bold">{events.length} Events</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {events.map((ev) => {
              const capacity = ev.maxCapacity || 100;
              const pct = capacity > 0 ? Math.round((ev.registeredStudentIds.length / capacity) * 100) : 0;
              return (
                <div key={ev.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 truncate max-w-xs">{ev.title}</span>
                    <span className="font-mono text-slate-600 font-bold">
                      {ev.registeredStudentIds.length} Registered ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-[#086a7e] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Registration by Category */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Sign-Ups by Event Genre</h3>
            <span className="text-xs text-slate-400">Total: {totalRegistrations}</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const catPct = totalRegistrations > 0 ? Math.round((count / totalRegistrations) * 100) : 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{cat}</span>
                    <span className="font-mono text-slate-600 font-bold">{count} ({catPct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, catPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
