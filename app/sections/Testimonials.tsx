"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

const testimonials = [
  {
    quote: "Felix brings thoughtful ideas to the table and turns them into a clear, polished experience.",
    name: "Naufal Kafabih Khalwani",
    role: "Mobile developer",
    number: "01",
    alphabet: "N",
  },
  {
    quote: "The process felt smooth from the first conversation through the final details.",
    name: "Project collaborator",
    role: "Web development",
    number: "02",
    alphabet: "P",
  },
  {
    quote: "A reliable partner who cares about both how a product works and how it feels.",
    name: "Project collaborator",
    role: "Product collaboration",
    number: "03",
    alphabet: "P",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  useGSAP(() => {
    if (!sectionRef.current || !headingRef.current) return;

    const headingSplit = new SplitText(headingRef.current, { type: "chars" });
    const cards = sectionRef.current.querySelectorAll<HTMLElement>(".testimonial-card__deal");

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 30%",
      onEnter: () => document.body.classList.remove("theme-dark"),
      onLeaveBack: () => document.body.classList.add("theme-dark"),
    });

    gsap.from(headingSplit.chars, {
      y: 90,
      opacity: 0,
      rotateX: -40,
      duration: 0.7,
      stagger: 0.025,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 78%",
        toggleActions: "play reverse play reverse",
      },
    });

    gsap.from(cards, {
      x: (index) => 230 - index * 22,
      y: (index) => -90 + index * 18,
      rotate: (index) => 13 - index * 9,
      scale: 0.88,
      opacity: 0,
      duration: 0.85,
      stagger: 0.18,
      ease: "back.out(1.25)",
      transformOrigin: "right center",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 66%",
        toggleActions: "play none none reverse",
      },
    });

    return () => headingSplit.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="testimonials" className="testimonials-section">
      <div className="testimonials-section__inner">
        <div className="testimonials-section__intro">
          <p className="testimonials-section__eyebrow"><span /> Work with me</p>
          <h2 ref={headingRef}>What people<br />say <em>“about me”</em><span>.</span></h2>
          <p className="testimonials-section__note">A few kind words from people I&apos;ve worked with.</p>
        </div>

        <div className="testimonials-grid" data-active-card={activeCard ?? undefined} onMouseLeave={() => setActiveCard(null)} onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActiveCard(null);
        }}>
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.number} tabIndex={0} onMouseEnter={() => setActiveCard(testimonial.number)} onFocus={() => setActiveCard(testimonial.number)}>
              <div className="testimonial-card__deal">
              <div className="testimonial-card__topline">
                <span>({testimonial.number})</span>
                <span aria-hidden="true">❞</span>
              </div>
              <blockquote>“{testimonial.quote}”</blockquote>
              <div className="testimonial-card__author">
                <span className="testimonial-card__avatar" aria-hidden="true">{testimonial.alphabet}</span>
                <span><strong>{testimonial.name}</strong><small>{testimonial.role}</small></span>
              </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
