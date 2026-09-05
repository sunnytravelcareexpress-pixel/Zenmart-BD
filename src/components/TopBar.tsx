import React from 'react';
import { Truck, Phone, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  onOpenAdmin: () => void;
  onOpenWhatsAppHelp: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenAdmin, onOpenWhatsAppHelp }) => {
  return (
    <div className="bg-[#f8f9fb] border-b border-[#e5e7eb] text-[12px] font-medium text-[#45464c] py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Cash on Delivery promise */}
        <div className="flex items-center gap-2 text-emerald-700">
          <Truck className="w-3.5 h-3.5" />
          <span className="text-[#191c1e] font-semibold">Cash on Delivery All Over Bangladesh</span>
        </div>

        {/* Right actions: Hotline & Admin Login */}
        <div className="flex items-center gap-5">
          <button
            onClick={onOpenWhatsAppHelp}
            className="flex items-center gap-1.5 hover:text-[#111827] transition-colors"
            title="Call or WhatsApp Customer Helpline"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hotline: <strong className="text-[#191c1e] tracking-tight">+880 1831-446111</strong></span>
          </button>

          <div className="h-3 w-px bg-slate-300 hidden sm:block" />

          <button
            onClick={onOpenAdmin}
            id="top-admin-login-btn"
            className="flex items-center gap-1 text-[#45464c] hover:text-[#111827] transition-colors font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>Admin Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
