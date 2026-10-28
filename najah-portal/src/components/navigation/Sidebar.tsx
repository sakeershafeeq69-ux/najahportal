import React, { useState, useRef, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { ProfileDropdownMenu } from '../profile/ProfileDropdownMenu';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarRange,
  Trophy,
  CalendarDays,
  Users,
  Award,
  BellRing,
  Image as ImageIcon,
  BarChart3,
  TrendingUp,
  Settings,
  MessageSquare,
  Bot,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAiChat: () => void;
  onOpenProfile: () => void;
  onOpenChangePassword: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openAiChat,
  onOpenProfile,
  onOpenChangePassword,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { currentUser, students, events, notices, rewards, messages, customLogo, scheduleDeadlines } = usePortal();
  const isAdmin = currentUser?.role === 'admin';
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const pendingDeadlinesCount = scheduleDeadlines?.filter(d => !d.completed).length || 0;

  // Admin Navigation Items
  const adminNav = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'schedule', label: 'Class Schedule', icon: CalendarRange, badge: pendingDeadlinesCount > 0 ? pendingDeadlinesCount : undefined },
    { id: 'attendance', label: 'Class Attendance', icon: CalendarCheck },
    { id: 'rewards', label: 'Reward System', icon: Trophy, badge: rewards.length },
    { id: 'performance', label: 'Performance Dashboard', icon: TrendingUp },
    { id: 'chat', label: 'Class Messages & Chat', icon: MessageSquare, badge: messages.length > 0 ? messages.length : undefined },
    { id: 'events', label: 'Events & Results', icon: CalendarDays, badge: events.length },
    { id: 'students', label: 'Manage Students', icon: Users, badge: students.length },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'notices', label: 'Notices', icon: BellRing, badge: notices.length },
    { id: 'gallery', label: 'Class Gallery', icon: ImageIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Security', icon: Settings },
  ];

  // Student Navigation Items
  const studentNav = [
    { id: 'student-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Class Schedule', icon: CalendarRange, badge: pendingDeadlinesCount > 0 ? pendingDeadlinesCount : undefined },
    { id: 'attendance', label: 'My Attendance', icon: CalendarCheck },
    {
      id: 'rewards',
      label: 'Rewards & Stars',
      icon: Trophy,
      badge: rewards.filter((r) => r.studentId === currentUser?.id).length,
    },
    { id: 'performance', label: 'Performance Trends', icon: TrendingUp },
    { id: 'chat', label: 'Class Messages & Chat', icon: MessageSquare, badge: messages.length > 0 ? messages.length : undefined },
    { id: 'events', label: 'Class Events', icon: CalendarDays, badge: events.filter(e => e.status === 'upcoming').length },
    { id: 'notices', label: 'Notices & Alerts', icon: BellRing, badge: notices.length },
    { id: 'my-certificates', label: 'My Certificates', icon: Award },
    { id: 'gallery', label: 'Class Gallery', icon: ImageIcon },
    { id: 'contact', label: 'Contact Admin', icon: MessageSquare },
  ];

  const currentNav = isAdmin ? adminNav : studentNav;

  const content = (
    <div className="h-full flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 select-none">
      {/* 1. Header with brand lockup - SMART CLASS (User instructed: change campus to class) */}
      <div>
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              setActiveTab(isAdmin ? 'dashboard' : 'student-dashboard');
              onCloseMobile?.();
            }}
            className="flex items-center gap-3 text-left focus:outline-hidden group"
          >
            <div className="relative shrink-0">
              <img
                src={customLogo}
                alt="Class Crest Logo"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform drop-shadow-xs"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  NAJAH
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#e6f7f7] text-[#0b5e70] dark:bg-teal-950/80 dark:text-teal-300 tracking-wider">
                  SMART CLASS
                </span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
                CLASS & EVENT PORTAL
              </div>
            </div>
          </button>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close navigation sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 2. Navigation items with active pill style */}
        <div className="px-3 py-3 space-y-1 overflow-y-auto max-h-[calc(100vh-290px)]">
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {isAdmin ? 'Class Admin Console' : 'Student Hub'}
          </div>

          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all text-left ${
                  isActive
                    ? 'bg-[#e6f7f7] text-[#0b5e70] dark:bg-teal-950/60 dark:text-teal-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-[#0b5e70] dark:text-teal-300'
                        : 'text-slate-400 dark:text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#0b5e70] text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom AI Assistant Card & User Profile Trigger */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {/* Quick AI Trigger Card */}
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-teal-500/10 via-[#0b5e70]/10 to-transparent border border-teal-500/20 dark:border-teal-400/20">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#0b5e70] dark:text-teal-300">
              <Bot className="w-3.5 h-3.5 text-[#0b5e70] dark:text-teal-400" />
              <span>Najah Class AI</span>
            </div>
            <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
            Need class schedules, rules, or notice drafts?
          </p>
          <button
            onClick={() => {
              openAiChat();
              onCloseMobile?.();
            }}
            className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#0b5e70] to-teal-600 hover:to-teal-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all active:scale-98"
          >
            <span>Ask Class AI</span>
          </button>
        </div>

        {/* 4. User Profile Trigger & Dropdown matching image_52542023.png */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all border border-slate-200/60 dark:border-slate-800 text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-700"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                    isAdmin ? 'bg-amber-500' : 'bg-teal-500'
                  }`}
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#e6f7f7] text-[#0b5e70] dark:bg-teal-950/70 dark:text-teal-300">
                    {isAdmin ? 'Admin' : 'Student'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[80px]">
                    @{currentUser?.username}
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                showProfileMenu ? 'rotate-180 text-teal-600' : ''
              }`}
            />
          </button>

          {/* Profile Dropdown matching image_52542023.png */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-150 z-50">
              <ProfileDropdownMenu
                position="up"
                className="w-full shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10"
                onOpenProfile={() => {
                  setShowProfileMenu(false);
                  onOpenProfile();
                  onCloseMobile?.();
                }}
                onOpenChangePassword={() => {
                  setShowProfileMenu(false);
                  onOpenChangePassword();
                  onCloseMobile?.();
                }}
                onClose={() => setShowProfileMenu(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (visible on md screens and up) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Container */}
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
