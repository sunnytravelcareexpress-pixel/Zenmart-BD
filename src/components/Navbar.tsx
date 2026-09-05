import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, User, LogIn, LogOut, Package, ChevronDown, X, MessageCircle, Shield, ShieldCheck } from 'lucide-react';
import { ZenmartLogo } from './ZenmartLogo';
import { CategoryId, AppUser, isAuthorizedAdmin } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTrackOrder: () => void;
  onOpenWhatsAppHelp: () => void;
  user: AppUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  cartCount,
  onOpenCart,
  onOpenTrackOrder,
  onOpenWhatsAppHelp,
  user,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e5e7eb] transition-all">
      {/* Primary Brand & Search Row */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => onSelectCategory('all')}>
          <ZenmartLogo size="md" />
        </div>

        {/* Search Bar matching screenshot */}
        <div className="flex-1 max-w-2xl mx-2 sm:mx-6">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-[#76777d] pointer-events-none" />
            <input
              type="text"
              id="global-product-search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search premium gadgets, smart home, ambient lighting..."
              className="w-full h-11 pl-10 pr-9 bg-[#ffffff] border border-[#e0e3e5] rounded-lg text-sm text-[#191c1e] placeholder-[#76777d] focus:outline-none focus:border-[#3B82F6] focus:ring-3 focus:ring-[#3B82F6]/15 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action icons: Cart & User Account */}
        <div className="flex items-center gap-3">
          {/* Cart Icon with badge */}
          <button
            id="open-cart-drawer-btn"
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full hover:bg-slate-100 text-[#191c1e] transition-colors flex items-center justify-center group"
            title="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#191c1e] group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#3B82F6] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Profile / Login */}
          {!user ? (
            <button
              onClick={onOpenAuth}
              id="navbar-login-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all shadow-xs"
              title="লগ ইন বা নতুন একাউন্ট"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগ ইন</span>
            </button>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                id="user-account-btn"
                className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 rounded-full transition-colors text-xs font-semibold text-slate-800"
                title="Account Menu"
              >
                <div className="w-6 h-6 rounded-full bg-[#111827] text-white flex items-center justify-center text-[11px] font-bold uppercase">
                  {user.displayName ? user.displayName.charAt(0) : 'U'}
                </div>
                <span className="max-w-[85px] sm:max-w-[110px] truncate hidden xs:inline">
                  {user.displayName || 'My Account'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user.displayName || 'Zenmart User'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {user.email || user.phoneNumber || 'Guest User'}
                    </p>
                  </div>

                  <div className="py-1">
                    {isAuthorizedAdmin(user.email) && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full px-4 py-2.5 text-xs text-slate-900 bg-blue-50/80 hover:bg-blue-100/80 flex items-center justify-between transition-colors text-left font-bold border-b border-blue-100"
                      >
                        <div className="flex items-center gap-2.5">
                          <Shield className="w-3.5 h-3.5 text-blue-600" />
                          <span>অ্যাডমিন কনসোল (Admin)</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono leading-none">
                          ADMIN
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenTrackOrder();
                      }}
                      className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors text-left"
                    >
                      <Package className="w-3.5 h-3.5 text-blue-600" />
                      <span>আমার অর্ডার সমূহ (My Orders)</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>লগ আউট (Log Out)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Category Navigation & Live Indicator */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#f2f4f6]">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-none py-2 gap-4 text-sm font-medium">
          {/* Categories matching Image 3 */}
          <div className="flex items-center gap-1.5 flex-nowrap">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#111827] text-white'
                  : 'text-[#45464c] hover:bg-slate-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onSelectCategory('gadgets')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === 'gadgets'
                  ? 'bg-[#111827] text-white'
                  : 'text-[#45464c] hover:bg-slate-100'
              }`}
            >
              Gadgets
            </button>
            <button
              onClick={() => onSelectCategory('home-decor')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === 'home-decor'
                  ? 'bg-[#111827] text-white'
                  : 'text-[#45464c] hover:bg-slate-100'
              }`}
            >
              Home Decor
            </button>
            <button
              onClick={() => onSelectCategory('ambient-lighting')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedCategory === 'ambient-lighting'
                  ? 'bg-[#111827] text-white'
                  : 'text-[#45464c] hover:bg-slate-100'
              }`}
            >
              Ambient Lighting
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

            <button
              onClick={onOpenTrackOrder}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#45464c] hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Track Order
            </button>
          </div>

          {/* Right Live Indicator: Direct WhatsApp Instant Order Available */}
          <div
            onClick={onOpenWhatsAppHelp}
            className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#45464c] hover:text-[#111827] transition-colors whitespace-nowrap flex-shrink-0"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[13px] text-slate-700 font-medium flex items-center gap-1">
              Direct WhatsApp Instant Order Available
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] inline ml-0.5" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
