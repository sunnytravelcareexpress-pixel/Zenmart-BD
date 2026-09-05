import React, { useState } from 'react';
import { X, MessageCircle, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onWhatsAppOrder: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onWhatsAppOrder,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-[#f8f9fb]">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {product.brandSeries} • SKU: {product.sku}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Product Image */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-square border border-slate-200">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <div className="absolute top-3 left-3 bg-[#111827] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Right: Key Details */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                <h2 className="text-xl font-bold text-[#111827] leading-snug">
                  {product.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {product.subtitle}
                </p>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl font-black text-[#059669] font-mono">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ml-auto">
                  {product.discountPercent}% OFF
                </span>
              </div>

              {/* Stock status */}
              {product.inStock ? (
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Dhaka Central Hub: In Stock ({product.stockCount} available)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-2 rounded-lg border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>স্টক শেষ (Out of Stock) — এই পণ্যটি বর্তমানে উপলব্ধ নেই</span>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity and Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">Qty:</span>
                  <div className={`flex items-center border border-slate-200 rounded-lg overflow-hidden text-xs ${product.inStock ? 'bg-white' : 'bg-slate-100 opacity-60'}`}>
                    <button
                      disabled={!product.inStock}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-slate-100 font-bold text-slate-700 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold min-w-[28px] text-center">
                      {quantity}
                    </span>
                    <button
                      disabled={!product.inStock}
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 hover:bg-slate-100 font-bold text-slate-700 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  {product.inStock ? (
                    <button
                      onClick={handleAdd}
                      className="flex-1 h-10 px-4 rounded-xl bg-[#111827] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-xs"
                    >
                      {addedNotice ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 h-10 px-4 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 cursor-not-allowed"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-300" />
                      <span>স্টক শেষ (Out of Stock)</span>
                    </button>
                  )}
                </div>

                {product.inStock ? (
                  <button
                    onClick={() => {
                      onClose();
                      onWhatsAppOrder(product);
                    }}
                    className="w-full h-11 rounded-full bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#20bd5a] hover:shadow-[0_4px_14px_rgba(37,211,102,0.35)] transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                    <span>Instant Order via WhatsApp</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full h-11 rounded-full bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 cursor-not-allowed select-none"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>স্টক শেষ — অর্ডার গ্রহণ সাময়িকভাবে বন্ধ</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Features and Specs Tabs / Sections */}
          <div className="border-t border-slate-200 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Features */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Key Features
              </h4>
              <ul className="space-y-1.5">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Technical Specifications
              </h4>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-2">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-slate-200/60 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-slate-500">{key}</span>
                    <span className="font-semibold text-slate-800 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Value Badges in Modal */}
          <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">100% Cash on Delivery</p>
              <p className="text-[10px] text-slate-500">Inspect before paying</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <Truck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">24h Express Dispatch</p>
              <p className="text-[10px] text-slate-500">Dhaka Central Hub</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <RefreshCw className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">7-Day Free Return</p>
              <p className="text-[10px] text-slate-500">Zero hassle replacement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
