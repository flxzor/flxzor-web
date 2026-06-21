"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuLinks = [
  { label: "Home", href: "/" },
  { label: "Project", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const emailRef = useRef<HTMLParagraphElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!overlayRef.current || !linksRef.current) return;

    const links = linksRef.current.querySelectorAll(".menu-overlay__link");

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

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!tlRef.current) return;

    if (isOpen) {
      document.body.classList.add("menu-open");
      tlRef.current.restart();
    } else {
      document.body.classList.remove("menu-open");
      tlRef.current.reverse();
    }
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className={`menu-overlay ${isOpen ? "menu-overlay--open" : ""}`}
      id="menu-overlay"
      style={{ clipPath: "inset(100% 0% 0% 0%)", pointerEvents: "none" }}
    >
      <ul ref={linksRef} className="menu-overlay__nav">
        {menuLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="menu-overlay__link"
              onClick={handleLinkClick}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <p ref={emailRef} className="menu-overlay__email">
        felixerlangga.contact@gmail.com
      </p>
    </div>
  );
}
