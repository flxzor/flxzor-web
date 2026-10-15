import type { Metadata } from "next";
import BlogShowcase from "./BlogShowcase";
import { getBlogPosts } from "../../lib/blog";
import "./blog.css";

export const metadata: Metadata = {
  title: "Blog | Flxzor",
  description: "Notes on software, design, and the things I’m learning along the way.",
};

export default async function BlogPage() {
  const { posts, error } = await getBlogPosts();
  return (
    <BlogShowcase posts={posts} error={error} />
  );
}
