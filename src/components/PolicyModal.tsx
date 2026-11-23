import { useEffect } from 'react';
import { X } from 'lucide-react';
import { POLICY_CONTENT } from '../data/catalog';
import { PolicyKey } from '../types';

interface PolicyModalProps {
  policyKey: PolicyKey | null;
  onClose: () => void;
}

export function PolicyModal({ policyKey, onClose }: PolicyModalProps) {
  useEffect(() => {
    if (!policyKey) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [policyKey, onClose]);

  if (!policyKey) return null;

  const content = POLICY_CONTENT[policyKey];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#F8F6F2] text-[#0F0F0E] p-6 sm:p-10 shadow-2xl relative max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center hover:bg-[#EAE5DC] transition-colors"
          aria-label="Close information dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="text-xs tracking-[0.16em] uppercase text-[#6E6A63] mb-1.5">
          AURA MAX Client Information
        </p>
        <h2
          id="policy-modal-title"
          className="font-display text-3xl sm:text-4xl font-medium text-[#0F0F0E] mb-2"
        >
          {content.title}
        </h2>
        <p className="text-xs text-[#6E6A63] pb-5 mb-6 border-b border-[#0F0F0E]/10">
          {content.subtitle}
        </p>

        <div className="space-y-6">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h3 className="text-xs tracking-[0.12em] uppercase font-semibold text-[#0F0F0E] mb-2">
                {section.heading}
              </h3>
              <p className="text-sm text-[#262421] leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 px-6 py-3 bg-[#0F0F0E] text-[#F8F6F2] text-xs tracking-[0.14em] uppercase font-semibold hover:bg-[#262421] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
