import StoryblokClient from "storyblok-js-client";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";
import CartWrapper from "./CartWrapper";

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

interface MyProduct {
  name: string;
  description: string;
  Price?: number | string;
  image?: { filename: string } | string;
}

function getImageUrl(image: MyProduct["image"]): string | null {
  if (typeof image === "string") {
    return image.startsWith("//") ? `https:${image}` : image;
  } else if (image?.filename) {
    return `https://a.storyblok.com${image.filename}`;
  }
  return null;
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  try {
    const response = await Storyblok.get(`cdn/stories/products/${slug}`, {
      version: "draft",
    });

    if (!response?.data?.story?.content) return notFound();

    const product: MyProduct = response.data.story.content;
    const imageUrl = getImageUrl(product.image);

    return (
      <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Section */}
          <div className="bg-white rounded-3xl shadow-xl ring-1 ring-gray-200 overflow-hidden group">
            <div className="aspect-[4/3] relative">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name || "Product Image"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Pricing + Actions (Client Component) */}
            <ProductDetailsClient
              name={product.name}
              description={product.description}
              price={product.Price}
            />
          </section>
        </div>

        {/* Cart CTA or Related Products */}
        <div className="mt-14 max-w-6xl mx-auto">
          <CartWrapper />
        </div>
      </main>
    );
  } catch (err) {
    return notFound();
  }
}
