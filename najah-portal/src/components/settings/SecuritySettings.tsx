import React, { useState, useRef } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Settings, 
  Trash2, 
  Download, 
  Upload, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  Link as LinkIcon
} from 'lucide-react';

export const SecuritySettings: React.FC = () => {
  const { 
    customLogo,
    setCustomLogo,
    resetCustomLogo,
    purgeAllData, 
    exportBackup, 
    importBackup, 
    auditLogs,
    students,
    events,
    notices,
    messages
  } = usePortal();

  // Logo Customization State
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [logoSuccessMsg, setLogoSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Purge Modal
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  // Backup Import
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Preset Crests / Badges
  const presetLogos = [
    {
      id: 'default-crest',
      name: 'Najah Official Gold & Teal Crest',
      url: '/assets/aistudio/f166505f-a49d-44a3-aea5-f2fc3758a9fa_9e956595.png',
    },
    {
      id: 'class-shield',
      name: 'Royal Class Shield',
      url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 'tech-crest',
      name: 'Modern Class Badge',
      url: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=200',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomLogo(reader.result);
        setLogoSuccessMsg('Class logo successfully updated from uploaded file!');
        setTimeout(() => setLogoSuccessMsg(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoUrlInput.trim()) return;
    setCustomLogo(logoUrlInput.trim());
    setLogoUrlInput('');
    setLogoSuccessMsg('Class logo successfully updated from URL!');
    setTimeout(() => setLogoSuccessMsg(null), 4000);
  };

  const handlePurgeConfirm = () => {
    if (!confirmCheckbox) return;
    purgeAllData();
    setShowPurgeModal(false);
    setConfirmCheckbox(false);
    setPurgeSuccess(true);
    setTimeout(() => setPurgeSuccess(false), 5000);
  };

  const handleDownloadBackup = () => {
    const data = exportBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `najah_class_portal_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportStatus(null);
    if (!importJson.trim()) return;
    const ok = importBackup(importJson);
    if (ok) {
      setImportStatus('Backup restored successfully!');
      setImportJson('');
    } else {
      setImportStatus('Invalid JSON format. Please verify the backup file.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#086a7e] dark:text-teal-400 mb-1">
          <Settings className="w-4 h-4" />
          <span>Class Security & System Administration</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Class Portal Settings & Data Governance
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Customize portal logo and branding, execute full system purges, and manage encrypted backups. (Note: Password security is managed directly inside your Profile).
        </p>
      </div>

      {purgeSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>All class data (events, notices, students, attendance, rewards, messages) has been completely deleted. Zero mock data exists; only the admin can add new items.</span>
        </div>
      )}

      {/* Grid: Logo Customization & Purge Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: Class Logo & Portal Branding Customization */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-[#086a7e] dark:text-teal-300 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Class Logo & Branding</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Change the crest displayed across the whole portal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetCustomLogo}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                title="Reset to default logo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Logo</span>
              </button>
            </div>

            {/* Current Active Logo Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src={customLogo}
                  alt="Active Class Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Active Portal Crest</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">Live</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Shown in the top navigation, sidebar, and login page lockup.
                </p>
              </div>
            </div>

            {/* Method A: Upload Image File */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Upload Logo from Device
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 text-xs font-bold rounded-xl border border-dashed border-[#086a7e] dark:border-teal-500/50 text-[#086a7e] dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File (PNG, JPG, SVG, WebP)</span>
                </button>
              </div>

              {/* Method B: Or enter URL */}
              <form onSubmit={handleApplyUrl} className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Or Paste Logo Image URL
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={logoUrlInput}
                      onChange={(e) => setLogoUrlInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-xl transition-colors shrink-0 shadow-xs"
                  >
                    Set URL
                  </button>
                </div>
              </form>

              {/* Method C: Preset Crests */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Quick Preset Crests
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {presetLogos.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setCustomLogo(preset.url);
                        setLogoSuccessMsg(`Applied preset: ${preset.name}!`);
                        setTimeout(() => setLogoSuccessMsg(null), 3000);
                      }}
                      className={`p-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        customLogo === preset.url
                          ? 'border-[#086a7e] bg-teal-50/70 dark:bg-teal-950/40 ring-2 ring-[#086a7e]/30'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-8 h-8 object-contain"
                      />
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {logoSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{logoSuccessMsg}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
            Logo automatically syncs to localStorage and renders across user sessions.
          </div>
        </div>

        {/* Section 2: CRITICAL PURGE ALL DATA */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-950 dark:text-rose-200">Factory Purge / Delete All Data</h3>
                <p className="text-xs text-rose-700 dark:text-rose-400">Permanently wipe all portal records on demand</p>
              </div>
            </div>

            <div className="my-4 p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-300 space-y-2.5 leading-relaxed">
              <div className="font-bold flex items-center gap-1.5 text-rose-800 dark:text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Zero Mock Data & Single-Item Deletion Guarantee:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
                <li>Permanently deletes all <strong>{students.length} students</strong>.</li>
                <li>Permanently clears all <strong>{events.length} class events</strong> and <strong>{notices.length} notices</strong>.</li>
                <li>Permanently clears all <strong>class schedules, timetable periods, and course deadlines</strong> without restoring templates.</li>
                <li>Permanently clears all <strong>{messages.length} class chat messages</strong>.</li>
                <li>Clears all student attendance records, rewards, certificates, and inquiries.</li>
                <li><strong>CRITICAL:</strong> No mock events, mock students, or schedule templates will self-populate. Only Admin can add or change any data in this app!</li>
                <li>You can also delete any individual item anywhere using its dedicated <strong>Delete</strong> button.</li>
              </ul>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowPurgeModal(true)}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Purge All Class Data Now</span>
            </button>
          </div>
        </div>

      </div>

      {/* Backup and Restore Row */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Class Backup & Recovery Center</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Export state as portable JSON or restore from backup file</p>
          </div>
          <button
            onClick={handleDownloadBackup}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors shadow-xs shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON Backup</span>
          </button>
        </div>

        <form onSubmit={handleImportSubmit} className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Restore Backup from JSON String
          </label>
          <textarea
            rows={3}
            placeholder="Paste your exported backup JSON text here to restore..."
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
          />
          {importStatus && (
            <div className={`text-xs font-semibold ${
              importStatus.includes('successfully') ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {importStatus}
            </div>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            Import & Restore Data
          </button>
        </form>
      </div>

      {/* Security Audit Trail */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#086a7e] dark:text-teal-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Class Security Audit Trail</h3>
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            {auditLogs.length} Records Logged
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-[#086a7e] dark:text-teal-300">
                    {log.action}
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">User: {log.user}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px]">{log.details}</p>
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Purge Confirmation Modal */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-7 h-7 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Delete All Class Data?</h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              You are about to completely wipe all class events, notices, gallery photos, attendance records, reward stars, chat messages, and student accounts.
            </p>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmCheckbox}
                  onChange={(e) => setConfirmCheckbox(e.target.checked)}
                  className="mt-0.5 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-xs font-bold text-rose-900 dark:text-rose-300">
                  I understand that this will delete all data now, and no students or events will be automatically generated.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPurgeModal(false);
                  setConfirmCheckbox(false);
                }}
                className="px-4 py-2.5 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!confirmCheckbox}
                onClick={handlePurgeConfirm}
                className="px-5 py-2.5 text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Yes, Delete All Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
