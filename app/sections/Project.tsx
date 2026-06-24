"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}



const Project = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const panelTopRef = useRef<HTMLDivElement>(null);
  const panelBottomRef = useRef<HTMLDivElement>(null);
  const headingSolidRef = useRef<HTMLSpanElement>(null);
  const headingOutlineRef = useRef<HTMLSpanElement>(null);

  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !panelTopRef.current ||
        !panelBottomRef.current ||
        !headingSolidRef.current ||
        !headingOutlineRef.current ||
        !wrapperRef.current ||
        !bgRef.current
      ) {
        return;
      }

      const aboutEl = document.querySelector("#about");

      /* ── Theme Toggle for Navbar & Menu ─────────── */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 30%",
        onEnter: () => document.body.classList.add("theme-dark"),
        onLeaveBack: () => document.body.classList.remove("theme-dark"),
      });

      /* ── Pin About Section ──────────────────────── */
      if (aboutEl) {
        ScrollTrigger.create({
          trigger: aboutEl,
          start: "bottom bottom",
          endTrigger: sectionRef.current,
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
      }

      /* ── Hard Toggle Background at Top ──────────── */
      // This bulletproofs the "early black background" issue.
      // The solid black background will ONLY appear the exact millisecond 
      // TechStack reaches the top and pins.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        onEnter: () => gsap.set(bgRef.current, { opacity: 1 }),
        onLeaveBack: () => gsap.set(bgRef.current, { opacity: 0 }),
      });

      /* ── Initial States ───────────────────────── */
      gsap.set(panelTopRef.current, { xPercent: 100 });
      gsap.set(panelBottomRef.current, { xPercent: -100 });
      gsap.set(bgRef.current, { opacity: 0 }); 
      gsap.set(headingSolidRef.current, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(headingOutlineRef.current, { clipPath: "inset(0% 0% 0% 100%)" });

      /* ═══════════════════════════════════════════
         PHASE 1 — Curtain Close
         As TechStack scrolls UP to cover About,
         the fixed curtains close horizontally.
         ═══════════════════════════════════════════ */
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top top", // Finish exactly as it hits the top
          scrub: true,
        },
      });

      scrollTl
        .to(panelTopRef.current, { xPercent: 0, duration: 1, ease: "none" }, 0)
        .to(panelBottomRef.current, { xPercent: 0, duration: 1, ease: "none" }, 0);

      /* ═══════════════════════════════════════════
         PHASE 2 — Pinned Reveal
         Once TechStack reaches the top, pin it,
         and open curtains vertically.
         ═══════════════════════════════════════════ */
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      /* 2a — Open curtains vertically */
      revealTl
        .to(panelTopRef.current, { yPercent: -100, duration: 2, ease: "power2.inOut" }, 0.2)
        .to(panelBottomRef.current, { yPercent: 100, duration: 2, ease: "power2.inOut" }, 0.2);

      /* 2b — Heading wipe reveals */
      revealTl
        .to(headingSolidRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power3.inOut" }, 1.2)
        .to(headingOutlineRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power3.inOut" }, 1.4);
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className="techstack-wrapper w-full">
      {/* ── Fixed Curtain Panels ───────────────── */}
      <div
        ref={panelTopRef}
        className="fixed left-0 w-full h-[50vh] bg-black z-[999] pointer-events-none will-change-transform top-0"
        aria-hidden="true"
      />
      <div
        ref={panelBottomRef}
        className="fixed left-0 w-full h-[50vh] bg-black z-[999] pointer-events-none will-change-transform top-[50%]"
        aria-hidden="true"
      />

      {/* ── Section ──────────────────────────── */}
      <section ref={sectionRef} id="project" className="relative w-full min-h-screen bg-transparent z-15">
        
        {/* Dedicated Background Layer */}
        <div ref={bgRef} className="absolute inset-0 w-full h-full bg-black z-0 pointer-events-none" />

        {/* Content Container (MUST have bg-transparent so the mask works) */}
        <div className="techstack__content relative z-10 flex flex-col items-center justify-center min-h-screen w-full bg-transparent px-[6vw] pt-[120px] pb-[100px]">
          
          {/* Heading */}
          <div className="flex flex-col items-center justify-center w-full relative mt-[-10vh]">
            <span
              ref={headingSolidRef}
              className="relative z-10 text-white font-black uppercase whitespace-nowrap leading-[0.9] tracking-[-0.02em] text-[clamp(3.5rem,12vw,13rem)] -translate-x-[5vw]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              MY PROJECT
            </span>
            <span
              ref={headingOutlineRef}
              className="relative z-0 font-black uppercase whitespace-nowrap leading-[0.9] tracking-[-0.02em] text-[clamp(3.5rem,12vw,13rem)] translate-x-[5vw]"
              style={{
                fontFamily: "var(--font-display)",
                color: "transparent",
                WebkitTextStroke: "2px rgba(255, 255, 255, 0.4)",
              }}
              aria-hidden="true"
            >
              MY PROJECT
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Project;
