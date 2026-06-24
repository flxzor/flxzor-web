"use client";

import { useCallback, useState, useEffect } from "react";
import Link from "next/link";

interface NavbarProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export default function Navbar({ isMenuOpen, onToggleMenu }: NavbarProps) {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsScrolled(false);
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY && currentScrollY > 100) {
        // Scrolling up past 100px
        setIsScrolled(true);
        setIsHidden(false);
      } else if (currentScrollY <= 100) {
        // At the top
        setIsScrolled(false);
        setIsHidden(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggle = useCallback(() => {
    onToggleMenu();
  }, [onToggleMenu]);

  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isMenuOpen) {
      onToggleMenu();
    }
    window.dispatchEvent(
      new CustomEvent("pageTransitionStart", { detail: { href } })
    );
  }, [isMenuOpen, onToggleMenu]);

  return (
    <nav className={`navbar ${isScrolled ? "navbar--fixed" : ""} ${isHidden && !isMenuOpen ? "navbar--hidden-up" : ""} ${isMenuOpen ? "navbar--menu-open" : ""}`} id="navbar">
      
      {/* Show default logo and links ONLY when not in the scrolled/sticky state */}
      {!isScrolled && (
        <>
          <a href="/" className={`navbar__logo ${isMenuOpen ? "navbar__logo--menu-open" : ""}`} onClick={(e) => handleLinkClick(e, "/")}>
            flxzor
          </a>

          {/* Desktop navigation */}
          <ul className="navbar__links">
            <li>
              <a href="/project" className="navbar__link" onClick={(e) => handleLinkClick(e, "/project")}>
                Project
              </a>
            </li>
            <li>
              <a href="/blog" className="navbar__link" onClick={(e) => handleLinkClick(e, "/blog")}>
                Blog
              </a>
            </li>
            <li>
              <a href="/about" className="navbar__link" onClick={(e) => handleLinkClick(e, "/about")}>
                About
              </a>
            </li>
          </ul>

          {/* Hamburger button (mobile top right) */}
          <button
            className={`navbar__hamburger navbar__hamburger--mobile ${isMenuOpen ? "navbar__hamburger--open" : ""}`}
            onClick={handleToggle}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
          </button>
        </>
      )}

      {/* Sticky Centered Menu Button */}
      {isScrolled && (
        <button
          className="navbar__sticky-menu"
          onClick={handleToggle}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <span className="navbar__sticky-text">{isMenuOpen ? "Close" : "Menu"}</span>
          <div className={`navbar__hamburger ${isMenuOpen ? "navbar__hamburger--open" : ""}`}>
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
          </div>
        </button>
      )}
    </nav>
  );
}
