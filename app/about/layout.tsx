import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Flxzor — Full-Stack Developer & Software Engineer",
  description:
    "About — built by Felix Erlangga, Full-Stack Developer & Software Engineer.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
