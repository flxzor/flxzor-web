import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatBlogDate, getBlogPost } from "../../../lib/blog";
import MarkdownContent from "../MarkdownContent";
import ArticleScrollTop from "../ArticleScrollTop";
import ArticleFooter from "../ArticleFooter";
import ArticleNavbar from "../ArticleNavbar";
import ArticleEntrance from "../ArticleEntrance";
import "../blog.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post not found | Flxzor" };
  return { title: `${post.title} | Flxzor Blog`, description: post.description ?? undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return <main className="blog-page blog-page--article">
    <ArticleNavbar />
    <ArticleEntrance slug={post.slug} coverUrl={post.coverImage?.url} />
    <article className="article-page" aria-labelledby="article-title">
      <div className="article-layout">
        <aside className="article-media-pane" aria-label="Article cover">
          {post.coverImage?.url ? (
            <div className="article-cover"><Image src={post.coverImage.url} alt="" fill priority sizes="(min-width: 900px) 45vw, 100vw" unoptimized /></div>
          ) : (
            <div className="article-cover article-cover--empty" aria-hidden="true"><span>flxzor.</span></div>
          )}
          <div className="article-media-copy">
            <Link href="/blog" className="article-back-link">
              <span className="article-back-link__icon" aria-hidden="true">
                <svg className="article-back-link__arrow" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </span>
              <span>Back to Blog</span>
            </Link>
            <p className="blog-kicker">{formatBlogDate(post.date) ?? "Personal notes"}<span>·</span> Blog</p>
            <h1 className="article-title" id="article-title">{post.title}</h1>
            {post.description && <p className="article-description">{post.description}</p>}
          </div>
        </aside>
        <section className="article-reading-pane" id="article-reading-pane" aria-label={`Article content: ${post.title}`}>
          <div className="article-reading-content" id="article-content-start">
            <div className="article-content"><MarkdownContent content={post.content} /></div>
            <div className="article-end"><Link href="/blog"><span aria-hidden="true">←</span> Back to Blog</Link><span>Thanks for reading.</span></div>
          </div>
        </section>
        <ArticleScrollTop />
      </div>
    </article>
    <ArticleFooter />
  </main>;
}
