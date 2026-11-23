import { useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { DEPARTMENT_CARDS, DEPARTMENT_SUBCATEGORIES } from '../data/catalog';
import { Department } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { SmartImage } from './SmartImage';

interface CategoryGridProps {
  onSelectDepartment: (department: Department, subCategory?: string) => void;
  onOpenShopAll: () => void;
}

const DEPARTMENTS: Department[] = ['Men', 'Women', 'Footwear', 'Accessories'];

export function CategoryGrid({
  onSelectDepartment,
  onOpenShopAll,
}: CategoryGridProps) {
  const [activeDeptTab, setActiveDeptTab] = useState<Department>('Men');

  return (
    <section
      id="categories"
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-[#0F0F0E]/10"
    >
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#6E6A63] mb-2">
              Complete Fashion &amp; Lifestyle Matrix
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-medium text-[#0F0F0E] tracking-tight">
              Shop by Department
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenShopAll}
            className="group inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase font-semibold text-[#0F0F0E] border-b border-[#0F0F0E] pb-1 self-start sm:self-auto hover:text-[#6E6A63] hover:border-[#6E6A63] transition-colors whitespace-nowrap"
          >
            <span>Explore All Categories</span>
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </div>
      </ScrollReveal>

      {/* 4 Flagship Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {DEPARTMENT_CARDS.map((card, idx) => (
          <ScrollReveal key={card.id} delay={Math.min(idx * 0.06, 0.25)}>
            <div
              data-cursor="SHOP"
              className="group relative overflow-hidden bg-[#EAE5DC] aspect-[3/4]"
            >
              <SmartImage
                src={card.image}
                alt={`${card.title} — ${card.subtitle}`}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                containerClassName="w-full h-full"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
                aria-hidden="true"
              />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex flex-col justify-end gap-3">
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-[#C4C8CE] mb-1">
                    {card.subCategories.length} Curated Categories
                  </p>
                  <h3 className="font-display text-3xl font-medium text-white leading-tight mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#EAE5DC]/80 line-clamp-2">
                    {card.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectDepartment(card.department)}
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 bg-[#F8F6F2] text-[#0F0F0E] text-[11px] tracking-[0.14em] uppercase font-semibold hover:bg-white transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>Shop {card.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Interactive Sub-Category Directory covering all 43 requested sub-categories */}
      <ScrollReveal>
        <div className="bg-[#EAE5DC]/55 border border-[#0F0F0E]/10 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#0F0F0E]/10">
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#6E6A63] mb-1">
                Atelier Category Directory
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#0F0F0E]">
                Browse Every Silhouette
              </h3>
            </div>

            <div
              role="tablist"
              aria-label="Select department directory"
              className="flex flex-wrap items-center gap-2"
            >
              {DEPARTMENTS.map((dept) => {
                const isActive = activeDeptTab === dept;
                return (
                  <button
                    key={dept}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => setActiveDeptTab(dept)}
                    className={`px-4 py-2 text-xs tracking-[0.12em] uppercase font-medium border transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#0F0F0E] text-[#F8F6F2] border-[#0F0F0E]'
                        : 'bg-[#F8F6F2] text-[#6E6A63] border-[#0F0F0E]/15 hover:text-[#0F0F0E] hover:border-[#0F0F0E]'
                    }`}
                  >
                    {dept} ({DEPARTMENT_SUBCATEGORIES[dept].length})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {DEPARTMENT_SUBCATEGORIES[activeDeptTab].map((subCategory) => (
              <button
                key={`${activeDeptTab}-${subCategory}`}
                type="button"
                onClick={() => onSelectDepartment(activeDeptTab, subCategory)}
                className="group px-4 py-3 bg-[#F8F6F2] border border-[#0F0F0E]/12 text-left hover:border-[#0F0F0E] hover:bg-[#0F0F0E] hover:text-[#F8F6F2] transition-colors flex items-center justify-between gap-2"
              >
                <span className="text-xs font-medium tracking-[0.04em] truncate">
                  {subCategory}
                </span>
                <ArrowUpRight
                  className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 shrink-0 transition-opacity"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
