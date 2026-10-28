import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Award, 
  Plus, 
  Search, 
  Printer, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Sparkles,
  Trash2,
  FileCheck2,
  Share2
} from 'lucide-react';
import { CertificateItem } from '../../types';

interface CertificateSystemProps {
  initialCertIdToView?: string | null;
}

export const CertificateSystem: React.FC<CertificateSystemProps> = ({ initialCertIdToView }) => {
  const { 
    currentUser, 
    students, 
    events, 
    certificates, 
    issueCertificate, 
    deleteCertificate,
    customLogo,
  } = usePortal();

  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  const [activeTab, setActiveTab] = useState<'certificates' | 'verify'>('certificates');
  const [searchQuery, setSearchQuery] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);

  // Selected Certificate for Viewing / Printing
  const [viewingCert, setViewingCert] = useState<CertificateItem | null>(() => {
    if (initialCertIdToView) {
      return certificates.find((c) => c.id === initialCertIdToView) || null;
    }
    return null;
  });

  // Issue Form State
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedEventTitle, setSelectedEventTitle] = useState(events[0]?.title || 'Annual Class TechFest');
  const [role, setRole] = useState<'Winner' | 'Participant' | 'Organizer' | 'Merit Award'>('Winner');
  const [signatureTitle, setSignatureTitle] = useState('Class Director & Faculty Advisor');

  // Verify Form State
  const [verifyCodeInput, setVerifyCodeInput] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<CertificateItem | null | 'not_found'>(null);

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) {
      alert('Please select a valid enrolled student. If none exist, enroll a student first.');
      return;
    }

    issueCertificate({
      studentId: student.id,
      studentName: student.name,
      studentRollNo: student.rollNo,
      eventTitle: selectedEventTitle,
      eventDate: new Date().toISOString().split('T')[0],
      role,
      signatureTitle,
    });

    setShowIssueModal(false);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const match = certificates.find(
      (c) => c.verificationCode.toLowerCase() === verifyCodeInput.trim().toLowerCase()
    );
    if (match) {
      setVerifiedResult(match);
    } else {
      setVerifiedResult('not_found');
    }
  };

  // Filter: if student, only their own certificates; if admin, all
  const displayedCertificates = certificates.filter((c) => {
    if (isStudent && currentUser) {
      return c.studentId === currentUser.id;
    }
    const matchesSearch = c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.verificationCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            <Award className="w-4 h-4" />
            <span>Digital Credential Authority</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Certificate Generation & QR Verification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically verifiable digital credentials with high-res printable certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'certificates'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vault ({displayedCertificates.length})
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'verify'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Verify Code
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                if (students.length === 0) {
                  alert('You must enroll at least one student before issuing certificates.');
                  return;
                }
                setShowIssueModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Certificates List */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search certificate, student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <span className="text-xs text-slate-400">
              {displayedCertificates.length} credentials stored
            </span>
          </div>

          {displayedCertificates.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
              <Award className="w-12 h-12 text-amber-500/40 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">
                {isStudent ? 'No Certificates in Your Vault' : 'No Certificates Issued Yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {isStudent
                  ? 'Participate in class hackathons, sports tournaments, and workshops to earn verified certificates.'
                  : 'Click "Issue Certificate" to generate an authentic certificate with QR verification for an enrolled student.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-3xl border border-amber-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900">
                        {cert.role}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {cert.issuedDate}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{cert.eventTitle}</h4>
                      <div className="text-xs text-slate-600 mt-1">
                        Awarded to: <strong className="text-[#086a7e]">{cert.studentName}</strong>
                      </div>
                      <div className="text-[11px] text-slate-400">Roll No: {cert.studentRollNo}</div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Verification Hash</div>
                        <div className="font-mono font-bold text-slate-800 text-[11px]">{cert.verificationCode}</div>
                      </div>
                      <QrCode className="w-5 h-5 text-slate-500" />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setViewingCert(cert)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View & Print</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this certificate record?')) deleteCertificate(cert.id);
                        }}
                        className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Verify Code */}
      {activeTab === 'verify' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs max-w-xl mx-auto space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#086a7e] flex items-center justify-center mx-auto mb-3">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Verify Digital Certificate Authenticity
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter the unique verification code printed on the certificate to check its cryptographic registry record.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. NAJAH-A819-2041"
                value={verifyCodeInput}
                onChange={(e) => setVerifyCodeInput(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 text-sm font-mono font-bold rounded-2xl border border-slate-200 uppercase tracking-wider text-slate-900 text-center focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-2xl shadow-md transition-all"
            >
              Verify Certificate Authenticity
            </button>
          </form>

          {/* Verification Results */}
          {verifiedResult === 'not_found' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center">
              No matching certificate found in the Najah Class registry. Please double-check the code.
            </div>
          )}

          {verifiedResult && verifiedResult !== 'not_found' && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Verified Authentic Najah Credential</span>
              </div>
              <div className="text-xs space-y-1 pt-1 text-slate-700">
                <div><strong>Recipient:</strong> {verifiedResult.studentName} ({verifiedResult.studentRollNo})</div>
                <div><strong>Event:</strong> {verifiedResult.eventTitle}</div>
                <div><strong>Honors:</strong> {verifiedResult.role}</div>
                <div><strong>Issued Date:</strong> {verifiedResult.issuedDate}</div>
                <div className="font-mono text-[11px] text-[#086a7e]">
                  Hash: {verifiedResult.verificationCode}
                </div>
              </div>
              <button
                onClick={() => setViewingCert(verifiedResult)}
                className="mt-2 text-xs font-bold text-[#086a7e] hover:underline"
              >
                Open Official Certificate &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Printable Certificate Modal */}
      {viewingCert && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 relative my-8">
            
            {/* The Certificate Frame */}
            <div className="border-8 border-double border-[#086a7e] p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-50/30 via-white to-teal-50/20 text-center relative print:border-8 print:p-8">
              
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-[#086a7e] text-xs font-serif">❖</div>
              <div className="absolute top-2 right-2 text-[#086a7e] text-xs font-serif">❖</div>
              <div className="absolute bottom-2 left-2 text-[#086a7e] text-xs font-serif">❖</div>
              <div className="absolute bottom-2 right-2 text-[#086a7e] text-xs font-serif">❖</div>

              {/* Logo & Header */}
              <img
                src={customLogo}
                alt="Najah Logo"
                className="w-16 h-16 mx-auto object-contain mb-2"
              />
              <div className="text-[11px] font-black uppercase tracking-widest text-[#086a7e]">
                Najah Class Portal · Official Recognition
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-serif">
                Certificate of Excellence
              </h1>
              <div className="w-24 h-0.5 bg-amber-500 mx-auto my-3" />

              {/* Body Citation */}
              <div className="text-xs text-slate-600 mt-4 leading-relaxed max-w-lg mx-auto">
                This is proudly conferred upon
              </div>
              <div className="text-2xl font-black text-[#073642] mt-1 font-serif">
                {viewingCert.studentName}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Student ID / Roll No: {viewingCert.studentRollNo}
              </div>

              <div className="text-xs text-slate-600 my-4 max-w-lg mx-auto leading-relaxed">
                In formal recognition of outstanding performance and active contribution as <strong className="text-amber-800 font-bold">{viewingCert.role}</strong> at the official university event:
              </div>

              <div className="text-base sm:text-lg font-extrabold text-[#086a7e] italic">
                "{viewingCert.eventTitle}"
              </div>

              {/* Signatures & QR Strip */}
              <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 items-end text-xs">
                {/* QR Code */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-white p-1 rounded border border-slate-200 mx-auto flex items-center justify-center shadow-xs">
                    <QrCode className="w-14 h-14 text-slate-800" />
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-1">
                    {viewingCert.verificationCode}
                  </div>
                </div>

                {/* Golden Seal */}
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 font-black text-[9px] mx-auto flex items-center justify-center border-2 border-amber-500 shadow-md uppercase tracking-wider">
                    Official Seal
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-1">
                    Date: {viewingCert.issuedDate}
                  </div>
                </div>

                {/* Signature */}
                <div className="text-center">
                  <div className="font-serif italic text-base text-slate-800 border-b border-slate-400 pb-1 mx-2">
                    Dr. Richard Vance
                  </div>
                  <div className="text-[10px] font-bold text-slate-700 mt-0.5">
                    {viewingCert.signatureTitle}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setViewingCert(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-xl shadow-md transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Certificate Modal (Admin) */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Issue Verified Certificate</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate an official digital credential with cryptographic hash.
            </p>

            <form onSubmit={handleIssueSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Student *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo}) - @{s.username}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event / Activity *
                </label>
                <select
                  value={selectedEventTitle}
                  onChange={(e) => setSelectedEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.title}>
                      {ev.title} ({ev.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Achievement / Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Winner">Winner (1st / 2nd / 3rd Place)</option>
                  <option value="Participant">Active Participant</option>
                  <option value="Organizer">Student Organizer</option>
                  <option value="Merit Award">Special Merit Award</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Authorizing Signature Title
                </label>
                <input
                  type="text"
                  value={signatureTitle}
                  onChange={(e) => setSignatureTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs"
                >
                  Generate & Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
