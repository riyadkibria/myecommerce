export interface MyProduct {
  component: string;
  name: string;
  description: string;
  image?: { filename: string };
  price?: number | string;
  slug: string; // added slug here
}
