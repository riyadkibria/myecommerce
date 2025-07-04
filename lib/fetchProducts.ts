import { MyProduct } from "@/types";

export async function fetchProducts(): Promise<MyProduct[]> {
  const slug = "product";
  const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;

  if (!token) throw new Error("Missing Storyblok token");

  const res = await fetch(
    `https://api.storyblok.com/v2/cdn/stories/${slug}?version=draft&token=${token}`
  );

  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();
  const body = data.story?.content?.body;

  if (!Array.isArray(body)) throw new Error("Invalid product format");

  return body as MyProduct[];
}
