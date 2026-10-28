import React, { useState, useRef } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Image as ImageIcon, 
  Video, 
  Plus, 
  Search, 
  Trash2, 
  Download, 
  ExternalLink,
  Tag,
  Play,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { GalleryItem } from '../../types';

export const CampusGallery: React.FC = () => {
  const { currentUser, gallery, addGalleryItem, deleteGalleryItem, events } = usePortal();
  const isAdmin = currentUser?.role === 'admin';

  const [activeFilter, setActiveFilter] = useState<'All' | 'photo' | 'video'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Upload Form State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'photo' | 'video'>('photo');
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [eventTag, setEventTag] = useState(events[0]?.title || 'Class Life');
  const [description, setDescription] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

    if (file.type.startsWith('video/')) {
      setType('video');
    } else {
      setType('photo');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setUrl(event.target.result);
        setFilePreview(event.target.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read selected media file. Please try another.');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setUploadError('Please provide a title for the media.');
      return;
    }
    if (!url) {
      setUploadError('Please tap and select a photo or video file from your device.');
      return;
    }

    addGalleryItem({
      title,
      type,
      url,
      eventTag,
      description,
    });

    setTitle('');
    setUrl('');
    setFileName('');
    setFileSize('');
    setFilePreview(null);
    setDescription('');
    setUploadError('');
    setShowUploadModal(false);
  };

  const filteredItems = gallery.filter((item) => {
    const matchesType = activeFilter === 'All' || item.type === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.eventTag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#086a7e] mb-1">
            <ImageIcon className="w-4 h-4" />
            <span>Class Media Archive</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Event Gallery & Video Highlights
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Relive class sports championships, cultural gala performances, and hackathon highlights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveFilter('All')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeFilter === 'All' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Media
            </button>
            <button
              onClick={() => setActiveFilter('photo')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeFilter === 'photo' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveFilter('video')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeFilter === 'video' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Videos
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#086a7e] text-white hover:bg-[#065464] transition-colors shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Media</span>
            </button>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No media uploaded in this category</h3>
          <p className="text-xs text-slate-500 mt-1">Upload event photographs or clips using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-slate-300 transition-all"
            >
              {/* Media Preview */}
              <div 
                onClick={() => setLightboxItem(item)}
                className="relative h-48 bg-slate-100 cursor-pointer overflow-hidden"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />

                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white/90 text-[#086a7e] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white">
                    {item.eventTag}
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="p-3.5 space-y-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{item.uploadedAt}</span>
                  <span className="capitalize text-[10px] font-semibold text-slate-500">{item.type}</span>
                </div>
              </div>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="p-3 pt-0 flex justify-end">
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this media item?')) deleteGalleryItem(item.id);
                    }}
                    className="text-[11px] font-semibold text-rose-500 hover:text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white animate-in zoom-in-95">
            <div className="relative max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={lightboxItem.url}
                alt={lightboxItem.title}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300">
                  {lightboxItem.eventTag} · {lightboxItem.type}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{lightboxItem.title}</h3>
                {lightboxItem.description && (
                  <p className="text-xs text-slate-300 mt-0.5">{lightboxItem.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={lightboxItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Open Full Media</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal (Admin) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload Class Media</h3>
            <p className="text-xs text-slate-400 mt-0.5">Add photo or video to class album.</p>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hackathon Final Pitch Stage"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Media Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                  >
                    <option value="photo">Photograph</option>
                    <option value="video">Video Clip</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Event Tag</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Class Life, Hackathon"
                    value={eventTag}
                    onChange={(e) => setEventTag(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                  />
                </div>
              </div>

              {/* Tap to Select Device File */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Class Media File (Photo / Video) *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,video/*"
                  className="hidden"
                />

                {!filePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#086a7e] dark:hover:border-teal-400 bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50/40 rounded-2xl p-5 text-center cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#086a7e] dark:text-teal-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-extrabold text-slate-800 dark:text-white">
                      Tap here to choose a photo or video
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Select JPG, PNG, MP4, WebM directly from your device
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50/60 dark:bg-teal-950/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {type === 'photo' ? (
                        <img
                          src={filePreview}
                          alt="Selected media"
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                      ) : (
                        <video
                          src={filePreview}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {fileName || 'Selected Media'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="capitalize font-semibold text-[#086a7e] dark:text-teal-400">{type}</span>
                          {fileSize && (
                            <>
                              <span>·</span>
                              <span>{fileSize}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0 transition-all shadow-2xs"
                    >
                      Change
                    </button>
                  </div>
                )}

                {uploadError && (
                  <p className="text-xs text-rose-500 mt-1.5 font-semibold">{uploadError}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Short caption..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setFilePreview(null);
                    setFileName('');
                    setFileSize('');
                    setUrl('');
                    setUploadError('');
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!url}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs"
                >
                  Save to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
