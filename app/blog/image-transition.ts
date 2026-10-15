export const BLOG_IMAGE_TRANSITION_KEY = "flxzor-blog-image-transition";

export type BlogImageTransition = {
  slug: string;
  url: string;
  rect: { left: number; top: number; width: number; height: number };
  createdAt: number;
};
