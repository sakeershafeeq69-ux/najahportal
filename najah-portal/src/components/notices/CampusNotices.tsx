import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  BellRing, 
  Plus, 
  Search, 
  Trash2, 
  Pin, 
  Calendar, 
  AlertCircle,
  Megaphone,
  CheckCircle2
} from 'lucide-react';
import { NoticeItem } from '../../types';

interface CampusNoticesProps {
  showPublishModalDirect?: boolean;
  onClosePublishModal?: () => void;
}

export const CampusNotices: React.FC<CampusNoticesProps> = ({
  showPublishModalDirect = false,
  onClosePublishModal,
}) => {
  const { currentUser, notices, addNotice, deleteNotice } = usePortal();
  const isAdmin = currentUser?.role === 'admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [showPublishModal, setShowPublishModal] = useState(showPublishModalDirect);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('General');
  const [isPinned, setIsPinned] = useState(false);
  const [publishedBy, setPublishedBy] = useState('Class Administration');

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addNotice({
      title,
      content,
      category: category.trim() || 'General',
      publishedBy,
      isPinned,
    });

    setTitle('');
    setContent('');
    setShowPublishModal(false);
    if (onClosePublishModal) onClosePublishModal();
  };

  const filteredNotices = notices.filter((n) => {
    const matchesCat = selectedCat === 'All' || n.category.toLowerCase() === selectedCat.toLowerCase();
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#086a7e] mb-1">
            <BellRing className="w-4 h-4" />
            <span>Class Notification Center</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Official Notices & Bulletins
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time announcements on event registrations, guidelines, and class updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
            />
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowPublishModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#086a7e] text-white hover:bg-[#065464] transition-colors shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', ...Array.from(new Set(['General', 'Urgent Alert', 'Event Update', 'Class Guideline', ...notices.map((n) => (n.category === 'Academic Guideline' ? 'Class Guideline' : n.category))]))].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl capitalize transition-colors ${
              selectedCat.toLowerCase() === cat.toLowerCase()
                ? 'bg-[#086a7e] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`bg-white rounded-3xl p-6 border shadow-xs transition-all ${
              notice.isPinned
                ? 'border-amber-300 ring-1 ring-amber-100'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  {notice.isPinned && (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                      <Pin className="w-3 h-3 text-amber-700" />
                      Pinned Announcement
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    notice.category === 'urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : notice.category === 'event'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {notice.category === 'Academic Guideline' ? 'Class Guideline' : notice.category}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  {notice.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pt-1">
                  {notice.content}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[11px] font-mono text-slate-400">{notice.publishedDate}</div>
                <div className="text-[10px] font-bold text-[#086a7e] mt-0.5">{notice.publishedBy}</div>
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this notice?')) deleteNotice(notice.id);
                    }}
                    className="mt-3 text-xs text-rose-500 hover:text-rose-700 font-semibold block ml-auto"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Notice Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Publish Class Announcement</h3>
            <p className="text-xs text-slate-400 mt-0.5">Post an official update to all class students.</p>

            <form onSubmit={handlePublishSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Change: TechFest Opening Keynote"
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
                    list="notice-category-options"
                    placeholder="Type or select category (e.g. Urgent Alert, Exam, Holiday...)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                  />
                  <datalist id="notice-category-options">
                    <option value="General" />
                    <option value="Urgent Alert" />
                    <option value="Event Update" />
                    <option value="Class Guideline" />
                    <option value="Exam Schedule" />
                    <option value="Holiday Notice" />
                  </datalist>
                </div>
                {/* Quick Selection Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['General', 'Urgent Alert', 'Event Update', 'Class Guideline', 'Exam Schedule'].map((cat) => (
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

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Publishing Authority</label>
                <input
                  type="text"
                  value={publishedBy}
                  onChange={(e) => setPublishedBy(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Full text of the notice..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-[#086a7e] focus:ring-[#086a7e]"
                />
                <span>Pin this notice to top of announcements</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowPublishModal(false);
                    if (onClosePublishModal) onClosePublishModal();
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-xl shadow-xs"
                >
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
