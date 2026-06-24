"use client";

import { useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import MenuOverlay from "../components/MenuOverlay";
import Contact from "../sections/Contact";

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <>
      <Navbar isMenuOpen={isMenuOpen} onToggleMenu={handleToggleMenu} />
      <MenuOverlay isOpen={isMenuOpen} onClose={handleCloseMenu} />
      <Contact variant="page" />
    </>
  );
}
