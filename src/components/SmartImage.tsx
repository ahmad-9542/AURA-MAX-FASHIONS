import { useState } from 'react';
import { Shirt } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

export function SmartImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
}: SmartImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EAE5DC] text-[#6E6A63] p-6 text-center ${containerClassName}`}
        role="img"
        aria-label={alt}
      >
        <Shirt className="w-8 h-8 mb-2 stroke-[1.25] opacity-60" aria-hidden="true" />
        <span className="text-xs tracking-wider uppercase font-medium opacity-75">
          AURA MAX Atelier
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
