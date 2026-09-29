"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

function resetScrollPosition() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

type ConfettiPiece = {
  left: string;
  width: string;
  height: string;
  delay: string;
  duration: string;
  color: string;
  animationName: string;
  round: boolean;
};

export default function PageLoader() {
  const [mounted, setMounted] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const grayFillRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLSpanElement>(null);
  const pipeRef = useRef<HTMLSpanElement>(null);
  const dotsWrapperRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const isAnimating = useRef(false);
  const targetHref = useRef<string | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Listen for pageTransitionStart event
  useEffect(() => {
    const handleStart = (e: Event) => {
      const href = (e as CustomEvent).detail?.href;
      if (!href || href === pathname || isAnimating.current) return;

      isAnimating.current = true;
      targetHref.current = href;

      const container = containerRef.current;
      const fill = fillRef.current;
      const grayFill = grayFillRef.current;
      if (!container || !fill || !grayFill) return;

      // Reset & show
      gsap.set(container, { display: "flex", yPercent: 0, opacity: 1, pointerEvents: "all" });
      gsap.set(grayFill, { height: "0%" });
      gsap.set(fill, { height: "0%" });
      gsap.set(logoTextRef.current, { color: "#111", opacity: 0 });
      gsap.set(pipeRef.current, { color: "rgba(0,0,0,0.25)", opacity: 0 });
      
      let dots: HTMLCollection | null = null;
      if (dotsWrapperRef.current) {
        dots = dotsWrapperRef.current.children;
        gsap.set(dots, { backgroundColor: "var(--accent-blue)", opacity: 0 });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          // Reset scroll while the transition covers the page before navigating.
          resetScrollPosition();
          router.push(href, { scroll: false });

          // Safety timeout: force reveal after 4s if pathname didn't change
          safetyTimer.current = setTimeout(() => {
            revealPage();
          }, 4000);
        },
      });

      // Gray fill from bottom
      tl.to(grayFill, {
        height: "100%",
        duration: 0.6,
        ease: "power3.inOut",
      });

      // Blue fill from bottom, slightly overlapping
      tl.to(fill, {
        height: "100%",
        duration: 0.6,
        ease: "power3.inOut",
      }, "-=0.3");

      // Fade in the logo and dots at the start
      tl.to(
        [logoTextRef.current, pipeRef.current, dots],
        {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        },
        0
      );

      // Turn text and dots white when the blue fill reaches them
      tl.to(
        [logoTextRef.current, pipeRef.current],
        {
          color: "#ffffff",
          duration: 0.2,
          ease: "none",
        },
        "-=0.4"
      );

      if (dots) {
        tl.to(
          dots,
          {
            backgroundColor: "#ffffff",
            duration: 0.2,
            ease: "none",
          },
          "-=0.4" // Start at the same time as the text color change
        );
      }
    };

    window.addEventListener("pageTransitionStart", handleStart);
    return () => window.removeEventListener("pageTransitionStart", handleStart);
  }, [pathname, router]);

  // Detect pathname change → page loaded → reveal
  useEffect(() => {
    if (!isAnimating.current || !targetHref.current) return;
    if (pathname !== targetHref.current) return;

    // The new route can render before the browser applies the previous scroll state.
    resetScrollPosition();

    // Clear safety timer
    if (safetyTimer.current) {
      clearTimeout(safetyTimer.current);
      safetyTimer.current = null;
    }

    // Small delay so new page renders first
    setTimeout(() => revealPage(), 250);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
      if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
    };
  }, []);

  const revealPage = () => {
    if (!containerRef.current || !isAnimating.current) return;

    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
      onComplete: () => {
        const arrivedAtContact = targetHref.current === "/contact";
        isAnimating.current = false;
        targetHref.current = null;
        if (containerRef.current) {
          gsap.set(containerRef.current, { display: "none", yPercent: 0 });
        }

        if (arrivedAtContact) {
          const colors = ["#2167AB", "#f4bd50", "#f07c70", "#74b88a", "#d998d3", "#ffffff"];
          setConfetti(
            Array.from({ length: 150 }, () => ({
              left: `${Math.random() * 100}%`,
              width: `${5 + Math.random() * 8}px`,
              height: `${7 + Math.random() * 13}px`,
              delay: `${Math.random() * 0.45}s`,
              duration: `${2.2 + Math.random() * 1.2}s`,
              color: colors[Math.floor(Math.random() * colors.length)],
              animationName: Math.random() > 0.5 ? "contactConfettiFall" : "contactConfettiDrift",
              round: Math.random() > 0.72,
            }))
          );
          if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
          celebrationTimer.current = setTimeout(() => {
            setConfetti([]);
            celebrationTimer.current = null;
          }, 4100);
        }
      },
    });
  };

  if (!mounted) return null;

  return (
    <>
      {confetti.length > 0 && (
        <div className="contact-celebration" aria-hidden="true">
          {confetti.map((piece, index) => (
            <span
              key={index}
              style={{
                left: piece.left,
                width: piece.width,
                height: piece.height,
                animationDelay: piece.delay,
                animationDuration: piece.duration,
                animationName: piece.animationName,
                backgroundColor: piece.color,
                borderRadius: piece.round ? "50%" : "2px",
              }}
            />
          ))}
        </div>
      )}
      <div
        ref={containerRef}
        className="hidden" // Tailwind class for display: none
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          overflow: "hidden",
          pointerEvents: "none", // ensure it doesn't block clicks while invisible
        }}
      >
      {/* Gray fill from bottom (first wipe) */}
      <div
        ref={grayFillRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "0%",
          background: "#e0e0e0",
          zIndex: 0,
        }}
      />
      
      {/* Blue fill from bottom (second wipe) */}
      <div
        ref={fillRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "0%",
          background: "var(--accent-blue)",
          zIndex: 0,
        }}
      />

      {/* Logo + Bouncing Dots */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <span
          ref={logoTextRef}
          style={{
            fontFamily: "var(--font-logo)",
            fontSize: "2rem",
            fontWeight: 700,
            fontStyle: "italic",
            color: "#111",
            letterSpacing: "-0.02em",
          }}
        >
          flxzor
        </span>

        <span
          ref={pipeRef}
          style={{
            color: "rgba(0,0,0,0.25)",
            fontSize: "1.5rem",
            fontWeight: 300,
          }}
        >
          |
        </span>

        <div
          ref={dotsWrapperRef}
          style={{
            display: "flex",
            gap: "5px",
            alignItems: "center",
            height: "24px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="page-loader-dot"
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "var(--accent-blue)",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
      </div>
    </>
  );
}
