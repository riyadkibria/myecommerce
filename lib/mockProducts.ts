import type { MyProduct } from "@/types";

export const mockProducts: MyProduct[] = [
  {
    component: "ProductCard",
    name: "Luxury Portfolio Template",
    slug: "luxury-portfolio-template",
    description: "A sleek and minimal portfolio template perfect for designers and creatives who want to showcase their work in style.",
    price: 59,
    image: {
      filename: "https://source.unsplash.com/800x500/?website,design,luxury",
    },
  },
  {
    component: "ProductCard",
    name: "Business Startup Template",
    slug: "business-startup-template",
    description: "Designed for startups and SaaS companies, this template includes all essential pages with a clean, modern UI.",
    price: 69,
    image: {
      filename: "https://source.unsplash.com/800x500/?tech,webdesign,business",
    },
  },
  {
    component: "ProductCard",
    name: "E-commerce Store Template",
    slug: "ecommerce-store-template",
    description: "An elegant and responsive e-commerce template for selling physical or digital products online.",
    price: 79,
    image: {
      filename: "https://source.unsplash.com/800x500/?ecommerce,store,online-shop",
    },
  },
  {
    component: "ProductCard",
    name: "Creative Agency Template",
    slug: "creative-agency-template",
    description: "Show off your agency’s creativity and client projects with this beautiful and bold layout.",
    price: 65,
    image: {
      filename: "https://source.unsplash.com/800x500/?agency,branding,creative",
    },
  },
];
