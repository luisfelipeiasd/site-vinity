import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation, Variant } from 'framer-motion';

export interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({ children, width = "fit-content", delay = 0.25, direction = "up", className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const getVariants = (): { hidden: Variant; visible: Variant } => {
    switch (direction) {
      case "up": return { hidden: { opacity: 0, y: 75 }, visible: { opacity: 1, y: 0 } };
      case "down": return { hidden: { opacity: 0, y: -75 }, visible: { opacity: 1, y: 0 } };
      case "left": return { hidden: { opacity: 0, x: 75 }, visible: { opacity: 1, x: 0 } };
      case "right": return { hidden: { opacity: 0, x: -75 }, visible: { opacity: 1, x: 0 } };
      default: return { hidden: { opacity: 0, y: 75 }, visible: { opacity: 1, y: 0 } };
    }
  };

  return (
    <div ref={ref} style={{ position: "relative", width }} className={className}>
      <motion.div
        variants={getVariants()}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.8, delay: delay, ease: [0.25, 0.25, 0.25, 0.75] }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};