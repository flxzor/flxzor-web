"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import type { BlogPost } from "../../lib/blog";
import { formatBlogDate } from "../../lib/blog";
import { BLOG_IMAGE_TRANSITION_KEY } from "./image-transition";
import { afterPageLoader } from "./page-loader-gate";

gsap.registerPlugin(useGSAP, SplitText);

export default function Gallery({ posts }: { posts: BlogPost[] }) {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const locked = useRef(false);
  const [active, setActive] = useState(0);
  const didReveal = useRef(false);
  const current = posts[active] ?? posts[0];

  const measureAndPosition = useCallback((animate: boolean) => {
    if (window.matchMedia("(max-width: 899px)").matches) return;
    const stage = viewport.current;
    const rail = track.current;
    const first = rail?.firstElementChild as HTMLElement | null;
    if (!stage || !rail || !first) return;
    const styles = window.getComputedStyle(rail);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const x = stage.clientWidth * 0.42 - first.offsetWidth / 2 - activeRef.current * (first.offsetWidth + gap);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(rail, { x, duration: animate && !reduceMotion ? 0.62 : 0, ease: "power3.out", overwrite: true });
    const parallax = root.current?.querySelector(".blog-gallery__parallax");
    if (parallax) {
      const parallaxProps = { xPercent: -50, yPercent: -50, x: -activeRef.current * 16 };
      if (animate && !reduceMotion) gsap.to(parallax, { ...parallaxProps, duration: 0.85, ease: "power2.out", overwrite: true });
      else gsap.set(parallax, parallaxProps);
    }
  }, []);

  useGSAP(() => {
    measureAndPosition(false);
    const stage = viewport.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => measureAndPosition(false));
    observer.observe(stage);
    return () => observer.disconnect();
  }, { scope: root, dependencies: [measureAndPosition] });

  useGSAP(() => {
    if (window.matchMedia("(max-width: 899px)").matches) return;
    measureAndPosition(true);
  }, { scope: root, dependencies: [active, measureAndPosition] });

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let animationContext: gsap.Context | undefined;
    let revertSplits = () => {};
    const cancelWait = afterPageLoader(() => {
      const section = root.current;
      const details = section?.querySelector<HTMLElement>(".blog-gallery__details");
      const title = details?.querySelector<HTMLElement>(".blog-gallery__title-copy");
      if (!section || !details || !title) return;

      animationContext = gsap.context(() => {
        const isInitialReveal = !didReveal.current;
        didReveal.current = true;
        const titleSplit = new SplitText(title, { type: "chars,words" });
        const wordSplits = [
          section.querySelector<HTMLElement>(".blog-gallery__heading-copy"),
          details.querySelector<HTMLElement>(".blog-frame__eyebrow"),
          details.querySelector<HTMLElement>(".blog-gallery__description"),
          details.querySelector<HTMLElement>(".blog-gallery__read-copy"),
        ].filter((element): element is HTMLElement => !!element).map((element) => new SplitText(element, { type: "words" }));
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        const start = isInitialReveal ? 0.48 : 0;

        timeline.from(titleSplit.chars, {
          y: 65,
          opacity: 0,
          rotateX: -40,
          duration: 0.7,
          stagger: 0.018,
          ease: "power3.out",
        }, start + 0.08);

        wordSplits.forEach((split, index) => {
          gsap.set(split.words, { opacity: 0.15 });
          timeline.to(split.words, {
            opacity: 1,
            duration: 0.42,
            stagger: 0.018,
            ease: "power2.out",
          }, start + index * 0.06);
        });

        revertSplits = () => {
          titleSplit.revert();
          wordSplits.forEach((split) => split.revert());
        };
      }, section);
    });

    return () => {
      cancelWait();
      revertSplits();
      animationContext?.revert();
    };
  }, { scope: root, dependencies: [active], revertOnUpdate: true });

  const goTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(posts.length - 1, index));
    activeRef.current = next;
    setActive(next);
  }, [posts.length]);

  useGSAP(() => {
    const section = root.current;
    if (!section || posts.length < 2) return;

    const onWheel = (event: WheelEvent) => {
      if (window.matchMedia("(max-width: 899px), (prefers-reduced-motion: reduce)").matches) return;
      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(delta) < 14 || locked.current) {
        if (locked.current) event.preventDefault();
        return;
      }
      const next = activeRef.current + (delta > 0 ? 1 : -1);
      if (next < 0 || next >= posts.length) return;
      event.preventDefault();
      locked.current = true;
      goTo(next);
      window.setTimeout(() => { locked.current = false; }, 680);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || window.matchMedia("(max-width: 899px)").matches) return;
      if (event.key === "ArrowRight") { event.preventDefault(); goTo(activeRef.current + 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); goTo(activeRef.current - 1); }
    };

    section.addEventListener("wheel", onWheel, { passive: false });
    section.addEventListener("keydown", onKeyDown);
    return () => {
      section.removeEventListener("wheel", onWheel);
      section.removeEventListener("keydown", onKeyDown);
    };
  }, { scope: root, dependencies: [goTo, posts.length] });

  if (!current) return null;

  return (
    <section className="blog-gallery" ref={root} aria-label="Blog post gallery" tabIndex={0}>
      <div className="blog-gallery__head">
        <span><i aria-hidden="true" /><span className="blog-gallery__heading-copy">Selected writing</span></span>
        <span className="blog-gallery__count" aria-live="polite">{String(active + 1).padStart(2, "0")} <b>/</b> {String(posts.length).padStart(2, "0")}</span>
      </div>

      <div className="blog-gallery__parallax" aria-hidden="true" />
      <div className="blog-gallery__viewport" ref={viewport}>
        <div className="blog-gallery__track" ref={track}>
          {posts.map((post, index) => (
            <article className={`blog-frame ${index === active ? "is-active" : ""}`} key={post.id} aria-hidden={index !== active}>
              <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="blog-frame__link" tabIndex={index === active ? 0 : -1} aria-label={`Read ${post.title}`} onClick={(event) => {
                if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                if (post.coverImage?.url) {
                  const art = event.currentTarget.querySelector<HTMLElement>(".blog-frame__art");
                  if (art) {
                    const { left, top, width, height } = art.getBoundingClientRect();
                    try {
                      sessionStorage.setItem(BLOG_IMAGE_TRANSITION_KEY, JSON.stringify({ slug: post.slug, url: post.coverImage.url, rect: { left, top, width, height }, createdAt: Date.now() }));
                    } catch {
                      // Navigation still works if storage is unavailable.
                    }
                  }
                }
              }}>
                <div className="blog-frame__art">
                  {post.coverImage?.url ? (
                <Image src={post.coverImage.url} alt="" fill sizes="(min-width: 900px) 66vw, 100vw" className="blog-frame__image" unoptimized />
                  ) : (
                    <div className="blog-frame__fallback" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span><i /></div>
                  )}
                </div>
                <div className="blog-frame__mobile-caption">
                  <span className="blog-frame__eyebrow">{formatBlogDate(post.date) ?? "Personal notes"}</span>
                  <h2>{post.title}</h2>
                  {post.description && <p>{post.description}</p>}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      <div key={current.slug} className="blog-gallery__details" aria-live="polite">
        <p className="blog-frame__eyebrow">{formatBlogDate(current.date) ?? "Personal notes"}</p>
        <Link key={current.slug} href={`/blog/${encodeURIComponent(current.slug)}`} className="blog-gallery__title"><span className="blog-gallery__title-copy">{current.title}</span><span aria-hidden="true"> ↗</span></Link>
        {current.description && <p className="blog-gallery__description">{current.description}</p>}
        <Link href={`/blog/${encodeURIComponent(current.slug)}`} className="blog-gallery__read"><span className="blog-gallery__read-copy">Read post</span><span aria-hidden="true">→</span></Link>
      </div>

      {posts.length > 1 && <nav className="blog-gallery__controls" aria-label="Gallery controls">
        <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous post">←</button>
        <div className="blog-gallery__progress" role="progressbar" aria-label="Gallery progress" aria-valuemin={1} aria-valuemax={posts.length} aria-valuenow={active + 1}><span style={{ transform: `scaleX(${posts.length > 1 ? active / (posts.length - 1) : 0})` }} /></div>
        <button type="button" onClick={() => goTo(active + 1)} disabled={active === posts.length - 1} aria-label="Next post">→</button>
      </nav>}
    </section>
  );
}
