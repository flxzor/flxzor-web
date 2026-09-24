"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import MenuOverlay from "../components/MenuOverlay";
import styles from "./about.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const principles = [
  {
    number: "01",
    title: "Start with the why.",
    description:
      "Every good interface begins with understanding the people using it. I turn real needs into clear, purposeful experiences.",
  },
  {
    number: "02",
    title: "Make it feel effortless.",
    description:
      "The best details are the ones that just make sense. Thoughtful interactions keep products simple, useful, and a little more human.",
  },
  {
    number: "03",
    title: "Build for what’s next.",
    description:
      "Good foundations matter. I care about clean, maintainable code that can grow alongside the ideas behind it.",
  },
  {
    number: "04",
    title: "Stay curious.",
    description:
      "Technology keeps moving, and so do I. I enjoy learning new tools and finding better ways to bring ideas to life.",
  },
];

const skills = ["Frontend development", "UI engineering", "Backend systems", "Product thinking"];

export default function About() {
  const pageRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleToggleMenu = useCallback(() => setIsMenuOpen((open) => !open), []);
  const handleCloseMenu = useCallback(() => setIsMenuOpen(false), []);

  useGSAP(
    () => {
      const titleLines = gsap.utils.toArray<HTMLElement>(`.${styles.titleLine}`);
      gsap.set(titleLines, { autoAlpha: 0 });
      const titleTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: `.${styles.title}`,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });

      titleLines.forEach((line, index) => {
        titleTimeline.fromTo(
          line,
          { autoAlpha: 0, y: 28, scaleX: 0.86, scaleY: 1.12, transformOrigin: "left bottom" },
          { autoAlpha: 1, y: 0, scaleX: 1, scaleY: 1, duration: 0.48, ease: "elastic.out(1, 0.58)" },
          index * 0.42,
        );
      });

      const skillsSection = pageRef.current?.querySelector<HTMLElement>(`.${styles.skillsSection}`);
      if (skillsSection) {
        ScrollTrigger.create({
          trigger: skillsSection,
          pin: skillsSection,
          pinSpacing: false,
          start: "top top",
          end: () => `+=${skillsSection.offsetHeight}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      }

      const ctaTitleLines = gsap.utils.toArray<HTMLElement>(`.${styles.ctaTitleLine}`);
      gsap.set(ctaTitleLines, { autoAlpha: 0 });
      const ctaTitleTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: `.${styles.cta}`,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
      ctaTitleLines.forEach((line, index) => {
        ctaTitleTimeline.fromTo(
          line,
          { autoAlpha: 0, y: 28, scaleX: 0.86, scaleY: 1.12, transformOrigin: "left bottom" },
          { autoAlpha: 1, y: 0, scaleX: 1, scaleY: 1, duration: 0.48, ease: "elastic.out(1, 0.58)" },
          index * 0.42,
        );
      });

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const scrambleTargets = [
          `.${styles.eyebrow}`,
          `.${styles.sectionLabel}`,
          `.${styles.lead}`,
          `.${styles.manifestoText}`,
          `.${styles.stat} p`,
          `.${styles.sectionAside}`,
          `.${styles.principle} p`,
          `.${styles.skill} strong`,
          `.${styles.ctaText}`,
        ].join(",");
        const glyphs = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789@#$%&";

        gsap.utils.toArray<HTMLElement>(scrambleTargets).forEach((element) => {
          ScrollTrigger.create({
            trigger: element,
            start: "top 94%",
            once: true,
            onEnter: () => {
              const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
              const textNodes: Text[] = [];
              while (walker.nextNode()) {
                const node = walker.currentNode as Text;
                if (node.nodeValue?.trim()) textNodes.push(node);
              }

              textNodes.forEach((node) => {
                const original = node.nodeValue ?? "";
                const chars = Array.from(original);
                const counter = { progress: 0 };
                gsap.to(counter, {
                  progress: 1,
                  duration: 0.7,
                  ease: "power2.out",
                  overwrite: true,
                  onUpdate: () => {
                    const settled = Math.floor(counter.progress * chars.length);
                    node.nodeValue = chars.map((char, index) => {
                      if (/\s/.test(char) || index < settled) return char;
                      return glyphs[Math.floor(Math.random() * glyphs.length)];
                    }).join("");
                  },
                  onComplete: () => { node.nodeValue = original; },
                  onInterrupt: () => { node.nodeValue = original; },
                });
              });
            },
          });
        });
      }

      const hoverLines = gsap.utils.toArray<HTMLElement>(`.${styles.hoverLine}`);
      const hoverTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: `.${styles.skillsLayout}`,
          start: "top 88%",
          once: true,
        },
      });
      hoverLines.forEach((line, index) => {
        const base = line.querySelector<HTMLElement>(`.${styles.hoverBase}`);
        const brush = line.querySelector<HTMLElement>(`.${styles.brushStroke}`);
        if (!base) return;

        gsap.set(base, { y: 44, autoAlpha: 0 });
        const position = index * 0.55;
        hoverTimeline.to(base, { y: 0, autoAlpha: 1, duration: 0.85, ease: "power3.out" }, position);
        if (brush) {
          hoverTimeline.to(brush, { scaleX: 1, duration: 0.75, ease: "power2.out" }, position + 0.25);
        }
      });

      const manifestoWords = gsap.utils.toArray<HTMLElement>(`.${styles.morphWord}`);
      gsap.fromTo(
        manifestoWords,
        { y: 24, scaleX: 0.82, scaleY: 1.18, transformOrigin: "center bottom" },
        {
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 1.25,
          stagger: 0.12,
          ease: "elastic.out(1, 0.55)",
          onComplete: () => gsap.set(manifestoWords, { clearProps: "transform" }),
          scrollTrigger: {
            trigger: `.${styles.manifestoTitle}`,
            start: "top 92%",
            once: true,
          },
        },
      );

      gsap.from(`.${styles.artCard}`, {
        y: 72,
        opacity: 0,
        rotate: (index) => (index === 0 ? -8 : 6),
        scale: 0.94,
        duration: 1.05,
        stagger: 0.14,
        ease: "back.out(1.35)",
      });

      gsap.utils.toArray<HTMLElement>(`.${styles.statValue}`).forEach((element) => {
        const target = Number(element.dataset.count);
        const digits = Number(element.dataset.pad ?? 0);
        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element.closest(`.${styles.stat}`) ?? element,
            start: "top 90%",
            once: true,
          },
          onUpdate: () => {
            element.textContent = String(Math.floor(counter.value)).padStart(digits, "0");
          },
          onComplete: () => {
            element.textContent = String(target).padStart(digits, "0");
          },
        });
      });

      gsap.fromTo(
        `.${styles.statInfinity}`,
        { rotation: -90, scale: 0.55, transformOrigin: "center" },
        {
          rotation: 0,
          scale: 1,
          duration: 1.1,
          ease: "elastic.out(1, 0.55)",
          scrollTrigger: {
            trigger: `.${styles.statInfinity}`,
            start: "top 90%",
            once: true,
          },
        },
      );

      gsap.to(`.${styles.orbit}`, {
        rotation: 360,
        duration: 32,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
    },
    { scope: pageRef },
  );

  return (
    <main ref={pageRef} className={styles.page}>
      <Navbar isMenuOpen={isMenuOpen} onToggleMenu={handleToggleMenu} lightOnTop />
      <MenuOverlay isOpen={isMenuOpen} onClose={handleCloseMenu} lightText />
      <section className={styles.hero} aria-labelledby="about-title">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={`${styles.eyebrow} ${styles.eyebrowLight}`}><span /> A little about me</p>
            <h1 id="about-title" className={styles.title}>
              <span className={styles.titleLine}>Curious</span>
              <span className={`${styles.titleLine} ${styles.titleAccent}`}>by nature.</span>
              <span className={styles.titleLine}>Builder by</span>
              <span className={styles.titleLine}>choice.</span>
            </h1>
            <p className={styles.lead}>
              I’m Felix Erlangga Ananta — a software engineering student and developer who loves turning thoughtful ideas into useful digital experiences.
            </p>
            <a className={styles.textLink} href="#my-approach">Get to know me <span aria-hidden="true">↓</span></a>
          </div>

          <div className={styles.art}>
            <div className={`${styles.orbit} ${styles.orbitOne}`} />
            <div className={`${styles.orbit} ${styles.orbitTwo}`} />
          <div className={`${styles.artCard} ${styles.cardBack}`}>
            <div className={styles.postHeader}><span className={styles.postAvatar}><Image src="/images/vector.png" alt="" fill sizes="25px" /></span><span><strong>Felix Erlangga</strong><small>Building something new · 2h</small></span><b>···</b></div>
            <p className={styles.postCopy}>Good ideas grow when you stay curious, keep learning, and make room to explore.</p>
            <div className={styles.postSketch}><span /><span /><span /></div>
            <div className={styles.postReaction}>♡ &nbsp; 24 likes <span>3 comments</span></div>
          </div>
          <div className={`${styles.artCard} ${styles.cardFront}`}>
            <div className={styles.postHeader}><span className={styles.postAvatar}><Image src="/images/vector.png" alt="" fill sizes="25px" /></span><span><strong>Felix Erlangga</strong><small>Somewhere outdoors · 1d</small></span><b>···</b></div>
            <div className={styles.postImage}>
              <Image
                src="/images/about-me.webp"
                alt="Felix Erlangga by a riverside"
                fill
                priority
                sizes="(max-width: 800px) 55vw, 22vw"
                className={styles.photoImage}
              />
            </div>
            <div className={styles.postActions}><strong>♡ &nbsp; ↗</strong><span>•••</span></div>
            <div className={styles.postReaction}><b>42 likes</b><span>View all 6 comments</span></div>
          </div>
            <span className={styles.artNote}>somewhere outdoors <span>❆</span></span>
          </div>
          <span className={styles.heroIndex}>01 / 05</span>
        </div>
      </section>

      <section className={styles.manifesto} id="my-approach">
        <div className={styles.sectionLabel}><span>01</span><span>What I believe</span></div>
        <div className={styles.manifestoContent}>
          <p className={`${styles.eyebrow} ${styles.reveal}`}>Technology should feel human.</p>
          <h2 className={styles.manifestoTitle}>
            <span className={styles.manifestoLine}><span className={styles.morphWord}>Make</span> <span className={styles.morphWord}>it</span> <span className={styles.morphWord}>useful.</span></span>
            <span className={`${styles.manifestoLine} ${styles.manifestoBlue}`}><span className={styles.morphWord}>Make</span> <span className={styles.morphWord}>it</span> <span className={styles.morphWord}>thoughtful.</span></span>
            <span className={styles.manifestoLine}><span className={styles.morphWord}>Make</span> <span className={styles.morphWord}>it</span> <span className={styles.morphWord}>last.</span></span>
          </h2>
          <p className={`${styles.manifestoText} ${styles.reveal}`}>
            I care about the experience as much as the engineering behind it. That means asking better questions, sweating the small stuff, and building things people can rely on.
          </p>
        </div>
      </section>

      <section className={styles.stats} aria-label="A few things about me">
        <div className={`${styles.sectionLabel} ${styles.reveal}`}><span>02</span><span>A few things about me</span></div>
        <div className={styles.statsGrid}>
          <article className={`${styles.stat} ${styles.reveal}`}><span className={styles.statNumber}># 1</span><p>curious mind, always learning</p></article>
          <article className={`${styles.stat} ${styles.reveal}`}><span className={`${styles.statNumber} ${styles.statInfinity}`}>∞</span><p>ideas worth exploring</p></article>
          <article className={`${styles.stat} ${styles.reveal}`}><span className={styles.statNumber}><span className={styles.statValue} data-count="100">0</span><span>%</span></span><p>care in every detail</p></article>
        </div>
      </section>

      <section className={styles.principlesSection}>
        <div className={`${styles.sectionLabel} ${styles.reveal}`}><span>03</span><span>My approach</span></div>
        <div className={styles.principlesHead}>
          <h2 className={`${styles.sectionTitle} ${styles.reveal}`}>Good work starts<br />with good questions.</h2>
          <p className={`${styles.sectionAside} ${styles.reveal}`}>A few principles I bring to every project, big or small.</p>
        </div>
        <div className={styles.principlesGrid}>
          {principles.map((item) => (
            <article className={styles.principle} key={item.number}>
              <span className={styles.principleNumber}>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className={styles.principleArrow} aria-hidden="true"> ★</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.skillsSection}>
        <div className={`${styles.sectionLabel} ${styles.reveal}`}><span>04</span><span>What I bring</span></div>
        <div className={styles.skillsLayout}>
          <h2 className={`${styles.sectionTitle} ${styles.skillsTitle}`}>
            <span className={styles.hoverLine}>
              <span className={styles.hoverBase}>A mix of</span>
            </span>
            <span className={`${styles.hoverLine} ${styles.brushLine}`}>
              <span className={`${styles.hoverBase} ${styles.brushText}`}>logic &amp; feeling.</span>
              <span className={styles.brushStroke} aria-hidden="true" />
            </span>
          </h2>
          <div className={styles.skillList}>
            {skills.map((skill, i) => <div className={`${styles.skill} ${styles.reveal}`} key={skill}><span>0{i + 1}</span><strong>{skill}</strong><span aria-hidden="true">✦</span></div>)}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <p className={`${styles.eyebrow} ${styles.eyebrowLight} ${styles.reveal}`}><span /> Have something in mind?</p>
          <h2 className={styles.ctaTitle}>
            <span className={styles.ctaTitleLine}>Let’s make</span>
            <span className={`${styles.ctaTitleLine} ${styles.ctaTitleAccent}`}>good things.</span>
          </h2>
          <p className={`${styles.ctaText} ${styles.reveal}`}>I’m always up for a thoughtful conversation or a new challenge.</p>
          <Link className={`${styles.ctaButton} ${styles.reveal}`} href="/contact">
            <span className={styles.ctaButtonText}>Say hello</span>
            <span className={styles.waveHand} aria-hidden="true" />
          </Link>
          <span className={styles.ctaDecor} aria-hidden="true">❆</span>
        </div>
      </section>
    </main>
  );
}
