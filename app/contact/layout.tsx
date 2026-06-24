import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Flxzor — Full-Stack Developer & Software Engineer",
  description:
    "Get in touch with Felix Erlangga — Full-Stack Developer & Software Engineer. Let's discuss your project or idea.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
