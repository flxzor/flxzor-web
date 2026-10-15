"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BLOG_IMAGE_TRANSITION_KEY, type BlogImageTransition } from "./image-transition";
import { afterPageLoader } from "./page-loader-gate";

gsap.registerPlugin(useGSAP);

export default function ArticleEntrance({ slug, coverUrl }: { slug: string; coverUrl?: string | null }) {
  useGSAP(() => {
    let imageTransition: BlogImageTransition | null = null;
    try {
      const stored = sessionStorage.getItem(BLOG_IMAGE_TRANSITION_KEY);
      if (stored) imageTransition = JSON.parse(stored) as BlogImageTransition;
      sessionStorage.removeItem(BLOG_IMAGE_TRANSITION_KEY);
    } catch {
      imageTransition = null;
    }

    const matchesSource = imageTransition?.slug === slug
      && imageTransition.url === coverUrl
      && Date.now() - imageTransition.createdAt < 10_000;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let animationContext: gsap.Context | undefined;
    const cancelWait = afterPageLoader(() => {
      const root = document.querySelector<HTMLElement>(".article-page");
      if (!root) return;

      animationContext = gsap.context(() => {
        const navbar = document.querySelector<HTMLElement>(".navbar");
        const cover = root.querySelector<HTMLElement>(".article-cover");
        const copy = Array.from(root.querySelectorAll<HTMLElement>(".article-media-copy > *"));
        const readingContent = root.querySelector<HTMLElement>(".article-reading-content");
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => gsap.set([navbar, cover, ...copy, readingContent].filter((element): element is HTMLElement => element !== null), { clearProps: "opacity,visibility,transform" }),
        });

        if (navbar) timeline.fromTo(navbar, { autoAlpha: 0, y: -7 }, { autoAlpha: 1, y: 0, duration: 0.28 }, 0);

        if (cover && matchesSource && imageTransition) {
          const target = cover.getBoundingClientRect();
          timeline.fromTo(cover, {
            x: imageTransition.rect.left - target.left,
            y: imageTransition.rect.top - target.top,
            scaleX: imageTransition.rect.width / target.width,
            scaleY: imageTransition.rect.height / target.height,
            transformOrigin: "top left",
          }, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.68 }, 0.02);
        } else if (cover) {
          timeline.fromTo(cover, { autoAlpha: 0, scale: 0.975 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, 0.12);
        }

        if (copy.length) timeline.fromTo(copy, { autoAlpha: 0, y: 13 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.055 }, matchesSource ? 0.32 : 0.38);
        if (readingContent) timeline.fromTo(readingContent, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 }, matchesSource ? 0.42 : 0.52);
      }, root);
    });

    return () => {
      cancelWait();
      animationContext?.revert();
    };
  }, { dependencies: [slug, coverUrl], revertOnUpdate: true });

  return null;
}
