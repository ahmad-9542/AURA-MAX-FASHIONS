import { PRODUCTS } from '../data/catalog';
import { Product, ProductSize } from '../types';
import { ProductCard } from './ProductCard';
import { ScrollReveal } from './ScrollReveal';

interface BestSellersSectionProps {
  wishlistIds: string[];
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product, size?: ProductSize) => void;
}

export function BestSellersSection({
  wishlistIds,
  onSelectProduct,
  onToggleWishlist,
  onQuickAdd,
}: BestSellersSectionProps) {
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);

  return (
    <section
      id="best-sellers"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-[#0F0F0E]/10"
    >
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#6E6A63] mb-2">
              Client Signatures
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-medium text-[#0F0F0E] tracking-tight">
              Best Sellers
            </h2>
          </div>
          <p className="text-sm text-[#6E6A63] max-w-sm">
            Our highest-rated silhouettes, celebrated by clients across India for cut, fabric handfeel, and enduring wear.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-12">
        {bestSellers.slice(0, 4).map((product, idx) => (
          <ScrollReveal key={product.id} delay={idx * 0.06}>
            <ProductCard
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              showRating
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
