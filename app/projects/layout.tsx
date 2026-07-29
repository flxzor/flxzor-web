import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project | Flxzor — Full-Stack Developer & Software Engineer",
  description:
    "Project detail — built by Felix Erlangga, Full-Stack Developer & Software Engineer.",
};

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
