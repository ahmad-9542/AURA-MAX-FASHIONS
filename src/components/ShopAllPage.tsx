import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  DEPARTMENT_SUBCATEGORIES,
  PRODUCTS,
} from '../data/catalog';
import {
  BrandLine,
  CollectionName,
  Department,
  PriceRangeOption,
  Product,
  ProductSize,
  SortOption,
} from '../types';
import { ProductCard } from './ProductCard';

interface ShopAllPageProps {
  selectedDepartment: Department | 'All';
  onDepartmentChange: (dept: Department | 'All') => void;
  selectedSubCategory: string | 'All';
  onSubCategoryChange: (sub: string | 'All') => void;
  selectedCollection: CollectionName | 'All';
  onCollectionChange: (coll: CollectionName | 'All') => void;
  onlySale: boolean;
  onOnlySaleChange: (sale: boolean) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  wishlistIds: string[];
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product, size?: ProductSize) => void;
  onBackToStorefront: () => void;
}

const DEPARTMENTS: (Department | 'All')[] = [
  'All',
  'Men',
  'Women',
  'Footwear',
  'Accessories',
];

const BRANDS: BrandLine[] = [
  'AURA MAX',
  'AURA MAX Atelier',
  'AURA MAX Studio',
  'AURA MAX Archive',
];

const ALL_SIZES: ProductSize[] = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'UK 6',
  'UK 7',
  'UK 8',
  'UK 9',
  'UK 10',
  'UK 11',
  'One Size',
];

const COLLECTIONS: CollectionName[] = [
  'Urban Essentials',
  'Minimalist Classics',
  'Summer Collection',
  'Premium Streetwear',
];

