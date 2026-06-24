"use client";

import React, { useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

const EMAIL = "felixerlangga.contact@gmail.com";

interface ContactProps {
  variant?: "landing" | "page";
}

const Contact = ({ variant = "landing" }: ContactProps) => {
  const contactRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const mailtoLink = `mailto:${EMAIL}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(message)}`;

      window.location.href = mailtoLink;
    },
    [subject, message]
  );

  useGSAP(
    () => {
      if (!headingRef.current || !contactRef.current) return;

      // SplitText for heading
      const headingSplit = new SplitText(headingRef.current, {
        type: "chars,words",
      });

      const formFields = formRef.current
        ? formRef.current.querySelectorAll(".contact-field, .contact-btn-wrapper")
        : [];

      if (variant === "landing") {
        // ── Landing variant: ScrollTrigger-based animations ──

        // Theme toggle: revert navbar to dark text on light background
        ScrollTrigger.create({
          trigger: contactRef.current,
          start: "top 30%",
          onEnter: () => {
            document.body.classList.remove("theme-dark");
          },
          onLeaveBack: () => {
            document.body.classList.add("theme-dark");
          },
        });

        // Heading reveal
        gsap.from(headingSplit.chars, {
          y: 120,
          opacity: 0,
          rotateX: -40,
          duration: 0.8,
          stagger: {
            amount: 0.6,
            from: "start",
          },
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        });

        // Form fields stagger
        if (formFields.length > 0) {
          gsap.from(formFields, {
            y: 40,
            opacity: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        }

        // Footer fade in
        if (footerRef.current) {
          gsap.from(footerRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          });
        }
      } else {
        // ── Page variant: Animate on mount (no ScrollTrigger) ──
        // Ensure theme-dark is removed so navbar text is dark on light background
        document.body.classList.remove("theme-dark");

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.2,
        });

        tl.from(headingSplit.chars, {
          y: 120,
          opacity: 0,
          rotateX: -40,
          duration: 0.8,
          stagger: {
            amount: 0.6,
            from: "start",
          },
        });

        if (formFields.length > 0) {
          tl.from(
            formFields,
            {
              y: 40,
              opacity: 0,
              duration: 0.7,
              stagger: 0.15,
              ease: "power3.out",
            },
            "-=0.4"
          );
        }

        if (footerRef.current) {
          tl.from(
            footerRef.current,
            {
              y: 30,
              opacity: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.4"
          );
        }
      }

      return () => {
        headingSplit.revert();
      };
    },
    { scope: contactRef }
  );

  return (
    <section
      ref={contactRef}
      id="contact"
      className="relative w-full min-h-screen flex flex-col items-center overflow-hidden"
      style={{
        zIndex: 20,
        background: "#f5f0eb",
        paddingTop: variant === "page" ? "calc(var(--nav-height) + 2rem)" : undefined,
      }}
    >
      <div
        className="w-full flex flex-col items-center"
        style={{
          maxWidth: "900px",
          padding: "80px clamp(1.25rem, 5vw, 4rem) 100px",
        }}
      >
        {/* Heading */}
        <div className="w-full flex justify-center mb-40 md:mb-52">
          <h2
            ref={headingRef}
            className="font-black uppercase text-[#111] select-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 12vw, 8rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
              whiteSpace: "nowrap",
            }}
          >
            CONTACT
          </h2>
        </div>

        {/* Form */}
        <form
          ref={formRef}
          className="w-full flex flex-col gap-10"
          onSubmit={handleSubmit}
        >
          {/* Subject Field */}
          <div className="contact-field flex flex-col gap-2 w-full">
            <label
              htmlFor="contact-subject"
              className="text-[#333] font-semibold text-sm"
              style={{ letterSpacing: "0.04em" }}
            >
              Subject <span className="text-[#c0392b] ml-0.5">*</span>
            </label>
            <input
              id="contact-subject"
              type="text"
              className="w-full bg-transparent text-[#111] outline-none"
              placeholder="What's this about?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              style={{
                border: "none",
                borderBottom: "1.5px solid rgba(0, 0, 0, 0.2)",
                padding: "0.85rem 0",
                fontSize: "1rem",
                fontFamily: "var(--font-body)",
                borderRadius: 0,
                WebkitAppearance: "none",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = "var(--accent-blue)")}
              onBlur={(e) => (e.target.style.borderBottomColor = "rgba(0, 0, 0, 0.2)")}
            />
          </div>

          {/* Message Field */}
          <div className="contact-field flex flex-col gap-2 w-full">
            <label
              htmlFor="contact-message"
              className="text-[#333] font-semibold text-sm"
              style={{ letterSpacing: "0.04em" }}
            >
              Message <span className="text-[#c0392b] ml-0.5">*</span>
            </label>
            <textarea
              id="contact-message"
              className="w-full bg-transparent text-[#111] outline-none"
              placeholder="Tell me about your project, idea, or just say hello..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
              style={{
                border: "none",
                borderBottom: "1.5px solid rgba(0, 0, 0, 0.2)",
                padding: "0.85rem 0",
                fontSize: "1rem",
                fontFamily: "var(--font-body)",
                lineHeight: 1.6,
                minHeight: "120px",
                resize: "vertical",
                borderRadius: 0,
                WebkitAppearance: "none",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = "var(--accent-blue)")}
              onBlur={(e) => (e.target.style.borderBottomColor = "rgba(0, 0, 0, 0.2)")}
            />
          </div>

          {/* Button */}
          <div className="contact-btn-wrapper flex justify-start mt-4">
            <button
              type="submit"
              className="contact-btn relative inline-flex items-center gap-3 cursor-pointer overflow-hidden"
              style={{
                padding: "1rem 2.5rem",
                background: "#111",
                color: "#f5f0eb",
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                border: "none",
                transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.background = "var(--accent-blue)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "#111";
              }}
            >
              <span className="relative z-10">LET&apos;S TALK</span>
              <svg
                className="relative z-10"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
