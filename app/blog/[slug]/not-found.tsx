import "../blog.css";
import ArticleNavbar from "../ArticleNavbar";
import PageTransitionLink from "../../components/PageTransitionLink";

export default function BlogPostNotFound() {
  return <main className="blog-page blog-page--article">
    <ArticleNavbar />
    <section className="blog-empty blog-empty--status" aria-live="polite">
      <span className="blog-empty__number">404 / JOURNAL</span>
      <h1>This story isn’t here.</h1>
      <p>The link may be out of date, or the post may have moved.</p>
      <PageTransitionLink href="/blog" className="blog-empty__link">Back to the journal <span aria-hidden="true">→</span></PageTransitionLink>
    </section>
  </main>;
}
