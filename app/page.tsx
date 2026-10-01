import About from "./sections/About";
import Hero from "./sections/Hero";
import Project from "./sections/Project";
import Testimonials from "./sections/Testimonials";
import Footer from "./components/Footer";
import { getProjects } from "@/lib/hygraph";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Hero />

      {/* Spacer to offset the fixed hero */}
      <div className="hero-spacer" />

      {/* Placeholder section — scrolls over the hero */}
      <section className="section-placeholder" style={{ background: '#bbc9f1' }}>
        <About />
      </section>

      <Project projects={projects} />

      <Testimonials />
      <Footer />
    </>
  );
}
