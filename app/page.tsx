import About from "./sections/About";
import Hero from "./sections/Hero";
import Project from "./sections/Project";
import Contact from "./sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Spacer to offset the fixed hero */}
      <div className="hero-spacer" />

      {/* Placeholder section — scrolls over the hero */}
      <section className="section-placeholder" style={{ background: '#bbc9f1' }}>
        <About />
      </section>

      <Project />

      <Contact variant="landing" />
    </>
  );
}
