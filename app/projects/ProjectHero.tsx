"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import MenuOverlay from "../components/MenuOverlay";
import { HygraphProject } from "@/lib/hygraph";

gsap.registerPlugin(SplitText);

interface ProjectHeroProps {
  projects: HygraphProject[];
}


/* ------------------------------------------------------------------ */
/*  Marquee                                                             */
/* ------------------------------------------------------------------ */

function Marquee({ text, repeat = 6, animate = true }: { text: string; repeat?: number; animate?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!trackRef.current || !animate) return;
      gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 14,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: trackRef, dependencies: [animate] },
  );
  if (!animate) {
    return (
      <div className="marquee">
        <div className="marquee__track">
          <span className="marquee__item">{text}</span>
        </div>
      </div>
    );
  }

  const items = Array.from({ length: repeat });

  return (
    <div className="marquee">
      <div ref={trackRef} className="marquee__track">
        {items.map((_, i) => (
          <span key={`a-${i}`} className="marquee__item">
            {text}
          </span>
        ))}
        {items.map((_, i) => (
          <span key={`b-${i}`} className="marquee__item">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Placeholder icon (shown until a real project image is provided)    */
/* ------------------------------------------------------------------ */

function ImagePlaceholderIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Project card (rendered for current index only)                      */
/* ------------------------------------------------------------------ */

function ProjectCardContent({ project, index }: { project: HygraphProject; index: number }) {
  return (
    <>
      <h2 className="project-card__title">{project.title}</h2>

      <div className="project-card__body">
        {/* Left: image + marquee */}
        <div className="project-card__media">
          <div className="project-card__image">
            {project.coverImage?.url ? (
              <Image
                src={project.coverImage.url}
                alt={project.title}
                fill
                sizes="(max-width: 1023px) 90vw, 45vw"
                className="project-card__image-img"
              />
            ) : (
              <div className="project-card__image-placeholder">
                <ImagePlaceholderIcon />
              </div>
            )}
          </div>

          <div className="project-card__marquee">
            <Marquee text={project.tech?.join(" • ") + " • " || " Project • "} animate={(project.tech?.length ?? 0) > 2} />
          </div>
        </div>

        {/* Right: description + actions */}
        <div className="project-card__content">
          {project.projectDate && (
            <p className="project-card__date">
              {new Date(project.projectDate).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <p className="project-card__description">{project.description}</p>

          <div className="project-card__actions">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="project-card__button project-card__button--primary"
              >
                Visit Project →
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="project-card__button project-card__button--secondary"
              >
                View on Github
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="project-card__number">
        {String(index + 1).padStart(2, "0")}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Section – fixed viewport, wheel-driven slide transitions            */
/* ------------------------------------------------------------------ */

export default function ProjectsSection({ projects }: ProjectHeroProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimating = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  /* ---- Intro animation on first mount ---- */
  useGSAP(
    () => {
      // Ensure we start with light theme at the top of the page
      document.body.classList.remove("theme-dark");

      if (!cardRef.current) return;
      const els = cardRef.current.children;
      gsap.from(els, {
        y: 60,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
      });
    },
    { scope: cardRef },
  );

  /* ---- Transition to next/prev project ---- */
  const goTo = useCallback(
    (direction: "next" | "prev" | number) => {
      if (isAnimating.current) return;

      let nextIdx = currentIndex;
      let isForward = true;

      if (typeof direction === "number") {
        nextIdx = Math.max(0, Math.min(direction, projects.length - 1));
        isForward = nextIdx > currentIndex;
      } else {
        nextIdx =
          direction === "next"
            ? Math.min(currentIndex + 1, projects.length - 1)
            : Math.max(currentIndex - 1, 0);
        isForward = direction === "next";
      }

      if (nextIdx === currentIndex) return;

      isAnimating.current = true;
      const card = cardRef.current;
      if (!card) return;

      const slideOut = isForward ? "-110%" : "110%";
      const slideIn = isForward ? "110%" : "-110%";

      // Separate text vs non-text elements
      const textEls = card.querySelectorAll(
        ".project-card__title, .project-card__date, .project-card__description, .project-card__number"
      );
      const morphEls = card.querySelectorAll(
        ".project-card__image, .project-card__button, .project-card__marquee"
      );

      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentIndex(nextIdx);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (!cardRef.current) return;

              const newTextEls = cardRef.current.querySelectorAll(
                ".project-card__title, .project-card__date, .project-card__description, .project-card__number"
              );
              const newMorphEls = cardRef.current.querySelectorAll(
                ".project-card__image, .project-card__button, .project-card__marquee"
              );

              // Set initial states
              gsap.set(newTextEls, { y: slideIn, opacity: 0 });
              gsap.set(newMorphEls, { opacity: 0, scale: 0.92, filter: "blur(6px)" });

              const tlIn = gsap.timeline({
                onComplete: () => {
                  isAnimating.current = false;
                },
              });

              // Text slides in
              tlIn.to(newTextEls, {
                y: "0%",
                opacity: 1,
                duration: 0.6,
                ease: "power3.out",
                stagger: 0.06,
              });

              // Image/buttons morph in (scale up + unblur)
              tlIn.to(
                newMorphEls,
                {
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  duration: 0.65,
                  ease: "power2.out",
                  stagger: 0.06,
                },
                "-=0.45"
              );
            });
          });
        },
      });

      // Text slides out
      tl.to(textEls, {
        y: slideOut,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        stagger: 0.04,
      });

      // Image/buttons morph out (scale down + blur)
      tl.to(
        morphEls,
        {
          opacity: 0,
          scale: 0.92,
          filter: "blur(6px)",
          duration: 0.45,
          ease: "power2.in",
        },
        "-=0.35"
      );
    },
    [currentIndex],
  );

  /* ---- Wheel listener ---- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let accumulated = 0;
    const threshold = 50;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      accumulated += e.deltaY;

      if (Math.abs(accumulated) >= threshold) {
        if (accumulated > 0) {
          goTo("next");
        } else {
          goTo("prev");
        }
        accumulated = 0;
      }
    };

    section.addEventListener("wheel", handleWheel, { passive: false });
    return () => section.removeEventListener("wheel", handleWheel);
  }, [goTo]);

  /* ---- Touch support for mobile ---- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) {
        if (delta > 0) {
          goTo("next");
        } else {
          goTo("prev");
        }
      }
    };

    section.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    section.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goTo]);

  const project = projects[currentIndex];

  return (
    <>
      <Navbar isMenuOpen={isMenuOpen} onToggleMenu={handleToggleMenu} />
      <MenuOverlay isOpen={isMenuOpen} onClose={handleCloseMenu} />

      <section ref={sectionRef} className="projects" id="project">
        {/* Project counter */}
        <div className="projects__counter">
          <span className="projects__counter-current">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span className="projects__counter-sep">/</span>
          <span className="projects__counter-total">
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        <div className="projects__inner">
          <div ref={cardRef} className="project-card" key={currentIndex}>
            <ProjectCardContent project={project} index={currentIndex} />
          </div>
        </div>

        {/* Scroll hint */}
        {currentIndex < projects.length - 1 ? (
          <div className="projects__scroll-hint">
            <span>Scroll to explore</span>
            <svg
              className="projects__scroll-hint-arrow"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </div>
        ) : (
          <div 
            className="projects__scroll-hint projects__scroll-hint--bottom cursor-pointer"
            onClick={() => goTo(0)}
          >
            <span>Stop digging, you've hit bottom</span>
            <svg
              className="projects__scroll-hint-arrow projects__scroll-hint-arrow--up"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </div>
        )}
      </section>
    </>
  );
}