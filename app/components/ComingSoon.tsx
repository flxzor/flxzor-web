"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ComingSoon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  // Explicitly remove theme-dark so text is visible on the light background
  useEffect(() => {
    document.body.classList.remove("theme-dark");
    
    // GSAP Reveal Animation (Slide up like Contact page)
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });

    // The giant 404 slides up from the bottom
    tl.fromTo(numberRef.current, 
      { y: 200, opacity: 0, rotateX: -20 },
      { y: 0, opacity: 0.4, rotateX: 0, duration: 1.2 }
    );

    // Reveal the text content from bottom up with a big Y offset
    if (textRef.current) {
      tl.fromTo(textRef.current.children,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.15 },
        "-=0.9"
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
          501
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
          UNDER DEVELOPMENT
        </h1>
        <p className="text-[#111] font-medium text-base md:text-lg mb-8 opacity-80">
          Oops... It seems the page you're searching for is still under development. Please check back later or explore other sections of the site.
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
