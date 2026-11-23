import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { CAMPAIGN_ART_DIFFERENT_IMAGE } from '../data/catalog';
import { MagneticButton } from './MagneticButton';
import { SmartImage } from './SmartImage';

interface CampaignSectionProps {
  onExploreCampaign: () => void;
}

export function CampaignSection({ onExploreCampaign }: CampaignSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0]);
  const textY = useTransform(scrollYProgress, [0, 1], [28, -24]);

  return (
    <section
      ref={containerRef}
      id="campaign-art"
      aria-label="Special Fashion Campaign: The Art of Being Different"
      className="relative w-full overflow-hidden bg-[#0F0F0E] text-[#F8F6F2]"
    >
      <div className="relative min-h-[560px] sm:min-h-[680px] lg:min-h-[760px] flex items-end">
        <motion.div
          style={prefersReducedMotion ? undefined : { scale: imageScale }}
          className="absolute inset-0 w-full h-full will-change-transform"
        >
          <SmartImage
            src={CAMPAIGN_ART_DIFFERENT_IMAGE}
            alt="AURA MAX editorial campaign featuring ivory wool cape outerwear and tailored monochrome suiting inside a limestone gallery"
            className="w-full h-full object-cover object-center"
            containerClassName="w-full h-full"
          />
        </motion.div>

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pb-16 sm:pb-24 pt-24">
          <motion.div
            style={prefersReducedMotion ? undefined : { y: textY }}
            className="max-w-3xl"
          >
            <p className="text-xs tracking-[0.24em] uppercase text-[#C4C8CE] mb-4 font-medium">
              AURA MAX · OWN YOUR AURA.
            </p>
            <h2 className="font-display text-4xl sm:text-6xl lg:text-[74px] font-medium leading-[0.98] tracking-[0.01em] text-white text-balance mb-6">
              THE ART OF BEING DIFFERENT.
            </h2>
            <p className="text-base sm:text-lg text-[#EAE5DC]/90 max-w-xl leading-relaxed mb-9">
              Sharp architectural capes, obsidian tailoring, and sculpted wool silhouettes crafted for individuals who command a room in quiet monochrome.
            </p>

            <MagneticButton>
              <button
                type="button"
                onClick={onExploreCampaign}
                data-cursor="EXPLORE"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#F8F6F2] text-[#0F0F0E] text-xs tracking-[0.16em] uppercase font-semibold hover:bg-white transition-colors whitespace-nowrap"
              >
                <span>Explore the Campaign</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
