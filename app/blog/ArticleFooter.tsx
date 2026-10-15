"use client";

import { useEffect, useState } from "react";
import Footer from "../components/Footer";

export default function ArticleFooter() {
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  useEffect(() => {
    const pane = document.getElementById("article-reading-pane");
    if (!pane) return;

    const checkEnd = () => {
      const isMobile = window.matchMedia("(max-width: 899px)").matches;
      let reachedEnd: boolean;
      if (isMobile) {
        const contentBottom = pane.getBoundingClientRect().bottom + window.scrollY;
        reachedEnd = window.scrollY + window.innerHeight >= contentBottom - 24;
      } else {
        reachedEnd = pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 24;
      }

      setHasReachedEnd((current) => current === reachedEnd ? current : reachedEnd);
    };

    pane.addEventListener("scroll", checkEnd, { passive: true });
    window.addEventListener("scroll", checkEnd, { passive: true });
    window.addEventListener("resize", checkEnd);
    checkEnd();

    return () => {
      pane.removeEventListener("scroll", checkEnd);
      window.removeEventListener("scroll", checkEnd);
      window.removeEventListener("resize", checkEnd);
    };
  }, []);

  return hasReachedEnd ? <div className="article-footer-reveal"><Footer /></div> : null;
}
