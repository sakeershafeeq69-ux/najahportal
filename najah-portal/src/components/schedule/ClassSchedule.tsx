import React, { useState, useMemo } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Weekday, SchedulePeriod, ScheduleDeadline } from '../../types';
import {
  CalendarRange,
  Clock,
  MapPin,
  User,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Filter,
  Printer,
  Sparkles,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Square,
  X,
  GraduationCap,
  Layers,
  ChevronRight
} from 'lucide-react';

const WEEKDAYS: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DEFAULT_DAYS: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Color Tag styling maps
const COLOR_THEMES: Record<
  SchedulePeriod['colorTag'],
  {
    bg: string;
    border: string;
    text: string;
    badge: string;
    dot: string;
    accent: string;
  }
> = {
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    border: 'border-teal-200 dark:border-teal-800/80',
    text: 'text-teal-950 dark:text-teal-200',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300',
    dot: 'bg-teal-500',
    accent: 'border-l-teal-600',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-200 dark:border-indigo-800/80',
    text: 'text-indigo-950 dark:text-indigo-200',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300',
    dot: 'bg-indigo-500',
    accent: 'border-l-indigo-600',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800/80',
    text: 'text-amber-950 dark:text-amber-200',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    dot: 'bg-amber-500',
    accent: 'border-l-amber-600',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800/80',
    text: 'text-emerald-950 dark:text-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    accent: 'border-l-emerald-600',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-800/80',
    text: 'text-purple-950 dark:text-purple-200',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
    dot: 'bg-purple-500',
    accent: 'border-l-purple-600',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800/80',
    text: 'text-rose-950 dark:text-rose-200',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
    dot: 'bg-rose-500',
    accent: 'border-l-rose-600',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-200 dark:border-sky-800/80',
    text: 'text-sky-950 dark:text-sky-200',
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300',
    dot: 'bg-sky-500',
    accent: 'border-l-sky-600',
  },
};

