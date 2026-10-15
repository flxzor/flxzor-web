"use client";

import { useCallback, useState } from "react";
import Navbar from "../components/Navbar";
import MenuOverlay from "../components/MenuOverlay";

export default function ArticleNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuLightText, setMenuLightText] = useState(false);

  const handleToggleMenu = useCallback((lightText = false) => {
    setIsMenuOpen((open) => !open);
    setMenuLightText(lightText);
  }, []);
  const handleCloseMenu = useCallback(() => setIsMenuOpen(false), []);

  return <>
    <Navbar isMenuOpen={isMenuOpen} onToggleMenu={handleToggleMenu} logoHref="/blog" />
    <MenuOverlay isOpen={isMenuOpen} onClose={handleCloseMenu} lightText={menuLightText} />
  </>;
}
