import { ArrowRight } from 'lucide-react';
import { SALE_BANNER_IMAGE } from '../data/catalog';
import { SmartImage } from './SmartImage';

interface StyleSaleBannerProps {
  onShopSale: () => void;
}

export function StyleSaleBanner({ onShopSale }: StyleSaleBannerProps) {
  return (
    <section
      id="sale-banner"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
    >
      <div className="relative overflow-hidden bg-[#0B0B0A] min-h-[380px] sm:min-h-[440px] flex items-center">
        <SmartImage
          src={SALE_BANNER_IMAGE}
          alt="AURA MAX seasonal archive rail featuring tailored wool blazers, silk shirts, and camel coats"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
          containerClassName="absolute inset-0 w-full h-full"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.22em] uppercase text-[#C4C8CE] mb-3 font-medium">
              AURA MAX Private Archive · OWN YOUR AURA.
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-white leading-[1.05] text-balance mb-3">
              THE STYLE SALE IS HERE
            </h2>
            <p className="text-sm sm:text-base text-[#EAE5DC]/90 max-w-md leading-relaxed">
              Enjoy curated reductions across tailored wool blazers, mulberry silk shirts, and Mediterranean flax linen essentials while archive sizes remain.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-5 shrink-0">
            <div className="border border-[#F8F6F2]/30 bg-black/40 backdrop-blur-sm px-6 py-4 text-left lg:text-right">
              <span className="block text-[11px] tracking-[0.2em] uppercase text-[#EAE5DC]/80 mb-1">
                Archive Privileges
              </span>
              <span className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-wide tabular-nums">
                UP TO 50% OFF
              </span>
            </div>

            <button
              type="button"
              onClick={onShopSale}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#F8F6F2] text-[#0F0F0E] text-xs tracking-[0.14em] uppercase font-semibold hover:bg-white transition-colors whitespace-nowrap"
            >
              <span>Shop Sale</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
