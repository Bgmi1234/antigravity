"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);

    const moveCursor = (e: MouseEvent) => {
      // Offset position to center the ring
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isClickable = 
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") ||
        target.classList.contains("cursor-pointer");
      
      setIsHovered(!!isClickable);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <>
      {/* Outer spring ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-indigo-500/80 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovered ? 1.6 : 1,
          borderColor: isHovered ? "rgba(99, 102, 241, 1)" : "rgba(99, 102, 241, 0.6)",
          backgroundColor: isHovered ? "rgba(99, 102, 241, 0.08)" : "rgba(99, 102, 241, 0)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
      {/* Inner fast dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-indigo-600 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          x: useSpring(cursorX, { damping: 15, stiffness: 500 }),
          y: useSpring(cursorY, { damping: 15, stiffness: 500 }),
        }}
        animate={{
          scale: isHovered ? 0.7 : 1,
        }}
      />
    </>
  );
}
