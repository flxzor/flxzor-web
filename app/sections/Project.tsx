"use client";

import React, { useRef } from "react";
import { Caveat } from "next/font/google";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { HygraphProject } from "@/lib/hygraph";

const caveat = Caveat({ subsets: ["latin"], weight: "700", display: "swap" });

const isMobileViewport = () => {
  if (typeof window === "undefined") return false;

  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  const hasMobileUserAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  return isTouchDevice || hasMobileUserAgent;
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

interface ProjectProps {
  projects: HygraphProject[];
}

const Project = ({ projects = [] }: ProjectProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const panelTopRef = useRef<HTMLDivElement>(null);
  const panelBottomRef = useRef<HTMLDivElement>(null);
  const headingGroupRef = useRef<HTMLDivElement>(null);
  const headingSolidRef = useRef<HTMLSpanElement>(null);
  const headingOutlineRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !panelTopRef.current ||
        !panelBottomRef.current ||
        !headingGroupRef.current ||
        !headingSolidRef.current ||
        !headingOutlineRef.current ||
        !captionRef.current ||
        !cardsRef.current ||
        !buttonRef.current ||
        !bgRef.current
      ) {
        return;
      }

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const aboutEl = document.querySelector("#about");
      const contactEl = document.querySelector("#contact") as HTMLElement | null;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 30%",
        onEnter: () => document.body.classList.add("theme-dark"),
        onLeaveBack: () => document.body.classList.remove("theme-dark"),
      });

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

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        onEnter: () => gsap.set(bgRef.current, { opacity: 1 }),
        onLeaveBack: () => gsap.set(bgRef.current, { opacity: 0 }),
      });

      gsap.set(panelTopRef.current, { xPercent: 100 });
      gsap.set(panelBottomRef.current, { xPercent: -100 });
      gsap.set(bgRef.current, { opacity: 0 });
      gsap.set(headingGroupRef.current, {
        y: 0,
        scale: 1,
        transformOrigin: "center bottom",
      });
      gsap.set(headingSolidRef.current, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(headingOutlineRef.current, { clipPath: "inset(0% 0% 0% 100%)" });
      gsap.set(captionRef.current, { y: 36, opacity: 0 });
      gsap.set(cardsRef.current, { y: 54, opacity: 0, scale: 0.96 });
      gsap.set(buttonRef.current, {
        xPercent: -50,
        yPercent: -50,
        x: () => (isMobileViewport() ? 0 : 250),
        y: () => (isMobileViewport() ? 168 : 28),
        opacity: 0,
        rotate: () => (isMobileViewport() ? 0 : -7),
        transformOrigin: "center center",
      });
      gsap.set(cards, {
        xPercent: -50,
        yPercent: -50,
        y: (index) => 150 + index * 34,
        x: (index) => (isMobileViewport() ? 0 : (index - 1) * 32),
        rotate: (index) => (isMobileViewport() ? 0 : (index - 1) * 6),
        scale: (index) => 1 - index * 0.035,
        opacity: 0,
        transformOrigin: "center center",
      });

      if (contactEl) {
        // Use negative margin to slide Contact over Project while Project is finishing its pin.
        gsap.set(contactEl, { marginTop: "-100vh", position: "relative", zIndex: 80 });
      }

      const curtainTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });

      curtainTl
        .to(panelTopRef.current, { xPercent: 0, duration: 1, ease: "none" }, 0)
        .to(panelBottomRef.current, { xPercent: 0, duration: 1, ease: "none" }, 0);

      const getCardStack = (index: number) => {
        const isMobile = isMobileViewport();
        return {
          x: isMobile ? 0 : (index - 1) * 30,
          y: isMobile ? index * -15 : index * -23,
          rotate: isMobile ? 0 : (index - 1) * -6,
          scale: 1 - index * 0.035,
        };
      };

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=500%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      revealTl
        .to(panelTopRef.current, { yPercent: -100, duration: 1.7, ease: "power2.inOut" }, 0.15)
        .to(panelBottomRef.current, { yPercent: 100, duration: 1.7, ease: "power2.inOut" }, 0.15)
        .to(headingSolidRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.45, ease: "power3.inOut" }, 1.25)
        .to(headingOutlineRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.45, ease: "power3.inOut" }, 1.38)
        .to(
          headingGroupRef.current,
          {
            y: () => (isMobileViewport() ? -54 : -24),
            scale: () => (isMobileViewport() ? 0.62 : 0.58),
            duration: 1.1,
            ease: "power3.inOut",
          },
          3.35
        )
        .to(captionRef.current, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }, 3.92)
        .to(
          captionRef.current,
          {
            y: () => (isMobileViewport() ? 0 : -46),
            scale: () => (isMobileViewport() ? 1 : 0.76),
            duration: 0.7,
            ease: "power2.out",
            transformOrigin: "center center",
          },
          4.12
        )
        .to(cardsRef.current, { y: 0, opacity: 1, scale: 1, duration: 0.95, ease: "power3.out" }, 4.25)
        .add(() => undefined, 4.35);

      cards.forEach((card, index) => {
        const startAt = 4.35 + index * 0.72;

        revealTl
          .to(
            card,
            {
              xPercent: -50,
              yPercent: -50,
              x: () => getCardStack(index).x,
              y: () => getCardStack(index).y,
              rotate: () => getCardStack(index).rotate,
              scale: () => getCardStack(index).scale,
              opacity: 1,
              duration: 0.9,
              ease: "back.out(1.35)",
            },
            startAt
          )
          .to(
            cards.slice(0, index),
            {
              x: (cardIndex) => {
                const isMobile = isMobileViewport();
                return isMobile ? 0 : getCardStack(cardIndex).x - (index - cardIndex) * 9;
              },
              y: (cardIndex) => {
                const isMobile = isMobileViewport();
                return isMobile ? cardIndex * -15 - (index - cardIndex) * 5 : getCardStack(cardIndex).y - (index - cardIndex) * 8;
              },
              rotate: (cardIndex) => {
                const isMobile = isMobileViewport();
                return isMobile ? 0 : getCardStack(cardIndex).rotate - (index - cardIndex) * 1.2;
              },
              duration: 0.55,
              ease: "power2.out",
            },
            startAt + 0.1
          );
      });

      revealTl
        .to(
          buttonRef.current,
          {
            xPercent: -50,
            yPercent: -50,
            x: () => (isMobileViewport() ? 0 : 250),
            y: () => (isMobileViewport() ? 168 : 116),
            opacity: 1,
            rotate: () => (isMobileViewport() ? 0 : -7),
            duration: 0.7,
            ease: "back.out(1.6)",
          },
          6.7
        )
        // Pad the timeline so the pinned Project stays still while Contact slides over it
        .to({}, { duration: 2.5 });
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className="project-wrapper w-full">
      <div
        ref={panelTopRef}
        className="fixed left-0 top-0 z-[100] h-[50vh] w-full bg-black will-change-transform pointer-events-none"
        aria-hidden="true"
      />
      <div
        ref={panelBottomRef}
        className="fixed left-0 top-[50%] z-[100] h-[50vh] w-full bg-black will-change-transform pointer-events-none"
        aria-hidden="true"
      />

      <section ref={sectionRef} id="project" className="relative z-[25] min-h-screen w-full bg-transparent">
        <div ref={bgRef} className="absolute inset-0 z-0 h-full w-full bg-black pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 z-[5] h-[32vh] bg-gradient-to-b from-transparent via-[#003f72]/70 to-[#0b72bd] pointer-events-none" />

        <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-[6vw] pb-[72px] pt-[120px] sm:pb-[90px]">
          <div ref={headingGroupRef} className="flex w-full flex-col items-center justify-center">
            <span
              ref={headingSolidRef}
              className="relative z-10 whitespace-nowrap text-[clamp(3.1rem,11vw,11rem)] font-black uppercase leading-[0.88] tracking-normal text-white will-change-transform"
              style={{ fontFamily: "var(--font-display)" }}
            >
              MY PROJECTS
            </span>
            <span
              ref={headingOutlineRef}
              className="relative z-0 whitespace-nowrap text-[clamp(3.1rem,11vw,11rem)] font-black uppercase leading-[0.88] tracking-normal text-transparent will-change-transform"
              style={{
                fontFamily: "var(--font-display)",
                WebkitTextStroke: "2px rgba(255, 255, 255, 0.72)",
              }}
              aria-hidden="true"
            >
              MY PROJECTS
            </span>
          </div>

          <div
            ref={captionRef}
            className={`${caveat.className} relative z-30 mt-[-20px] mb-20 flex items-end gap-1.5 text-center text-[clamp(1.8rem,5.3vw,3.4rem)] leading-none text-white sm:mt-[-36px] sm:mb-28 lg:mt-[-44px]`}
          >
            <span>See What I&apos;ve Built</span>
            <svg
              className="mb-[-20px] h-12 w-10 rotate-[-10deg] sm:mb-[-26px] sm:h-20 sm:w-16"
              viewBox="0 0 64 86"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 6c22 12 17 32 6 29-10-3-5-19 8-13 14 7 24 27 26 53"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M38 65l11 12 8-14"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div ref={cardsRef} className="relative mt-0 h-[270px] w-full max-w-[760px] sm:h-[280px]">
            {projects.map((project, index) => (
              <div
                key={project.id || index}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="absolute left-1/2 top-1/2 grid w-[min(90vw,760px)] grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-2 rounded-md border border-[#087bd0] bg-[#0e1118] p-2 text-white shadow-[0_18px_55px_rgba(0,0,0,0.5)] transition-shadow duration-300 hover:shadow-[0_22px_65px_rgba(0,0,0,0.65)] sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] sm:gap-5 sm:p-4"
                style={{ zIndex: index + 1 }}
              >
                <div className="min-w-0">
                  <div className="mb-1 flex h-5 items-center gap-1 rounded-t border border-white/15 bg-[#171a21] px-1.5 text-[7px] font-mono text-white/45 sm:mb-3 sm:h-7 sm:gap-2 sm:px-3 sm:text-[9px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f04452] sm:h-2 sm:w-2" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f0b429] sm:h-2 sm:w-2" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#12b981] sm:h-2 sm:w-2" />
                    <span className="ml-auto max-w-[65%] truncate">{project.demoUrl?.replace(/^https?:\/\//, "") || project.title}</span>
                    <span className="ml-auto text-[#37a6ff]">HTTPS</span>
                  </div>
                  <div className="relative aspect-[1.12/1] w-full overflow-hidden rounded-sm border border-[#5552a5] bg-[#171923] p-0.5 sm:aspect-[1.55/1] sm:p-1">
                    <div className="relative h-full w-full overflow-hidden bg-[#090b10]">
                      {project.coverImage?.url && (
                        <Image
                          src={project.coverImage.url}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 90vw, 55vw"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className="flex h-full min-w-0 flex-col justify-center py-2"
                  style={{ paddingLeft: "16px", paddingRight: "16px" }}
                >
                  <div className="mb-1 flex items-center justify-between gap-1 font-mono text-[6px] uppercase tracking-wider text-white/50 sm:mb-4 sm:gap-2 sm:text-[9px]">
                    <span className="text-[#39a9ff]">FEATURED PROJECT / {String(index + 1).padStart(2, "0")}</span>
                    {project.projectDate && <span>{project.projectDate}</span>}
                  </div>
                  <h3 className="text-[clamp(0.78rem,3.8vw,2.65rem)] font-black leading-[0.95] tracking-tight text-white line-clamp-2 sm:text-[clamp(1.35rem,3.8vw,2.65rem)]">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-[9px] leading-snug text-white/75 line-clamp-2 sm:mt-3 sm:text-[clamp(0.68rem,1.2vw,0.88rem)] sm:leading-relaxed sm:line-clamp-3">
                    {project.description}
                  </p>
                  <div className="mt-1.5 sm:mt-5">
                    <p className="mb-1 hidden font-mono text-[8px] uppercase tracking-widest text-white/45 sm:block">Technology Stack</p>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {project.tech?.slice(0, 4).map((tech) => (
                        <span key={tech} className="rounded-sm border border-[#277b61]/40 bg-[#153a31] px-1 py-0.5 font-mono text-[6px] text-[#77e2b6] sm:px-2 sm:py-1 sm:text-[9px]">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1 sm:mt-6 sm:gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 w-auto min-w-[132px] flex-none items-center justify-center gap-2 border border-white/20 bg-black px-4 text-[11px] font-bold uppercase tracking-wide !text-white transition-colors hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white max-sm:h-7 max-sm:w-[72px] max-sm:min-w-0 max-sm:gap-1 max-sm:px-2 max-sm:text-[6px]"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[1.1em] w-[1.1em] !text-white">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 w-auto min-w-[132px] flex-none items-center justify-center gap-2 bg-[#087bd0] px-4 text-[11px] font-bold uppercase tracking-wide !text-white transition-colors hover:bg-[#1595ed] focus:outline-none focus-visible:ring-2 focus-visible:ring-white max-sm:h-7 max-sm:w-[72px] max-sm:min-w-0 max-sm:gap-1 max-sm:px-2 max-sm:text-[6px]"
                      >
                        Visit Demo <span className="ml-1">-&gt;</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div
              ref={buttonRef}
              className="absolute left-1/2 top-1/2 z-20 w-max max-w-[90vw] will-change-transform"
            >
              <a
                href="/projects"
                className="group relative inline-flex min-h-[48px] max-w-full items-center justify-center gap-3 overflow-hidden bg-[#111] px-7 py-4 text-[0.72rem] tracking-[0.08em] text-[#f5f0eb] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-[58px] sm:gap-4 sm:px-12 sm:py-5 sm:text-[0.85rem] sm:tracking-[0.14em]"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(
                    new CustomEvent("pageTransitionStart", { detail: { href: "/projects" } })
                  );
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.background = "var(--accent-blue)";
                  e.currentTarget.style.color = "#f5f0eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.background = "#111";
                  e.currentTarget.style.color = "#f5f0eb";
                }}
                style={{
                  color: "#f5f0eb",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  minWidth: "170px",
                  paddingLeft: "28px",
                  paddingRight: "28px",
                  border: "none",
                  transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, color 0.3s ease",
                }}
              >
                <span className="relative z-10 whitespace-nowrap text-[#f5f0eb]">SEE ALL MY PROJECT</span>
                <svg
                  className="relative z-10 h-[18px] w-[18px] text-[#f5f0eb] transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Project;
