export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  date?: string | null;
  coverImage?: { url?: string | null } | null;
  content?: string | { raw?: unknown; markdown?: string } | null;
}

type BlogResult = { posts: BlogPost[]; error: boolean };

const POSTS_QUERY = `
  query BlogPosts {
    posts(orderBy: date_DESC) {
      id
      title
      slug
      description
      date
      coverImage { url }
      content
    }
  }
`;

const POST_QUERY = `
  query BlogPost($slug: String!) {
    posts(where: { slug: $slug }, first: 1) {
      id
      title
      slug
      description
      date
      coverImage { url }
      content
    }
  }
`;

async function query<T>(queryText: string, variables?: Record<string, string>): Promise<T | null> {
  const endpoint = process.env.HYGRAPH_ENDPOINT;
  if (!endpoint) return null;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryText, variables }),
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const result = await response.json();
    if (result.errors || !result.data) return null;
    return result.data as T;
  } catch {
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogResult> {
  const data = await query<{ posts?: BlogPost[] }>(POSTS_QUERY);
  if (!data || !Array.isArray(data.posts)) return { posts: [], error: true };
  const posts = data.posts.filter((post) => post && post.slug && post.title);
  posts.sort((a, b) => {
    const aDate = Date.parse(a.date ?? "");
    const bDate = Date.parse(b.date ?? "");
    return (Number.isFinite(bDate) ? bDate : 0) - (Number.isFinite(aDate) ? aDate : 0);
  });
  return { posts, error: false };
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const data = await query<{ posts?: BlogPost[] }>(POST_QUERY, { slug });
  return data?.posts?.find((post) => post.slug === slug) ?? null;
}

export function formatBlogDate(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(date);
}
