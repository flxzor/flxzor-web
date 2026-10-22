"use client";

import { useCallback, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { BlogPost } from "../../lib/blog";
import Gallery from "./Gallery";
import Navbar from "../components/Navbar";
import MenuOverlay from "../components/MenuOverlay";
import PageTransitionLink from "../components/PageTransitionLink";
import { afterPageLoader } from "./page-loader-gate";

gsap.registerPlugin(useGSAP);

export default function BlogShowcase({ posts, error }: { posts: BlogPost[]; error: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuLightText, setMenuLightText] = useState(false);

  const handleToggleMenu = useCallback((lightText = false) => {
    setIsMenuOpen((open) => !open);
    setMenuLightText(lightText);
  }, []);
  const handleCloseMenu = useCallback(() => setIsMenuOpen(false), []);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animationContext: gsap.Context | undefined;
    const cancelWait = afterPageLoader(() => {
      const scope = root.current;
      if (!scope) return;
      animationContext = gsap.context(() => {
        const navbar = scope.querySelector(".navbar");
        const images = scope.querySelectorAll(".blog-frame__art");
        const heading = scope.querySelector(".blog-gallery__head");
        const details = scope.querySelector(".blog-gallery__details");
        const controls = scope.querySelectorAll(".blog-gallery__controls");
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            const targets = [navbar, heading, ...Array.from(images), details, ...Array.from(controls)]
              .filter((target): target is Element => target instanceof Element);
            gsap.set(targets, { clearProps: "opacity,visibility,transform" });
          },
        });

        if (navbar) timeline.from(navbar, { autoAlpha: 0, y: -6, duration: 0.24 }, 0);
        if (heading) timeline.from(heading, { autoAlpha: 0, y: 10, duration: 0.32 }, 0.1);
        if (images.length) timeline.from(images, {
          x: 230,
          y: -90,
          rotate: 13,
          scale: 0.88,
          autoAlpha: 0,
          duration: 0.85,
          ease: "back.out(1.25)",
          transformOrigin: "right center",
          stagger: { amount: 0.45, from: "start" },
        }, 0.16);
        if (details) timeline.from(details, { autoAlpha: 0, y: 12, duration: 0.38 }, 0.48);
        if (controls.length) timeline.from(controls, { autoAlpha: 0, y: 8, duration: 0.28, stagger: 0.08 }, 0.68);
      }, scope);
    });

    return () => {
      cancelWait();
      animationContext?.revert();
    };
  }, { scope: root });

  return (
    <main className="blog-page" ref={root}>
      <Navbar isMenuOpen={isMenuOpen} onToggleMenu={handleToggleMenu} />
      <MenuOverlay isOpen={isMenuOpen} onClose={handleCloseMenu} lightText={menuLightText} />
      {posts.length > 0 ? <Gallery posts={posts} /> : (
        <section className="blog-empty blog-empty--status" aria-live="polite">
          <span className="blog-empty__number">{error ? "JOURNAL / OFFLINE" : "JOURNAL / 00"}</span>
          <h2>{error ? "The posts didn’t load." : "Nothing here yet."}</h2>
          <p>{error ? "Please come back in a little while." : "New writing will appear here soon."}</p>
          <PageTransitionLink href="/">Return home <span aria-hidden="true">→</span></PageTransitionLink>
        </section>
      )}
    </main>
  );
}
