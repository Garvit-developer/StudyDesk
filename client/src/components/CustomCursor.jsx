import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;

    // Initial scale and autoAlpha
    gsap.set(cursor, { scale: 1, autoAlpha: 0 });

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: "power2.out",
        autoAlpha: 1
      });
      if (!isVisible) setIsVisible(true);
    };

    const handleHoverStart = (e) => {
      const target = e.target;
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest(".cursor-pointer")
      ) {
        setIsHovered(true);
        gsap.to(cursor, {
          scale: 3,
          duration: 0.3,
          ease: "back.out(1.7)",
          backgroundColor: "#155dfc",
          opacity: 0.5
        });
      }
    };

    const handleHoverEnd = () => {
      setIsHovered(false);
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        backgroundColor: "#5751e1",
        opacity: 1
      });
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleHoverStart);
    document.addEventListener("mouseout", handleHoverEnd);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleHoverStart);
      document.removeEventListener("mouseout", handleHoverEnd);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference hidden md:block`}
      style={{ width: "12px", height: "12px", backgroundColor: "#5751e1" }}
    ></div>
  );
};

export default CustomCursor;

