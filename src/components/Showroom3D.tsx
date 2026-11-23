import { MouseEvent, useState } from 'react';
import { ArrowRight, ArrowUpRight, Layers, Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { PRODUCTS } from '../data/catalog';
import { Product } from '../types';
import { formatINR } from '../utils/format';
import { MagneticButton } from './MagneticButton';
import { SmartImage } from './SmartImage';

interface Showroom3DProps {
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

const SHOWROOM_PIECES = [PRODUCTS[1], PRODUCTS[0], PRODUCTS[8], PRODUCTS[9]];

export function Showroom3D({ onSelectProduct, onQuickAdd }: Showroom3DProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const activeProduct = SHOWROOM_PIECES[activeIndex] ?? PRODUCTS[0];

  const handleStageMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: Number((-ny * 8).toFixed(2)),
      rotateY: Number((nx * 10).toFixed(2)),
    });
  };

  const handleStageMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <section
      id="showroom-3d"
      aria-label="AURA MAX 3D Atelier Showroom"
      className="relative overflow-hidden bg-[#0B0B0A] text-[#F8F6F2] border-b border-white/10"
    >
      {/* Subtle animated architectural grid & metallic chrome silver ambiance */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(196,200,206,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(196,200,206,0.45) 1px, transparent 1px)',
          backgroundSize: '84px 84px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-40 right-0 w-[560px] h-[560px] rounded-full bg-[#C4C8CE]/10 blur-[130px] pointer-events-none"
      />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left: Editorial Showroom Controls & Piece Details */}
          <div className="lg:col-span-5 space-y-7">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#C4C8CE] mb-3">
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Spatial Atelier · Interactive 3D Stage</span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-medium leading-[1.04] text-white text-balance">
                Sculpted in Light &amp; Proportion
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#EAE5DC]/75 leading-relaxed max-w-md">
              Inspect our flagship silhouettes in multi-layered spatial depth. Move across the showroom stage to shift perspective, or select any architectural look below.
            </p>

            {/* Piece Selector Rail */}
            <div className="space-y-2 border-t border-white/10 pt-5">
              {SHOWROOM_PIECES.map((piece, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={piece.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full text-left px-4 py-3.5 border transition-all duration-200 flex items-center justify-between gap-4 ${
                      isActive
                        ? 'bg-white/[0.07] border-[#C4C8CE]/60 text-white'
                        : 'bg-transparent border-white/10 text-[#EAE5DC]/65 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="block text-[10px] tracking-[0.18em] uppercase text-[#C4C8CE] mb-0.5">
                        0{idx + 1} · {piece.category}
                      </span>
                      <span className="block text-sm font-medium truncate">
                        {piece.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold tabular-nums shrink-0">
                      {formatINR(piece.price)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton>
                <button
                  type="button"
                  onClick={() => onSelectProduct(activeProduct)}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#F8F6F2] text-[#0F0F0E] text-xs tracking-[0.16em] uppercase font-semibold hover:bg-[#EAE5DC] transition-colors whitespace-nowrap"
                >
                  <span>Inspect Silhouette</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </MagneticButton>

              <button
                type="button"
                onClick={() => onQuickAdd(activeProduct)}
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/25 text-[#F8F6F2] text-xs tracking-[0.14em] uppercase font-medium hover:border-white hover:bg-white/5 transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>

          {/* Right: 3D Perspective Stage */}
          <div className="lg:col-span-7">
            <div
              onMouseMove={handleStageMouseMove}
              onMouseLeave={handleStageMouseLeave}
              className="relative min-h-[460px] sm:min-h-[560px] flex items-center justify-center"
              style={{ perspective: '1400px' }}
            >
              {/* 3D Depth Wrapper */}
              <div
                className="relative w-full max-w-[540px] h-[440px] sm:h-[520px] transition-transform duration-300 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                }}
              >
                {/* Back Depth Architectural Plane */}
                <div
                  aria-hidden="true"
                  className="hidden sm:block absolute inset-4 border border-[#C4C8CE]/25 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"
                  style={{ transform: 'translateZ(-55px)' }}
                />

                {/* Secondary Floating Garment Card (Back-Right) */}
                {SHOWROOM_PIECES[(activeIndex + 1) % SHOWROOM_PIECES.length] && (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((activeIndex + 1) % SHOWROOM_PIECES.length)
                    }
                    data-cursor="VIEW"
                    aria-label={`Switch 3D showroom focus to ${
                      SHOWROOM_PIECES[(activeIndex + 1) % SHOWROOM_PIECES.length].name
                    }`}
                    className="hidden sm:block absolute right-0 top-6 w-44 aspect-[3/4] overflow-hidden border border-white/15 bg-[#1B1A18] shadow-2xl opacity-75 hover:opacity-100 transition-opacity duration-300"
                    style={{ transform: 'translateZ(20px) rotateY(-8deg)' }}
                  >
                    <SmartImage
                      src={
                        SHOWROOM_PIECES[(activeIndex + 1) % SHOWROOM_PIECES.length]
                          .image
                      }
                      alt={
                        SHOWROOM_PIECES[(activeIndex + 1) % SHOWROOM_PIECES.length]
                          .name
                      }
                      className="w-full h-full object-cover object-top"
                      containerClassName="w-full h-full"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"
                      aria-hidden="true"
                    />
                    <span className="absolute bottom-2.5 left-3 right-3 text-left text-[10px] tracking-[0.14em] uppercase text-[#EAE5DC] truncate">
                      Next Look →
                    </span>
                  </button>
                )}

                {/* Primary Center Floating 3D Card */}
                <motion.div
                  key={activeProduct.id}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, scale: 0.96 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => onSelectProduct(activeProduct)}
                  data-cursor="EXPLORE"
                  className="relative mx-auto sm:ml-10 w-[290px] sm:w-[340px] aspect-[3/4] overflow-hidden bg-[#1C1B19] border border-[#C4C8CE]/35 shadow-[0_35px_80px_rgba(0,0,0,0.7)] cursor-pointer group"
                  style={{ transform: 'translateZ(65px)' }}
                >
                  <SmartImage
                    src={activeProduct.alternateImage ?? activeProduct.image}
                    alt={`${activeProduct.name} in 3D Showroom`}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    containerClassName="w-full h-full"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent"
                    aria-hidden="true"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[10px] tracking-[0.18em] uppercase text-[#C4C8CE] mb-1">
                        {activeProduct.collection}
                      </p>
                      <h3 className="font-display text-2xl text-white leading-tight">
                        {activeProduct.name}
                      </h3>
                      <p className="text-xs text-[#EAE5DC] mt-1 tabular-nums">
                        {formatINR(activeProduct.price)}
                      </p>
                    </div>
                    <span className="w-9 h-9 bg-[#F8F6F2] text-[#0F0F0E] flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </div>
                </motion.div>

                {/* Foreground Floating Fabric Tag Card */}
                <div
                  className="hidden sm:flex items-center gap-3 absolute left-0 bottom-8 bg-[#181715]/95 backdrop-blur-md border border-[#C4C8CE]/30 px-4 py-3 shadow-2xl max-w-[230px]"
                  style={{ transform: 'translateZ(95px)' }}
                >
                  <div>
                    <span className="block text-[10px] tracking-[0.16em] uppercase text-[#C4C8CE]">
                      Material Spec
                    </span>
                    <span className="block text-xs text-white leading-snug mt-0.5">
                      {activeProduct.fabricAndCare[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
