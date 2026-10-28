import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  KeyRound, 
  Copy, 
  Check, 
  Mail, 
  Phone, 
  Building2, 
  Eye, 
  EyeOff,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { StudentUser } from '../../types';

interface ManageStudentsProps {
  showAddModalDirect?: boolean;
  onCloseAddModal?: () => void;
}

export const ManageStudents: React.FC<ManageStudentsProps> = ({ 
  showAddModalDirect = false,
  onCloseAddModal
}) => {
  const { students, addStudent, deleteStudent } = usePortal();
  
  const [showAddModal, setShowAddModal] = useState(showAddModalDirect);
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState<{ [id: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add Student Form State
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !rollNo || !username || !password || !email) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const res = addStudent({
      name,
      rollNo,
      username,
      password,
      email,
      department: 'Class Student',
      phone: phone || '+1 (555) 234-5678',
    });

    if (!res.success) {
      setErrorMessage(res.message || 'Error enrolling student.');
      return;
    }

    // Reset Form
    setName('');
    setRollNo('');
    setUsername('');
    setPassword('');
    setEmail('');
    setPhone('');
    setShowAddModal(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  const togglePasswordReveal = (studentId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const copyCredentials = (student: StudentUser) => {
    const text = `Najah Portal Credentials\nName: ${student.name}\nUsername: ${student.username}\nPassword: ${student.password}\nLogin at: najah-portal`;
    navigator.clipboard.writeText(text);
    setCopiedId(student.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#086a7e] dark:text-teal-400 mb-1">
            <Users className="w-4 h-4" />
            <span>Class Student Directory</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Manage Students & Credentials
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin creates student accounts with login username & password. Only enrolled students can log in.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, roll no, user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#086a7e] text-white hover:bg-[#065464] transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* Zero Students Notice */}
      {students.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-100 text-[#086a7e] flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Students Currently Enrolled
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            The student database is completely empty as requested. Click the button below to add your first student with their designated <strong>Username</strong> and <strong>Password</strong>.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-5 px-5 py-2.5 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-2xl shadow-md transition-all"
          >
            + Enroll First Student
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700">
              Total Enrolled: <span className="font-mono text-[#086a7e]">{filteredStudents.length} Students</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Students log in via Student portal using their assigned credentials.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Login Username</th>
                  <th className="py-3 px-4">Login Password</th>
                  <th className="py-3 px-4 text-center">Registrations</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const isRevealed = revealedPasswords[student.id];
                  const isCopied = copiedId === student.id;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{student.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{student.email}</div>
                        </div>
                      </td>

                      {/* Roll No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {student.rollNo}
                      </td>

                      {/* Contact / Phone */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                        {student.phone || 'N/A'}
                      </td>

                      {/* Username */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#086a7e]">
                        @{student.username}
                      </td>

                      {/* Password */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80 font-mono text-xs">
                          <span>{isRevealed ? student.password : '••••••••'}</span>
                          <button
                            type="button"
                            onClick={() => togglePasswordReveal(student.id)}
                            className="text-slate-400 hover:text-slate-600"
                            title={isRevealed ? 'Hide Password' : 'Show Password'}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Registrations count */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                        {student.registeredEventIds.length} Events
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => copyCredentials(student)}
                            className="p-1.5 text-slate-500 hover:text-[#086a7e] hover:bg-teal-50 rounded-lg transition-colors"
                            title="Copy Student Login Details"
                          >
                            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete student ${student.name}?`)) {
                                deleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#086a7e] dark:text-teal-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Enroll New Student</h3>
                  <p className="text-xs text-slate-400">Create student credentials for class portal login</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  if (onCloseAddModal) onCloseAddModal();
                }}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Al-Mansoor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Roll Number / Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NJH-2026-001"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                  />
                </div>
              </div>

              {/* Credentials Highlighted Box */}
              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 space-y-3">
                <div className="text-xs font-bold text-[#085a6b] dark:text-teal-300 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" />
                  <span>Portal Login Credentials (Used by Student to Sign In)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Login Username *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. tariq_m"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-slate-800 font-mono text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Login Password *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. student123"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-slate-800 font-mono text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@class.portal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    if (onCloseAddModal) onCloseAddModal();
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-xl shadow-md"
                >
                  Confirm & Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
