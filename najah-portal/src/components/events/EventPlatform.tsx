import React, { useState, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Users, 
  Plus, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  QrCode, 
  Award, 
  Search, 
  Filter, 
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CampusEvent, EventWinner } from '../../types';

interface EventPlatformProps {
  showCreateModalDirect?: boolean;
  onCloseCreateModal?: () => void;
}

export const EventPlatform: React.FC<EventPlatformProps> = ({
  showCreateModalDirect = false,
  onCloseCreateModal,
}) => {
  const { 
    currentUser, 
    students, 
    events, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    registerForEvent, 
    cancelRegistration,
    setEventWinners,
    checkInStudent,
    issueCertificate
  } = usePortal();

  const isAdmin = currentUser?.role === 'admin';
  const currentStudentId = !isAdmin && currentUser ? currentUser.id : null;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(showCreateModalDirect);

  // Selected event for Winners Modal
  const [editingWinnersEvent, setEditingWinnersEvent] = useState<CampusEvent | null>(null);
  const [winner1, setWinner1] = useState('');
  const [winner2, setWinner2] = useState('');
  const [winner3, setWinner3] = useState('');

  // Selected event for Check-In modal
  const [checkInEvent, setCheckInEvent] = useState<CampusEvent | null>(null);

  // New Event Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Tech');
  const [date, setDate] = useState('2026-11-25');
  const [time, setTime] = useState('10:00 AM - 04:00 PM');
  const [venue, setVenue] = useState('Main Class Hall');
  const [coordinator, setCoordinator] = useState('Class Event Committee');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800');
  const [rules, setRules] = useState('1. Open to all registered class students.\n2. Bring student ID card.\n3. Follow class rules.');

  // Countdown clock state
  const [timeLeft, setTimeLeft] = useState<{ [id: string]: { days: number; hours: number; minutes: number; seconds: number } }>({});

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const map: { [id: string]: { days: number; hours: number; minutes: number; seconds: number } } = {};

      events.forEach((ev) => {
        const target = new Date(`${ev.date} 09:00:00`).getTime();
        const diff = target - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          map[ev.id] = { days, hours, minutes, seconds };
        } else {
          map[ev.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });

      setTimeLeft(map);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [events]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !venue) return;

    createEvent({
      title,
      category: category.trim() || 'General',
      date,
      time,
      venue,
      maxCapacity: 9999,
      coordinator,
      description,
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
      status: 'upcoming',
      registrationOpen: true,
      rules: rules.split('\n').filter(r => r.trim().length > 0),
      winners: [],
    });

    setTitle('');
    setDescription('');
    setShowCreateModal(false);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  const handleSaveWinners = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWinnersEvent) return;

    const winnersList: EventWinner[] = [];
    if (winner1.trim()) winnersList.push({ position: '1st Place', studentName: winner1.trim() });
    if (winner2.trim()) winnersList.push({ position: '2nd Place', studentName: winner2.trim() });
    if (winner3.trim()) winnersList.push({ position: '3rd Place', studentName: winner3.trim() });

    setEventWinners(editingWinnersEvent.id, winnersList);
    setEditingWinnersEvent(null);
  };

  const handleIssueCertificatesToAttendees = (event: CampusEvent) => {
    const attendees = students.filter(s => event.registeredStudentIds.includes(s.id));
    if (attendees.length === 0) {
      alert('No students registered for this event yet.');
      return;
    }

    attendees.forEach((student) => {
      // Check if winner
      const isWinner = event.winners?.find(w => w.studentName.toLowerCase().includes(student.name.toLowerCase()));
      issueCertificate({
        studentId: student.id,
        studentName: student.name,
        studentRollNo: student.rollNo,
        eventTitle: event.title,
        eventDate: event.date,
        role: isWinner ? 'Winner' : 'Participant',
        signatureTitle: 'Dean of Student Affairs',
      });
    });

    alert(`Successfully generated certificates for ${attendees.length} registered students!`);
  };

  const categories = ['All', ...Array.from(new Set(['Tech', 'Sports', 'Cultural', 'Class', 'Workshop', 'Social', ...events.map((e) => (e.category === 'Academic' ? 'Class' : e.category))]))];

  const filteredEvents = events.filter((ev) => {
    const evCat = ev.category === 'Academic' ? 'Class' : ev.category;
    const matchesCat = activeCategory === 'All' || evCat === activeCategory;
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || ev.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#086a7e] mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Class Event Management Platform</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Events, Live Results & Check-In
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time countdowns, digital QR registration passes, and automated certificate generation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
            />
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#086a7e] text-white hover:bg-[#065464] transition-colors shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories Filter Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-[#086a7e] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((ev) => {
          const isRegistered = currentStudentId ? ev.registeredStudentIds.includes(currentStudentId) : false;
          const isAttended = currentStudentId ? ev.attendedStudentIds.includes(currentStudentId) : false;
          const timer = timeLeft[ev.id];
          const hasWinners = ev.winners && ev.winners.length > 0;

          return (
            <div
              key={ev.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all group"
            >
              <div>
                {/* Image Banner & Live Countdown Overlay */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={ev.bannerUrl}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#086a7e] shadow-xs">
                      {ev.category === 'Academic' ? 'Class' : ev.category}
                    </span>
                  </div>

                  {/* Live Countdown Timer */}
                  {timer && (timer.days > 0 || timer.hours > 0 || timer.minutes > 0 || timer.seconds > 0) && (
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                      <span className="flex items-center gap-1 text-amber-300 font-bold">
                        <Clock className="w-3.5 h-3.5 animate-spin" /> Starts in:
                      </span>
                      <span className="font-bold">
                        {timer.days}d {timer.hours}h {timer.minutes}m {timer.seconds}s
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 line-clamp-1 group-hover:text-[#086a7e] transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{ev.date} · {ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{ev.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">{ev.registeredStudentIds.length}</strong> Class Students Registered
                      </span>
                    </div>
                  </div>

                  {/* Winners Banner if announced */}
                  {hasWinners && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                      <div className="text-[11px] font-bold flex items-center gap-1.5 text-amber-800">
                        <Trophy className="w-3.5 h-3.5 text-amber-600" />
                        <span>Official Winners Announced:</span>
                      </div>
                      <div className="text-[11px] space-y-0.5">
                        {ev.winners?.map((w, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="font-semibold">{w.position}:</span>
                            <span className="font-bold text-slate-900">{w.studentName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-3 pt-3">
                {isAdmin ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setEditingWinnersEvent(ev);
                          setWinner1(ev.winners?.[0]?.studentName || '');
                          setWinner2(ev.winners?.[1]?.studentName || '');
                          setWinner3(ev.winners?.[2]?.studentName || '');
                        }}
                        className="font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{hasWinners ? 'Edit Winners' : 'Post Winners'}</span>
                      </button>

                      <button
                        onClick={() => handleIssueCertificatesToAttendees(ev)}
                        className="font-bold text-[#086a7e] hover:underline flex items-center gap-1"
                        title="Generate digital certificates for all registered attendees"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Issue Certificates</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <button
                        onClick={() => setCheckInEvent(ev)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Check-In Desk ({ev.attendedStudentIds.length})</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this event?')) deleteEvent(ev.id);
                        }}
                        className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {isRegistered ? (
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          Registered {isAttended && '· Checked In'}
                        </span>
                        <button
                          onClick={() => cancelRegistration(ev.id)}
                          className="text-xs font-semibold text-rose-600 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (currentStudentId) {
                            registerForEvent(ev.id);
                          } else {
                            alert('Please sign in as a student to register.');
                          }
                        }}
                        className="w-full py-2.5 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-xl shadow-xs transition-colors"
                      >
                        Register for Event
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Winners Announcement Modal (Admin) */}
      {editingWinnersEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-amber-700">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Post Official Winners</h3>
            </div>
            <p className="text-xs text-slate-500">
              Announce competition winners for {editingWinnersEvent.title}.
            </p>

            <form onSubmit={handleSaveWinners} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  🥇 1st Place Champion
                </label>
                <input
                  type="text"
                  placeholder="Student or Team Name"
                  value={winner1}
                  onChange={(e) => setWinner1(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  🥈 2nd Place Runner Up
                </label>
                <input
                  type="text"
                  placeholder="Student or Team Name"
                  value={winner2}
                  onChange={(e) => setWinner2(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  🥉 3rd Place
                </label>
                <input
                  type="text"
                  placeholder="Student or Team Name"
                  value={winner3}
                  onChange={(e) => setWinner3(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingWinnersEvent(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs"
                >
                  Publish Winners
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check-In Desk Modal (Admin) */}
      {checkInEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">QR Check-In Scanner Desk</h3>
                <p className="text-xs text-slate-400">{checkInEvent.title}</p>
              </div>
              <button
                onClick={() => setCheckInEvent(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                &times;
              </button>
            </div>

            <div className="my-4">
              <div className="text-xs font-bold text-slate-700 mb-2">Registered Attendees:</div>
              {checkInEvent.registeredStudentIds.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-400">
                  No students currently registered for this event.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {checkInEvent.registeredStudentIds.map((sId) => {
                    const student = students.find((s) => s.id === sId);
                    const isChecked = checkInEvent.attendedStudentIds.includes(sId);

                    return (
                      <div key={sId} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{student?.name || 'Student'}</div>
                          <div className="text-[10px] text-slate-400">{student?.rollNo} · {student?.department}</div>
                        </div>
                        {isChecked ? (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Checked In
                          </span>
                        ) : (
                          <button
                            onClick={() => checkInStudent(checkInEvent.id, sId)}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-lg shadow-xs"
                          >
                            Mark Arrived
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCheckInEvent(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close Desk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Publish New Class Event</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Set schedules, venue, live countdown date, and student registration limits.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Najah 24H AI Hackathon & Pitch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                />
              </div>

              {/* Category (Selectable & Fully Typeable) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Category *</label>
                  <span className="text-[10px] text-[#086a7e] dark:text-teal-400 font-semibold">Select preset or type your own</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    list="event-category-options"
                    placeholder="Type or select category (e.g. Workshop, Hackathon, Cultural...)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                  />
                  <datalist id="event-category-options">
                    <option value="Tech" />
                    <option value="Workshop" />
                    <option value="Cultural" />
                    <option value="Sports" />
                    <option value="Class" />
                    <option value="Seminar" />
                    <option value="Hackathon" />
                    <option value="Social" />
                  </datalist>
                </div>
                {/* Quick Selection Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Tech', 'Workshop', 'Cultural', 'Sports', 'Class', 'Social'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        category.toLowerCase() === cat.toLowerCase()
                          ? 'bg-[#086a7e] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time (Max Seats Capacity Removed) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM - 04:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Venue / Hall *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central Auditorium & Innovation Lab"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Event details, schedule, highlights..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rules & Guidelines</label>
                <textarea
                  rows={2}
                  placeholder="Separate each rule with a new line..."
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    if (onCloseCreateModal) onCloseCreateModal();
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-xl shadow-xs"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
