"use client";

import Link from "next/link";

const EMAIL = "felixerlangga.contact@gmail.com";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/flxzor/" },
  { label: "GitHub", href: "https://github.com/flxzor" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/felix-erlangga-ananta/" },
  { label: "Email", href: `mailto:${EMAIL}` },
];

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export default function Footer() {
  return (
    <footer className="site-footer" id="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__heading">
          <span>(Follow)</span>
          <span>(Navigation)</span>
        </div>

        <div className="site-footer__links">
          <nav aria-label="Social links" className="site-footer__socials">
            {socialLinks.map(({ label, href }) => (
              <a href={href} key={label}>{label}</a>
            ))}
          </nav>

          <a className="site-footer__back-top" href="#top" aria-label="Back to top">
            Back to top <span aria-hidden="true">↑</span>
          </a>

          <nav aria-label="Footer navigation" className="site-footer__navigation">
            {navigationLinks.map(({ label, href }) => (
              <Link
                href={href}
                key={label}
                onClick={(event) => {
                  event.preventDefault();
                  window.dispatchEvent(
                    new CustomEvent("pageTransitionStart", { detail: { href } })
                  );
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <a className="site-footer__cta" href={`mailto:${EMAIL}`}>
        <span aria-hidden="true">Let&apos;s talk&nbsp;&nbsp; Let&apos;s talk&nbsp;&nbsp; Let&apos;s talk&nbsp;&nbsp;</span>
        <span className="site-footer__cta-label">Start a conversation <span aria-hidden="true">↗</span></span>
      </a>

      <div className="site-footer__bottom">
        <p><span className="site-footer__status" aria-hidden="true" /> Jakarta, Indonesia <span>GMT+7</span></p>
        <p>© {new Date().getUTCFullYear()} flxzor <span>All rights reserved</span></p>
      </div>
    </footer>
  );
}
