import React, { useState } from 'react';
import { X, Search, PackageCheck, Truck, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import { Order } from '../types';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const [searchTerm, setSearchTerm] = useState('ZB-9241');
  const [foundOrder, setFoundOrder] = useState<Order | null>(
    orders.find((o) => o.id === 'ZB-9241') || orders[0] || null
  );
  const [hasSearched, setHasSearched] = useState(true);

  if (!isOpen) return null;

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    const result = orders.find(
      (o) => o.id.toLowerCase() === term || o.phone.replace(/[^0-9]/g, '').includes(term.replace(/[^0-9]/g, ''))
    );
    setFoundOrder(result || null);
    setHasSearched(true);
  };

  const steps = [
    { label: 'Order Confirmed', sub: 'Hub team verified order', icon: Clock },
    { label: 'Dhaka Hub QC & Packed', sub: 'Passed 3-point inspection', icon: PackageCheck },
    { label: 'Dispatched via Courier', sub: 'Steadfast Express Hub', icon: Truck },
    { label: 'Delivered / Ready for COD', sub: 'Unbox & inspect before payment', icon: CheckCircle2 },
  ];

  const getStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'out_for_delivery': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStep = foundOrder ? getStepIndex(foundOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#f8f9fb]">
          <div>
            <h3 className="text-base font-bold text-[#111827]">
              Track Your Shipment
            </h3>
            <p className="text-xs text-slate-500">
              Live updates from Dhaka Central Fulfillment & Courier Partner
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Search Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Enter Order ID or Mobile Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. ZB-9241 or 01712..."
                  className="w-full h-11 px-3.5 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:outline-none focus:border-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-5 h-11 bg-[#111827] text-white rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track</span>
              </button>
            </div>

            {/* Quick Test Samples */}
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
              <span>Quick tests:</span>
              {orders.slice(0, 3).map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSearchTerm(o.id);
                    setFoundOrder(o);
                    setHasSearched(true);
                  }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono text-[10px]"
                >
                  {o.id}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {hasSearched && foundOrder ? (
            <div className="space-y-5 pt-2 border-t border-slate-100">
              {/* Order Status Ribbon */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-900">
                      {foundOrder.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {foundOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Placed on: {foundOrder.createdAt} • Courier: {foundOrder.trackingNumber}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Total Due:</span>
                  <span className="font-mono font-bold text-emerald-700 text-base">
                    ৳{foundOrder.total.toLocaleString()} (COD)
                  </span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="py-2">
                <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {steps.map((step, idx) => {
                    const isPassed = idx <= currentStep;
                    const isCurrent = idx === currentStep;
                    const Icon = step.icon;

                    return (
                      <div key={idx} className="relative flex items-start gap-4 pl-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center z-10 text-xs font-bold ${
                            isPassed
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white border-2 border-slate-300 text-slate-400'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <h4
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-emerald-700'
                                : isPassed
                                ? 'text-slate-900'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p className="text-[11px] text-slate-500">{step.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Destination & Recipient */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Delivery Address:</span>
                </div>
                <p className="text-slate-600 pl-5 leading-relaxed">
                  {foundOrder.customerName} • {foundOrder.address}, {foundOrder.city}
                </p>
                <div className="flex items-center gap-2 text-slate-500 pl-5 text-[11px]">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>Contact: {foundOrder.phone}</span>
                </div>
              </div>

              {/* Items in parcel */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">
                  Items in Package:
                </h4>
                <div className="space-y-2">
                  {foundOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-8 h-8 rounded object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1">{item.product.name}</p>
                          <p className="text-[10px] text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-700">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <p className="text-xs text-slate-500">No order found matching "{searchTerm}".</p>
              <p className="text-[11px] text-slate-400">Please verify your order reference or phone number.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
