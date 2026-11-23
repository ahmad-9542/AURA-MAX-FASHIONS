import { useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Product } from '../types';
import { formatINR } from '../utils/format';
import { AuraMaxLogo } from './AuraMaxLogo';
import { SmartImage } from './SmartImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onMoveToBag: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export function WishlistDrawer({
  isOpen,
  products,
  onClose,
  onMoveToBag,
  onRemoveFromWishlist,
  onSelectProduct,
}: WishlistDrawerProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Saved Wishlist"
          onClick={onClose}
        >
          <motion.div
            initial={prefersReducedMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={prefersReducedMotion ? undefined : { x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md bg-[#F8F6F2] text-[#0F0F0E] h-full flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#0B0B0A] text-[#F8F6F2] border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <AuraMaxLogo size="xs" />
                <span className="h-5 w-px bg-white/15 shrink-0" aria-hidden="true" />
                <h2 className="font-display text-xl sm:text-2xl font-medium text-white truncate">
                  Wishlist ({products.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-[#F8F6F2] hover:bg-white/10 transition-colors shrink-0"
                aria-label="Close wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {products.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <Heart className="w-10 h-10 text-[#6E6A63] stroke-[1.25] mb-3" />
                  <p className="font-display text-2xl text-[#0F0F0E] mb-1.5">
                    No saved pieces yet
                  </p>
                  <p className="text-sm text-[#6E6A63] max-w-xs mb-6">
                    Tap the heart icon on any garment, shoe, or accessory to curate your personal AURA MAX edit.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 bg-[#0F0F0E] text-[#F8F6F2] text-xs tracking-[0.14em] uppercase font-semibold hover:bg-[#262421] transition-colors"
                  >
                    Explore Catalog
                  </button>
                </div>
              ) : (
                products.map((product) => {
                  const isOutOfStock = product.stockStatus === 'Out of Stock';
                  return (
                    <div
                      key={product.id}
                      className="flex gap-4 pb-5 border-b border-[#0F0F0E]/10"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                        className="w-20 h-28 bg-[#EAE5DC] shrink-0 overflow-hidden"
                      >
                        <SmartImage
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-top"
                          containerClassName="w-full h-full"
                        />
                      </button>

                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSelectProduct(product);
                            }}
                            className="text-left text-sm font-medium text-[#0F0F0E] hover:text-[#6E6A63]"
                          >
                            {product.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveFromWishlist(product.id)}
                            className="text-[#6E6A63] hover:text-[#0F0F0E] p-1"
                            aria-label={`Remove ${product.name} from wishlist`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-[#6E6A63] mt-0.5">
                          {product.department} · {product.subCategory}
                        </p>

                        <div className="mt-1.5 flex items-baseline gap-2 tabular-nums">
                          <span className="text-sm font-semibold text-[#0F0F0E]">
                            {formatINR(product.price)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-[#6E6A63] line-through">
                              {formatINR(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => onMoveToBag(product)}
                          className={`mt-auto pt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] tracking-[0.12em] uppercase font-medium transition-colors ${
                            isOutOfStock
                              ? 'bg-[#EAE5DC] text-[#6E6A63] cursor-not-allowed'
                              : 'bg-[#0F0F0E] text-[#F8F6F2] hover:bg-[#262421]'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>
                            {isOutOfStock ? 'Out of Stock' : 'Move to Cart'}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
