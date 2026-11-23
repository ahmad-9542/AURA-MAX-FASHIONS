import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AuraMaxLogo } from './AuraMaxLogo';

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(false);
      onComplete();
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion, onComplete]);

  const handleSkip = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="auramax-cinematic-intro"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] bg-[#0B0B0A] text-[#F8F6F2] flex flex-col items-center justify-center overflow-hidden select-none px-4"
          aria-label="AURA MAX Brand Introduction"
        >
          {/* Metallic chrome silver hairline */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.35 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-64 sm:w-96 h-px bg-gradient-to-r from-transparent via-[#C4C8CE] to-transparent mb-8"
          />

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <AuraMaxLogo size="xl" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ delay: 0.45, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-[11px] tracking-[0.3em] uppercase text-[#C4C8CE]"
          >
            OWN YOUR AURA.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.35 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-64 sm:w-96 h-px bg-gradient-to-r from-transparent via-[#C4C8CE] to-transparent mt-8"
          />

          <button
            type="button"
            onClick={handleSkip}
            className="absolute bottom-8 right-8 px-4 py-2 text-[11px] tracking-[0.2em] uppercase text-[#C4C8CE] hover:text-white border border-[#C4C8CE]/30 hover:border-white/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
