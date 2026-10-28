import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  HelpCircle,
  Building2,
  Phone,
  Mail
} from 'lucide-react';

export const ContactAdmin: React.FC = () => {
  const { currentUser, inquiries, submitInquiry, replyToInquiry } = usePortal();
  const isAdmin = currentUser?.role === 'admin';

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Admin reply state
  const [replyTextMap, setReplyTextMap] = useState<{ [id: string]: string }>({});

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    submitInquiry(subject, message);
    setSubject('');
    setMessage('');
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  const handleAdminReplySubmit = (inquiryId: string) => {
    const text = replyTextMap[inquiryId];
    if (!text || !text.trim()) return;
    replyToInquiry(inquiryId, text.trim());
    setReplyTextMap((prev) => ({ ...prev, [inquiryId]: '' }));
  };

  // Filter: if student, only show their inquiries
  const displayedInquiries = isAdmin
    ? inquiries
    : inquiries.filter((i) => i.studentId === currentUser?.id);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#086a7e] dark:text-teal-400 mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>Class Communication & Helpdesk</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {isAdmin ? 'Student Helpdesk & Inquiries Queue' : 'Contact Class Administration'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {isAdmin
            ? 'Respond directly to student inquiries regarding event registrations and certificates.'
            : 'Have questions about registrations, certificates, or schedules? Submit an inquiry directly to the Admin.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Student Submit Form or Admin Info */}
        {!isAdmin ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Send Inquiry to Admin</h3>
            
            {submittedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your inquiry has been sent to the Admin!</span>
              </div>
            )}

            <form onSubmit={handleStudentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question regarding TechFest team size"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Inquiry</span>
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Office: Class Administration Desk, Room 204</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>admin@najah.portal</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900">Helpdesk Guidelines</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Timely responses build an engaged class community. Inquiries answered here are immediately accessible in the student's portal view.
            </p>
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 text-xs text-teal-900">
              <strong>Open Inquiries:</strong> {inquiries.filter((i) => i.status === 'open').length} awaiting your response.
            </div>
          </div>
        )}

        {/* Inquiries Thread List */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {isAdmin ? 'All Student Inquiries' : 'My Previous Inquiries'}
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {displayedInquiries.length} threads
            </span>
          </div>

          {displayedInquiries.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-xs text-slate-400">
              No inquiries on record.
            </div>
          ) : (
            <div className="space-y-4">
              {displayedInquiries.map((inq) => (
                <div key={inq.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          inq.status === 'answered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inq.status}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{inq.subject}</h4>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        By {inq.studentName} ({inq.studentRollNo}) · {inq.sentAt}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed">
                    "{inq.message}"
                  </p>

                  {/* Admin Reply Section */}
                  {inq.reply ? (
                    <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-100 text-xs text-[#085a6b] space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-[#086a7e]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Admin Response:</span>
                      </div>
                      <p className="text-slate-800 italic">"{inq.reply}"</p>
                    </div>
                  ) : isAdmin ? (
                    <div className="pt-2 border-t border-slate-200/60 space-y-2">
                      <input
                        type="text"
                        placeholder="Write reply to student..."
                        value={replyTextMap[inq.id] || ''}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [inq.id]: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                      />
                      <button
                        onClick={() => handleAdminReplySubmit(inq.id)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-lg shadow-xs"
                      >
                        Send Reply
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-700 italic flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Awaiting administrator response...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
