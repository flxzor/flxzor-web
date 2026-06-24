"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from "gsap/SplitText";
import { Caveat } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'], weight: '700', display: 'swap' });

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

const About = () => {
  const aboutRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    // Heading SplitText & 3D Reveal effect (like Hero)
    const headingSplit = new SplitText(".about-heading", { type: "chars,words" });
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
        trigger: aboutRef.current,
        start: "top 80%",
        toggleActions: "play reverse play reverse"
      }
    });

    // Text fade effect for the split paragraphs
    const splits: any[] = [];
    
    gsap.utils.toArray(".about-text-split").forEach((el: any) => {
      const split = new SplitText(el, { type: "lines, words" });
      splits.push(split);

      gsap.set(split.words, { opacity: 0.15 });

      gsap.to(split.words, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.02,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el, 
          start: "top 85%", 
          toggleActions: "play none none reverse"
        },
      });
    });

    // Polaroid image drop-in effect
    gsap.from(".about-image-wrapper", {
      y: 150,
      opacity: 0,
      rotation: -15,
      duration: 1.2,
      ease: "back.out(1.2)",
      scrollTrigger: {
        trigger: ".about-image-wrapper",
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    // 3D Tilt effect
    const imageContainer = imageRef.current as HTMLElement | null;
    if (!imageContainer) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = imageContainer.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      gsap.to(imageContainer, {
        rotationY: x * 30, // Max 15 degrees tilt right/left
        rotationX: y * -30, // Max 15 degrees tilt up/down
        rotationZ: 0, // Straighten out the polaroid when hovered!
        scale: 1.05,
        ease: "power2.out",
        duration: 0.4
      });
    };

    const handleMouseLeave = () => {
      gsap.to(imageContainer, {
        rotationY: 0,
        rotationX: 0,
        rotationZ: -4, // Go back to original -4deg tilt
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.4)"
      });
    };

    imageContainer.addEventListener("mousemove", handleMouseMove);
    imageContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      headingSplit.revert();
      splits.forEach(s => s.revert());
      imageContainer.removeEventListener("mousemove", handleMouseMove);
      imageContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: aboutRef });

  return (
    <div id="about" ref={aboutRef} className='min-h-screen w-full bg-[#bbc9f1] relative z-10 flex flex-col overflow-hidden' style={{ paddingTop: '100px', paddingBottom: '120px', paddingLeft: '8vw', paddingRight: '8vw' }}>
      
      <div className="w-full flex justify-center mb-16 md:mb-20">
        <h2 
          className='about-heading font-black uppercase text-[#111] text-[13vw] md:text-[clamp(5rem,18vw,16rem)]'
          style={{ 
            fontFamily: 'var(--font-display)',
            lineHeight: 0.75,
            letterSpacing: '-0.04em',
            whiteSpace: 'nowrap'
          }}
        >
          ABOUT ME
        </h2>
      </div>

      <div className='max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 lg:gap-16'>
        
        <div className='w-full lg:w-[28%] lg:pb-8 order-2 lg:order-1'>
          <p className='about-text-split text-[#222] text-lg md:text-xl leading-[1.6] font-medium'>
            Hi everyone, 
            My name is <span className='font-bold'>Felix Erlangga Ananta</span>, I'm a Software Engineering student at <a href="https://telkomuniversity.ac.id/" target="_blank" rel="noopener noreferrer" className='font-bold underline'>Telkom University</a> in Purwokerto. I enjoy transforming ideas into functional digital solutions and exploring how software can solve real-world problems.
          </p>
        </div>

        <div className='w-full lg:w-[35%] flex justify-center order-1 lg:order-2 z-20' style={{ perspective: '1000px' }}>
          <div ref={imageRef} className="about-image-wrapper relative w-[260px] md:w-[340px] bg-white p-4 pb-16 md:p-5 md:pb-20 shadow-2xl" style={{ transform: 'rotateZ(-4deg)' }}>
            <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-gray-200">
              <Image 
                src="/images/about-me.webp" 
                alt="Felix Erlangga Ananta" 
                fill 
                sizes="(max-width: 768px) 260px, 340px"
                className="object-cover object-top transition-all duration-700" 
              />
            </div>
            <p className={`absolute bottom-5 left-5 text-3xl text-[#333] ${caveat.className}`}>
              @flxzor
            </p>
          </div>
        </div>

        <div className='w-full lg:w-[28%] lg:pb-8 order-3 lg:order-3 text-right lg:text-left flex flex-col items-end lg:items-start'>
          <p className='about-text-split text-[#222] text-lg md:text-xl leading-[1.6] font-medium mb-8'>
            My journey as a developer is driven by curiosity and a desire to keep improving, whether through academic work, personal projects, or experimenting with new technologies. With every project, I aim to strengthen my technical expertise, develop creative solutions, and build experiences that are both useful and meaningful.
          </p>
        </div>

      </div>
    </div>
  )
}

export default About;