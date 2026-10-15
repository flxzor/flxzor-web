import Link from "next/link";

export default function BlogPostNotFound() {
  return <main className="blog-page"><section className="blog-empty"><span className="blog-empty__number">404</span><h1>This post isn’t here.</h1><p>The link may be out of date, or the post may have moved.</p><Link href="/blog" className="article-back">← Back to Blog</Link></section></main>;
}
