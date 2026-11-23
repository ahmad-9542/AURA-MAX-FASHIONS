import { ArrowRight } from 'lucide-react';
import { COLLECTIONS } from '../data/catalog';
import { CollectionName } from '../types';
import { MagneticButton } from './MagneticButton';
import { ScrollReveal } from './ScrollReveal';
import { SmartImage } from './SmartImage';

interface CollectionsSectionProps {
  onSelectCollection: (collection: CollectionName) => void;
}

export function CollectionsSection({ onSelectCollection }: CollectionsSectionProps) {
  return (
    <section
      id="collections"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-[#0F0F0E]/10"
    >
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#6E6A63] mb-2">
              Editorial Capsules
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-medium text-[#0F0F0E] tracking-tight">
              Featured Collections
            </h2>
          </div>
          <p className="text-sm text-[#6E6A63] max-w-md">
            Four cohesive capsules shaped around architectural tailoring, breathable Mediterranean flax, and elevated urban staples.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {COLLECTIONS.map((coll, idx) => (
          <ScrollReveal key={coll.id} delay={idx * 0.08}>
            <article
              data-cursor="EXPLORE"
              className="group relative overflow-hidden bg-[#1C1B19] aspect-[4/3]"
            >
              <SmartImage
                src={coll.image}
                alt={`${coll.name} — ${coll.season}`}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                containerClassName="w-full h-full"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"
                aria-hidden="true"
              />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10 flex flex-col items-start">
                <span className="text-[11px] tracking-[0.18em] uppercase text-[#C4C8CE] mb-2">
                  {coll.season}
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-medium text-white mb-2.5">
                  {coll.name}
                </h3>
                <p className="text-sm text-[#F8F6F2]/85 leading-relaxed max-w-md mb-6">
                  {coll.description}
                </p>
                <MagneticButton>
                  <button
                    type="button"
                    onClick={() => onSelectCollection(coll.name)}
                    className="group/btn inline-flex items-center gap-2 px-5 py-2.5 bg-[#F8F6F2] text-[#0F0F0E] text-xs tracking-[0.14em] uppercase font-semibold hover:bg-white transition-colors whitespace-nowrap"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>
                </MagneticButton>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
