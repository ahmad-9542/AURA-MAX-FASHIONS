import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { Department, Product, ProductSize } from '../types';
import { ProductCard } from './ProductCard';
import { ScrollReveal } from './ScrollReveal';

interface EditorialRailProps {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  products: Product[];
  wishlistIds: string[];
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product, size?: ProductSize) => void;
  onViewAll: () => void;
  viewAllLabel?: string;
}

function EditorialProductRail({
  id,
  eyebrow,
  title,
  subtitle,
  products,
  wishlistIds,
  onSelectProduct,
  onToggleWishlist,
  onQuickAdd,
  onViewAll,
  viewAllLabel = 'View All',
}: EditorialRailProps) {
  return (
    <section
      id={id}
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20 border-b border-[#0F0F0E]/10"
    >
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#6E6A63] mb-2">
              {eyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-medium text-[#0F0F0E] tracking-tight">
              {title}
            </h2>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <p className="text-sm text-[#6E6A63] max-w-sm sm:text-right">
              {subtitle}
            </p>
            <button
              type="button"
              onClick={onViewAll}
              className="group inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase font-semibold text-[#0F0F0E] border-b border-[#0F0F0E] pb-0.5 hover:text-[#6E6A63] hover:border-[#6E6A63] transition-colors whitespace-nowrap self-start sm:self-end"
            >
              <span>{viewAllLabel}</span>
              <ArrowRight
                className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-12">
        {products.slice(0, 4).map((product, idx) => (
          <ScrollReveal key={product.id} delay={Math.min(idx * 0.05, 0.2)}>
            <ProductCard
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onSelectProduct={onSelectProduct}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

interface HomepageRailsProps {
  wishlistIds: string[];
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product, size?: ProductSize) => void;
  onOpenShopAll: (opts?: { department?: Department | 'All'; sortNewest?: boolean }) => void;
}

export function NewArrivalsSection({
  wishlistIds,
  onSelectProduct,
  onToggleWishlist,
  onQuickAdd,
  onOpenShopAll,
}: HomepageRailsProps) {
  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival).sort(
    (a, b) => b.newestRank - a.newestRank
  );
  return (
    <EditorialProductRail
      id="new-arrivals"
      eyebrow="Seasonal Drop"
      title="New Arrivals"
      subtitle="Just landed across tailored suiting, heavyweight outerwear, footwear, and obsidian accessories."
      products={newArrivals}
      wishlistIds={wishlistIds}
      onSelectProduct={onSelectProduct}
      onToggleWishlist={onToggleWishlist}
      onQuickAdd={onQuickAdd}
      onViewAll={() => onOpenShopAll({ department: 'All', sortNewest: true })}
      viewAllLabel="Shop New Arrivals"
    />
  );
}

export function TrendingNowSection({
  wishlistIds,
  onSelectProduct,
  onToggleWishlist,
  onQuickAdd,
  onOpenShopAll,
}: HomepageRailsProps) {
  const trending = PRODUCTS.filter((p) => p.isTrending);
  return (
    <EditorialProductRail
      id="trending-now"
      eyebrow="Most Coveted This Week"
      title="Trending Now"
      subtitle="Runway silhouettes and statement essentials generating the highest client demand."
      products={trending}
      wishlistIds={wishlistIds}
      onSelectProduct={onSelectProduct}
      onToggleWishlist={onToggleWishlist}
      onQuickAdd={onQuickAdd}
      onViewAll={() => onOpenShopAll({ department: 'All' })}
      viewAllLabel="Explore Shop All"
    />
  );
}

export function FootwearShowcaseSection({
  wishlistIds,
  onSelectProduct,
  onToggleWishlist,
  onQuickAdd,
  onOpenShopAll,
}: HomepageRailsProps) {
  const footwear = PRODUCTS.filter((p) => p.department === 'Footwear');
  return (
    <EditorialProductRail
      id="footwear-edit"
      eyebrow="Bench-Built & Vulcanized"
      title="Premium Footwear"
      subtitle="Full-grain Italian leather court sneakers, Goodyear-welted Chelsea boots, and hand-stitched loafers."
      products={footwear}
      wishlistIds={wishlistIds}
      onSelectProduct={onSelectProduct}
      onToggleWishlist={onToggleWishlist}
      onQuickAdd={onQuickAdd}
      onViewAll={() => onOpenShopAll({ department: 'Footwear' })}
      viewAllLabel="Shop Footwear"
    />
  );
}

export function AccessoriesShowcaseSection({
  wishlistIds,
  onSelectProduct,
  onToggleWishlist,
  onQuickAdd,
  onOpenShopAll,
}: HomepageRailsProps) {
  const accessories = PRODUCTS.filter((p) => p.department === 'Accessories');
  return (
    <EditorialProductRail
      id="accessories-edit"
      eyebrow="Hardware & Carryalls"
      title="Architectural Accessories"
      subtitle="Japanese-movement titanium chronographs, polarized acetate eyewear, calfskin totes, and bridle leather belts."
      products={accessories}
      wishlistIds={wishlistIds}
      onSelectProduct={onSelectProduct}
      onToggleWishlist={onToggleWishlist}
      onQuickAdd={onQuickAdd}
      onViewAll={() => onOpenShopAll({ department: 'Accessories' })}
      viewAllLabel="Shop Accessories"
    />
  );
}

export function RecommendedProductsSection({
  wishlistIds,
  onSelectProduct,
  onToggleWishlist,
  onQuickAdd,
  onOpenShopAll,
}: HomepageRailsProps) {
  const recommended = PRODUCTS.filter((p) => p.isRecommended);
  return (
    <EditorialProductRail
      id="recommended-edit"
      eyebrow="Atelier Selection"
      title="Recommended For You"
      subtitle="Versatile wardrobe pairings selected by AURA MAX creative directors for cohesive everyday styling."
      products={recommended}
      wishlistIds={wishlistIds}
      onSelectProduct={onSelectProduct}
      onToggleWishlist={onToggleWishlist}
      onQuickAdd={onQuickAdd}
      onViewAll={() => onOpenShopAll({ department: 'All' })}
      viewAllLabel="View Complete Edit"
    />
  );
}
