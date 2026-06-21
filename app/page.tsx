import Hero from "./sections/Hero";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Spacer to offset the fixed hero */}
      <div className="hero-spacer" />

      {/* Placeholder section — scrolls over the hero */}
      <section className="section-placeholder">
        <p style={{ color: "#999", fontSize: "0.875rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          More content coming soon
        </p>
      </section>
    </>
  );
}
