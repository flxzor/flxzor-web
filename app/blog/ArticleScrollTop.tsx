"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export default function ArticleScrollTop() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const pane = document.getElementById("article-reading-pane");
    if (!pane) return;

    const updateVisibility = () => {
      const isMobile = window.matchMedia("(max-width: 899px)").matches;
      setVisible((isMobile ? window.scrollY : pane.scrollTop) > 240);
    };

    pane.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();
    return () => {
      pane.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

  useGSAP(() => {
    const button = buttonRef.current;
    if (!button) return;

    const expanded = { autoAlpha: 1, scale: 1, y: 0, borderRadius: "50%" };
    const collapsed = { autoAlpha: 0, scale: 0.62, y: 10, borderRadius: "14px" };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(button, visible ? expanded : collapsed);
      return;
    }

    const tween = gsap.to(button, {
      ...(visible ? expanded : collapsed),
      duration: visible ? 0.38 : 0.26,
      ease: visible ? "back.out(1.25)" : "power2.in",
      overwrite: true,
    });
    return () => tween.kill();
  }, { dependencies: [visible] });

  const scrollToStart = () => {
    const pane = document.getElementById("article-reading-pane");
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    if (window.matchMedia("(max-width: 899px)").matches) window.scrollTo({ top: 0, behavior });
    else pane?.scrollTo({ top: 0, behavior });
  };

  return <button ref={buttonRef} type="button" className="article-scroll-top" onClick={scrollToStart} aria-label="Scroll article to top" aria-hidden={!visible} tabIndex={visible ? 0 : -1} disabled={!visible}>
    <svg className="article-scroll-top__arrow article-scroll-top__arrow--up" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  </button>;
}
