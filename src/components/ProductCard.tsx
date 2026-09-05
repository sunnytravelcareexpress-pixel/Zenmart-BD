import React from 'react';
import { MessageCircle, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onWhatsAppOrder: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onWhatsAppOrder,
  onAddToCart,
  onQuickView,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-3 sm:p-3.5 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#fafafa] mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top-Left Badge (Discount / Category tag) */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase bg-[#111827] text-white shadow-xs">
              {product.badge}
            </span>
          </div>
        )}

        {/* Bottom-Right Category Pill on Image */}
        <div className="absolute bottom-2.5 right-2.5 z-20">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs border border-white/40">
            {product.categoryLabel}
          </span>
        </div>

        {/* Out of Stock Prominent Image Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-rose-600/95 text-white font-bold text-[11px] sm:text-xs tracking-wide px-3 py-1.5 rounded-full shadow-lg border border-white/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>স্টক শেষ (Out of Stock)</span>
            </div>
          </div>
        )}

        {/* Quick View Floating Overlay on Hover */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
          <button
            onClick={() => onQuickView(product)}
            className="p-2.5 bg-white text-slate-800 rounded-full hover:bg-slate-100 active:scale-90 transition-all shadow-md"
            title="Quick View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {product.inStock && (
            <button
              onClick={() => onAddToCart(product)}
              className="p-2.5 bg-[#111827] text-white rounded-full hover:bg-slate-800 active:scale-90 transition-all shadow-md"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Brand Series in Muted Caps */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10.5px] font-semibold tracking-wider text-[#76777d] uppercase truncate">
              {product.brandSeries}
            </p>
            {!product.inStock && (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                স্টক শেষ
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-[14px] font-bold text-[#111827] line-clamp-1 hover:text-[#3B82F6] cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Subtitle description */}
          <p className="text-[12px] text-[#76777d] line-clamp-1 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing Block */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-baseline gap-2">
          <span className={`text-[19px] font-extrabold tabular-nums tracking-tight ${product.inStock ? 'text-[#059669]' : 'text-slate-500'}`}>
            ৳{product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs font-medium text-[#9CA3AF] line-through tabular-nums">
              ৳{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* WhatsApp Order Action Button */}
        <div className="mt-3">
          {product.inStock ? (
            <button
              id={`order-whatsapp-${product.id}`}
              onClick={() => onWhatsAppOrder(product)}
              className="w-full h-10 px-4 rounded-full bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#20bd5a] hover:shadow-[0_4px_14px_rgba(37,211,102,0.35)] active:scale-98 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>Order via WhatsApp</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full h-10 px-4 rounded-full bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 cursor-not-allowed select-none"
              title="এই পণ্যটির স্টক শেষ, তাই অর্ডার করা সম্ভব নয়।"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>স্টক শেষ (Out of Stock)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
