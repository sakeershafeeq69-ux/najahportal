import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { User, Key, Moon, Sun, LogOut } from 'lucide-react';

interface ProfileDropdownMenuProps {
  onOpenProfile: () => void;
  onOpenChangePassword: () => void;
  onClose?: () => void;
  position?: 'up' | 'down';
  className?: string;
}

export const ProfileDropdownMenu: React.FC<ProfileDropdownMenuProps> = ({
  onOpenProfile,
  onOpenChangePassword,
  onClose,
  position = 'down',
  className = '',
}) => {
  const { currentUser, logout, isDarkMode, toggleDarkMode } = usePortal();
  const isAdmin = currentUser?.role === 'admin';

  if (!currentUser) return null;

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 z-50 text-slate-800 dark:text-slate-100 w-64 ${className}`}
    >
      {/* Top Header Card matching image_52542023.png */}
      <div className="p-3.5 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/40">
        <div className="relative shrink-0">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-xs"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block ${
                isAdmin
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                  : 'bg-[#e6f7f7] text-[#0b5e70] dark:bg-teal-950/70 dark:text-teal-300'
              }`}
            >
              {isAdmin ? 'Admin' : 'Student'}
            </span>
          </div>
          <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate mt-1">
            {currentUser.name}
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate">
            @{currentUser.username}
          </div>
        </div>
      </div>

      {/* Item 1: My Profile */}
      <button
        onClick={() => {
          onClose?.();
          onOpenProfile();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors text-left group"
      >
        <span className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-[#0b5e70] dark:group-hover:text-teal-400 transition-colors">
          <User className="w-4 h-4" />
        </span>
        <span className="flex-1">My Profile</span>
      </button>

      {/* Item 2: Change Password */}
      <button
        onClick={() => {
          onClose?.();
          onOpenChangePassword();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors text-left group"
      >
        <span className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-[#0b5e70] dark:group-hover:text-teal-400 transition-colors">
          <Key className="w-4 h-4" />
        </span>
        <span className="flex-1">Change Password</span>
      </button>

      {/* Item 3: Dark / Light Mode Toggle */}
      <button
        type="button"
        onClick={() => {
          toggleDarkMode();
        }}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors text-left group"
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </span>
          <div className="flex flex-col text-left">
            <span className="font-bold text-slate-900 dark:text-white">
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Tap to switch mode
            </span>
          </div>
        </div>
        {/* Toggle switch visual */}
        <div
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            isDarkMode ? 'bg-[#0b5e70]' : 'bg-slate-300'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              isDarkMode ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </div>
      </button>

      {/* Item 4: Sign Out */}
      <button
        onClick={() => {
          onClose?.();
          logout();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 transition-colors text-left group"
      >
        <span className="w-5 h-5 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
          <LogOut className="w-4 h-4" />
        </span>
        <span className="flex-1">Sign Out</span>
      </button>
    </div>
  );
};
