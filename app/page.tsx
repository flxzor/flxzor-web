import About from "./sections/About";
import Hero from "./sections/Hero";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Spacer to offset the fixed hero */}
      <div className="hero-spacer" />

      {/* Placeholder section — scrolls over the hero */}
      <section className="section-placeholder">
        <About />
      </section>
    </>
  );
}
