"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  // Explicitly remove theme-dark so text is visible on the light background
  useEffect(() => {
    document.body.classList.remove("theme-dark");
    
    // GSAP Reveal Animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });

    // Fade in the big 404
    tl.fromTo(numberRef.current, 
      { opacity: 0, scale: 0.8 },
      { opacity: 0.4, scale: 1, duration: 1.5 }
    );

    // Reveal the text content from bottom up
    if (textRef.current) {
      tl.fromTo(textRef.current.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
        "-=1"
      );
    }

  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("pageTransitionStart", { detail: { href } })
    );
  };

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center bg-[#f5f0eb] overflow-hidden pt-[35vh]">
      
      {/* Giant 404 Text Background */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none">
        <span 
          ref={numberRef}
          className="text-white font-bold"
          style={{ 
            fontFamily: 'var(--font-logo)',
            fontSize: 'clamp(15rem, 45vw, 40rem)', 
            lineHeight: 0.8,
            letterSpacing: '-0.02em',
            opacity: 0.4
          }}
        >
          404
        </span>
      </div>

      {/* Blue Gradient Overlay */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[50vh] z-10 pointer-events-none" 
        style={{ background: 'linear-gradient(to top, var(--accent-blue) -20%, transparent 100%)' }} 
      />

      {/* Content - Positioned Bottom Center with absolute to guarantee exact placement */}
      <div ref={textRef} className="absolute bottom-12 md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-center px-4 w-full">
        <h1 
          className="font-black uppercase text-[#111] mb-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1
          }}
        >
          PAGE NOT FOUND
        </h1>
        <p className="text-[#111] font-medium text-base md:text-lg mb-8 opacity-80">
          Oops... It seems the page you're searching for doesn't exist.
        </p>
        
        {/* Improved Button */}
        <a 
          href="/"
          onClick={(e) => handleLinkClick(e, "/")}
          className="relative inline-flex items-center justify-center overflow-hidden cursor-pointer"
          style={{
            padding: "1rem 2.5rem",
            background: "#111",
            color: "#f5f0eb",
            fontFamily: "var(--font-body)",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            border: "none",
            transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.background = "var(--accent-blue)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "#111";
          }}
        >
          GO TO HOMEPAGE
        </a>
      </div>

    </div>
  );
}
