import React, { useState, useRef } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  User,
  Phone,
  MapPin,
  Camera,
  CheckCircle2,
  X,
  Upload,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { StudentUser } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateStudentProfile } = usePortal();
  const isAdmin = currentUser?.role === 'admin';
  const student = !isAdmin ? (currentUser as StudentUser) : null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar Photo State
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  // Personal Details
  const [fullName, setFullName] = useState(student?.name || currentUser?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(student?.dateOfBirth || '');
  const [gender, setGender] = useState(student?.gender || '');
  const [bloodGroup, setBloodGroup] = useState(student?.bloodGroup || '');
  const [nationality, setNationality] = useState(student?.nationality || 'Indian');
  const [religion, setReligion] = useState(student?.religion || '');
  const [community, setCommunity] = useState(student?.community || '');
  const [category, setCategory] = useState(student?.category || 'General');
  const [motherTongue, setMotherTongue] = useState(student?.motherTongue || '');
  const [birthplace, setBirthplace] = useState(student?.birthplace || '');
  const [identificationMarks, setIdentificationMarks] = useState(student?.identificationMarks || '');

  // Contact Details
  const [email, setEmail] = useState(student?.email || currentUser?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');
  const [mobile, setMobile] = useState(student?.mobile || student?.phone || '');
  const [whatsapp, setWhatsapp] = useState(student?.whatsapp || '');

  // Address Details
  const [cityTown, setCityTown] = useState(student?.cityTown || '');
  const [state, setState] = useState(student?.state || '');
  const [taluk, setTaluk] = useState(student?.taluk || '');
  const [panchayath, setPanchayath] = useState(student?.panchayath || '');
  const [postOffice, setPostOffice] = useState(student?.postOffice || '');
  const [pinCode, setPinCode] = useState(student?.pinCode || '');
  const [fullAddress, setFullAddress] = useState(student?.fullAddress || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !currentUser) return null;

  // Handle local photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (student) {
      updateStudentProfile(student.id, {
        name: fullName.trim() || student.name,
        avatar,
        dateOfBirth,
        gender,
        bloodGroup,
        nationality,
        religion,
        community,
        category,
        motherTongue,
        birthplace,
        identificationMarks,
        email,
        phone,
        mobile,
        whatsapp,
        cityTown,
        state,
        taluk,
        panchayath,
        postOffice,
        pinCode,
        fullAddress,
      });
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden my-auto">
        
        {/* Top Header - Exact match to image_9c33410f.png */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-white dark:bg-slate-900 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              My details
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Fill in your details. You can save and continue later. Once you submit, changes need the admin&apos;s approval.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          
          {savedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Details and photo updated successfully!</span>
            </div>
          )}

          {/* Photo Adding & Editing Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group shrink-0">
              <img
                src={avatar || currentUser.avatar}
                alt={fullName || currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-teal-500/20 shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/40 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs cursor-pointer"
                title="Upload Photo"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">Change Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2.5 w-full">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  Profile Photo System
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e6f7f7] text-[#0b5e70] dark:bg-teal-950/70 dark:text-teal-300">
                  {isAdmin ? 'Admin' : 'Student'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload your picture from your device, choose from class presets, or paste an image URL.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-[#0b5e70] hover:bg-[#084b5a] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Device Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{showPhotoPicker ? 'Hide Presets' : 'Choose Preset Avatar'}</span>
                </button>

                {avatar !== currentUser.avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar(currentUser.avatar)}
                    className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-medium flex items-center gap-1"
                    title="Reset to default"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Preset Avatars Gallery */}
              {showPhotoPicker && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-2 space-y-2">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    Select a preset class avatar:
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((presetUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(presetUrl)}
                        className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          avatar === presetUrl
                            ? 'border-[#0b5e70] ring-2 ring-teal-500/40 scale-105'
                            : 'border-transparent hover:opacity-80'
                        }`}
                      >
                        <img src={presetUrl} alt="Preset avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="url"
                      placeholder="Or paste external photo link (https://...)"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrl.trim()) {
                          setAvatar(customUrl.trim());
                          setCustomUrl('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CARD 1: PERSONAL DETAILS (Exact match to image_9c33410f.png) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-black tracking-wider text-[#0b5e70] dark:text-teal-400 uppercase">
              <User className="w-4 h-4" />
              <span>PERSONAL DETAILS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* FULL NAME */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                  required
                />
              </div>

              {/* DATE OF BIRTH */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  DATE OF BIRTH
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* GENDER */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  GENDER
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                >
                  <option value="">— Select Gender —</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* BLOOD GROUP */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  BLOOD GROUP
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                >
                  <option value="">— Select Group —</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              {/* NATIONALITY */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  NATIONALITY
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="e.g. Indian"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* RELIGION */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  RELIGION
                </label>
                <input
                  type="text"
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  placeholder="e.g. Islam / Christianity / Hinduism"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* COMMUNITY */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  COMMUNITY
                </label>
                <input
                  type="text"
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  placeholder="Community name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  CATEGORY
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. General, OBC, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* MOTHER TONGUE */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  MOTHER TONGUE
                </label>
                <input
                  type="text"
                  value={motherTongue}
                  onChange={(e) => setMotherTongue(e.target.value)}
                  placeholder="e.g. Malayalam, English, Arabic"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* BIRTHPLACE */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  BIRTHPLACE
                </label>
                <input
                  type="text"
                  value={birthplace}
                  onChange={(e) => setBirthplace(e.target.value)}
                  placeholder="City or Hospital of birth"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* IDENTIFICATION MARKS */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  IDENTIFICATION MARKS
                </label>
                <textarea
                  rows={2}
                  value={identificationMarks}
                  onChange={(e) => setIdentificationMarks(e.target.value)}
                  placeholder="e.g. A mole on the right cheek or collarbone"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* CARD 2: CONTACT DETAILS (Exact match to image_9c33410f.png) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-black tracking-wider text-[#0b5e70] dark:text-teal-400 uppercase">
              <Phone className="w-4 h-4" />
              <span>CONTACT DETAILS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* EMAIL */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                  required
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  PHONE
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 00000 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* MOBILE */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  MOBILE
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Primary mobile"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* WHATSAPP */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  WHATSAPP
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="WhatsApp phone number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>
            </div>
          </div>

          {/* CARD 3: ADDRESS DETAILS (Exact match to image_4c9427f5.png) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-black tracking-wider text-[#0b5e70] dark:text-teal-400 uppercase">
              <MapPin className="w-4 h-4" />
              <span>ADDRESS DETAILS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* CITY / TOWN */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  CITY / TOWN
                </label>
                <input
                  type="text"
                  value={cityTown}
                  onChange={(e) => setCityTown(e.target.value)}
                  placeholder="Enter city or town"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* STATE */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  STATE
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* TALUK */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  TALUK
                </label>
                <input
                  type="text"
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  placeholder="Taluk name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* PANCHAYATH */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  PANCHAYATH
                </label>
                <input
                  type="text"
                  value={panchayath}
                  onChange={(e) => setPanchayath(e.target.value)}
                  placeholder="Panchayath / Municipality"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* POST OFFICE */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  POST OFFICE
                </label>
                <input
                  type="text"
                  value={postOffice}
                  onChange={(e) => setPostOffice(e.target.value)}
                  placeholder="Branch post office"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* PIN CODE */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  PIN CODE
                </label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="6-digit PIN"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all"
                />
              </div>

              {/* FULL ADDRESS */}
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  FULL ADDRESS
                </label>
                <textarea
                  rows={3}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House number, street, landmark, area..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0b5e70]/20 focus:border-[#0b5e70] outline-hidden transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0b5e70] to-teal-600 hover:to-teal-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Submit Details</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
