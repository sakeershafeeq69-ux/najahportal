import React, { useState, useRef, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { ProfileDropdownMenu } from './profile/ProfileDropdownMenu';
import {
  Menu,
  Bot,
  BellRing,
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiChat: () => void;
  onOpenProfile: () => void;
  onOpenChangePassword: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAiChat,
  onOpenProfile,
  onOpenChangePassword,
  onToggleMobileMenu,
}) => {
  const { currentUser, notices, customLogo, isDarkMode, toggleDarkMode } = usePortal();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const isAdmin = currentUser?.role === 'admin';

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  // Tab Title helper
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Executive Class Overview';
      case 'student-dashboard':
        return 'Student Hub';
      case 'schedule':
        return 'Class Schedule & Weekly Timetable';
      case 'attendance':
        return isAdmin ? 'Class Roll Call & Absent Log' : 'My Attendance Record';
      case 'rewards':
        return isAdmin ? 'Class Rewards & Recognition' : 'My Rewards & Badges';
      case 'performance':
        return 'Class Performance Dashboard';
      case 'chat':
        return 'Class Messaging & Direct Chat';
      case 'events':
        return 'Class Events & Results';
      case 'students':
        return 'Class Student Management';
      case 'certificates':
      case 'my-certificates':
        return 'Class Certificate System';
      case 'notices':
        return 'Class Bulletins & Notices';
      case 'gallery':
        return 'Class Media Gallery';
      case 'analytics':
        return 'Class Intelligence & Growth Metrics';
      case 'settings':
        return 'Settings & Security';
      case 'contact':
        return 'Contact Class Admin';
      default:
        return 'Class Portal';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Mobile Menu Toggle + Mobile Brand or Desktop Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand (hidden on desktop because sidebar is visible) */}
            <div className="flex md:hidden items-center gap-2.5">
              <img
                src={customLogo}
                alt="Class Crest Logo"
                className="w-8 h-8 object-contain"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-900 dark:text-white uppercase">
                  NAJAH
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#e6f7f7] text-[#0b5e70] dark:bg-teal-950/80 dark:text-teal-300">
                  CLASS
                </span>
              </div>
            </div>

            {/* Desktop Active View Title & Section Pill */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-slate-800 dark:text-white">
                  {getTabTitle(activeTab)}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {isAdmin ? 'Admin Console' : 'Student Portal'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions & Profile Dropdown */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Quick Notice Shortcut */}
            <button
              onClick={() => setActiveTab('notices')}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Class Notices"
            >
              <BellRing className="w-4 h-4" />
              {notices.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Direct 1-Click Dark/Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark / Light Mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-180 duration-200" />
              )}
            </button>

            {/* Najah Class AI Assistant Launch Button */}
            <button
              onClick={openAiChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0b5e70] to-teal-600 hover:to-teal-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
              title="Open Najah Class AI"
            >
              <Bot className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Ask AI</span>
              <Sparkles className="w-3 h-3 text-amber-300 hidden sm:inline" />
            </button>

            {/* Topbar Profile Dropdown (matching image_52542023.png) */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 transition-all text-left group"
              >
                <div className="relative">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-2xs"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                      isAdmin ? 'bg-amber-500' : 'bg-teal-500'
                    }`}
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[100px]">
                    {currentUser?.name}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>

              {/* Exact Popup matching image_52542023.png */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <ProfileDropdownMenu
                    position="down"
                    className="w-64"
                    onOpenProfile={() => {
                      setProfileOpen(false);
                      onOpenProfile();
                    }}
                    onOpenChangePassword={() => {
                      setProfileOpen(false);
                      onOpenChangePassword();
                    }}
                    onClose={() => setProfileOpen(false)}
                  />
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
