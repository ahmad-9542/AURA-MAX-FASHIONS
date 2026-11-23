import { useEffect } from 'react';
import {
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CartItem } from '../types';
import { formatINR } from '../utils/format';
import { AuraMaxLogo } from './AuraMaxLogo';
import { SmartImage } from './SmartImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onProceedToCheckout: () => void;
  onExploreShopAll: () => void;
}

export const FREE_SHIPPING_THRESHOLD = 4999;
export const STANDARD_SHIPPING_FEE = 299;

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onExploreShopAll,
}: CartDrawerProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const totalMrp = items.reduce(
    (sum, item) =>
      sum + Math.max(item.product.originalPrice, item.product.price) * item.quantity,
    0
  );
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalDiscount = Math.max(0, totalMrp - subtotal);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const qualifiesFreeShipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingCost = qualifiesFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const finalPayable = subtotal + shippingCost;
  const amountRemainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

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
          aria-label="Shopping Bag"
          onClick={onClose}
        >
          <motion.div
            initial={prefersReducedMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={prefersReducedMotion ? undefined : { x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg bg-[#F8F6F2] text-[#0F0F0E] h-full flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Official Logo */}
            <div className="px-6 py-4 bg-[#0B0B0A] text-[#F8F6F2] border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <AuraMaxLogo size="xs" />
                <span className="h-5 w-px bg-white/15 shrink-0" aria-hidden="true" />
                <h2 className="font-display text-xl sm:text-2xl font-medium text-white truncate">
                  Shopping Bag ({totalCount})
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-[#F8F6F2] hover:bg-white/10 transition-colors shrink-0"
                aria-label="Close shopping bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length > 0 && (
              <div className="px-6 py-3 bg-[#EAE5DC]/75 border-b border-[#0F0F0E]/10 text-xs text-[#262421]">
                {qualifiesFreeShipping ? (
                  <span>
                    Your bag qualifies for{' '}
                    <strong>Complimentary Express Shipping</strong> across India.
                  </span>
                ) : (
                  <span className="tabular-nums">
                    Add <strong>{formatINR(amountRemainingForFree)}</strong> more
                    for complimentary express shipping.
                  </span>
                )}
              </div>
            )}

            {/* Item List */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <ShoppingBag className="w-10 h-10 text-[#6E6A63] stroke-[1.25] mb-3" />
                  <p className="font-display text-2xl text-[#0F0F0E] mb-1.5">
                    Your bag is empty
                  </p>
                  <p className="text-sm text-[#6E6A63] max-w-xs mb-6">
                    Explore tailored garments, Italian leather footwear, and obsidian accessories to build your wardrobe.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onExploreShopAll();
                    }}
                    className="px-6 py-3 bg-[#0F0F0E] text-[#F8F6F2] text-xs tracking-[0.14em] uppercase font-semibold hover:bg-[#262421] transition-colors"
                  >
                    Explore Shop All
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.key}
                    className="flex gap-4 pb-5 border-b border-[#0F0F0E]/10"
                  >
                    <div className="w-20 h-28 bg-[#EAE5DC] shrink-0 overflow-hidden">
                      <SmartImage
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-top"
                        containerClassName="w-full h-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="block text-[10px] tracking-[0.14em] uppercase text-[#6E6A63]">
                            {item.product.department} · {item.product.subCategory}
                          </span>
                          <h3 className="text-sm font-medium text-[#0F0F0E] leading-snug">
                            {item.product.name}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.key)}
                          className="text-[#6E6A63] hover:text-[#0F0F0E] p-1"
                          aria-label={`Remove ${item.product.name} from bag`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-[#6E6A63] mt-1">
                        Size {item.size} · {item.color.name}
                      </p>

                      <div className="mt-auto pt-3 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center border border-[#0F0F0E]/20 bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#EAE5DC]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#EAE5DC]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right tabular-nums">
                          <span className="block text-sm font-semibold text-[#0F0F0E]">
                            {formatINR(item.product.price * item.quantity)}
                          </span>
                          {item.product.originalPrice > item.product.price && (
                            <span className="block text-[11px] text-[#6E6A63] line-through">
                              {formatINR(item.product.originalPrice * item.quantity)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totals Breakdown & Proceed to Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#0F0F0E]/10 bg-white space-y-4">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-[#6E6A63]">
                    <span>Total MRP</span>
                    <span className="tabular-nums text-[#0F0F0E]">
                      {formatINR(totalMrp)}
                    </span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-[#262421]">
                      <span>Archive Discount</span>
                      <span className="tabular-nums font-medium">
                        − {formatINR(totalDiscount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#6E6A63]">
                    <span>Subtotal</span>
                    <span className="tabular-nums text-[#0F0F0E]">
                      {formatINR(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6E6A63]">
                    <span>Express Shipping</span>
                    <span className="tabular-nums text-[#0F0F0E]">
                      {shippingCost === 0
                        ? 'Complimentary'
                        : formatINR(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-[#0F0F0E] pt-2.5 border-t border-[#0F0F0E]/10">
                    <span>Final Payable Amount</span>
                    <span className="tabular-nums">{formatINR(finalPayable)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 bg-[#0F0F0E] text-[#F8F6F2] text-xs tracking-[0.16em] uppercase font-semibold hover:bg-[#262421] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <p className="text-[11px] text-[#6E6A63] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Saved locally · Inclusive of Indian GST</span>
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
