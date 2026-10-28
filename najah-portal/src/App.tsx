/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Sidebar } from './components/navigation/Sidebar';
import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ManageStudents } from './components/admin/ManageStudents';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AttendanceSystem } from './components/attendance/AttendanceSystem';
import { RewardSystem } from './components/rewards/RewardSystem';
import { EventPlatform } from './components/events/EventPlatform';
import { CertificateSystem } from './components/certificates/CertificateSystem';
import { CampusGallery } from './components/gallery/CampusGallery';
import { CampusNotices } from './components/notices/CampusNotices';
import { AnalyticsHub } from './components/analytics/AnalyticsHub';
import { ClassPerformanceDashboard } from './components/analytics/ClassPerformanceDashboard';
import { ClassChatHub } from './components/chat/ClassChatHub';
import { ClassSchedule } from './components/schedule/ClassSchedule';
import { SecuritySettings } from './components/settings/SecuritySettings';
import { ContactAdmin } from './components/contact/ContactAdmin';
import { AiAssistantModal } from './components/ai/AiAssistantModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { ChangePasswordModal } from './components/profile/ChangePasswordModal';
import { ReadOnlyStudentBoundary } from './components/common/ReadOnlyStudentGuard';
import { Bot, ShieldCheck, GraduationCap } from 'lucide-react';

const NajahApp: React.FC = () => {
  const { currentUser, customLogo } = usePortal();
  const isAdmin = currentUser?.role === 'admin';

  const [activeTab, setActiveTab] = useState<string>(() => {
    return isAdmin ? 'dashboard' : 'student-dashboard';
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [activeCertIdToView, setActiveCertIdToView] = useState<string | null>(null);

  // Quick Action Modal triggers from dashboard
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showPublishNoticeModal, setShowPublishNoticeModal] = useState(false);

  // If not logged in, render the reference-matching login card!
  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-row text-slate-900 dark:text-slate-100 selection:bg-teal-600 selection:text-white transition-colors">
      
      {/* Dedicated Left Navigation Sidebar matching image_19766cb2.png & image_52542023.png */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiChat={() => setShowAiModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenChangePassword={() => setShowChangePasswordModal(true)}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Header / Utility Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openAiChat={() => setShowAiModal(true)}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenChangePassword={() => setShowChangePasswordModal(true)}
          onToggleMobileMenu={() => setMobileSidebarOpen(true)}
        />

        {/* Dynamic Views Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {/* Admin Views */}
          {isAdmin && (
            <>
              {activeTab === 'dashboard' && (
                <AdminDashboard
                  setActiveTab={setActiveTab}
                  openAddStudentModal={() => {
                    setShowAddStudentModal(true);
                    setActiveTab('students');
                  }}
                  openCreateEventModal={() => {
                    setShowCreateEventModal(true);
                    setActiveTab('events');
                  }}
                  openPublishNoticeModal={() => {
                    setShowPublishNoticeModal(true);
                    setActiveTab('notices');
                  }}
                />
              )}

              {activeTab === 'schedule' && <ClassSchedule />}

              {activeTab === 'attendance' && <AttendanceSystem />}

              {activeTab === 'rewards' && <RewardSystem />}

              {activeTab === 'performance' && <ClassPerformanceDashboard />}

              {activeTab === 'chat' && <ClassChatHub />}

              {activeTab === 'students' && (
                <ManageStudents
                  showAddModalDirect={showAddStudentModal}
                  onCloseAddModal={() => setShowAddStudentModal(false)}
                />
              )}

              {activeTab === 'events' && (
                <EventPlatform
                  showCreateModalDirect={showCreateEventModal}
                  onCloseCreateModal={() => setShowCreateEventModal(false)}
                />
              )}

              {activeTab === 'certificates' && (
                <CertificateSystem initialCertIdToView={activeCertIdToView} />
              )}

              {activeTab === 'notices' && (
                <CampusNotices
                  showPublishModalDirect={showPublishNoticeModal}
                  onClosePublishModal={() => setShowPublishNoticeModal(false)}
                />
              )}

              {activeTab === 'gallery' && <CampusGallery />}

              {activeTab === 'analytics' && <AnalyticsHub />}

              {activeTab === 'settings' && <SecuritySettings />}
            </>
          )}

          {/* Student Views wrapped in Read-Only Security Guard Middleware */}
          {!isAdmin && (
            <ReadOnlyStudentBoundary viewName="Student Class Portal">
              {activeTab === 'student-dashboard' && (
                <StudentDashboard
                  setActiveTab={setActiveTab}
                  openAiChat={() => setShowAiModal(true)}
                  onViewCertificate={(certId) => {
                    setActiveCertIdToView(certId);
                    setActiveTab('my-certificates');
                  }}
                />
              )}

              {activeTab === 'schedule' && <ClassSchedule />}

              {activeTab === 'attendance' && <AttendanceSystem />}

              {activeTab === 'rewards' && <RewardSystem />}

              {activeTab === 'performance' && <ClassPerformanceDashboard />}

              {activeTab === 'chat' && <ClassChatHub />}

              {activeTab === 'events' && <EventPlatform />}

              {activeTab === 'notices' && <CampusNotices />}

              {activeTab === 'my-certificates' && (
                <CertificateSystem initialCertIdToView={activeCertIdToView} />
              )}

              {activeTab === 'gallery' && <CampusGallery />}

              {activeTab === 'contact' && <ContactAdmin />}
            </ReadOnlyStudentBoundary>
          )}

        </main>

        {/* Global Floating AI Action Button */}
        <button
          onClick={() => setShowAiModal(true)}
          className="fixed bottom-6 right-6 z-30 bg-gradient-to-r from-[#0b5e70] to-teal-600 hover:to-teal-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 border border-white/20"
          title="Open Najah Class AI"
        >
          <Bot className="w-5 h-5 animate-pulse text-amber-300" />
          <span className="text-xs font-extrabold pr-1 hidden sm:inline">Ask Class AI</span>
        </button>

        {/* Modals */}
        <AiAssistantModal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
        />

        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />

        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 mt-auto py-5 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2.5">
              <img
                src={customLogo}
                alt="Najah Logo"
                className="w-6 h-6 object-contain"
              />
              <span className="font-extrabold text-slate-800 dark:text-white tracking-tight">NAJAH PORTAL</span>
              <span>·</span>
              <span>Smart AI Class Platform for Events, Recognition & Student Life</span>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin ? (
                <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Class Admin Master Mode</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-800">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Student Class Mode</span>
                </span>
              )}
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
};

export default function App() {
  return (
    <PortalProvider>
      <NajahApp />
    </PortalProvider>
  );
}
