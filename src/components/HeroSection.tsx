import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { HERO_CAMPAIGN_IMAGE } from '../data/catalog';
import { AuraMaxLogo } from './AuraMaxLogo';
import { MagneticButton } from './MagneticButton';
import { SmartImage } from './SmartImage';

interface HeroSectionProps {
  onShopCollection: () => void;
  onShopMen: () => void;
  onShopWomen: () => void;
}

export function HeroSection({
  onShopCollection,
  onShopMen,
  onShopWomen,
}: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.25]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full overflow-hidden bg-[#0B0B0A] text-[#F8F6F2]"
      aria-label="AURA MAX Beyond the Ordinary Campaign"
    >
      <div className="relative h-[88vh] min-h-[600px] max-h-[920px] w-full overflow-hidden">
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : { y: imageY, scale: imageScale }
          }
          className="absolute inset-0 w-full h-full will-change-transform"
        >
          <SmartImage
            src={HERO_CAMPAIGN_IMAGE}
            alt="AURA MAX futuristic luxury campaign featuring male and female models in structured black wool coats and metallic charcoal silk inside a dark travertine atrium"
            className="w-full h-full object-cover object-center"
            containerClassName="w-full h-full"
            priority
          />
        </motion.div>

        {/* Cinematic chiaroscuro lighting scrims */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/35"
          aria-hidden="true"
        />

        <motion.div
          style={prefersReducedMotion ? undefined : { opacity: contentOpacity }}
          className="relative z-10 h-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 flex flex-col justify-end pb-14 sm:pb-20 lg:pb-24"
        >
          <div className="max-w-3xl">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3.5 mb-5"
            >
              <AuraMaxLogo
                size="xs"
                className="border border-white/15"
              />
              <p className="text-xs tracking-[0.26em] uppercase text-[#C4C8CE] font-medium">
                OWN YOUR AURA.
              </p>
            </motion.div>

            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-7xl lg:text-[88px] font-medium leading-[0.94] tracking-[0.02em] text-white text-balance mb-5"
            >
              BEYOND THE ORDINARY
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#EAE5DC]/90 leading-relaxed max-w-xl mb-9 font-normal"
            >
              Futuristic tailoring, chiaroscuro drapery, and architectural silhouettes engineered in Grade-6A mulberry silk and Italian virgin wool.
            </motion.p>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              <MagneticButton>
                <button
                  type="button"
                  onClick={onShopCollection}
                  data-cursor="SHOP"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-[#F8F6F2] text-[#0F0F0E] text-xs tracking-[0.16em] uppercase font-semibold hover:bg-white transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>SHOP THE COLLECTION</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </MagneticButton>

              <button
                type="button"
                onClick={onShopMen}
                className="inline-flex items-center gap-2 px-6 py-4 border border-[#F8F6F2]/45 bg-black/30 backdrop-blur-xs text-[#F8F6F2] text-xs tracking-[0.14em] uppercase font-medium hover:bg-[#F8F6F2] hover:text-[#0F0F0E] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Shop Men</span>
              </button>

              <button
                type="button"
                onClick={onShopWomen}
                className="inline-flex items-center gap-2 px-6 py-4 border border-[#F8F6F2]/45 bg-black/30 backdrop-blur-xs text-[#F8F6F2] text-xs tracking-[0.14em] uppercase font-medium hover:bg-[#F8F6F2] hover:text-[#0F0F0E] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Shop Women</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
