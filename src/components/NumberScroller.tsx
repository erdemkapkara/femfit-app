import React, { useRef, useEffect, useCallback } from 'react';

interface NumberScrollerProps {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  label: string;
  unit?: string;
}

const ITEM_HEIGHT = 44;

const NumberScroller: React.FC<NumberScrollerProps> = ({ value, min, max, onChange, label, unit }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const isScrolling = useRef(false);

  const scrollToValue = useCallback((val: number, smooth = false) => {
    if (!listRef.current) return;
    const idx = val - min;
    listRef.current.scrollTo({
      top: idx * ITEM_HEIGHT,
      behavior: smooth ? 'smooth' : ('instant' as ScrollBehavior),
    });
  }, [min]);

  useEffect(() => {
    scrollToValue(value);
  }, [value, scrollToValue]);

  const handleScroll = () => {
    if (!listRef.current || isScrolling.current) return;
    isScrolling.current = true;
    const idx = Math.round(listRef.current.scrollTop / ITEM_HEIGHT);
    const snapped = Math.min(max, Math.max(min, min + idx));
    if (snapped !== value) onChange(snapped);
    setTimeout(() => { isScrolling.current = false; }, 100);
  };

  return (
    <div className="flex flex-col items-center select-none">
      <p className="text-xs font-bold text-charcoal uppercase tracking-wide mb-2">{label}</p>
      <div className="relative w-20 rounded-xl overflow-hidden" style={{ height: ITEM_HEIGHT * 3 }}>
        {/* highlight stripe */}
        <div
          className="absolute inset-x-0 pointer-events-none z-10 border-y-2 border-sage"
          style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT }}
        />
        {/* fades */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

        <div
          ref={listRef}
          onScroll={handleScroll}
          className="h-full overflow-y-scroll"
          style={{ scrollSnapType: 'y mandatory', scrollbarWidth: 'none' }}
        >
          {/* padding items so first/last can center */}
          <div style={{ height: ITEM_HEIGHT }} />
          {numbers.map(n => (
            <div
              key={n}
              onClick={() => { onChange(n); scrollToValue(n, true); }}
              className={`flex items-center justify-center cursor-pointer transition-all font-semibold
                ${n === value ? 'text-sage text-xl' : 'text-gray-400 text-base'}`}
              style={{ height: ITEM_HEIGHT, scrollSnapAlign: 'center' }}
            >
              {n}{unit && <span className="text-xs ml-0.5 text-gray-400">{unit}</span>}
            </div>
          ))}
          <div style={{ height: ITEM_HEIGHT }} />
        </div>
      </div>
    </div>
  );
};

export default NumberScroller;
