"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import MenuOverlay from "../components/MenuOverlay";
import { HeroSVGTop, HeroSVGBottom } from "../components/HeroSVGDecoration";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const scrollDownRef = useRef<HTMLSpanElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useGSAP(
    () => {
      if (!headingRef.current || !heroRef.current) return;

      let split: SplitText | null = null;

      const runAnimation = () => {
        if (!headingRef.current) return;

        // Ensure we start with light theme at the top of the page
        document.body.classList.remove("theme-dark");

        // --- SplitText Animation ---
        split = SplitText.create(headingRef.current, {
          type: "chars,words",
        });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        // Logo fade in
        tl.from(".navbar__logo", {
          y: -20,
          opacity: 0,
          duration: 0.6,
        });

        // Nav links fade in (desktop)
        tl.from(
          ".navbar__link",
          {
            y: -15,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.3",
        );

        // Hamburger fade in (mobile)
        tl.from(
          ".navbar__hamburger",
          {
            y: -15,
            opacity: 0,
            duration: 0.5,
          },
          "<",
        );

        // Hero heading chars reveal
        tl.from(
          split.chars,
          {
            y: 120,
            opacity: 0,
            rotateX: -40,
            duration: 0.8,
            stagger: {
              amount: 0.6,
              from: "start",
            },
          },
          "-=0.2",
        );

        // Description text
        if (descriptionRef.current) {
          tl.from(
            descriptionRef.current,
            {
              y: 20,
              opacity: 0,
              duration: 0.6,
            },
            "-=0.4",
          );
        }

        // Scroll down indicator
        if (scrollDownRef.current) {
          tl.from(
            scrollDownRef.current,
            {
              y: 20,
              opacity: 0,
              duration: 0.6,
            },
            "-=0.4",
          );
        }
      };

      const handlePreloaderComplete = () => {
        runAnimation();
        window.removeEventListener("preloaderComplete", handlePreloaderComplete);
      };

      if (sessionStorage.getItem("preloader_shown")) {
        runAnimation();
      } else {
        window.addEventListener("preloaderComplete", handlePreloaderComplete);
      }

      // Cleanup
      return () => {
        window.removeEventListener("preloaderComplete", handlePreloaderComplete);
        if (split) split.revert();
      };
    },
    { dependencies: [] },
  );

  return (
    <>
      <Navbar isMenuOpen={isMenuOpen} onToggleMenu={handleToggleMenu} />
      <MenuOverlay isOpen={isMenuOpen} onClose={handleCloseMenu} />

      <section ref={heroRef} className="hero" id="hero">
        <div className="hero__content">
          {/* SVG Decorations (DrawSVG) */}
          <HeroSVGTop />
          <HeroSVGBottom />

          {/* Heading */}
          <div className="hero__heading-wrapper">
            <h1 ref={headingRef} className="hero__heading">
              Full&#8209;Stack Developer Software Engineer
            </h1>
          </div>

          {/* Portrait Image */}
          <div className="hero__image-wrapper">
            <div ref={imageWrapperRef} className="hero__image-container">
              <Image
                src="/images/hero.webp"
                alt="Felix Erlangga - Full-Stack Developer & Software Engineer"
                fill
                sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 38vw"
                className="hero__image"
                preload={true}
              />
            </div>
          </div>
        </div>

        {/* Full-width blue gradient overlay */}
        <div className="hero__gradient" aria-hidden="true" />

        {/* Bottom bar */}
        <div ref={bottomRef} className="z-0 hero__bottom text-black">
          <p ref={descriptionRef} className="hero__description">
            I'm a Software Engineering student passionate about building modern
            web applications.
          </p>
          <span
            ref={scrollDownRef}
            className="z-0 hero__scroll-down text-black"
          >
            ( Scroll Down )
          </span>
        </div>
      </section>
    </>
  );
}
