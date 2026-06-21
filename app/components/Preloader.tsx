"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if preloader has already been shown in this session
    if (sessionStorage.getItem("preloader_shown")) {
      setIsRevealed(true);
      setShouldRender(true);
    } else {
      setShouldRender(true);
    }
  }, []);

  useGSAP(() => {
    if (isRevealed || !shouldRender) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // Mark as shown in session storage
        sessionStorage.setItem("preloader_shown", "true");
        
        // Auto reveal immediately
        revealSite();
      },
    });

    const counter = { val: 0 };
    
    // Animate the blue progress bar from height 0% to 100%
    tl.to(progressRef.current, {
      height: "100%",
      duration: 2.5,
      ease: "power3.inOut",
    }, 0);

    // Animate the percentage text
    tl.to(counter, {
      val: 100,
      duration: 2.5,
      ease: "power3.inOut",
      onUpdate: () => {
        if (textRef.current) {
          textRef.current.innerText = `${Math.round(counter.val)}%`;
        }
      },
    }, 0);

    const revealSite = () => {
      // Dispatch immediately so the Hero animation starts playing 
      // while the preloader is sliding up (no delay)
      window.dispatchEvent(new CustomEvent("preloaderComplete"));

      // Animate the preloader container away
      gsap.to(containerRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
        onComplete: () => setIsRevealed(true),
      });
      
      // Also fade out the text
      gsap.to(textRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

  }, { scope: containerRef, dependencies: [shouldRender, isRevealed] });

  // Don't render anything until we check sessionStorage to prevent hydration mismatch
  if (!shouldRender || isRevealed) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-end justify-start bg-[#e0e0e0] overflow-hidden"
    >
      {/* The Blue Progress Bar growing from bottom */}
      <div
        ref={progressRef}
        className="absolute bottom-0 left-0 w-full bg-(--accent-blue) h-0 z-0"
      />
      
      {/* Percentage Text */}
      <div
        ref={textRef}
        className="relative z-50 p-8 text-[#111] text-8xl md:text-[10rem] font-bold tracking-tighter"
      >
        0%
      </div>
    </div>
  );
}
