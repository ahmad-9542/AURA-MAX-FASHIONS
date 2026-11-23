import { ArrowUpRight, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BRAND_CONTACT } from '../data/catalog';
import { PolicyKey } from '../types';
import { AuraMaxLogo } from './AuraMaxLogo';
import { NavDestination } from './Navbar';

interface FooterProps {
  onNavigate: (dest: NavDestination) => void;
  onOpenContact: () => void;
  onOpenPolicy: (policy: PolicyKey) => void;
}

export function Footer({
  onNavigate,
  onOpenContact,
  onOpenPolicy,
}: FooterProps) {
  return (
    <footer className="bg-[#0B0B0A] text-[#F8F6F2] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-10 pb-14 border-b border-white/15">
          {/* 1. BRAND */}
          <div className="lg:col-span-4 space-y-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              aria-label="AURA MAX Home"
              className="inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <AuraMaxLogo size="footer" interactive />
            </button>
            <p className="text-[11px] tracking-[0.26em] uppercase text-[#C4C8CE] font-semibold">
              {BRAND_CONTACT.tagline}
            </p>
            <p className="text-sm text-[#C4C8CE]/80 leading-relaxed max-w-xs">
              Futuristic luxury tailoring, Grade-6A mulberry silk, and architectural essentials designed for contemporary poise across India.
            </p>
          </div>

          {/* 2. CUSTOMER SUPPORT */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-[11px] tracking-[0.2em] uppercase text-[#C4C8CE]/70 font-semibold">
              Customer Support
            </h3>
            <ul className="space-y-2.5 text-sm text-[#EAE5DC]/85">
              <li>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('faqs')}
                  className="hover:text-white transition-colors"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('shipping')}
                  className="hover:text-white transition-colors"
                >
                  Shipping Information
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('returns')}
                  className="hover:text-white transition-colors"
                >
                  Return and Refund Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms and Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* 3. CONTACT INFORMATION */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-[11px] tracking-[0.2em] uppercase text-[#C4C8CE]/70 font-semibold">
              Contact Information
            </h3>
            <ul className="space-y-3 text-sm text-[#EAE5DC]/85">
              <li>
                <a
                  href={BRAND_CONTACT.phoneHref}
                  className="inline-flex items-center gap-2.5 hover:text-white transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#C4C8CE] shrink-0" aria-hidden="true" />
                  <span>{BRAND_CONTACT.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={BRAND_CONTACT.emailHref}
                  className="inline-flex items-center gap-2.5 hover:text-white transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#C4C8CE] shrink-0" aria-hidden="true" />
                  <span>{BRAND_CONTACT.email}</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5 text-[#EAE5DC]/85">
                <MapPin className="w-4 h-4 text-[#C4C8CE] shrink-0" aria-hidden="true" />
                <span>Location: {BRAND_CONTACT.location}</span>
              </li>
              <li className="pt-1">
                <a
                  href={BRAND_CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 border border-white/20 text-xs tracking-[0.12em] uppercase text-[#F8F6F2] hover:bg-white hover:text-[#0B0B0A] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>WhatsApp Concierge</span>
                </a>
              </li>
            </ul>
          </div>

          {/* 4. SOCIAL MEDIA */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-[11px] tracking-[0.2em] uppercase text-[#C4C8CE]/70 font-semibold">
              Social Media
            </h3>
            <p className="text-xs text-[#C4C8CE]/75 leading-relaxed">
              Runway previews, styling reels, and private drops.
            </p>

            <div className="flex flex-col items-start gap-3 pt-1">
              <a
                href={BRAND_CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AURA MAX Instagram (@ahmad_dudekula)"
                className="group w-11 h-11 border border-white/25 flex items-center justify-center text-[#F8F6F2] hover:bg-white hover:text-[#0B0B0A] hover:scale-105 transition-all duration-200"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>

              <a
                href={BRAND_CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2.5 bg-[#F8F6F2] text-[#0B0B0A] text-[11px] tracking-[0.12em] uppercase font-semibold hover:bg-[#DDE1E7] transition-all duration-200 whitespace-nowrap"
              >
                <span>Follow {BRAND_CONTACT.instagramHandle}</span>
                <ArrowUpRight
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C4C8CE]/60">
          <p>© {new Date().getFullYear()} AURA MAX Luxury Apparel. All rights reserved.</p>
          <p>Prices listed in Indian Rupees (₹) inclusive of GST · {BRAND_CONTACT.location}</p>
        </div>
      </div>
    </footer>
  );
}
