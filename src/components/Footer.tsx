import React from 'react';
import { MessageCircle, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { CategoryId } from '../types';
import { ZenmartLogo } from './ZenmartLogo';

interface FooterProps {
  onSelectCategory: (cat: CategoryId) => void;
  onOpenTrackOrder: () => void;
  onOpenAdmin: () => void;
  onOpenWhatsApp: () => void;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTrackOrder,
  onOpenAdmin,
  onOpenWhatsApp,
  isAdmin = false,
}) => {
  return (
    <footer className="bg-white border-t border-[#e5e7eb] pt-12 pb-16 relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <ZenmartLogo size="md" />
            <p className="text-xs sm:text-[13px] text-[#76777d] leading-relaxed max-w-sm">
              Curated contemporary tech gadgets and aesthetic lifestyle home decor across Bangladesh with prompt verified delivery.
            </p>

            <button
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827] text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Helpline: +880 1831-446111</span>
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#45464c]">
              <li>
                <button
                  onClick={() => onSelectCategory('gadgets')}
                  className="hover:text-[#111827] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  Smart Wearables & Gadgets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('home-decor')}
                  className="hover:text-[#111827] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  Minimalist Home Decor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('ambient-lighting')}
                  className="hover:text-[#111827] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  Desk & Ambient Lighting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('desk-setup')}
                  className="hover:text-[#111827] transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  Acoustic & Audio Systems
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#45464c]">
              <li>
                <button
                  onClick={onOpenTrackOrder}
                  className="hover:text-[#111827] transition-colors flex items-center gap-1.5 font-medium text-blue-600"
                >
                  <ArrowRight className="w-3 h-3" />
                  Track Your Shipment
                </button>
              </li>
              <li>
                <span className="hover:text-[#111827] transition-colors cursor-pointer flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  7-Day Easy Return Policy
                </span>
              </li>
              <li>
                <span className="hover:text-[#111827] transition-colors cursor-pointer flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  Official Brand Warranty
                </span>
              </li>
              <li>
                <span className="hover:text-[#111827] transition-colors cursor-pointer flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>

          {/* Accepted Payment Methods */}
          <div>
            <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-2">
              Accepted Payment Methods
            </h4>
            <p className="text-xs text-[#76777d] mb-4">
              100% secure automated checkout & cash on receipt anywhere in BD:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {/* bKash */}
              <div className="bg-[#f8f9fb] border border-[#e5e7eb] rounded-lg p-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-[#e2136e] text-white text-[10px] font-black flex items-center justify-center">
                  bK
                </span>
                <span className="text-xs font-semibold text-slate-800">bKash</span>
              </div>

              {/* Nagad */}
              <div className="bg-[#f8f9fb] border border-[#e5e7eb] rounded-lg p-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-[#f7941d] text-white text-[10px] font-black flex items-center justify-center">
                  ন
                </span>
                <span className="text-xs font-semibold text-slate-800">Nagad</span>
              </div>

              {/* Rocket */}
              <div className="bg-[#f8f9fb] border border-[#e5e7eb] rounded-lg p-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-[#8c3494] text-white text-[10px] font-black flex items-center justify-center">
                  R
                </span>
                <span className="text-xs font-semibold text-slate-800">Rocket</span>
              </div>

              {/* Cash on Delivery */}
              <div className="bg-[#f8f9fb] border border-[#e5e7eb] rounded-lg p-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-[#059669] text-white text-[10px] font-black flex items-center justify-center">
                  COD
                </span>
                <span className="text-xs font-semibold text-slate-800">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar matching screenshot */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#76777d]">
          {/* Admin Console Pill Button on bottom left as in screenshot - Only visible to authorized admins */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                id="footer-admin-console-btn"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111827] text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Admin Console</span>
              </button>
            )}
            <span>© 2025 Zenmart BD. All rights reserved.</span>
          </div>

          <div className="text-center sm:text-right">
            <span>Crafted for modern homes and tech enthusiasts in Bangladesh.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
