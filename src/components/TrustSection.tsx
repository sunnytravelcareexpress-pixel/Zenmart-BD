import React from 'react';
import { Banknote, RefreshCw, MessageSquare } from 'lucide-react';

interface TrustSectionProps {
  onOpenWhatsApp: () => void;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ onOpenWhatsApp }) => {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: 100% Cash on Delivery */}
        <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-xs flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <Banknote className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-[#111827]">
              100% Cash on Delivery
            </h4>
            <p className="text-xs sm:text-[13px] text-[#76777d] leading-relaxed">
              Check parcel contents in front of the courier rider before handing over money.
            </p>
          </div>
        </div>

        {/* Card 2: 7-Day Free Replacement */}
        <div className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-xs flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-[#111827]">
              7-Day Free Replacement
            </h4>
            <p className="text-xs sm:text-[13px] text-[#76777d] leading-relaxed">
              Any defects or electrical failure? We pick up & replace with zero hassle.
            </p>
          </div>
        </div>

        {/* Card 3: Direct WhatsApp Hotline */}
        <div
          onClick={onOpenWhatsApp}
          className="bg-white rounded-2xl p-6 border border-[#e5e7eb] shadow-xs flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center flex-shrink-0 border border-emerald-200 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-[#111827] group-hover:text-[#059669] transition-colors">
              Direct WhatsApp Hotline
            </h4>
            <p className="text-xs sm:text-[13px] text-[#76777d] leading-relaxed">
              Need actual unboxing videos or dimensions? Send a message anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
