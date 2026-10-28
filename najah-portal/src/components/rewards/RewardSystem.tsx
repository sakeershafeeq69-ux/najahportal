import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  Trophy,
  Star,
  Medal,
  Zap,
  Crown,
  Sparkles,
  Award,
  Plus,
  Trash2,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { RewardRecord } from '../../types';

export const RewardSystem: React.FC = () => {
  const { currentUser, students, rewards, addReward, deleteReward } = usePortal();
  const isAdmin = currentUser?.role === 'admin';

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [title, setTitle] = useState('Class Excellence Star');
  const [points, setPoints] = useState<number>(50);
  const [category, setCategory] = useState<RewardRecord['category']>('Class');
  const [badgeIcon, setBadgeIcon] = useState<RewardRecord['badgeIcon']>('star');
  const [notes, setNotes] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [successToast, setSuccessToast] = useState(false);

  // Student ranking calculation
  const rankedStudents = [...students].sort(
    (a, b) => (b.rewardPoints || 0) - (a.rewardPoints || 0)
  );

  const studentRank = !isAdmin
    ? rankedStudents.findIndex((s) => s.id === currentUser?.id) + 1
    : 0;

  const currentStudentRewards = !isAdmin
    ? rewards.filter((r) => r.studentId === currentUser?.id)
    : rewards;

  const filteredRewards = filterCategory === 'all'
    ? currentStudentRewards
    : currentStudentRewards.filter((r) => {
        if (filterCategory === 'Class') {
          return r.category === 'Class' || (r.category as string) === 'Academic';
        }
        return r.category === filterCategory;
      });

  const totalPointsAwarded = rewards.reduce((acc, r) => acc + r.points, 0);

  const renderBadgeIcon = (icon: RewardRecord['badgeIcon'], className = 'w-5 h-5') => {
    switch (icon) {
      case 'trophy':
        return <Trophy className={`${className} text-amber-500`} />;
      case 'medal':
        return <Medal className={`${className} text-indigo-500`} />;
      case 'zap':
        return <Zap className={`${className} text-emerald-500`} />;
      case 'crown':
        return <Crown className={`${className} text-amber-400`} />;
      case 'sparkles':
        return <Sparkles className={`${className} text-purple-500`} />;
      case 'award':
        return <Award className={`${className} text-rose-500`} />;
      case 'star':
      default:
        return <Star className={`${className} text-amber-400 fill-amber-400`} />;
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert('Please select a student to award.');
      return;
    }

    addReward({
      studentId: selectedStudentId,
      title: title.trim(),
      points: Number(points) || 10,
      category,
      badgeIcon,
      notes: notes.trim(),
    });

    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2000);
    setShowAddModal(false);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0b5e70] via-teal-700 to-emerald-700 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-200">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Class Recognition Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            {isAdmin ? 'Class Reward & Merit Management' : 'My Star Badges & Achievements'}
          </h2>
          <p className="text-xs text-teal-100 max-w-xl mt-1 leading-relaxed">
            {isAdmin
              ? 'Award performance points, star badges, and achievements to students for class excellence, events, discipline, and leadership.'
              : 'Earn points and badges for participating in class events, class accomplishments, and stellar attendance.'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            disabled={students.length === 0}
            className={`px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0 ${
              students.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Award Points / Badge</span>
          </button>
        )}
      </div>

      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Reward successfully granted and student score updated!</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin ? (
          <>
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Total Badges Awarded
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {rewards.length}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Total Star Points Given
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-amber-400" />
                <span>{totalPointsAwarded}</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Top Performer
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1 truncate">
                {rankedStudents[0]?.name || 'No students enrolled'}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Class Participation
              </div>
              <div className="text-2xl font-black text-[#0b5e70] dark:text-teal-400 mt-1">
                {students.filter((s) => (s.rewardPoints || 0) > 0).length} / {students.length}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                My Total Star Points
              </div>
              <div className="text-2xl font-black text-amber-500 flex items-center gap-1.5 mt-1">
                <Star className="w-5 h-5 fill-amber-400" />
                <span>{(currentUser as any)?.rewardPoints || 0}</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                My Badges Earned
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {currentStudentRewards.length}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Class Standing
              </div>
              <div className="text-2xl font-black text-[#0b5e70] dark:text-teal-400 mt-1 flex items-center gap-1.5">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span>Rank #{studentRank > 0 ? studentRank : 1}</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                Status
              </div>
              <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                Active Scholar
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Grid: Leaderboard & Awards List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Awards Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#0b5e70]" />
              <span>{isAdmin ? 'All Class Awards & Badges' : 'My Earned Recognitions'}</span>
            </h3>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['all', 'Class', 'Attendance', 'Conduct', 'Event', 'Leadership', 'Creativity'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                    filterCategory === cat
                      ? 'bg-[#0b5e70] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          {filteredRewards.length === 0 ? (
            <div className="p-10 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-2">
              <Trophy className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No rewards recorded in this view
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {isAdmin
                  ? 'Click "Award Points / Badge" to grant merits to students.'
                  : 'Participate actively in class events and assignments to earn your badges!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between gap-4 transition-all hover:border-teal-500/30"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
                      {renderBadgeIcon(reward.badgeIcon, 'w-6 h-6')}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {reward.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/70 text-[#0b5e70] dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                          {(reward.category as string) === 'Academic' ? 'Class' : reward.category}
                        </span>
                      </div>

                      {isAdmin && (
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                          Student: {reward.studentName} <span className="text-slate-400 font-mono text-[11px]">({reward.studentRollNo})</span>
                        </div>
                      )}

                      {reward.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                          &ldquo;{reward.notes}&rdquo;
                        </p>
                      )}

                      <div className="text-[10px] text-slate-400 mt-2 font-mono">
                        Awarded on {reward.awardedDate} by {reward.awardedBy}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-black text-xs flex items-center gap-1 shadow-2xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>+{reward.points} Pts</span>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => deleteReward(reward.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete reward"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Class Leaderboard */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Class Leaderboard</span>
          </h3>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            {rankedStudents.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-6">
                No students enrolled yet. Admin can enroll students in Student Management.
              </div>
            ) : (
              rankedStudents.map((std, index) => {
                const isTop3 = index < 3;
                const isSelf = !isAdmin && std.id === currentUser?.id;

                return (
                  <div
                    key={std.id}
                    className={`p-3 rounded-2xl flex items-center justify-between gap-3 border transition-all ${
                      isSelf
                        ? 'bg-[#e6f7f7] dark:bg-teal-950/60 border-teal-300 dark:border-teal-700 font-bold'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0">
                        {index === 0 && <span className="text-base">🥇</span>}
                        {index === 1 && <span className="text-base">🥈</span>}
                        {index === 2 && <span className="text-base">🥉</span>}
                        {index > 2 && <span className="text-slate-500 text-xs">#{index + 1}</span>}
                      </div>

                      <img
                        src={std.avatar}
                        alt={std.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shrink-0"
                      />

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {std.name} {isSelf && '(You)'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          Roll: {std.rollNo}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1 justify-end">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{std.rewardPoints || 0}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {std.badgesCount || 0} badges
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Admin "+ Award Points / Badge" Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Grant Class Award</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Add Star Points & Badges</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
              {/* Select Student */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Student *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  required
                >
                  <option value="">— Select a student —</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo}) - Current: {s.rewardPoints || 0} pts
                    </option>
                  ))}
                </select>
              </div>

              {/* Award Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Award / Badge Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Science Quiz Champion"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Points */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Star Points *
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    step="5"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    <option value="Class">Class</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Conduct">Conduct</option>
                    <option value="Event">Event</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Creativity">Creativity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Badge Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Badge Icon Symbol
                </label>
                <div className="flex items-center gap-2">
                  {(['star', 'trophy', 'medal', 'zap', 'crown', 'sparkles', 'award'] as const).map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setBadgeIcon(icon)}
                      className={`p-2 rounded-xl border transition-all ${
                        badgeIcon === icon
                          ? 'border-[#0b5e70] bg-[#e6f7f7] dark:bg-teal-950/70 scale-105'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {renderBadgeIcon(icon, 'w-4 h-4')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teacher / Admin Remarks
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reason for granting this recognition..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0b5e70] to-teal-600 hover:to-teal-700 text-white text-xs font-bold shadow-md"
                >
                  Award Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
