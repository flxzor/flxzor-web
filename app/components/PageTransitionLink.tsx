"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
};

export default function PageTransitionLink({ href, className, children }: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) return;

        event.preventDefault();
        window.dispatchEvent(new CustomEvent("pageTransitionStart", { detail: { href } }));
      }}
    >
      {children}
    </Link>
  );
}
