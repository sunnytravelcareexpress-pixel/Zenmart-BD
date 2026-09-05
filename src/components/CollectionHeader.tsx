import React from 'react';
import { ChevronDown } from 'lucide-react';
import { CategoryId } from '../types';

interface CollectionHeaderProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  categoryCounts: { [key in CategoryId]: number };
  sortBy: string;
  onSortChange: (sort: string) => void;
  showingCount: number;
  totalCount: number;
}

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  sortBy,
  onSortChange,
  showingCount,
  totalCount,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Filter Chips & Hub Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'bg-white text-[#45464c] border border-[#e0e3e5] hover:border-slate-400'
            }`}
          >
            All ({categoryCounts['all'] || 0})
          </button>
          <button
            onClick={() => onSelectCategory('gadgets')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'gadgets'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'bg-white text-[#45464c] border border-[#e0e3e5] hover:border-slate-400'
            }`}
          >
            Gadgets ({categoryCounts['gadgets'] || 0})
          </button>
          <button
            onClick={() => onSelectCategory('home-decor')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'home-decor'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'bg-white text-[#45464c] border border-[#e0e3e5] hover:border-slate-400'
            }`}
          >
            Home Decor ({categoryCounts['home-decor'] || 0})
          </button>
          <button
            onClick={() => onSelectCategory('desk-setup')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'desk-setup'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'bg-white text-[#45464c] border border-[#e0e3e5] hover:border-slate-400'
            }`}
          >
            Desk Setup ({categoryCounts['desk-setup'] || 0})
          </button>
          <button
            onClick={() => onSelectCategory('ambient-lighting')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'ambient-lighting'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'bg-white text-[#45464c] border border-[#e0e3e5] hover:border-slate-400'
            }`}
          >
            Ambient Lighting ({categoryCounts['ambient-lighting'] || 0})
          </button>
        </div>

        {/* Right side: Dhaka Central Hub badge and Sort dropdown */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#e5e7eb] text-xs font-medium text-slate-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Dhaka Central Hub: <strong className="text-emerald-700">Ready to Ship</strong></span>
          </div>

          <div className="relative inline-block">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-white border border-[#e5e7eb] rounded-lg px-3.5 py-1.5 pr-8 text-xs font-semibold text-[#191c1e] hover:border-slate-400 focus:outline-none focus:border-[#3B82F6] cursor-pointer shadow-xs"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
              <option value="rating">Top Customer Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Collection Title & Count Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-3 gap-2">
        <div>
          <h2 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#111827]">
            Curated In-Stock Collection
          </h2>
          <p className="text-xs sm:text-sm text-[#76777d] mt-0.5">
            Original verified products. Pay cash only after unboxing & inspection.
          </p>
        </div>

        <div className="text-xs text-[#76777d] font-medium self-start sm:self-auto whitespace-nowrap">
          Showing <span className="font-bold text-[#111827]">{showingCount}</span> of {totalCount} premium products
        </div>
      </div>
    </div>
  );
};
