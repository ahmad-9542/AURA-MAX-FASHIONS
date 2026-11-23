export const AURA_MAX_LOGO_SRC =
  '/assets/aistudio/Gemini_Generated_Image_iqg862iqg862iqg8_e3b4a2b0.png';

interface AuraMaxLogoProps {
  size?: 'xs' | 'sm' | 'nav' | 'md' | 'footer' | 'xl';
  interactive?: boolean;
  className?: string;
}

export function AuraMaxLogo({
  size = 'md',
  interactive = false,
  className = '',
}: AuraMaxLogoProps) {
  const sizeClasses: Record<NonNullable<AuraMaxLogoProps['size']>, string> = {
    xs: 'h-9 sm:h-11 w-auto',
    sm: 'h-11 sm:h-14 w-auto',
    nav: 'h-11 sm:h-12 md:h-14 w-auto',
    md: 'h-14 sm:h-16 w-auto',
    footer: 'h-20 sm:h-24 w-auto',
    xl: 'h-44 sm:h-56 md:h-64 w-auto',
  };

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 select-none overflow-hidden bg-[#0B0B0A] ${
        interactive
          ? 'transition-all duration-300 ease-out hover:scale-[1.04] hover:brightness-110'
          : ''
      } ${className}`}
    >
      <img
        src={AURA_MAX_LOGO_SRC}
        alt="AURA MAX Official Logo"
        className={`${sizeClasses[size]} object-contain block`}
        draggable={false}
      />
    </span>
  );
}
