import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ShieldCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AppUser, isAuthorizedAdmin, AUTHORIZED_ADMIN_EMAILS } from '../types';
import { loginWithEmail, registerWithEmail, loginQuickGuest } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserLoggedIn: (user: AppUser) => void;
  isAdminLogin?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onUserLoggedIn,
  isAdminLogin = false,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Quick Guest Login fields
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [showQuickGuest, setShowQuickGuest] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    const result = await loginWithEmail(email, password);
    setIsLoading(false);

    if (result.success && result.user) {
      const authorized = isAuthorizedAdmin(result.user.email);
      if (isAdminLogin && !authorized) {
        setErrorMessage(
          `লগ ইন সফল হয়েছে, তবে '${result.user.email}' অ্যাডমিন হিসেবে অনুমোদিত নয়! অ্যাডমিন প্যানেলে শুধুমাত্র Sunny.travelcareexpress@gmail.com ও Official.sunny.ext@gmail.com এক্সেস করতে পারবে।`
        );
        onUserLoggedIn(result.user);
        return;
      }

      setSuccessMessage(
        authorized
          ? 'স্বাগতম অ্যাডমিন! প্যানেল এক্সেস অনুমোদিত হয়েছে।'
          : 'সফলভাবে লগ ইন সম্পন্ন হয়েছে!'
      );
      onUserLoggedIn(result.user);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMessage(result.error || 'লগ ইন করতে ব্যর্থ হয়েছে।');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password.length < 6) {
      setErrorMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    setIsLoading(true);
    const result = await registerWithEmail(email, password, name, phone);
    setIsLoading(false);

    if (result.success && result.user) {
      setSuccessMessage('একাউন্ট সফলভাবে তৈরি হয়েছে!');
      onUserLoggedIn(result.user);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMessage(result.error || 'রেজিস্ট্রেশন করতে ব্যর্থ হয়েছে।');
    }
  };

  const handleQuickGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার নাম দিন।');
      return;
    }
    setIsLoading(true);
    const result = await loginQuickGuest(quickName.trim(), quickPhone.trim());
    setIsLoading(false);

    if (result.success && result.user) {
      setSuccessMessage('গেস্ট হিসেবে লগ ইন হয়েছে!');
      onUserLoggedIn(result.user);
      setTimeout(() => {
        onClose();
      }, 600);
    } else {
      setErrorMessage('লগ ইন করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Inter',_'Hind_Siliguri',_sans-serif]">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-[#111827] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {tab === 'login' ? 'Zenmart একাউন্টে লগ ইন' : 'নতুন একাউন্ট তৈরি করুন'}
              </h3>
              <p className="text-[11px] text-slate-300">
                Firebase Authentication সুরক্ষিত
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMessage('');
              setShowQuickGuest(false);
            }}
            className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors border-b-2 ${
              tab === 'login'
                ? 'border-[#111827] bg-white text-[#111827] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>লগ ইন (Log In)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMessage('');
              setShowQuickGuest(false);
            }}
            className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors border-b-2 ${
              tab === 'register'
                ? 'border-[#111827] bg-white text-[#111827] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>নতুন একাউন্ট (Sign Up)</span>
          </button>
        </div>

        {/* Alerts */}
        <div className="p-6 pt-5">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' && !showQuickGuest && (
            <form onSubmit={handleLogin} className="space-y-4">
              {isAdminLogin && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-2 mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>অ্যাডমিন একাউন্ট ভেরিফিকেশন</span>
                  </div>
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    অ্যাডমিন প্যানেল লক করা। শুধুমাত্র নিচের ২টি অনুমোদিত ইমেইল থেকে লগ ইন করলে এক্সেস মিলবে:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-1.5 pt-0.5">
                    {AUTHORIZED_ADMIN_EMAILS.map((adminMail) => (
                      <button
                        key={adminMail}
                        type="button"
                        onClick={() => setEmail(adminMail)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100 border border-blue-300 text-[11px] font-mono text-blue-800 font-bold transition-colors text-left truncate shadow-2xs"
                        title="ক্লিক করে এই ইমেইলটি ইনপুটে বসান"
                      >
                        {adminMail}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ইমেইল এড্রেস (Email)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full h-10 pl-10 pr-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  পাসওয়ার্ড (Password)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 pl-10 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#111827] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>লগ ইন করুন</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowQuickGuest(true)}
                  className="text-xs text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  দ্রুত নাম ও ফোন দিয়ে ইনস্ট্যান্ট লগ ইন করুন
                </button>
              </div>
            </form>
          )}

          {/* QUICK GUEST LOGIN */}
          {tab === 'login' && showQuickGuest && (
            <form onSubmit={handleQuickGuestLogin} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                পাসওয়ার্ড ছাড়াই শুধু নাম ও ফোন দিয়ে দ্রুত অর্ডার করতে পারেন।
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  আপনার নাম (Full Name) *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="e.g. তানভীর আহমেদ"
                    className="w-full h-10 pl-10 pr-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  মোবাইল নম্বর (Phone Number)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full h-10 pl-10 pr-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>কনটিনিউ করুন (Guest Log In)</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowQuickGuest(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  ← সাধারণ ইমেইল লগ ইন-এ ফিরে যান
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  পুরো নাম (Full Name) *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার নাম"
                    className="w-full h-10 pl-10 pr-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মোবাইল নম্বর (Phone) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full h-10 pl-10 pr-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ইমেইল (Email) *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full h-10 pl-10 pr-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  পাসওয়ার্ড (Password) *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    className="w-full h-10 pl-10 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 mt-2 bg-[#111827] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>একাউন্ট তৈরি করুন</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>১০০% সুরক্ষিত ফায়ারবেস অথেনটিকেশন</span>
          </p>
        </div>
      </div>
    </div>
  );
};
