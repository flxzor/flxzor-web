"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuLinks = [
  { label: "Home", href: "/" },
  { label: "Project", href: "/project" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const emailRef = useRef<HTMLParagraphElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!overlayRef.current || !linksRef.current) return;

      const links = linksRef.current.querySelectorAll(".menu-overlay-v2__link");

      // Build timeline
      const tl = gsap.timeline({ paused: true });

      tl.to(overlayRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.6,
        ease: "power3.inOut",
        onStart: () => {
          if (overlayRef.current) {
            overlayRef.current.style.pointerEvents = "all";
          }
        },
      });

      // Stagger each link from below the hidden mask
      tl.from(
        links,
        {
          y: "110%",
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.08,
        },
        "-=0.3"
      );

      // Email fade in
      if (emailRef.current) {
        tl.from(
          emailRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.6"
        );
      }

      tlRef.current = tl;
    },
    { scope: containerRef }
  );

  // Separate hook for reacting to isOpen state
  useGSAP(() => {
    if (!tlRef.current) return;

    if (isOpen) {
      document.body.classList.add("menu-open");
      tlRef.current.play();
    } else {
      document.body.classList.remove("menu-open");
      tlRef.current.reverse();
    }
  }, [isOpen]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();

      // Close the menu immediately
      onClose();

      // Trigger the page loader immediately without waiting for close animation
      window.dispatchEvent(
        new CustomEvent("pageTransitionStart", { detail: { href } })
      );
    },
    [onClose]
  );

  return (
    <div ref={containerRef}>
    <div
      ref={overlayRef}
      className={`menu-overlay-v2 ${isOpen ? "menu-overlay-v2--open" : ""}`}
      id="menu-overlay-v2"
      style={{ clipPath: "inset(100% 0% 0% 0%)", pointerEvents: "none" }}
    >
      <ul ref={linksRef} className="menu-overlay-v2__nav">
        {menuLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="menu-overlay-v2__link"
              onClick={(e) => handleLinkClick(e, link.href)}
              data-text={link.label}
            >
              <span className="menu-overlay-v2__link-inner">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <p ref={emailRef} className="menu-overlay-v2__email">
        felixerlangga.contact@gmail.com
      </p>
    </div>
    </div>
  );
}
