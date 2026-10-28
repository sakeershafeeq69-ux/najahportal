import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Role } from '../types';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle,
  HelpCircle,
  Info,
  Sun,
  Moon
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, students, customLogo, isDarkMode, toggleDarkMode } = usePortal();
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      if (students.length > 0) {
        setUsername(students[0].username);
        setPassword(students[0].password);
      } else {
        setUsername('');
        setPassword('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = login(selectedRole, username, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#072430] flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background subtle radial glow */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Right Quick Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 text-xs font-bold"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-200" />}
          <span className="hidden sm:inline">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      {/* Class Logo & Brand Title */}
      <div className="text-center mb-6 z-10 flex flex-col items-center">
        <img
          src={customLogo}
          alt="NAJAH Logo"
          className="w-24 h-24 object-contain drop-shadow-xl mb-3 hover:scale-105 transition-transform"
        />
        <h1 className="text-2xl font-black tracking-wider text-white uppercase drop-shadow-xs">
          Najah Portal
        </h1>
        <p className="text-xs text-teal-200/80 font-medium tracking-wide mt-0.5">
          Smart AI Class Platform
        </p>
      </div>

      {/* Main Sign-In Card matching the user's reference mockup */}
      <div className="w-full max-w-sm sm:max-w-md shadow-2xl rounded-3xl overflow-hidden z-10 border border-teal-900/40">
        
        {/* Top Header Card (Teal Gradient with Lock Icon) */}
        <div className="bg-gradient-to-b from-[#0b6a7e] to-[#075363] px-6 pt-8 pb-7 text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-inner mb-3">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Sign In
          </h2>
          <p className="text-xs text-teal-100 font-normal mt-1">
            Use your credentials to access the portal
          </p>
        </div>

        {/* White Body Form */}
        <div className="bg-white p-6 sm:p-8 space-y-5">
          
          {/* Role Selector: Admin and Student Only */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2.5">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-[#e7f5f7] border-[#0a7a92] text-[#085a6b] shadow-xs ring-1 ring-[#0a7a92]'
                    : 'bg-slate-50/80 border-slate-200/90 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                  selectedRole === 'admin' ? 'bg-[#086a7e] text-white' : 'text-slate-400'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Admin</span>
              </button>

              {/* Student Button */}
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${
                  selectedRole === 'student'
                    ? 'bg-[#e7f5f7] border-[#0a7a92] text-[#085a6b] shadow-xs ring-1 ring-[#0a7a92]'
                    : 'bg-slate-50/80 border-slate-200/90 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                  selectedRole === 'student' ? 'bg-[#086a7e] text-white' : 'text-slate-400'
                }`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Student</span>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-black placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0a7a92] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-black placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0a7a92] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0a7a92] focus:ring-[#0a7a92]"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="font-semibold text-[#0a7a92] hover:text-[#075363] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-[#086a7e] hover:bg-[#065464] active:scale-[0.99] text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-[#086a7e]/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          </form>

          {/* Context Notice regarding Student Accounts */}
          {selectedRole === 'student' && (
            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100 text-teal-900 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#0a7a92]" />
              <div>
                <span className="font-bold">Student Notice:</span> Only Admin can enroll students. If you haven't received your credentials yet, contact the Class Administrator.
                {students.length > 0 && (
                  <div className="mt-1 font-mono text-[11px] text-teal-800">
                    Enrolled ({students.length}): {students.map(s => s.username).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin Demo Helper */}
          {selectedRole === 'admin' && (
            <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              Default Admin: <strong className="text-slate-700 font-mono">admin</strong> / <strong className="text-slate-700 font-mono">admin123</strong>
            </div>
          )}

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Account Recovery</h3>
            <p className="text-xs text-slate-500 mt-1">
              For security reasons, password resets are handled through the Class Director Office.
            </p>
            <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div><strong>Admin Password:</strong> Can be updated anytime inside Admin Settings. Default is <code className="text-[#0a7a92]">admin123</code>.</div>
              <div><strong>Student Password:</strong> Please request your Class Incharge or Admin to view or reset your password in the Student Management directory.</div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#086a7e] hover:bg-[#065464] rounded-xl"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
