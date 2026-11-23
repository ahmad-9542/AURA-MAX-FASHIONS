import { useState } from 'react';
import { Eye, Heart, Star } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Product, ProductSize } from '../types';
import { formatINR } from '../utils/format';
import { SmartImage } from './SmartImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  showRating?: boolean;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product, size?: ProductSize) => void;
}

export function ProductCard({
  product,
  isWishlisted,
  showRating = true,
  onSelectProduct,
  onToggleWishlist,
  onQuickAdd,
}: ProductCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const isOutOfStock = product.stockStatus === 'Out of Stock';
  const showAlternate = isHovered && Boolean(product.alternateImage);

  return (
    <article
      className="group flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Studio Image Container with Alternate Lookbook Crossfade */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#EAE5DC] mb-3.5"
        data-cursor="VIEW"
      >
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="block w-full h-full text-left relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F0F0E]"
          aria-label={`View details for ${product.name}`}
        >
          <SmartImage
            src={product.image}
            alt={`${product.name} in ${product.colors[0]?.name ?? 'signature finish'}`}
            className={`w-full h-full object-cover object-top transition-all duration-700 ease-out ${
              isHovered ? 'scale-[1.06]' : 'scale-100'
            } ${showAlternate ? 'opacity-0' : 'opacity-100'} ${
              isOutOfStock ? 'grayscale-[35%] opacity-85' : ''
            }`}
            containerClassName="w-full h-full"
          />

          {product.alternateImage && (
            <SmartImage
              src={product.alternateImage}
              alt={`${product.name} alternate editorial angle`}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
                showAlternate ? 'opacity-100 scale-[1.04]' : 'opacity-0 scale-100'
              }`}
              containerClassName="absolute inset-0 w-full h-full"
            />
          )}
        </button>

        {/* Single crisp rectangular top-left tag */}
        {(isOutOfStock || product.discountPercent > 0 || product.isNewArrival) && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase font-semibold pointer-events-none ${
              isOutOfStock
                ? 'bg-[#262421] text-[#EAE5DC]'
                : product.discountPercent > 0
                  ? 'bg-[#0F0F0E] text-[#F8F6F2]'
                  : 'bg-[#F8F6F2] text-[#0F0F0E]'
            }`}
          >
            {isOutOfStock
              ? 'Out of Stock'
              : product.discountPercent > 0
                ? `${product.discountPercent}% Off`
                : 'New Arrival'}
          </span>
        )}

        {/* Top-right Action Cluster: Quick View & Animated Wishlist */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          <motion.button
            type="button"
            whileTap={prefersReducedMotion ? undefined : { scale: 0.85 }}
            animate={
              isWishlisted && !prefersReducedMotion
                ? { scale: [1, 1.18, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onToggleWishlist(product.id)}
            className="w-9 h-9 flex items-center justify-center bg-[#F8F6F2]/90 backdrop-blur-sm text-[#0F0F0E] hover:bg-white transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F0F0E]"
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from wishlist`
                : `Save ${product.name} to wishlist`
            }
            aria-pressed={isWishlisted}
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isWishlisted ? 'fill-[#0F0F0E] text-[#0F0F0E]' : 'stroke-[1.6]'
              }`}
            />
          </motion.button>

          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="w-9 h-9 flex items-center justify-center bg-[#F8F6F2]/90 backdrop-blur-sm text-[#0F0F0E] hover:bg-white lg:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F0F0E]"
            aria-label={`View details for ${product.name}`}
          >
            <Eye className="w-4 h-4 stroke-[1.6]" />
          </button>
        </div>

        {/* Hover Quick Size Selector Bar */}
        <div className="absolute inset-x-2.5 bottom-2.5 bg-[#0B0B0A]/92 backdrop-blur-md p-2 lg:opacity-0 lg:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 focus-within:opacity-100 focus-within:translate-y-0 transition-all duration-200">
          {isOutOfStock ? (
            <button
              type="button"
              onClick={() => onSelectProduct(product)}
              className="w-full py-1.5 text-[10px] tracking-[0.16em] uppercase text-[#C4C8CE] hover:text-white text-center transition-colors"
            >
              Sold Out · View Details
            </button>
          ) : (
            <>
              <p className="text-[9px] tracking-[0.18em] uppercase text-[#C4C8CE] text-center mb-1.5">
                Quick Add
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onQuickAdd(product, size)}
                    className="px-2 py-1 text-[10px] font-medium text-[#F8F6F2] hover:bg-[#F8F6F2] hover:text-[#0F0F0E] transition-colors tabular-nums whitespace-nowrap"
                    aria-label={`Quick add ${product.name} in size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Metadata */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] tracking-[0.12em] uppercase text-[#6E6A63] truncate">
            {product.department} · {product.subCategory}
          </span>

          {showRating && (
            <span className="inline-flex items-center gap-1 text-xs text-[#262421] tabular-nums shrink-0">
              <Star className="w-3 h-3 fill-[#0F0F0E] text-[#0F0F0E]" aria-hidden="true" />
              <span>{product.rating.toFixed(1)}</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="text-left text-[15px] font-medium text-[#0F0F0E] hover:text-[#6E6A63] transition-colors leading-snug mb-1.5"
        >
          {product.name}
        </button>

        {/* Color Dots + Stock Note */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color.name}
                title={color.name}
                className="w-2.5 h-2.5 border border-[#0F0F0E]/20"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
          {product.stockStatus === 'Low Stock' && (
            <span className="text-[10px] tracking-[0.1em] uppercase text-[#6E6A63]">
              Low Stock
            </span>
          )}
        </div>

        <div className="mt-auto flex items-baseline gap-2.5 tabular-nums">
          <span className="text-[15px] font-semibold text-[#0F0F0E]">
            {formatINR(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-[#6E6A63] line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
