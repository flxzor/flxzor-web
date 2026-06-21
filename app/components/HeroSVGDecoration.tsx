"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(DrawSVGPlugin);

export function HeroSVGTop() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll(".hero__svg-line");

    gsap.set(paths, { drawSVG: "0%" });

    gsap.to(paths, {
      drawSVG: "100%",
      duration: 1.5,
      ease: "power2.inOut",
      stagger: 0.2,
      delay: 0.8,
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      className="hero__svg-decoration hero__svg-decoration--top"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Cross / plus shape */}
      <line
        className="hero__svg-line"
        x1="60"
        y1="20"
        x2="60"
        y2="100"
      />
      <line
        className="hero__svg-line"
        x1="20"
        y1="60"
        x2="100"
        y2="60"
      />
      {/* Corner accent */}
      <path
        className="hero__svg-line hero__svg-line--accent"
        d="M 90 20 L 100 20 L 100 30"
      />
      <path
        className="hero__svg-line hero__svg-line--accent"
        d="M 20 90 L 20 100 L 30 100"
      />
    </svg>
  );
}

export function HeroSVGBottom() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll(".hero__svg-line");

    gsap.set(paths, { drawSVG: "0%" });

    gsap.to(paths, {
      drawSVG: "100%",
      duration: 1.8,
      ease: "power2.inOut",
      stagger: 0.15,
      delay: 1.2,
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      className="hero__svg-decoration hero__svg-decoration--bottom"
      viewBox="0 0 180 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Horizontal line with tick marks */}
      <line
        className="hero__svg-line"
        x1="0"
        y1="40"
        x2="180"
        y2="40"
      />
      <line
        className="hero__svg-line hero__svg-line--accent"
        x1="0"
        y1="30"
        x2="0"
        y2="50"
      />
      <line
        className="hero__svg-line hero__svg-line--accent"
        x1="60"
        y1="32"
        x2="60"
        y2="48"
      />
      <line
        className="hero__svg-line hero__svg-line--accent"
        x1="120"
        y1="32"
        x2="120"
        y2="48"
      />
      <line
        className="hero__svg-line hero__svg-line--accent"
        x1="180"
        y1="30"
        x2="180"
        y2="50"
      />
      {/* Small circle at center */}
      <circle
        className="hero__svg-line"
        cx="90"
        cy="40"
        r="6"
      />
    </svg>
  );
}