export const ClassSchedule: React.FC = () => {
  const {
    currentUser,
    schedulePeriods,
    scheduleDeadlines,
    addSchedulePeriod,
    deleteSchedulePeriod,
    addScheduleDeadline,
    toggleScheduleDeadline,
    deleteScheduleDeadline,
  } = usePortal();

  const isAdmin = currentUser?.role === 'admin';

  // Navigation & View States
  const [activeView, setActiveView] = useState<'grid' | 'agenda' | 'deadlines'>('grid');
  const [includeSaturday, setIncludeSaturday] = useState(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');

  // Today Detection
  const todayWeekday = useMemo<Weekday>(() => {
    const dayIndex = new Date().getDay();
    const map: Record<number, Weekday> = {
      0: 'Sunday' as Weekday,
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
    };
    return map[dayIndex] || 'Monday';
  }, []);

  const [agendaDay, setAgendaDay] = useState<Weekday>(() => {
    return WEEKDAYS.includes(todayWeekday) ? todayWeekday : 'Monday';
  });

  // Modal States
  const [showAddPeriodModal, setShowAddPeriodModal] = useState(false);
  const [showAddDeadlineModal, setShowAddDeadlineModal] = useState(false);

  // New Period Form State
  const [periodForm, setPeriodForm] = useState<{
    day: Weekday;
    startTime: string;
    endTime: string;
    subject: string;
    subjectCode: string;
    instructor: string;
    room: string;
    type: SchedulePeriod['type'];
    colorTag: SchedulePeriod['colorTag'];
    notes: string;
  }>({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:15',
    subject: '',
    subjectCode: '',
    instructor: '',
    room: '',
    type: 'Lecture',
    colorTag: 'teal',
    notes: '',
  });

  // New Deadline Form State
  const [deadlineForm, setDeadlineForm] = useState<{
    title: string;
    dueDate: string;
    dueTime: string;
    type: ScheduleDeadline['type'];
    priority: ScheduleDeadline['priority'];
    course: string;
    notes: string;
  }>({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '11:59 PM',
    type: 'Assignment',
    priority: 'high',
    course: '',
    notes: '',
  });

  // Days to show
  const activeDays = useMemo(() => {
    return includeSaturday ? WEEKDAYS : DEFAULT_DAYS;
  }, [includeSaturday]);

  // Unique Subjects for filter
  const uniqueSubjects = useMemo(() => {
    const set = new Set<string>();
    schedulePeriods.forEach((p) => {
      set.add(p.subjectCode);
    });
    return Array.from(set).sort();
  }, [schedulePeriods]);

  // Filtered Periods
  const filteredPeriods = useMemo(() => {
    return schedulePeriods.filter((p) => {
      if (selectedSubjectFilter !== 'ALL' && p.subjectCode !== selectedSubjectFilter) {
        return false;
      }
      return true;
    });
  }, [schedulePeriods, selectedSubjectFilter]);

  // Handle Add Period
  const handleCreatePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodForm.subject.trim() || !periodForm.subjectCode.trim()) return;

    addSchedulePeriod({
      day: periodForm.day,
      startTime: periodForm.startTime,
      endTime: periodForm.endTime,
      subject: periodForm.subject.trim(),
      subjectCode: periodForm.subjectCode.trim().toUpperCase(),
      instructor: periodForm.instructor.trim() || 'Class Instructor',
      room: periodForm.room.trim() || 'Class Room',
      type: periodForm.type,
      colorTag: periodForm.colorTag,
      notes: periodForm.notes.trim() || undefined,
    });

    setShowAddPeriodModal(false);
    setPeriodForm({
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:15',
      subject: '',
      subjectCode: '',
      instructor: '',
      room: '',
      type: 'Lecture',
      colorTag: 'teal',
      notes: '',
    });
  };

  // Handle Add Deadline
  const handleCreateDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadlineForm.title.trim() || !deadlineForm.course.trim()) return;

    addScheduleDeadline({
      title: deadlineForm.title.trim(),
      dueDate: deadlineForm.dueDate,
      dueTime: deadlineForm.dueTime.trim() || '11:59 PM',
      type: deadlineForm.type,
      priority: deadlineForm.priority,
      course: deadlineForm.course.trim(),
      notes: deadlineForm.notes.trim() || undefined,
    });

    setShowAddDeadlineModal(false);
    setDeadlineForm({
      title: '',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '11:59 PM',
      type: 'Assignment',
      priority: 'high',
      course: '',
      notes: '',
    });
  };

  // Sorted deadlines
  const sortedDeadlines = useMemo(() => {
    return [...scheduleDeadlines].sort((a, b) => {
      if (a.completed === b.completed) {
        return a.dueDate.localeCompare(b.dueDate);
      }
      return a.completed ? 1 : -1;
    });
  }, [scheduleDeadlines]);

  // Print schedule
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & Actions Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-[#0b5e70] dark:text-teal-400">
                <CalendarRange className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-extrabold text-black dark:text-white tracking-tight">
                  Class Schedule & Weekly Timetable
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Synchronized weekly periods, lecture halls, and upcoming course deadlines
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Print button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-2xs transition-colors"
              title="Print Timetable"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Saturday toggle */}
            <button
              onClick={() => setIncludeSaturday(!includeSaturday)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors border ${
                includeSaturday
                  ? 'bg-teal-50 text-[#0b5e70] border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-700'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {includeSaturday ? 'Mon - Sat' : 'Mon - Fri'}
            </button>

            {/* Admin Controls */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setShowAddDeadlineModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 text-xs font-bold shadow-2xs transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Add Deadline</span>
                </button>

                <button
                  onClick={() => setShowAddPeriodModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0b5e70] hover:bg-[#084857] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Schedule</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* View Switcher Tabs & Subject Filter */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              onClick={() => setActiveView('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-black dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Weekly Grid</span>
            </button>

            <button
              onClick={() => setActiveView('agenda')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'agenda'
                  ? 'bg-white dark:bg-slate-900 text-black dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Daily Agenda</span>
            </button>

            <button
              onClick={() => setActiveView('deadlines')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                activeView === 'deadlines'
                  ? 'bg-white dark:bg-slate-900 text-black dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Course Deadlines</span>
              {scheduleDeadlines.filter((d) => !d.completed).length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {scheduleDeadlines.filter((d) => !d.completed).length}
                </span>
              )}
            </button>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Subject:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-black dark:text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
            >
              <option value="ALL">All Subjects ({uniqueSubjects.length})</option>
              {uniqueSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Today Banner Highlights */}
      <div className="bg-gradient-to-r from-teal-500/10 via-[#0b5e70]/10 to-transparent dark:from-teal-950/40 dark:via-slate-900 border border-teal-500/20 dark:border-teal-800/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex flex-col items-center justify-center font-black shadow-xs shrink-0">
            <span className="text-[10px] uppercase tracking-wider leading-none">
              {new Date().toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            <span className="text-base leading-none mt-0.5">{new Date().getDate()}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-800 dark:text-teal-300">
                Current Class Day: {todayWeekday}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                <Sparkles className="w-2.5 h-2.5" />
                Live Schedule
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {schedulePeriods.filter((p) => p.day === todayWeekday).length > 0
                ? `${schedulePeriods.filter((p) => p.day === todayWeekday).length} recurring class periods scheduled for today.`
                : 'No recurring class periods scheduled for today.'}
            </p>
          </div>
        </div>

        {/* Quick Deadline Notice */}
        {sortedDeadlines.filter((d) => !d.completed).length > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              Next: {sortedDeadlines.find((d) => !d.completed)?.title} ({sortedDeadlines.find((d) => !d.completed)?.dueDate})
            </span>
          </div>
        )}
      </div>

      {/* 3. VIEW 1: Weekly Calendar Grid */}
      {activeView === 'grid' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-3.5">
            {activeDays.map((day) => {
              const isToday = day === todayWeekday;
              const periodsForDay = filteredPeriods
                .filter((p) => p.day === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              return (
                <div
                  key={day}
                  className={`flex flex-col rounded-2xl border transition-all ${
                    isToday
                      ? 'bg-teal-50/40 dark:bg-slate-900/90 border-[#0b5e70]/50 shadow-sm ring-2 ring-[#0b5e70]/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  {/* Day Header */}
                  <div
                    className={`p-3.5 border-b flex items-center justify-between rounded-t-2xl ${
                      isToday
                        ? 'bg-teal-600 text-white border-teal-700'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider">{day}</h3>
                      <p
                        className={`text-[10px] font-medium ${
                          isToday ? 'text-teal-100' : 'text-slate-400 dark:text-slate-400'
                        }`}
                      >
                        {periodsForDay.length} {periodsForDay.length === 1 ? 'Period' : 'Periods'}
                      </p>
                    </div>

                    {isToday && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-teal-800 shadow-2xs">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Day Periods List */}
                  <div className="p-2.5 flex-1 space-y-2.5 min-h-[360px]">
                    {periodsForDay.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500">
                        <Clock className="w-6 h-6 stroke-1 mb-1.5 opacity-60" />
                        <span className="text-xs font-medium">No class periods</span>
                      </div>
                    ) : (
                      periodsForDay.map((period) => {
                        const theme = COLOR_THEMES[period.colorTag] || COLOR_THEMES.teal;
                        return (
                          <div
                            key={period.id}
                            className={`p-3 rounded-xl border border-l-4 ${theme.accent} ${theme.bg} ${theme.border} transition-all shadow-2xs hover:shadow-xs group relative`}
                          >
                            {/* Header: Code & Type Badge */}
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[11px] font-extrabold font-mono text-black dark:text-white">
                                {period.subjectCode}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${theme.badge}`}
                              >
                                {period.type}
                              </span>
                            </div>

                            {/* Subject Title */}
                            <h4 className="text-xs font-bold text-black dark:text-white leading-snug line-clamp-2">
                              {period.subject}
                            </h4>

                            {/* Time & Location */}
                            <div className="mt-2 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                              <div className="flex items-center gap-1.5 font-medium">
                                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="font-semibold text-black dark:text-slate-200">
                                  {period.startTime} - {period.endTime}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{period.room}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <User className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{period.instructor}</span>
                              </div>
                            </div>

                            {/* Admin Delete Action */}
                            {isAdmin && (
                              <button
                                onClick={() => deleteSchedulePeriod(period.id)}
                                className="absolute top-2 right-2 p-1 rounded-md text-rose-500 hover:text-white hover:bg-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                                title="Delete Class Period"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. VIEW 2: Daily Agenda View */}
      {activeView === 'agenda' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
          {/* Day selection tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            {activeDays.map((d) => (
              <button
                key={d}
                onClick={() => setAgendaDay(d)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  agendaDay === d
                    ? 'bg-[#0b5e70] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{d}</span>
                {d === todayWeekday && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Today" />
                )}
              </button>
            ))}
          </div>

          {/* Agenda items for selected day */}
          <div className="space-y-3">
            {filteredPeriods.filter((p) => p.day === agendaDay).length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  No classes scheduled for {agendaDay}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Enjoy your study or project preparation time.
                </p>
              </div>
            ) : (
              filteredPeriods
                .filter((p) => p.day === agendaDay)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((period, idx) => {
                  const theme = COLOR_THEMES[period.colorTag] || COLOR_THEMES.teal;
                  return (
                    <div
                      key={period.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-400/50 bg-slate-50/50 dark:bg-slate-800/40 transition-all"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        {/* Time Stamp Box */}
                        <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center shrink-0 min-w-[90px] shadow-2xs">
                          <span className="text-xs font-black text-black dark:text-white block">
                            {period.startTime}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold block">
                            to {period.endTime}
                          </span>
                        </div>

                        {/* Class Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black font-mono text-[#0b5e70] dark:text-teal-400">
                              {period.subjectCode}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badge}`}>
                              {period.type}
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-black dark:text-white mt-0.5">
                            {period.subject}
                          </h4>

                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {period.room}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              {period.instructor}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side status / delete */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-teal-50 text-[#0b5e70] dark:bg-teal-950/70 dark:text-teal-300">
                          Period #{idx + 1}
                        </span>

                        {isAdmin && (
                          <button
                            onClick={() => deleteSchedulePeriod(period.id)}
                            className="p-1.5 rounded-xl text-rose-500 hover:text-white hover:bg-rose-600 transition-colors"
                            title="Delete Period"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* 5. VIEW 3: Course & Event Deadlines */}
      {activeView === 'deadlines' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-black dark:text-white">
                Upcoming Course Milestones & Event Deadlines
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track assignments, project deliverables, quizzes, and class event submissions
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAddDeadlineModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b5e70] hover:bg-[#084857] text-white text-xs font-bold shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Deadline</span>
              </button>
            )}
          </div>

          {/* Deadlines List */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedDeadlines.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-80" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  All caught up! No active deadlines.
                </p>
              </div>
            ) : (
              sortedDeadlines.map((dl) => (
                <div
                  key={dl.id}
                  className={`py-3.5 flex items-center justify-between gap-3 transition-colors ${
                    dl.completed ? 'opacity-60 line-through' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (isAdmin) {
                          toggleScheduleDeadline(dl.id);
                        }
                      }}
                      disabled={!isAdmin}
                      className={`p-1 ${isAdmin ? 'text-slate-400 hover:text-teal-600 cursor-pointer' : 'text-slate-400 cursor-default'}`}
                      title={isAdmin ? (dl.completed ? 'Mark pending' : 'Mark completed') : (dl.completed ? 'Completed' : 'Pending')}
                    >
                      {dl.completed ? (
                        <CheckSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-black dark:text-white">
                          {dl.title}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {dl.course}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            dl.priority === 'high'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                              : dl.priority === 'medium'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                          }`}
                        >
                          {dl.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>
                          Due: {dl.dueDate} at {dl.dueTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={() => deleteScheduleDeadline(dl.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Deadline"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 6. ADMIN MODAL: Add Class Period */}
      {showAddPeriodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-[#0b5e70] dark:text-teal-400">
                  <CalendarRange className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-black dark:text-white">
                    Publish New Class Schedule
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add a recurring class timetable schedule slot
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddPeriodModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePeriod} className="space-y-4">
              {/* Day selection */}
              <div>
                <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                  Day of the Week
                </label>
                <select
                  value={periodForm.day}
                  onChange={(e) => setPeriodForm({ ...periodForm, day: e.target.value as Weekday })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                >
                  {WEEKDAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Title & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={periodForm.subject}
                    onChange={(e) => setPeriodForm({ ...periodForm, subject: e.target.value })}
                    placeholder="e.g. Algorithms & Data Structures"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-400 text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={periodForm.subjectCode}
                    onChange={(e) => setPeriodForm({ ...periodForm, subjectCode: e.target.value })}
                    placeholder="CS-301"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-400 text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none font-mono uppercase"
                  />
                </div>
              </div>

              {/* Start & End Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={periodForm.startTime}
                    onChange={(e) => setPeriodForm({ ...periodForm, startTime: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={periodForm.endTime}
                    onChange={(e) => setPeriodForm({ ...periodForm, endTime: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                  />
                </div>
              </div>

              {/* Instructor & Hall / Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={periodForm.instructor}
                    onChange={(e) => setPeriodForm({ ...periodForm, instructor: e.target.value })}
                    placeholder="e.g. Dr. Kareem Al-Husseini"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-400 text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                    Room / Hall
                  </label>
                  <input
                    type="text"
                    value={periodForm.room}
                    onChange={(e) => setPeriodForm({ ...periodForm, room: e.target.value })}
                    placeholder="Hall 302, Science Bldg"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-400 text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                  />
                </div>
              </div>

              {/* Type & Color theme */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                    Period Type
                  </label>
                  <select
                    value={periodForm.type}
                    onChange={(e) =>
                      setPeriodForm({ ...periodForm, type: e.target.value as SchedulePeriod['type'] })
                    }
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                    Color Accent
                  </label>
                  <select
                    value={periodForm.colorTag}
                    onChange={(e) =>
                      setPeriodForm({
                        ...periodForm,
                        colorTag: e.target.value as SchedulePeriod['colorTag'],
                      })
                    }
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                  >
                    <option value="teal">Teal Classic</option>
                    <option value="indigo">Indigo Tech</option>
                    <option value="amber">Amber Warm</option>
                    <option value="emerald">Emerald Nature</option>
                    <option value="purple">Purple Creative</option>
                    <option value="rose">Rose Bold</option>
                    <option value="sky">Sky Blue</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPeriodModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0b5e70] hover:bg-[#084857] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
                >
                  Publish Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. ADMIN MODAL: Add Course Deadline */}
      {showAddDeadlineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400">
                  <CheckSquare className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-black dark:text-white">
                    Publish Course Deadline
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add milestone, assignment or exam due date
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddDeadlineModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeadline} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                  Milestone / Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={deadlineForm.title}
                  onChange={(e) => setDeadlineForm({ ...deadlineForm, title: e.target.value })}
                  placeholder="e.g. Midterm Project Phase 1 Submission"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-400 text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                  Course Code / Name *
                </label>
                <input
                  type="text"
                  required
                  value={deadlineForm.course}
                  onChange={(e) => setDeadlineForm({ ...deadlineForm, course: e.target.value })}
                  placeholder="CS-301 or Algorithms"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-400 text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={deadlineForm.dueDate}
                    onChange={(e) => setDeadlineForm({ ...deadlineForm, dueDate: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                    Due Time
                  </label>
                  <input
                    type="text"
                    value={deadlineForm.dueTime}
                    onChange={(e) => setDeadlineForm({ ...deadlineForm, dueTime: e.target.value })}
                    placeholder="11:59 PM"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-400 text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                    Category
                  </label>
                  <select
                    value={deadlineForm.type}
                    onChange={(e) =>
                      setDeadlineForm({
                        ...deadlineForm,
                        type: e.target.value as ScheduleDeadline['type'],
                      })
                    }
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Project">Project</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Exam">Exam</option>
                    <option value="Event Deadline">Event Deadline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                    Priority
                  </label>
                  <select
                    value={deadlineForm.priority}
                    onChange={(e) =>
                      setDeadlineForm({
                        ...deadlineForm,
                        priority: e.target.value as ScheduleDeadline['priority'],
                      })
                    }
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#0b5e70] outline-none"
                  >
                    <option value="high">High (Urgent)</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDeadlineModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
                >
                  Save Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
