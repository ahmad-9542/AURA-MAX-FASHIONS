import { FormEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Star,
  Truck,
  Zap,
  ZoomIn,
} from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { ColorOption, Product, ProductReview, ProductSize } from '../types';
import { formatINR } from '../utils/format';
import { ProductCard } from './ProductCard';
import { SmartImage } from './SmartImage';

interface ProductDetailPageProps {
  product: Product;
  isWishlisted: boolean;
  wishlistIds: string[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (
    product: Product,
    size: ProductSize,
    color: ColorOption,
    quantity: number
  ) => void;
  onBuyNow: (
    product: Product,
    size: ProductSize,
    color: ColorOption,
    quantity: number
  ) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product, size?: ProductSize) => void;
}

export function ProductDetailPage({
  product,
  isWishlisted,
  wishlistIds,
  onBack,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onQuickAdd,
}: ProductDetailPageProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes.includes('M')
      ? 'M'
      : product.sizes.includes('UK 9')
        ? 'UK 9'
        : product.sizes[0]
  );
  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    product.colors[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Interactive session review addition
  const [customReviews, setCustomReviews] = useState<ProductReview[]>([]);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    setSelectedSize(
      product.sizes.includes('M')
        ? 'M'
        : product.sizes.includes('UK 9')
          ? 'UK 9'
          : product.sizes[0]
    );
    setSelectedColor(product.colors[0]);
    setQuantity(1);
    setActiveImageIndex(0);
    setIsZooming(false);
    setShowSizeGuide(false);
    setAddedFeedback(false);
    setReviewSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const gallery = useMemo(() => {
    return product.galleryImages.length > 0
      ? product.galleryImages
      : [product.image];
  }, [product]);

  const activeImage = gallery[activeImageIndex] ?? product.image;
  const isOutOfStock = product.stockStatus === 'Out of Stock';
  const savings = Math.max(0, product.originalPrice - product.price);
  const isFootwear = product.department === 'Footwear';

  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        (p.department === product.department || p.collection === product.collection)
    ).slice(0, 4);
  }, [product]);

  const allReviews = useMemo(() => {
    const seeded = product.reviews.length > 0 ? product.reviews : [];
    return [...customReviews, ...seeded];
  }, [customReviews, product.reviews]);

  const handleImageMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isZooming) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
    );
    const y = Math.max(
      0,
      Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)
    );
    setZoomOrigin({ x, y });
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1800);
  };

  const handleBuyNowClick = () => {
    if (isOutOfStock) return;
    onBuyNow(product, selectedSize, selectedColor, quantity);
  };

  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      city: reviewCity.trim() || 'India',
      rating: reviewRating,
      date: 'Session Review',
      comment: reviewComment.trim(),
    };
    setCustomReviews((prev) => [newRev, ...prev]);
    setReviewAuthor('');
    setReviewCity('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSubmitted(true);
  };

  return (
    <div className="bg-[#F8F6F2] text-[#0F0F0E]">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-[#0F0F0E]/10 bg-[#EAE5DC]/45">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-4 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase font-medium text-[#0F0F0E] hover:text-[#6E6A63] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Shopping</span>
          </button>

          <p className="text-[11px] tracking-[0.14em] uppercase text-[#6E6A63]">
            {product.department} / {product.subCategory} / {product.sku}
          </p>
        </div>
      </div>

      {/* Main PDP Split View */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16 border-b border-[#0F0F0E]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Multi-Image Studio Gallery + 2x Zoom */}
          <div className="lg:col-span-6 space-y-4">
            <div
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleImageMove}
              onClick={() => setIsZooming((z) => !z)}
              className="aspect-[3/4] w-full bg-[#EAE5DC] overflow-hidden relative cursor-zoom-in border border-[#0F0F0E]/10"
            >
              <div
                className="w-full h-full transition-transform duration-200 ease-out"
                style={{
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  transform: isZooming ? 'scale(1.85)' : 'scale(1)',
                }}
              >
                <SmartImage
                  src={activeImage}
                  alt={`${product.name} — view ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover object-top"
                  containerClassName="w-full h-full"
                  priority
                />
              </div>

              <div className="absolute top-4 left-4 bg-[#0B0B0A]/85 text-[#F8F6F2] px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase flex items-center gap-1.5 pointer-events-none">
                <ZoomIn className="w-3 h-3" aria-hidden="true" />
                <span>{isZooming ? '2x Zoom Active' : 'Hover or Tap to Zoom'}</span>
              </div>

              {product.discountPercent > 0 && (
                <div className="absolute top-4 right-4 bg-[#0B0B0A] text-[#F8F6F2] px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase font-semibold pointer-events-none">
                  Save {product.discountPercent}%
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((imgUrl, idx) => {
                  const active = idx === activeImageIndex;
                  return (
                    <button
                      key={`${imgUrl}-${idx}`}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`View gallery image ${idx + 1}`}
                      className={`aspect-[3/4] bg-[#EAE5DC] overflow-hidden border transition-all ${
                        active
                          ? 'border-[#0F0F0E] ring-1 ring-[#0F0F0E]'
                          : 'border-[#0F0F0E]/15 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <SmartImage
                        src={imgUrl}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover object-top"
                        containerClassName="w-full h-full"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Purchase & Specification Column */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-[#6E6A63] mb-2">
              <span className="font-semibold text-[#0F0F0E]">{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{product.collection}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-medium text-[#0F0F0E] leading-[1.08] mb-4">
              {product.name}
            </h1>

            {/* Rating & Explicit Stock Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#262421] tabular-nums">
                <Star className="w-3.5 h-3.5 fill-[#0F0F0E] text-[#0F0F0E]" aria-hidden="true" />
                <span className="font-semibold">{product.rating.toFixed(1)}</span>
                <span className="text-[#6E6A63]">
                  ({product.reviewCount + customReviews.length} client ratings)
                </span>
              </div>

              <span
                className={`text-[11px] tracking-[0.12em] uppercase font-semibold px-2.5 py-1 border ${
                  isOutOfStock
                    ? 'bg-[#262421] text-[#EAE5DC] border-[#262421]'
                    : product.stockStatus === 'Low Stock'
                      ? 'bg-[#EAE5DC] text-[#0F0F0E] border-[#0F0F0E]/20'
                      : 'bg-white text-[#0F0F0E] border-[#0F0F0E]/15'
                }`}
              >
                {product.stockStatus}
              </span>
            </div>

            {/* Pricing & Discounts */}
            <div className="pb-6 mb-6 border-b border-[#0F0F0E]/10">
              <div className="flex flex-wrap items-baseline gap-3 tabular-nums">
                <span className="text-3xl font-semibold text-[#0F0F0E]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-[#6E6A63] line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                    <span className="text-xs font-semibold tracking-wider uppercase text-[#0F0F0E]">
                      {product.discountPercent}% Off · You save {formatINR(savings)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#6E6A63] mt-1">
                Inclusive of all taxes (GST) · Item ID: {product.id}
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#262421] leading-relaxed mb-7">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="uppercase tracking-[0.14em] text-[#6E6A63]">
                  Color Option
                </span>
                <span className="font-semibold text-[#0F0F0E]">
                  {selectedColor.name}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {product.colors.map((color) => {
                  const isSelected = selectedColor.name === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 border transition-all ${
                        isSelected
                          ? 'border-[#0F0F0E] ring-1 ring-[#0F0F0E] ring-offset-2 ring-offset-[#F8F6F2]'
                          : 'border-[#0F0F0E]/25 hover:border-[#0F0F0E]'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={`Select color ${color.name}`}
                      aria-pressed={isSelected}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-7">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="uppercase tracking-[0.14em] text-[#6E6A63]">
                  Select Size ·{' '}
                  <strong className="text-[#0F0F0E]">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-[#0F0F0E] underline underline-offset-4 hover:text-[#6E6A63]"
                >
                  <Ruler className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{showSizeGuide ? 'Hide Fit Guide' : 'Fit & Size Guide'}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 px-2 text-xs font-medium border transition-colors tabular-nums ${
                        isSelected
                          ? 'bg-[#0F0F0E] text-[#F8F6F2] border-[#0F0F0E]'
                          : 'bg-white text-[#0F0F0E] border-[#0F0F0E]/20 hover:border-[#0F0F0E]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {showSizeGuide && (
                <div className="mt-3 p-4 bg-[#EAE5DC] text-xs text-[#262421] tabular-nums">
                  <p className="font-semibold text-[#0F0F0E] mb-1">
                    {isFootwear
                      ? 'AURA MAX Footwear Last Guide (UK / EU)'
                      : 'AURA MAX Atelier Garment Guide (Inches)'}
                  </p>
                  <p className="text-[#6E6A63] leading-relaxed">
                    {isFootwear
                      ? 'UK 6 (EU 40 · 25.1 cm) · UK 7 (EU 41 · 25.9 cm) · UK 8 (EU 42 · 26.8 cm) · UK 9 (EU 43 · 27.6 cm) · UK 10 (EU 44 · 28.5 cm) · UK 11 (EU 45 · 29.3 cm).'
                      : 'XS: Chest 34–36 / Waist 26–28 · S: Chest 36–38 / Waist 28–30 · M: Chest 38–40 / Waist 30–32 · L: Chest 40–42 / Waist 32–34 · XL: Chest 42–44 / Waist 34–36 · XXL: Chest 44–46 / Waist 36–38.'}
                  </p>
                </div>
              )}
            </div>

            {/* Quantity Stepper + Add to Cart + Buy Now + Wishlist */}
            <div className="space-y-3 mb-8">
              <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-3">
                <div className="inline-flex items-center border border-[#0F0F0E]/25 bg-white">
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-12 flex items-center justify-center text-[#0F0F0E] hover:bg-[#EAE5DC] disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="w-11 h-12 flex items-center justify-center text-[#0F0F0E] hover:bg-[#EAE5DC] disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAdd}
                  className={`flex-1 h-12 px-6 text-xs tracking-[0.16em] uppercase font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                    isOutOfStock
                      ? 'bg-[#EAE5DC] text-[#6E6A63] cursor-not-allowed'
                      : 'bg-[#0F0F0E] text-[#F8F6F2] hover:bg-[#262421]'
                  }`}
                >
                  {isOutOfStock ? (
                    <span>Currently Out of Stock</span>
                  ) : addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" aria-hidden="true" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <span>
                      Add to Cart · {formatINR(product.price * quantity)}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label={
                    isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'
                  }
                  aria-pressed={isWishlisted}
                  className="w-12 h-12 bg-white border border-[#0F0F0E]/25 flex items-center justify-center hover:border-[#0F0F0E] transition-colors shrink-0"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted
                        ? 'fill-[#0F0F0E] text-[#0F0F0E]'
                        : 'text-[#0F0F0E]'
                    }`}
                  />
                </button>
              </div>

              {!isOutOfStock && (
                <button
                  type="button"
                  onClick={handleBuyNowClick}
                  className="w-full h-12 px-6 bg-[#EAE5DC] border border-[#0F0F0E] text-[#0F0F0E] text-xs tracking-[0.16em] uppercase font-semibold hover:bg-[#0F0F0E] hover:text-[#F8F6F2] transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Buy Now · Proceed to Checkout</span>
                </button>
              )}
            </div>

            {/* Materials & Craft */}
            <div className="pt-6 border-t border-[#0F0F0E]/10 mb-6">
              <h2 className="text-xs tracking-[0.16em] uppercase font-semibold text-[#0F0F0E] mb-3">
                Composition &amp; Atelier Care
              </h2>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#262421]">
                {product.fabricAndCare.map((line) => (
                  <li key={line}>· {line}</li>
                ))}
              </ul>
            </div>

            {/* Trust Grid */}
            <div className="pt-5 border-t border-[#0F0F0E]/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#6E6A63]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0F0F0E] shrink-0" aria-hidden="true" />
                <span>Free India Delivery ₹4,999+</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#0F0F0E] shrink-0" aria-hidden="true" />
                <span>30-Day Complimentary Return</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0F0F0E] shrink-0" aria-hidden="true" />
                <span>Authentic AURA MAX Archive</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20 border-b border-[#0F0F0E]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <p className="text-xs tracking-[0.2em] uppercase text-[#6E6A63] mb-2">
              Client Impressions
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#0F0F0E] mb-3">
              Customer Reviews
            </h2>
            <p className="text-sm text-[#6E6A63] mb-6">
              Rated <strong className="text-[#0F0F0E]">{product.rating.toFixed(1)} / 5.0</strong> across{' '}
              {product.reviewCount + customReviews.length} verified client ratings.
            </p>

            {/* Add Review Form */}
            <form
              onSubmit={handleSubmitReview}
              className="bg-white border border-[#0F0F0E]/12 p-5 sm:p-6 space-y-4"
            >
              <h3 className="text-xs tracking-[0.14em] uppercase font-semibold text-[#0F0F0E]">
                Share Your Experience
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="Your Name"
                  className="px-3 py-2 bg-[#F8F6F2] border border-[#0F0F0E]/15 text-xs focus:outline-none focus:border-[#0F0F0E]"
                />
                <input
                  type="text"
                  value={reviewCity}
                  onChange={(e) => setReviewCity(e.target.value)}
                  placeholder="City (e.g. Mumbai)"
                  className="px-3 py-2 bg-[#F8F6F2] border border-[#0F0F0E]/15 text-xs focus:outline-none focus:border-[#0F0F0E]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#6E6A63]">Rating:</span>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setReviewRating(num)}
                    aria-label={`Rate ${num} stars`}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        num <= reviewRating
                          ? 'fill-[#0F0F0E] text-[#0F0F0E]'
                          : 'text-[#6E6A63]/40'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Notes on fit, fabric finish, or comfort..."
                className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#0F0F0E]/15 text-xs focus:outline-none focus:border-[#0F0F0E]"
              />

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0F0F0E] text-[#F8F6F2] text-xs tracking-[0.14em] uppercase font-medium hover:bg-[#262421] transition-colors"
              >
                Post Review
              </button>

              {reviewSubmitted && (
                <p className="text-xs text-[#262421]">
                  Thank you — your review is now displayed for this session.
                </p>
              )}
            </form>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {allReviews.length > 0 ? (
              allReviews.map((rev) => (
                <article
                  key={rev.id}
                  className="bg-white border border-[#0F0F0E]/10 p-6 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3.5 h-3.5 fill-[#0F0F0E] text-[#0F0F0E]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#6E6A63]">{rev.date}</span>
                  </div>
                  <p className="text-sm text-[#262421] leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                  <p className="text-xs font-medium text-[#0F0F0E]">
                    {rev.author} · <span className="text-[#6E6A63] font-normal">{rev.city}</span>
                  </p>
                </article>
              ))
            ) : (
              <div className="bg-white border border-[#0F0F0E]/10 p-8 text-center">
                <p className="font-display text-2xl text-[#0F0F0E] mb-1">
                  Be the first to write an editorial note
                </p>
                <p className="text-xs text-[#6E6A63]">
                  Overall client rating {product.rating.toFixed(1)}/5 from {product.reviewCount} verified scores.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20">
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-[#6E6A63] mb-2">
              Complete the Silhouette
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#0F0F0E]">
              Related Pieces
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-6">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isWishlisted={wishlistIds.includes(item.id)}
                onSelectProduct={onSelectProduct}
                onToggleWishlist={onToggleWishlist}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