export function ShopAllPage({
  selectedDepartment,
  onDepartmentChange,
  selectedSubCategory,
  onSubCategoryChange,
  selectedCollection,
  onCollectionChange,
  onlySale,
  onOnlySaleChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  wishlistIds,
  onSelectProduct,
  onToggleWishlist,
  onQuickAdd,
  onBackToStorefront,
}: ShopAllPageProps) {
  const [priceRange, setPriceRange] = useState<PriceRangeOption>('all');
  const [selectedSize, setSelectedSize] = useState<ProductSize | 'All'>('All');
  const [selectedColor, setSelectedColor] = useState<string | 'All'>('All');
  const [selectedBrand, setSelectedBrand] = useState<BrandLine | 'All'>('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Extract unique color swatches present across catalog
  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    for (const product of PRODUCTS) {
      for (const c of product.colors) {
        if (!map.has(c.name)) {
          map.set(c.name, c.hex);
        }
      }
    }
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  // Scoped sub-categories based on selected department (or curated distinct options when All)
  const visibleSubCategories = useMemo(() => {
    if (selectedDepartment !== 'All') {
      return DEPARTMENT_SUBCATEGORIES[selectedDepartment];
    }
    return Array.from(new Set(PRODUCTS.map((p) => p.subCategory)));
  }, [selectedDepartment]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = PRODUCTS.filter((p) => {
      if (selectedDepartment !== 'All' && p.department !== selectedDepartment) {
        return false;
      }
      if (selectedSubCategory !== 'All' && p.subCategory !== selectedSubCategory) {
        return false;
      }
      if (selectedCollection !== 'All' && p.collection !== selectedCollection) {
        return false;
      }
      if (onlySale && p.discountPercent <= 0) {
        return false;
      }
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) {
        return false;
      }
      if (selectedSize !== 'All' && !p.sizes.includes(selectedSize)) {
        return false;
      }
      if (
        selectedColor !== 'All' &&
        !p.colors.some((c) => c.name === selectedColor)
      ) {
        return false;
      }
      if (inStockOnly && p.stockStatus === 'Out of Stock') {
        return false;
      }

      if (priceRange === 'under-3000' && p.price >= 3000) return false;
      if (priceRange === '3000-7500' && (p.price < 3000 || p.price > 7500)) {
        return false;
      }
      if (priceRange === '7500-15000' && (p.price < 7500 || p.price > 15000)) {
        return false;
      }
      if (priceRange === 'above-15000' && p.price <= 15000) return false;

      if (q) {
        const haystack =
          `${p.name} ${p.sku} ${p.brand} ${p.department} ${p.subCategory} ${p.collection} ${p.description} ${p.colors.map((c) => c.name).join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    const sorted = [...matches];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => b.newestRank - a.newestRank);
    } else if (sortBy === 'popularity') {
      sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      // featured: prioritize new arrival & best sellers cleanly
      sorted.sort((a, b) => {
        const scoreA = (a.isBestSeller ? 2 : 0) + (a.isNewArrival ? 1 : 0);
        const scoreB = (b.isBestSeller ? 2 : 0) + (b.isNewArrival ? 1 : 0);
        return scoreB - scoreA || b.newestRank - a.newestRank;
      });
    }
    return sorted;
  }, [
    selectedDepartment,
    selectedSubCategory,
    selectedCollection,
    onlySale,
    selectedBrand,
    selectedSize,
    selectedColor,
    inStockOnly,
    priceRange,
    searchQuery,
    sortBy,
  ]);

  const handleResetAll = () => {
    onDepartmentChange('All');
    onSubCategoryChange('All');
    onCollectionChange('All');
    onOnlySaleChange(false);
    onSearchChange('');
    onSortChange('featured');
    setPriceRange('all');
    setSelectedSize('All');
    setSelectedColor('All');
    setSelectedBrand('All');
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedDepartment !== 'All' ||
    selectedSubCategory !== 'All' ||
    selectedCollection !== 'All' ||
    onlySale ||
    searchQuery.trim().length > 0 ||
    priceRange !== 'all' ||
    selectedSize !== 'All' ||
    selectedColor !== 'All' ||
    selectedBrand !== 'All' ||
    inStockOnly;

  const filterSidebarContent = (
    <div className="space-y-7">
      {/* Department */}
      <div>
        <h3 className="text-[11px] tracking-[0.18em] uppercase font-semibold text-[#0F0F0E] mb-3">
          Department
        </h3>
        <div className="space-y-1.5">
          {DEPARTMENTS.map((dept) => {
            const active = selectedDepartment === dept;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => {
                  onDepartmentChange(dept);
                  onSubCategoryChange('All');
                }}
                className={`w-full px-3 py-2 text-left text-xs border transition-colors flex items-center justify-between ${
                  active
                    ? 'bg-[#0F0F0E] text-[#F8F6F2] border-[#0F0F0E] font-medium'
                    : 'bg-white text-[#262421] border-[#0F0F0E]/12 hover:border-[#0F0F0E]'
                }`}
              >
                <span>{dept === 'All' ? 'All Departments' : dept}</span>
                {dept !== 'All' && (
                  <span className="text-[10px] opacity-70 tabular-nums">
                    {PRODUCTS.filter((p) => p.department === dept).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category / Sub-Category */}
      <div>
        <h3 className="text-[11px] tracking-[0.18em] uppercase font-semibold text-[#0F0F0E] mb-3">
          Category
        </h3>
        <select
          aria-label="Filter by category"
          value={selectedSubCategory}
          onChange={(e) => onSubCategoryChange(e.target.value)}
          className="w-full px-3 py-2.5 bg-white border border-[#0F0F0E]/20 text-xs text-[#0F0F0E] focus:outline-none focus:border-[#0F0F0E]"
        >
          <option value="All">All Categories</option>
          {visibleSubCategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-[11px] tracking-[0.18em] uppercase font-semibold text-[#0F0F0E] mb-3">
          Price Bracket (₹)
        </h3>
        <div className="space-y-1.5">
          {(
            [
              { id: 'all', label: 'All Prices' },
              { id: 'under-3000', label: 'Under ₹3,000' },
              { id: '3000-7500', label: '₹3,000 – ₹7,500' },
              { id: '7500-15000', label: '₹7,500 – ₹15,000' },
              { id: 'above-15000', label: 'Above ₹15,000' },
            ] as { id: PriceRangeOption; label: string }[]
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPriceRange(opt.id)}
              className={`w-full px-3 py-2 text-left text-xs border transition-colors ${
                priceRange === opt.id
                  ? 'bg-[#0F0F0E] text-[#F8F6F2] border-[#0F0F0E] font-medium'
                  : 'bg-white text-[#262421] border-[#0F0F0E]/12 hover:border-[#0F0F0E]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h3 className="text-[11px] tracking-[0.18em] uppercase font-semibold text-[#0F0F0E] mb-3">
          Size
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedSize('All')}
            className={`px-2.5 py-1.5 text-[11px] border transition-colors ${
              selectedSize === 'All'
                ? 'bg-[#0F0F0E] text-[#F8F6F2] border-[#0F0F0E]'
                : 'bg-white text-[#262421] border-[#0F0F0E]/15 hover:border-[#0F0F0E]'
            }`}
          >
            All
          </button>
          {ALL_SIZES.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setSelectedSize(sz === selectedSize ? 'All' : sz)}
              className={`px-2.5 py-1.5 text-[11px] border transition-colors tabular-nums ${
                selectedSize === sz
                  ? 'bg-[#0F0F0E] text-[#F8F6F2] border-[#0F0F0E]'
                  : 'bg-white text-[#262421] border-[#0F0F0E]/15 hover:border-[#0F0F0E]'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="text-[11px] tracking-[0.18em] uppercase font-semibold text-[#0F0F0E] mb-3">
          Color Palette
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedColor('All')}
            className={`px-2.5 py-1 text-[11px] border transition-colors ${
              selectedColor === 'All'
                ? 'bg-[#0F0F0E] text-[#F8F6F2] border-[#0F0F0E]'
                : 'bg-white text-[#262421] border-[#0F0F0E]/15 hover:border-[#0F0F0E]'
            }`}
          >
            All
          </button>
          {availableColors.map((col) => {
            const active = selectedColor === col.name;
            return (
              <button
                key={col.name}
                type="button"
                onClick={() => setSelectedColor(active ? 'All' : col.name)}
                title={col.name}
                aria-label={`Filter color ${col.name}`}
                aria-pressed={active}
                className={`w-7 h-7 border transition-all ${
                  active
                    ? 'border-[#0F0F0E] ring-1 ring-[#0F0F0E] ring-offset-2 ring-offset-[#F8F6F2]'
                    : 'border-[#0F0F0E]/25 hover:border-[#0F0F0E]'
                }`}
                style={{ backgroundColor: col.hex }}
              />
            );
          })}
        </div>
        {selectedColor !== 'All' && (
          <p className="text-[11px] text-[#6E6A63] mt-2">
            Selected: <strong className="text-[#0F0F0E]">{selectedColor}</strong>
          </p>
        )}
      </div>

      {/* Brand Line */}
      <div>
        <h3 className="text-[11px] tracking-[0.18em] uppercase font-semibold text-[#0F0F0E] mb-3">
          Brand House
        </h3>
        <div className="space-y-1.5">
          {(['All', ...BRANDS] as const).map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => setSelectedBrand(brand)}
              className={`w-full px-3 py-2 text-left text-xs border transition-colors ${
                selectedBrand === brand
                  ? 'bg-[#0F0F0E] text-[#F8F6F2] border-[#0F0F0E] font-medium'
                  : 'bg-white text-[#262421] border-[#0F0F0E]/12 hover:border-[#0F0F0E]'
              }`}
            >
              {brand === 'All' ? 'All AURA MAX Lines' : brand}
            </button>
          ))}
        </div>
      </div>

      {/* Collection + Toggles */}
      <div className="space-y-3 pt-2 border-t border-[#0F0F0E]/10">
        <div>
          <h3 className="text-[11px] tracking-[0.18em] uppercase font-semibold text-[#0F0F0E] mb-2.5">
            Capsule Collection
          </h3>
          <select
            aria-label="Filter by collection"
            value={selectedCollection}
            onChange={(e) =>
              onCollectionChange(e.target.value as CollectionName | 'All')
            }
            className="w-full px-3 py-2.5 bg-white border border-[#0F0F0E]/20 text-xs text-[#0F0F0E] focus:outline-none focus:border-[#0F0F0E]"
          >
            <option value="All">All Collections</option>
            {COLLECTIONS.map((coll) => (
              <option key={coll} value={coll}>
                {coll}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2.5 text-xs text-[#262421] cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={onlySale}
            onChange={(e) => onOnlySaleChange(e.target.checked)}
            className="w-4 h-4 accent-[#0F0F0E]"
          />
          <span>Special Offers / Sale Only</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-[#262421] cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-[#0F0F0E]"
          />
          <span>Hide Out-of-Stock Items</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F8F6F2] text-[#0F0F0E] min-h-[75vh]">
      {/* Dark Architectural Page Header */}
      <div className="bg-[#0B0B0A] text-[#F8F6F2] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
          <button
            type="button"
            onClick={onBackToStorefront}
            className="inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-[#C4C8CE] hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Storefront</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-[#C4C8CE] mb-2">
                AURA MAX Full Catalog
              </p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-white tracking-tight">
                {selectedDepartment === 'All'
                  ? 'Shop All Pieces'
                  : `${selectedDepartment} Collection`}
              </h1>
            </div>

            {/* Search Input directly on Shop All */}
            <div className="w-full lg:w-96 relative">
              <Search
                className="w-4 h-4 text-[#C4C8CE] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search blazers, kurtis, sneakers, watches..."
                aria-label="Search Shop All catalog"
                className="w-full pl-10 pr-9 py-3 bg-[#171715] border border-white/20 text-sm text-white placeholder:text-[#C4C8CE]/60 focus:outline-none focus:border-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#C4C8CE] hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter Sidebar + Product Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
        {/* Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#0F0F0E]/10">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-[#0F0F0E] text-[#F8F6F2] text-xs tracking-[0.12em] uppercase font-medium"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{mobileFiltersOpen ? 'Hide Filters' : 'Filters'}</span>
            </button>

            <span className="text-xs text-[#6E6A63] tabular-nums">
              Showing{' '}
              <strong className="text-[#0F0F0E] font-semibold">
                {filteredProducts.length}
              </strong>{' '}
              of {PRODUCTS.length} pieces
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex items-center gap-1.5 text-xs underline underline-offset-4 text-[#0F0F0E] hover:text-[#6E6A63]"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="shop-all-sort"
              className="text-xs tracking-[0.1em] uppercase text-[#6E6A63] hidden sm:inline"
            >
              Sort
            </label>
            <select
              id="shop-all-sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-3.5 py-2 border border-[#0F0F0E]/20 bg-white text-xs text-[#0F0F0E] focus:outline-none focus:border-[#0F0F0E] cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="newest">Sort: Newest</option>
              <option value="popularity">Sort: Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips Row */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {selectedDepartment !== 'All' && (
              <button
                type="button"
                onClick={() => {
                  onDepartmentChange('All');
                  onSubCategoryChange('All');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAE5DC] text-xs text-[#0F0F0E] hover:bg-[#D8D1C5]"
              >
                <span>Department: {selectedDepartment}</span>
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
            {selectedSubCategory !== 'All' && (
              <button
                type="button"
                onClick={() => onSubCategoryChange('All')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAE5DC] text-xs text-[#0F0F0E] hover:bg-[#D8D1C5]"
              >
                <span>Category: {selectedSubCategory}</span>
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
            {selectedCollection !== 'All' && (
              <button
                type="button"
                onClick={() => onCollectionChange('All')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAE5DC] text-xs text-[#0F0F0E] hover:bg-[#D8D1C5]"
              >
                <span>Collection: {selectedCollection}</span>
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
            {priceRange !== 'all' && (
              <button
                type="button"
                onClick={() => setPriceRange('all')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAE5DC] text-xs text-[#0F0F0E] hover:bg-[#D8D1C5]"
              >
                <span>Price: {priceRange}</span>
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
            {selectedSize !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedSize('All')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAE5DC] text-xs text-[#0F0F0E] hover:bg-[#D8D1C5]"
              >
                <span>Size: {selectedSize}</span>
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
            {selectedColor !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedColor('All')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAE5DC] text-xs text-[#0F0F0E] hover:bg-[#D8D1C5]"
              >
                <span>Color: {selectedColor}</span>
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
            {selectedBrand !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedBrand('All')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAE5DC] text-xs text-[#0F0F0E] hover:bg-[#D8D1C5]"
              >
                <span>Brand: {selectedBrand}</span>
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
            {onlySale && (
              <button
                type="button"
                onClick={() => onOnlySaleChange(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAE5DC] text-xs text-[#0F0F0E] hover:bg-[#D8D1C5]"
              >
                <span>Special Offers</span>
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Desktop Sidebar / Mobile Expandable Filter Panel */}
          <aside
            className={`lg:col-span-3 ${
              mobileFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-[#EAE5DC]/50 border border-[#0F0F0E]/10 p-5 sm:p-6 lg:sticky lg:top-24">
              {filterSidebarContent}
            </div>
          </aside>

          {/* Product Results Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-12">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onSelectProduct={onSelectProduct}
                    onToggleWishlist={onToggleWishlist}
                    onQuickAdd={onQuickAdd}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 px-6 text-center bg-[#EAE5DC]/60 border border-[#0F0F0E]/10">
                <p className="font-display text-3xl text-[#0F0F0E] mb-2">
                  No pieces match these exact filters
                </p>
                <p className="text-sm text-[#6E6A63] mb-6 max-w-md mx-auto">
                  {selectedSubCategory !== 'All'
                    ? `We currently showcase featured silhouettes under ${selectedDepartment === 'All' ? 'all departments' : selectedDepartment}. Clear the sub-category or filter constraints to view every piece in our collection.`
                    : 'Adjust your price bracket, size, color, or search term to explore the complete AURA MAX catalog.'}
                </p>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="px-7 py-3 bg-[#0F0F0E] text-[#F8F6F2] text-xs tracking-[0.14em] uppercase font-semibold hover:bg-[#262421] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
