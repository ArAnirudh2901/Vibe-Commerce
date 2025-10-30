import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function AnimatedBorderButton({
  children,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
}) {
  const btnRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0, r: 6 });

  useLayoutEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth || 100;
      const h = el.offsetHeight || 40;
      const cs = window.getComputedStyle(el);
      const rpx = parseFloat(cs.borderTopLeftRadius) || 6;
      const maxR = Math.min((w - 2) / 2, (h - 2) / 2);
      const r = Math.max(0, Math.min(rpx, maxR));
      setDims({ w, h, r });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  return (
    <motion.button
      ref={btnRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-[3.5px] ${className}`}
      initial="rest"
      animate="rest"
      whileHover={disabled ? undefined : 'hover'}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      variants={{ rest: { y: 0 } }}
    >
      <span className="relative z-10 select-none">
        {loading ? 'Processing...' : children}
      </span>

      {/* Animated border overlay */}
      <motion.svg
        className="absolute inset-0 w-full h-full z-0"
        viewBox={`0 0 ${Math.max(dims.w || 100, 2)} ${Math.max(dims.h || 40, 2)}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ pointerEvents: 'none' }}
      >
        {/* Animated ring (starts top-left and draws clockwise full perimeter) */}
        <motion.rect
          x={1}
          y={1}
          width={Math.max((dims.w || 100) - 2, 0)}
          height={Math.max((dims.h || 40) - 2, 0)}
          rx={dims.r || 6}
          ry={dims.r || 6}
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          pathLength={1}
          strokeDasharray={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          shapeRendering="geometricPrecision"
          variants={{ rest: { strokeDashoffset: 1, opacity: 0 }, hover: { strokeDashoffset: 0, opacity: 1 } }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </motion.svg>
    </motion.button>
  );
}

export default AnimatedBorderButton;