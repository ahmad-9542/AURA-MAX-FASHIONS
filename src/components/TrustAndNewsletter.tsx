import { FormEvent, useState } from 'react';
import { ArrowRight, Check, RotateCcw, ShieldCheck, Star, Truck } from 'lucide-react';
import { BRAND_CONTACT, TESTIMONIALS } from '../data/catalog';

interface TrustAndNewsletterProps {
  onOpenContact?: () => void;
}

export function TrustAndNewsletter({ onOpenContact }: TrustAndNewsletterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <>
      {/* Service Guarantees */}
      <section
        aria-label="Client Service Standards"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-14 border-b border-[#0F0F0E]/10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div className="flex items-start gap-4">
            <Truck className="w-6 h-6 text-[#0F0F0E] stroke-[1.4] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold tracking-[0.06em] uppercase text-[#0F0F0E] mb-1.5">
                Complimentary Express Shipping
              </h3>
              <p className="text-sm text-[#6E6A63] leading-relaxed">
                Insured air delivery in archival garment packaging on all orders above ₹4,999 across India within 2–4 business days.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-[#0F0F0E] stroke-[1.4] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold tracking-[0.06em] uppercase text-[#0F0F0E] mb-1.5">
                Secure Encrypted Shopping
              </h3>
              <p className="text-sm text-[#6E6A63] leading-relaxed">
                Protected by 256-bit TLS checkout security across UPI, cards, and zero-fee Cash on Delivery.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <RotateCcw className="w-6 h-6 text-[#0F0F0E] stroke-[1.4] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold tracking-[0.06em] uppercase text-[#0F0F0E] mb-1.5">
                30-Day Effortless Returns
              </h3>
              <p className="text-sm text-[#6E6A63] leading-relaxed mb-2.5">
                Complimentary doorstep pickup and instant size exchanges for 30 days on all unworn garments with tags.
              </p>
              {onOpenContact && (
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="inline-flex items-center gap-1.5 text-xs tracking-[0.12em] uppercase font-semibold text-[#0F0F0E] underline underline-offset-4 hover:text-[#6E6A63] transition-colors"
                >
                  <span>Contact Client Concierge ({BRAND_CONTACT.phoneDisplay})</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section
        aria-label="Client Testimonials"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20 border-b border-[#0F0F0E]/10"
      >
        <div className="mb-10">
          <p className="text-xs tracking-[0.18em] uppercase text-[#6E6A63] mb-2">
            Verified Clients
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#0F0F0E] tracking-tight">
            Worn Across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((item) => (
            <blockquote
              key={item.id}
              className="p-6 sm:p-8 bg-[#EAE5DC]/55 border border-[#0F0F0E]/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4" aria-label={`${item.rating} out of 5 stars`}>
                  {Array.from({ length: item.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-3.5 h-3.5 fill-[#0F0F0E] text-[#0F0F0E]"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-sm text-[#262421] leading-relaxed mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <footer className="pt-4 border-t border-[#0F0F0E]/10">
                <p className="text-sm font-semibold text-[#0F0F0E]">
                  {item.customerName}
                </p>
                <p className="text-xs text-[#6E6A63] mt-0.5">
                  {item.location} · Verified Purchase: {item.purchasedItem}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section
        aria-label="Newsletter Subscription"
        className="bg-[#EAE5DC] border-b border-[#0F0F0E]/10"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-lg">
            <p className="text-xs tracking-[0.18em] uppercase text-[#6E6A63] mb-2">
              Private Dispatch
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#0F0F0E] mb-2">
              Receive Early Capsule Access
            </h2>
            <p className="text-sm text-[#262421]/80 leading-relaxed">
              Join the AURA MAX journal for private seasonal previews, runway lookbooks, and invitation-only archive releases.
            </p>
          </div>

          <div className="w-full max-w-md">
            {subscribed ? (
              <div className="p-4 bg-[#F8F6F2] border border-[#0F0F0E]/15 flex items-center gap-3 text-sm text-[#0F0F0E]">
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  Thank you. Your invitation to AURA MAX Private Dispatch is confirmed.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3.5 bg-[#F8F6F2] border border-[#0F0F0E]/20 text-sm text-[#0F0F0E] placeholder:text-[#6E6A63] focus:outline-none focus:border-[#0F0F0E]"
                />
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-[#0F0F0E] text-[#F8F6F2] text-xs tracking-[0.14em] uppercase font-semibold hover:bg-[#262421] transition-colors whitespace-nowrap shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
