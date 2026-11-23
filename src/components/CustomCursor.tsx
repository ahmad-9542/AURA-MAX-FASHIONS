import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isPointerHover, setIsPointerHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') {
      setEnabled(false);
      return;
    }

    const mediaQuery = window.matchMedia('(pointer: fine)');
    const updateMedia = () => setEnabled(mediaQuery.matches);
    updateMedia();
    mediaQuery.addEventListener('change', updateMedia);
    return () => mediaQuery.removeEventListener('change', updateMedia);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const cursorEl = target.closest('[data-cursor]') as HTMLElement | null;
        if (cursorEl) {
          setCursorLabel(cursorEl.getAttribute('data-cursor'));
          setIsPointerHover(true);
        } else if (target.closest('button, a, select, input, [role="button"]')) {
          setCursorLabel(null);
          setIsPointerHover(true);
        } else {
          setCursorLabel(null);
          setIsPointerHover(false);
        }
      }
    };

    const handleLeave = () => {
      setIsVisible(false);
    };

    const animate = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.18;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetPos.current.x}px, ${targetPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId.current = window.requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    rafId.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, [enabled, isVisible]);

  if (!enabled || !isVisible) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 z-[90] pointer-events-none rounded-full transition-[width,height,background-color,border-color] duration-200 flex items-center justify-center ${
          cursorLabel
            ? 'w-16 h-16 bg-[#0B0B0A]/90 border border-[#C4C8CE]/70 text-[#F8F6F2]'
            : isPointerHover
              ? 'w-10 h-10 bg-transparent border border-[#0B0B0A]/75'
              : 'w-7 h-7 bg-transparent border border-[#0B0B0A]/40'
        }`}
      >
        {cursorLabel && (
          <span className="text-[9px] tracking-[0.18em] uppercase font-semibold">
            {cursorLabel}
          </span>
        )}
      </div>

      {!cursorLabel && (
        <div
          ref={dotRef}
          aria-hidden="true"
          className="fixed top-0 left-0 z-[90] w-1.5 h-1.5 rounded-full bg-[#C4C8CE] mix-blend-difference pointer-events-none"
        />
      )}
    </>
  );
}
